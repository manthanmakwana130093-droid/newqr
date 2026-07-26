export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    const response = await fetch(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to shorten URL via is.gd');
    }
    const data = await response.json();
    if (data.errorcode) {
      throw new Error(data.errormessage || 'is.gd API error');
    }
    return res.status(200).json({ shortUrl: data.shorturl });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
