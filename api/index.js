const SUKI_URL = "https://raw.githubusercontent.com/gh8y4gwmsq-web/sUukaaa/refs/heads/main/suki.txt";

export default {
  async fetch() {
    try {
      const res = await fetch(SUKI_URL, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (!res.ok) {
        return new Response("error", { status: 502 });
      }

      const raw = await res.text();

      // Ключи + названия серверов
      const keys = raw
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.startsWith("vless://") || l.startsWith("trojan://"))
        .join("\n");

      if (!keys) {
        return new Response("empty", { status: 500 });
      }

      // Трюк с application/json — переводчик не трогает
      return new Response(keys + "\n", {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=120",
          "Access-Control-Allow-Origin": "*",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (e) {
      return new Response("fail", { status: 500 });
    }
  },
};
