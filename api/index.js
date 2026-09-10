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

      let text = await res.text();

      // Оставляем только ключи
      const lines = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l && !l.startsWith("#"));

      text = lines.join("\n");

      if (!text) {
        return new Response("No servers found", { status: 500 });
      }

      // Надёжное кодирование в base64
      const base64 = btoa(unescape(encodeURIComponent(text)));

      return new Response(base64, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (err) {
      return new Response("Error: " + err.message, { status: 500 });
    }
  },
};
