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

    let text = await response.text();

    // Убираем все строки, которые начинаются с #
    text = text
      .split("\n")
      .filter(line => !line.trim().startsWith("#"))
      .join("\n")
      .trim();

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.setHeader("X-Content-Type-Options", "nosniff");

    return res.status(200).send(text);
  } catch (err) {
    return res.status(500).send("Server Error");
  }
}
