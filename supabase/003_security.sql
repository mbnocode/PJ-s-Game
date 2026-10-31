-- PJ's Game: security update (anti-cheat for the leaderboards, and spam limits).
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- It's safe to run more than once.
--
-- What it does:
--  * Each level gets a top score that's possible (more than the points you'd get if every robot glowed orange on Nightmare,
--    so real players never hit it). Scores above that are thrown away, so nobody can put 99,999,999 on the leaderboard.
--  * A game can't say "won" until it has reached the level's last wave, and waves can't go backwards or skip ahead.
--  * Waves take real time: a game can't report wave 20 just 5 seconds after it started.
--  * Only real level names and difficulties are accepted, and nicknames lose invisible/control characters.
--  * Too many new games or challenges in one minute (a spam robot) get turned away for a moment.
-- When PJ adds or changes a level, add or update its row in level_rules (a level with no row gets a big default limit).

create table if not exists public.level_rules (
  level     text primary key,
  waves     int  not null,
  max_score int  not null
);
alter table public.level_rules enable row level security;
revoke all on public.level_rules from anon, authenticated;
grant select on public.level_rules to anon, authenticated;
drop policy if exists "anyone can read level rules" on public.level_rules;
create policy "anyone can read level rules" on public.level_rules for select using (true);

insert into public.level_rules (level, waves, max_score) values
  ('meadow', 10, 60000),
  ('forest', 15, 150000),
  ('swamp', 20, 280000),
  ('beach', 20, 400000),
  ('desert', 20, 460000),
  ('pyramid', 20, 540000),
  ('basalt', 23, 860000),
  ('magma', 23, 940000),
  ('volcano', 23, 1380000),
  ('tundra', 25, 1950000),
  ('glacier', 25, 2430000),
  ('blizzard', 25, 2640000),
  ('infinity', 45, 6650000)
on conflict (level) do update set waves = excluded.waves, max_score = excluded.max_score;

-- Start a game (in a challenge or solo).
create or replace function public.join_game(p_code text, p_nickname text, p_level text, p_difficulty text)
returns table (id uuid, secret uuid) language plpgsql security definer set search_path = public as $$
declare ch challenges%rowtype; nick text;
begin
  -- spam limit: at most 120 new games a minute across everyone
  if (select count(*) from players where created_at > now() - interval '1 minute') >= 120 then
    raise exception 'Too many games right now. Try again in a minute.';
  end if;
  if p_code is not null then
    select * into ch from challenges where code = upper(p_code);
    if not found then raise exception 'No challenge with that code'; end if;
    if ch.ends_at < now() then raise exception 'That challenge is over'; end if;
    p_level := ch.level; p_difficulty := ch.difficulty; p_code := ch.code;
  end if;
  if p_level is null or p_level !~ '^[a-z]{2,20}$' then raise exception 'bad level'; end if;
  if p_difficulty not in ('easy', 'normal', 'hard', 'nightmare') then raise exception 'bad difficulty'; end if;
  -- nicknames: no invisible or control characters, no extra spaces, 1 to 16 characters
  nick := regexp_replace(coalesce(p_nickname, ''), '[[:cntrl:]\u200B-\u200F\u202A-\u202E\u2060-\u2064\uFEFF]', '', 'g');
  nick := left(btrim(regexp_replace(nick, '\s+', ' ', 'g')), 16);
  if char_length(nick) < 1 then raise exception 'Type a nickname'; end if;
  return query
    insert into players (challenge_code, nickname, level, difficulty)
    values (p_code, nick, p_level, p_difficulty)
    returning players.id, players.secret;
end $$;

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
  if p_wave < pl.wave or p_wave > waves then raise exception 'bad wave'; end if;   -- waves never go backwards or past the end
  if p_wave > floor(secs / 2) + 1 then raise exception 'too fast'; end if;        -- every wave takes at least 2 real seconds
  if p_score < 0 or p_score > cap then raise exception 'bad score'; end if;       -- more than is possible on this level
  if p_status = 'won' and p_wave < waves then raise exception 'not finished'; end if;   -- you can only win on the last wave
  update players
     set wave = p_wave, health = greatest(0, least(p_health, 1000)), status = p_status, score = p_score,
         stars = case when p_status = 'won' then greatest(0, least(p_stars, 3)) else 0 end, updated_at = now()
   where players.id = p_id;
end $$;

-- Host a challenge (with the same checks, and a spam limit of 30 new challenges a minute).
create or replace function public.host_challenge(p_level text, p_difficulty text, p_hours int)
returns table (challenge_code text, secret uuid) language plpgsql security definer set search_path = public as $$
declare
  words text[] := array['LEAF','OAK','FERN','MOSS','OWL','FROG','PINE','ACORN','MAPLE','BIRCH','CEDAR','DRAGON','WIZARD','DEER','RIVER','STONE'];
  c text; tries int := 0;
begin
  if (select count(*) from challenges where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'Too many challenges right now. Try again in a minute.';
  end if;
  if p_hours not in (1, 24, 168) then raise exception 'bad length'; end if;
  if p_level is null or p_level !~ '^[a-z]{2,20}$' then raise exception 'bad level'; end if;
  if p_difficulty not in ('easy', 'normal', 'hard', 'nightmare') then raise exception 'bad difficulty'; end if;
  loop
    c := words[1 + floor(random() * array_length(words, 1))::int] || '-' || lpad((floor(random() * 100))::int::text, 2, '0');
    exit when not exists (select 1 from challenges ch where ch.code = c);
    tries := tries + 1;
    if tries > 50 then raise exception 'no free codes'; end if;
  end loop;
  return query
    insert into challenges (code, level, difficulty, ends_at)
    values (c, p_level, p_difficulty, now() + make_interval(hours => p_hours))
    returning challenges.code, challenges.host_secret;
end $$;

-- The old create_challenge function isn't used by the game any more: switch it off.
revoke execute on function public.create_challenge(text, text, int) from anon, authenticated, public;

revoke all on function public.join_game(text, text, text, text), public.update_progress(uuid, uuid, int, int, text, int, int),
  public.host_challenge(text, text, int) from public;
grant execute on function public.join_game(text, text, text, text), public.update_progress(uuid, uuid, int, int, text, int, int),
  public.host_challenge(text, text, int) to anon, authenticated;

-- Clean up any scores already on the boards that are impossible (higher than the level's top possible score).
delete from public.players p using public.level_rules r
 where p.level = r.level and p.score > r.max_score;
