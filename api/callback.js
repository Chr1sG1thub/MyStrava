export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send('No code');

  try {
    const tokenRes = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    });
    const data = await tokenRes.json();

    if (!tokenRes.ok) throw new Error(data.message);

    // Store token + success flag, then redirect
    res.setHeader('Content-Type', 'text/html');
    res.send(`
      <script>
        localStorage.setItem('strava_token', '${data.access_token}');
        localStorage.setItem('strava_connected', '1');
        window.location.href = '/debug.html?strava=success';
      </script>
      <p>Success! Redirecting...</p>
    `);
  } catch (err) {
    res.status(500).send('Error: ' + err.message);
  }
}
