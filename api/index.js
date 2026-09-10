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

      // Оставляем только ключи (убираем все строки с #)
      text = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l && !l.startsWith("#"))
        .join("\n");

      // Кодируем в base64 — переводчик это почти никогда не трогает
      const base64 = btoa(unescape(encodeURIComponent(text)));

      return new Response(base64, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": "inline; filename=\"sub.txt\"",
          "Cache-Control": "public, max-age=300",
          "Access-Control-Allow-Origin": "*",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (err) {
      return new Response("Error: " + err.message, { status: 502 });
    }
  },
};
