-- PJ's Game: the Eye of the Storm level (30 waves).
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- (The level works without it too; this just adds the 30-wave limit and a score limit for the leaderboard's cheat checks.)
insert into public.level_rules (level, waves, max_score) values
  ('storm', 30, 2400000)
on conflict (level) do update set waves = excluded.waves, max_score = excluded.max_score;
