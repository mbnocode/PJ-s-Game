-- PJ's Game: the two Sky Island levels (Floating Islands and Thunder Peaks).
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
insert into public.level_rules (level, waves, max_score) values
  ('skyislands', 25, 1610000),
  ('thunder', 25, 2480000)
on conflict (level) do update set waves = excluded.waves, max_score = excluded.max_score;

-- Also: a brand-new level that doesn't have a row here yet can still be won (it just gets a big score limit).
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

