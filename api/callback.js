export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  try {
    const response = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code'
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description);
    res.json(data);  // Returns access_token, refresh_token, etc.
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  res.redirect('my-strava-lay6.vercel.app' + '/');
}
