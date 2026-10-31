-- PJ's Game: Infinity now has 45 waves (orange Universe Golems and the Universe Titan).
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
insert into public.level_rules (level, waves, max_score) values ('infinity', 45, 6650000)
on conflict (level) do update set waves = excluded.waves, max_score = excluded.max_score;
