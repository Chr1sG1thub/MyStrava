export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const code = req.query.code;
  if (!code) return res.status(400).json({ error: 'No code' });

  try {
    const tokenResponse = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REDIRECT_URI
      })
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) throw new Error(tokenData.message || 'Token failed');

    // Store securely: Return to client (use httpOnly cookies for prod)
    // e.g., res.setHeader('Set-Cookie', `access_token=${tokenData.access_token}; HttpOnly; Secure; SameSite=Strict`);
    res.json({ 
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
