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

    // SET COOKIES (secure, auto-sent on future fetches)
    res.setHeader('Set-Cookie', [
      `strava_access=${data.access_token}; HttpOnly; Path=/; Max-Age=21600`,  // 6hr
      `strava_refresh=${data.refresh_token}; HttpOnly; Path=/; Max-Age=31536000`  // 1yr
    ]);

    // Auto-redirect to main page
    res.redirect(307, '/');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
