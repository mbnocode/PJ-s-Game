-- PJ's Game: challenges, live progress and leaderboards.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

create table if not exists public.challenges (
  code        text primary key,
  level       text not null,
  difficulty  text not null,
  created_at  timestamptz not null default now(),
  ends_at     timestamptz not null
);

create table if not exists public.players (
  id             uuid primary key default gen_random_uuid(),
  secret         uuid not null default gen_random_uuid(),
  challenge_code text references public.challenges(code) on delete cascade,
  nickname       text not null check (char_length(nickname) between 1 and 16),
  level          text not null,
  difficulty     text not null,
  wave           int  not null default 0,
  health         int  not null default 100,
  status         text not null default 'playing' check (status in ('playing', 'won', 'lost')),
  score          int  not null default 0,
  stars          int  not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists players_challenge_idx on public.players (challenge_code);
create index if not exists players_board_idx on public.players (level, status, score desc);

-- Lock the tables down: the game can read (without secrets) but only change things through the functions below.
alter table public.challenges enable row level security;
alter table public.players enable row level security;
drop policy if exists "anyone can read challenges" on public.challenges;
create policy "anyone can read challenges" on public.challenges for select using (true);
drop policy if exists "anyone can read players" on public.players;
create policy "anyone can read players" on public.players for select using (true);
revoke all on public.challenges, public.players from anon, authenticated;
grant select on public.challenges to anon, authenticated;
grant select (id, challenge_code, nickname, level, difficulty, wave, health, status, score, stars, created_at, updated_at)
  on public.players to anon, authenticated;

-- Make a challenge code like LEAF-42.
create or replace function public.create_challenge(p_level text, p_difficulty text, p_hours int)
returns text language plpgsql security definer set search_path = public as $$
declare
  words text[] := array['LEAF','OAK','FERN','MOSS','OWL','FROG','PINE','ACORN','MAPLE','BIRCH','CEDAR','DRAGON','WIZARD','DEER','RIVER','STONE'];
  c text; tries int := 0;
begin
  if p_hours not in (1, 24, 168) then raise exception 'bad length'; end if;
  loop
    c := words[1 + floor(random() * array_length(words, 1))::int] || '-' || lpad((floor(random() * 100))::int::text, 2, '0');
    exit when not exists (select 1 from challenges where code = c);
    tries := tries + 1;
    if tries > 50 then raise exception 'no free codes'; end if;
  end loop;
  insert into challenges (code, level, difficulty, ends_at) values (c, p_level, p_difficulty, now() + make_interval(hours => p_hours));
  return c;
end $$;

-- Start a game (in a challenge or solo). Returns the player's id and a secret only this browser knows.
create or replace function public.join_game(p_code text, p_nickname text, p_level text, p_difficulty text)
returns table (id uuid, secret uuid) language plpgsql security definer set search_path = public as $$
declare ch challenges%rowtype;
begin
  if p_code is not null then
    select * into ch from challenges where code = upper(p_code);
    if not found then raise exception 'No challenge with that code'; end if;
    if ch.ends_at < now() then raise exception 'That challenge is over'; end if;
    p_level := ch.level; p_difficulty := ch.difficulty; p_code := ch.code;
  end if;
  return query
    insert into players (challenge_code, nickname, level, difficulty)
    values (p_code, left(trim(p_nickname), 16), p_level, p_difficulty)
    returning players.id, players.secret;
end $$;

-- Report progress during a game.
create or replace function public.update_progress(p_id uuid, p_secret uuid, p_wave int, p_health int, p_status text, p_score int, p_stars int)
returns void language sql security definer set search_path = public as $$
  update players
     set wave = greatest(0, least(p_wave, 99)), health = greatest(0, least(p_health, 1000)),
         status = p_status, score = greatest(0, p_score), stars = greatest(0, least(p_stars, 3)), updated_at = now()
   where id = p_id and secret = p_secret and status = 'playing';
$$;

revoke all on function public.create_challenge(text, text, int), public.join_game(text, text, text, text),
  public.update_progress(uuid, uuid, int, int, text, int, int) from public;
grant execute on function public.create_challenge(text, text, int), public.join_game(text, text, text, text),
  public.update_progress(uuid, uuid, int, int, text, int, int) to anon, authenticated;
