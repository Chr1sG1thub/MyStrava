export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { refresh_token } = req.body;
  if (!refresh_token) return res.status(400).json({ error: 'No refresh_token' });

  try {
    const response = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token,
        grant_type: 'refresh_token'
      })
    });

    const tokenData = await response.json();
    res.json({ access_token: tokenData.access_token, refresh_token: tokenData.refresh_token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
