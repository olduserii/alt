const SUKI_URL = "https://raw.githubusercontent.com/gh8y4gwmsq-web/sUukaaa/refs/heads/main/suki.txt";

export default {
  async fetch(request) {
    try {
      const res = await fetch(SUKI_URL, {
        headers: { "User-Agent": "Vercel-Sueta/1.0" },
      });

      if (!res.ok) {
        return new Response(JSON.stringify({ error: "GitHub error" }), {
          status: 502,
          headers: { "Content-Type": "application/json" },
        });
      }

      const text = await res.text();

      // Берём только ключи
      const keys = text
        .split("\n")
        .map(l => l.trim())
        .filter(l => l && !l.startsWith("#"));

      // Отдаём чистый JSON с ключами
      return new Response(JSON.stringify(keys, null, 2), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=300",
          "Access-Control-Allow-Origin": "*",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
