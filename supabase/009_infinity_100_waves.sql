-- PJ's Game: Infinity now has 100 waves (super fast Universe Golems and Titans, and the Super Clanker on wave 75).
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
insert into public.level_rules (level, waves, max_score) values ('infinity', 100, 40000000)
on conflict (level) do update set waves = excluded.waves, max_score = excluded.max_score;
