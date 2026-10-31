-- PJ's Game: fix for "Add to leaderboard" after a game, plus the Sky Island levels.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run. (It includes everything in 005, so you only need this one.)

-- 1. The Sky Island levels' rules.
insert into public.level_rules (level, waves, max_score) values
  ('skyislands', 25, 1610000),
  ('thunder', 25, 2480000)
on conflict (level) do update set waves = excluded.waves, max_score = excluded.max_score;

-- 2. A brand-new level that doesn't have a row in level_rules yet can still be won (it just gets a big score limit).
-- Report progress during a game, with cheat checks.
create or replace function public.update_progress(p_id uuid, p_secret uuid, p_wave int, p_health int, p_status text, p_score int, p_stars int)
returns void language plpgsql security definer set search_path = public as $$
declare pl players%rowtype; rule level_rules%rowtype; waves int; cap int; secs numeric;
begin
  select * into pl from players where players.id = p_id and players.secret = p_secret and players.status = 'playing';
  if not found then return; end if;   -- unknown game, wrong secret, or the game is already over
  if p_status not in ('playing', 'won', 'lost') then raise exception 'bad status'; end if;
  select * into rule from level_rules where level_rules.level = pl.level;
  waves := coalesce(rule.waves, 99); cap := coalesce(rule.max_score, 3000000);
  secs := extract(epoch from (now() - pl.created_at));
  if p_wave < pl.wave or (rule.level is not null and p_wave > waves) then raise exception 'bad wave'; end if;   -- waves never go backwards or past the end
  if p_wave > floor(secs / 2) + 1 then raise exception 'too fast'; end if;        -- every wave takes at least 2 real seconds
  if p_score < 0 or p_score > cap then raise exception 'bad score'; end if;       -- more than is possible on this level
  if p_status = 'won' and rule.level is not null and p_wave < waves then raise exception 'not finished'; end if;   -- you can only win on the last wave (levels with no row yet skip this check)
  update players
     set wave = p_wave, health = greatest(0, least(p_health, 1000)), status = p_status, score = p_score,
         stars = case when p_status = 'won' then greatest(0, least(p_stars, 3)) else 0 end, updated_at = now()
   where players.id = p_id;
end $$;


-- 3. Add a finished game to the leaderboard (for players who type their nickname after the game).
--    The game says how long it took in real seconds; the same score, wave and level checks apply.
create or replace function public.submit_score(p_nickname text, p_level text, p_difficulty text, p_wave int, p_health int, p_status text, p_score int, p_stars int, p_seconds int)
returns void language plpgsql security definer set search_path = public as $$
declare g record; secs int;
begin
  if p_status not in ('won', 'lost') then raise exception 'bad status'; end if;
  secs := greatest(0, least(coalesce(p_seconds, 0), 60 * 60 * 24 * 7));
  select * into g from join_game(null, p_nickname, p_level, p_difficulty);
  update players set created_at = now() - make_interval(secs => secs) where players.id = g.id;   -- when the game really started
  perform update_progress(g.id, g.secret, p_wave, p_health, p_status, p_score, p_stars);
  if not exists (select 1 from players where players.id = g.id and players.status = p_status) then
    raise exception 'score not accepted';
  end if;
end $$;
revoke all on function public.submit_score(text, text, text, int, int, text, int, int, int) from public;
grant execute on function public.submit_score(text, text, text, int, int, text, int, int, int) to anon, authenticated;

-- 4. Sky Island games that reached the last wave but got stuck as "playing" (before these levels had rules): count them as won.
update public.players set status = 'won', stars = case when health >= 90 then 3 when health >= 50 then 2 else 1 end
 where level in ('skyislands', 'thunder') and status = 'playing' and wave >= 25 and health > 0;
