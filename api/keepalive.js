// Free Supabase projects go to sleep after a week with no visitors.
// Vercel calls this once a day (see vercel.json) so the leaderboard stays awake.
const URL = "https://ywdoujoatyifwlxacnjx.supabase.co";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZG91am9hdHlpZndseGFjbmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4ODE5MDUsImV4cCI6MjEwODQ1NzkwNX0.q3MouplTtwsrMC8wGcvwZuw20Pie-UJYMiqOR0JMF8U";
module.exports = async (req, res) => {
  try {
    const r = await fetch(`${URL}/rest/v1/challenges?select=code&limit=1`, { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } });
    res.status(200).json({ ok: r.ok, status: r.status });
  } catch (e) {
    res.status(200).json({ ok: false, error: String(e) });
  }
};
