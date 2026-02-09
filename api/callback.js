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

    // Simple HTML: mark connected in localStorage, then go home
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <html>
        <body>
          <p>Connected to Strava. Redirecting…</p>
          <script>
            // Save minimal flag (you can also store tokens here if you want)
            localStorage.setItem('strava_connected', '1');
            // Optionally store token temporarily:
            // localStorage.setItem('strava_access_token', '${data.access_token}');
            window.location.href = '/';
          </script>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
