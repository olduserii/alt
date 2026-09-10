const SUKI_URL = "https://raw.githubusercontent.com/gh8y4gwmsq-web/sUukaaa/refs/heads/main/suki.txt";

export default {
  async fetch() {
    try {
      const res = await fetch(SUKI_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Vercel)",
        },
      });

      if (!res.ok) {
        return new Response("Source error", { status: 502 });
      }

      const raw = await res.text();

      // Только ключи, ничего лишнего
      const keys = raw
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 10 && !l.startsWith("#"))
        .join("\n");

      if (!keys) {
        return new Response("No keys", { status: 500 });
      }

      // Самые жёсткие заголовки против переводчика
      return new Response(keys, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": "attachment; filename=\"keys.txt\"",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
          "Access-Control-Allow-Origin": "*",
          "X-Robots-Tag": "noindex, nofollow, noarchive",
        },
      });
    } catch (e) {
      return new Response("Error", { status: 500 });
    }
  },
};
