-- ============================================================
-- LearnLoop LMS migration 0002 — course batches (cohorts)
-- Run in Supabase Dashboard → SQL Editor. Safe to re-run:
-- IF NOT EXISTS guards, DROP ... IF EXISTS, no data deletion.
-- Requires migration 0001 (courses table) to have run first.
-- ============================================================

create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  starts_at timestamptz,
  ends_at timestamptz,
  seats integer not null default 0 check (seats >= 0),
  status text not null default 'draft'
    check (status in ('draft', 'open', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.batches
  add column if not exists course_id uuid references public.courses (id) on delete cascade,
  add column if not exists title text,
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz,
  add column if not exists seats integer not null default 0,
  add column if not exists status text not null default 'draft',
  add column if not exists created_at timestamptz not null default now();

create index if not exists batches_course_idx on public.batches (course_id, starts_at);

alter table public.batches enable row level security;

-- Public sees open batches of published courses; admins see everything.
drop policy if exists "batches_public_read" on public.batches;
create policy "batches_public_read" on public.batches
  for select using (
    (status = 'open' and exists (
      select 1 from public.courses c
      where c.id = batches.course_id and c.status = 'published'
    ))
    or public.is_admin()
  );
drop policy if exists "batches_admin_write" on public.batches;
create policy "batches_admin_write" on public.batches
  for insert with check (public.is_admin());
drop policy if exists "batches_admin_update" on public.batches;
create policy "batches_admin_update" on public.batches
  for update using (public.is_admin());
drop policy if exists "batches_admin_delete" on public.batches;
create policy "batches_admin_delete" on public.batches
  for delete using (public.is_admin());
