-- ============================================================
-- LearnLoop LMS migration 0003 — safe self-service profile repair
-- Run in Supabase Dashboard → SQL Editor. Safe to re-run:
-- no tables/columns/rows are created, altered or deleted here.
--
-- WHY THIS EXISTS
-- If the handle_new_user trigger (migration 0001) ever missed a user
-- (e.g. the account was created before the trigger existed), that user
-- can authenticate but has NO row in public.profiles — and profiles has
-- no INSERT policy for ordinary users, so the app can never repair it.
-- This policy lets a logged-in user insert ONLY their own row, and ONLY
-- with role = 'student'. It cannot be used to grant yourself admin:
--   * role is locked to 'student' by the WITH CHECK clause, and
--   * protect_profile_role (migration 0001) still blocks any later
--     UPDATE that tries to change role without admin rights.
-- Admin assignment stays SQL-only (see bottom of file).
-- Requires migration 0001 (profiles table) to have run first.
-- ============================================================

alter table public.profiles enable row level security;

drop policy if exists "profiles_owner_insert" on public.profiles;
create policy "profiles_owner_insert" on public.profiles
  for insert
  with check (auth.uid() = id and role = 'student');

-- ============================================================
-- MANUAL ADMIN SETUP (run these yourself in SQL Editor)
-- 1) Create the login in Dashboard → Authentication → Users → Add user
--    → Create new user. Enter email + password, tick "Auto Confirm User".
-- 2) Confirm the auth user exists (must return EXACTLY 1 row):
--      select id, email, email_confirmed_at, created_at
--      from auth.users
--      where email = 'admin@learnloop.com';
-- 3) Confirm the profile row exists and is linked by UUID
--    (created automatically by the handle_new_user trigger; if the
--    query below returns 0 rows, the trigger missed it — sign the user
--    in once on the website, or insert it with the policy above, then
--    re-run this check):
--      select p.id, p.email, p.role, (p.id = u.id) as uuid_linked
--      from public.profiles p
--      join auth.users u on u.email = p.email
--      where p.email = 'admin@learnloop.com';
-- 4) Promote EXACTLY that one row to admin, then verify the count:
--      update public.profiles
--      set role = 'admin'
--      where email = 'admin@learnloop.com'
--        and role <> 'admin';
--      -- MUST print "1 row affected". If it prints 0 rows, STOP: the
--      -- profile row does not exist — do not proceed, fix step 3 first.
--      select id, email, role from public.profiles
--      where email = 'admin@learnloop.com';
-- 5) Log in at /admin/login with the SAME email + password from step 1.
-- ============================================================
