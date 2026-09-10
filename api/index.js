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

      // Берём только ключи и полностью отрезаем всё после #
      const keys = raw
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.startsWith("vless://") || line.startsWith("trojan://"))
        .map(line => line.split("#")[0])   // убираем название сервера
        .filter(Boolean)
        .join("\n");

      if (!keys) {
        return new Response("empty", { status: 500 });
      }

      return new Response(keys + "\n", {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": "attachment; filename=\"sub.txt\"",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (e) {
      return new Response("fail", { status: 500 });
    }
  },
};
