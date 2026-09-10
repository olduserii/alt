export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/gh8y4gwmsq-web/sUukaaa/refs/heads/main/suki.txt',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Cache-Control': 'no-cache'
        }
      }
    );

    if (!response.ok) {
      return res.status(502).send('Не удалось получить файл с GitHub');
    }

    const text = await response.text();

    // Важные заголовки для подписок
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=300'); // кэш 5 минут

    return res.status(200).send(text);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Ошибка сервера');
  }
}
