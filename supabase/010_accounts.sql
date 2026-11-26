-- PJ's Game: accounts (username + password) so a save can move between computers.
-- Run this once in Supabase: SQL Editor -> New query -> paste -> Run.
-- Passwords are never stored: only a bcrypt hash. Nobody can read the table directly; the game only uses the functions below.
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.accounts (
  username     text primary key check (username ~ '^[a-z0-9_]{3,20}$'),
  pass_hash    text not null,
  save         jsonb not null default '{}'::jsonb,
  fails        int not null default 0,
  locked_until timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
alter table public.accounts enable row level security;   -- (no policies on purpose: anon can't read or write it directly)
revoke all on public.accounts from anon, authenticated;

-- checks a username + password; after 8 wrong passwords in a row the account is locked for 10 minutes
create or replace function public.account_check(p_username text, p_password text)
returns text language plpgsql security definer set search_path = public, extensions as $$
declare a accounts%rowtype; u text := lower(trim(p_username));
begin
  select * into a from accounts where username = u for update;
  if not found then raise exception 'wrong username or password'; end if;
  if a.locked_until is not null and a.locked_until > now() then raise exception 'too many tries, wait 10 minutes'; end if;
  if a.pass_hash <> crypt(p_password, a.pass_hash) then
    update accounts set fails = fails + 1, locked_until = case when fails + 1 >= 8 then now() + interval '10 minutes' else null end where username = u;
    return null;
  end if;
  update accounts set fails = 0, locked_until = null where username = u;
  return u;
end $$;
revoke all on function public.account_check(text, text) from public, anon, authenticated;

create or replace function public.account_create(p_username text, p_password text, p_save jsonb)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare u text := lower(trim(p_username));
begin
  if u !~ '^[a-z0-9_]{3,20}$' then raise exception 'username must be 3 to 20 letters, numbers or _'; end if;
  if length(coalesce(p_password, '')) < 4 or length(p_password) > 64 then raise exception 'password must be 4 to 64 characters'; end if;
  if pg_column_size(p_save) > 500000 then raise exception 'save is too big'; end if;
  if exists (select 1 from accounts where username = u) then raise exception 'that username is taken'; end if;
  insert into accounts (username, pass_hash, save) values (u, crypt(p_password, gen_salt('bf', 8)), coalesce(p_save, '{}'::jsonb));
end $$;

-- (a wrong password returns {"error": ...} instead of raising, so the wrong-tries counter is kept)
create or replace function public.account_save(p_username text, p_password text, p_save jsonb)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare u text; t timestamptz := now();
begin
  if pg_column_size(p_save) > 500000 then raise exception 'save is too big'; end if;
  u := account_check(p_username, p_password);
  if u is null then return jsonb_build_object('error', 'wrong username or password'); end if;
  update accounts set save = coalesce(p_save, '{}'::jsonb), updated_at = t where username = u;
  return jsonb_build_object('updated_at', t);
end $$;

create or replace function public.account_load(p_username text, p_password text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare u text; a accounts%rowtype;
begin
  u := account_check(p_username, p_password);
  if u is null then return jsonb_build_object('error', 'wrong username or password'); end if;
  select * into a from accounts where username = u;
  return jsonb_build_object('save', a.save, 'updated_at', a.updated_at);
end $$;

revoke all on function public.account_create(text, text, jsonb) from public;
revoke all on function public.account_save(text, text, jsonb) from public;
revoke all on function public.account_load(text, text) from public;
grant execute on function public.account_create(text, text, jsonb) to anon, authenticated;
grant execute on function public.account_save(text, text, jsonb) to anon, authenticated;
grant execute on function public.account_load(text, text) to anon, authenticated;
