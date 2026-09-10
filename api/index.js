const SUKI_URL = "https://raw.githubusercontent.com/gh8y4gwmsq-web/sUukaaa/refs/heads/main/suki.txt";

export default {
  async fetch(request) {
    try {
      const res = await fetch(SUKI_URL, {
        headers: { "User-Agent": "Vercel-Sueta/1.0" },
      });

      if (!res.ok) {
        return new Response("GitHub error: " + res.status, { status: 502 });
      }

      const text = await res.text();
      const config = buildConfig(text);

      return new Response(JSON.stringify(config, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "profile-title": "Sueta",
          "profile-update-interval": "4",
          "support-url": "https://t.me/SuetaVpna",
          "profile-web-page-url": "https://t.me/SuetaVpna",
        },
      });
    } catch (err) {
      return new Response("Ошибка загрузки: " + err.message, { status: 502 });
    }
  },
};

function buildConfig(sukiText) {
  const lines = sukiText.split("\n").map(l => l.trim()).filter(Boolean);
  const links = lines.filter(l => !l.startsWith("#"));

  const configs = [];

  const dns = {
    queryStrategy: "UseIPv4",
    servers: ["1.1.1.1", "https://dns.adguard.com/dns-query"],
  };

  const inbounds = [
    {
      listen: "127.0.0.1",
      port: 10808,
      protocol: "socks",
      settings: { auth: "noauth", udp: true },
      sniffing: {
        destOverride: ["http", "tls", "quic"],
        enabled: true,
        routeOnly: false,
      },
      tag: "socks",
    },
    {
      listen: "127.0.0.1",
      port: 10809,
      protocol: "http",
      settings: { allowTransparent: false },
      sniffing: {
        destOverride: ["http", "tls", "quic"],
        enabled: true,
        routeOnly: false,
      },
      tag: "http",
    },
  ];

  const direct = { protocol: "freedom", tag: "direct" };
  const block = { protocol: "blackhole", tag: "block" };

  links.forEach((link, i) => {
    try {
      const { outbound, name } = parseLink(link);
      outbound.tag = "proxy-01";

      configs.push({
        remarks: name || `Server ${i + 1}`,
        dns,
        inbounds,
        outbounds: [outbound, direct, block],
        routing: {
          domainMatcher: "hybrid",
          domainStrategy: "IPIfNonMatch",
          rules: [
            { type: "field", domain: ["geosite:category-ads"], outboundTag: "block" },
            { type: "field", protocol: ["bittorrent"], outboundTag: "direct" },
            { type: "field", network: "tcp,udp", outboundTag: "proxy-01" },
          ],
        },
      });
    } catch (e) {}
  });

  return configs;
}

function parseLink(link) {
  let name = "unnamed";
  if (link.includes("#")) {
    name = decodeURIComponent(link.split("#").pop());
  }

  if (link.startsWith("hy2://") || link.startsWith("hysteria2://")) {
    const raw = link.replace(/^hy2:\/\//, "").replace(/^hysteria2:\/\//, "");
    const [mainPart] = raw.split("#");
    const [authHost, queryPart] = mainPart.split("?");
    const [auth, hostPort] = authHost.includes("@") ? authHost.split("@") : ["", authHost];
    const [host, portStr] = hostPort.includes(":") ? hostPort.split(":") : [hostPort, "443"];
    const port = parseInt(portStr) || 443;

    const params = {};
    if (queryPart) {
      queryPart.split("&").forEach(p => {
        const [k, v] = p.split("=");
        params[k] = decodeURIComponent(v || "");
      });
    }

    return {
      name,
      outbound: {
        protocol: "hysteria",
        settings: {
          address: host,
          auth: auth,
          port: port,
          version: 2,
        },
        streamSettings: {
          network: "hysteria",
          security: "tls",
          hysteriaSettings: { version: 2 },
          tlsSettings: {
            alpn: (params.alpn || "h3").split(","),
            serverName: params.sni || host,
          },
        },
      },
    };
  }

  const url = new URL(link);
  const protocol = url.protocol.replace(":", "");
  const uuidOrPass = decodeURIComponent(url.username);
  const host = url.hostname;
  const port = parseInt(url.port) || 443;
  const params = Object.fromEntries(url.searchParams.entries());

  if (protocol === "vless") {
    const user = {
      encryption: params.encryption || "none",
      id: uuidOrPass,
    };
    if (params.flow) user.flow = params.flow;

    const stream = {
      network: params.type || "tcp",
      security: params.security || "none",
    };

    if (params.security === "reality") {
      stream.realitySettings = {
        fingerprint: params.fp || "firefox",
        publicKey: params.pbk,
        serverName: params.sni,
      };
      if (params.sid) stream.realitySettings.shortId = params.sid;
      if (params.spx) stream.realitySettings.spiderX = decodeURIComponent(params.spx);
    } else if (params.security === "tls") {
      stream.tlsSettings = {
        fingerprint: params.fp || "firefox",
        serverName: params.sni,
      };
      if (params.alpn) stream.tlsSettings.alpn = params.alpn.split(",");
    }

    if (stream.network === "tcp") {
      stream.tcpSettings = { header: { type: params.headerType || "none" } };
    } else if (stream.network === "ws") {
      stream.wsSettings = {
        path: params.path || "/",
      };
      if (params.host) stream.wsSettings.headers = { Host: params.host };
    } else if (stream.network === "grpc") {
      stream.grpcSettings = {
        multiMode: false,
        serviceName: params.serviceName || "",
      };
    }

    return {
      name,
      outbound: {
        protocol: "vless",
        settings: {
          vnext: [{ address: host, port: port, users: [user] }],
        },
        streamSettings: stream,
      },
    };
  }

  if (protocol === "trojan") {
    const stream = {
      network: params.type || "tcp",
      security: params.security || "tls",
    };

    if (stream.security === "tls") {
      stream.tlsSettings = {
        fingerprint: params.fp || "firefox",
        serverName: params.sni,
      };
      if (params.alpn) stream.tlsSettings.alpn = params.alpn.split(",");
    }

    if (stream.network === "tcp") {
      stream.tcpSettings = { header: { type: params.headerType || "none" } };
    }

    return {
      name,
      outbound: {
        protocol: "trojan",
        settings: {
          servers: [{ address: host, password: uuidOrPass, port: port }],
        },
        streamSettings: stream,
      },
    };
  }

  throw new Error("Unsupported protocol: " + protocol);
}
