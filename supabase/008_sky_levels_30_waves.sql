-- PJ's Game: Floating Islands and Thunder Peaks now have 30 waves (like the Eye of the Storm).
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Without it, the leaderboard refuses games on those two levels once they get past wave 25.
insert into public.level_rules (level, waves, max_score) values
  ('skyislands', 30, 1800000),
  ('thunder', 30, 2500000),
  ('storm', 30, 2600000)
on conflict (level) do update set waves = excluded.waves, max_score = excluded.max_score;
