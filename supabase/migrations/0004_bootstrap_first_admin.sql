-- ============================================================
-- LearnLoop LMS migration 0004 — one-time bootstrap of the FIRST admin
-- Run ONCE in Supabase Dashboard → SQL Editor. Safe to re-run:
-- if the account is already admin it only prints a NOTICE and changes
-- nothing. Nothing else is created, altered or deleted.
--
-- WHY THIS EXISTS
-- protect_profile_role() (migration 0001) blocks EVERY role change made
-- by a non-admin — and the SQL Editor runs with no auth JWT, so
-- auth.uid() is NULL and is_admin() is always false there. With zero
-- admins in the system, a plain UPDATE can never succeed (ERROR P0001).
-- This script resolves the deadlock WITHOUT weakening anything:
--   1. verifies the auth user exists (by exact email),
--   2. verifies the profile row exists AND its UUID matches the auth
--      user's UUID AND its email matches,
--   3. drops ONLY the trigger (the function and all RLS stay in place),
--   4. updates EXACTLY that one row (asserts row count = 1),
--   5. recreates the trigger identically, then re-verifies it exists
--      and the role is 'admin'.
-- Any failed check raises an exception, which rolls back the whole
-- script — the database is left exactly as it was.
-- Requires migrations 0001 (tables, trigger function) to have run.
-- ============================================================

do $$
declare
  v_auth_id uuid;
  v_profile_id uuid;
  v_profile_email text;
  v_profile_role text;
  v_updated int;
  v_trigger_count int;
begin
  -- 1. The auth account must exist (create it first in
  --    Dashboard → Authentication → Users → Add user, auto-confirmed).
  select id into v_auth_id
  from auth.users
  where email = 'admin@learnloop.com';
  if v_auth_id is null then
    raise exception 'BOOTSTRAP ABORTED: no auth.users row with email %. Create it in Dashboard → Authentication → Users first.', 'admin@learnloop.com';
  end if;

  -- 2. The profile row must exist and be linked by UUID + email.
  select id, email, role into v_profile_id, v_profile_email, v_profile_role
  from public.profiles
  where id = v_auth_id;
  if not found then
    raise exception 'BOOTSTRAP ABORTED: auth user % exists but has no public.profiles row with the same UUID. Sign the user in once on the website (or insert the row), then re-run.', v_auth_id;
  end if;
  if v_profile_email is distinct from 'admin@learnloop.com' then
    raise exception 'BOOTSTRAP ABORTED: profile % has unexpected email %. Refusing to promote.', v_profile_id, v_profile_email;
  end if;

  -- 3. Idempotent: already done → change nothing.
  if v_profile_role = 'admin' then
    raise notice 'BOOTSTRAP SKIPPED: % is already admin. Nothing changed.', v_profile_email;
    return;
  end if;

  -- 4. Lift ONLY the trigger (function, RLS and everything else stay).
  drop trigger if exists protect_role on public.profiles;

  -- 5. Promote EXACTLY the verified row — never by email alone.
  update public.profiles
  set role = 'admin'
  where id = v_auth_id
    and email = 'admin@learnloop.com'
    and role <> 'admin';
  get diagnostics v_updated = row_count;
  if v_updated <> 1 then
    raise exception 'BOOTSTRAP ABORTED: expected to promote exactly 1 row, got %. Rolled back.', v_updated;
  end if;

  -- 6. Restore normal protection immediately, in the same transaction.
  create trigger protect_role
    before update on public.profiles
    for each row execute function public.protect_profile_role();

  -- 7. Final verification: role + trigger both in place.
  select role into v_profile_role
  from public.profiles
  where id = v_auth_id;
  if v_profile_role is distinct from 'admin' then
    raise exception 'BOOTSTRAP FAILED: role is %, expected admin. Rolled back.', v_profile_role;
  end if;
  select count(*) into v_trigger_count
  from pg_trigger
  where tgrelid = 'public.profiles'::regclass
    and tgname = 'protect_role';
  if v_trigger_count <> 1 then
    raise exception 'BOOTSTRAP FAILED: protect_role trigger was not restored. Rolled back.';
  end if;

  raise notice 'BOOTSTRAP SUCCESS: % (%) is now admin and protect_role is active.', v_profile_email, v_auth_id;
end
$$;

-- Standalone verification (run after the block above succeeds):
--   select p.id, p.email, p.role, (p.id = u.id) as uuid_linked
--   from public.profiles p join auth.users u on u.email = p.email
--   where p.email = 'admin@learnloop.com';
-- Expected: exactly 1 row, role = admin, uuid_linked = true.
-- Then log in at /admin/login with the step-1 credentials.
