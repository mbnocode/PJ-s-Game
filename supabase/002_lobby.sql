-- PJ's Game: challenge lobbies. The host gets a code, friends join, and the host presses Start.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.

alter table public.challenges add column if not exists started_at timestamptz;
alter table public.challenges add column if not exists host_secret uuid not null default gen_random_uuid();

-- Everyone can see challenges, but not the host's secret.
revoke select on public.challenges from anon, authenticated;
grant select (code, level, difficulty, created_at, ends_at, started_at) on public.challenges to anon, authenticated;

-- Host a challenge: returns the code and a secret only the host's browser knows.
create or replace function public.host_challenge(p_level text, p_difficulty text, p_hours int)
returns table (challenge_code text, secret uuid) language plpgsql security definer set search_path = public as $$
declare
  words text[] := array['LEAF','OAK','FERN','MOSS','OWL','FROG','PINE','ACORN','MAPLE','BIRCH','CEDAR','DRAGON','WIZARD','DEER','RIVER','STONE'];
  c text; tries int := 0;
begin
  if p_hours not in (1, 24, 168) then raise exception 'bad length'; end if;
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

-- Only the host can start their challenge, and only once.
create or replace function public.start_challenge(p_code text, p_secret uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update challenges ch set started_at = now()
   where ch.code = upper(p_code) and ch.host_secret = p_secret and ch.started_at is null;
  return found;
end $$;

revoke all on function public.host_challenge(text, text, int), public.start_challenge(text, uuid) from public;
grant execute on function public.host_challenge(text, text, int), public.start_challenge(text, uuid) to anon, authenticated;
