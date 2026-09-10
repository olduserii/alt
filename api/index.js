export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/gh8y4gwmsq-web/sUukaaa/refs/heads/main/suki.txt",
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Vercel)",
        },
      }
    );

    if (!response.ok) {
      return res.status(502).send("Error fetching source");
    }

    const text = await response.text();

    // Самые важные заголовки
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Content-Disposition", "inline");

    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}
