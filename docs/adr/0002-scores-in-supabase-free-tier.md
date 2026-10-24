# Leaderboard scores live in Supabase's free plan

The game is a static page on Vercel, but shared Leaderboards and Challenges need a database. We chose Supabase because Preston already uses it and its free plan easily holds a game's scores (500 MB). Free Supabase projects pause after a week with no activity, so a small weekly scheduled ping keeps the database awake.
