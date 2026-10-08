-- ============================================================
-- LearnLoop LMS — full schema, RLS, storage, triggers (FINAL, v2)
-- Run ONCE in Supabase Dashboard → SQL Editor (paste the whole file + Run).
--
-- v2 fixes "ERROR 42P01: relation public.profiles does not exist":
--   ALL tables are now created FIRST, and only afterwards do any
--   function, trigger, SELECT, foreign key, RLS policy or storage
--   rule reference them.
--
-- Safe to re-run on a database where parts already ran:
--   * every CREATE uses IF NOT EXISTS
--   * every column is ensured with ADD COLUMN IF NOT EXISTS
--   * every trigger/policy is dropped (IF EXISTS) before re-creating
--   * seeds use ON CONFLICT DO NOTHING
-- Nothing here deletes tables, columns or existing rows.
-- ============================================================

-- ---------- 0. extensions ----------
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. TABLES FIRST (no function/trigger/policy may reference
--    a table before this block has created it)
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text,
  last_name text,
  mobile text,
  avatar_path text,
  role text not null default 'student' check (role in ('student', 'instructor', 'admin')),
  last_sign_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.instructors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  bio text,
  avatar_path text,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  short_description text,
  thumbnail_path text,
  instructor_id uuid references public.instructors (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  level text not null default 'Beginner'
    check (level in ('Beginner', 'Intermediate', 'Advanced', 'All levels')),
  price numeric not null default 0 check (price >= 0),
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 0,
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  video_path text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete cascade,
  title text not null,
  file_path text not null,
  file_type text,
  file_size integer,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  student_email text,
  course_id uuid not null references public.courses (id) on delete cascade,
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  enrolled_at timestamptz not null default now(),
  unique (student_id, course_id)
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.profiles (id) on delete set null,
  student_email text,
  course_id uuid references public.courses (id) on delete set null,
  amount numeric not null default 0,
  currency text not null default 'INR',
  provider text,
  provider_payment_id text,
  status text not null default 'completed',
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (student_id, lesson_id)
);

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  course_id uuid references public.courses (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  course_id uuid references public.courses (id) on delete set null,
  awarded_at timestamptz not null default now(),
  unique (student_id, badge_id)
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_no text not null unique,
  student_id uuid not null references public.profiles (id) on delete cascade,
  student_email text,
  course_id uuid not null references public.courses (id) on delete cascade,
  status text not null default 'issued',
  issued_at timestamptz not null default now()
);

-- ============================================================
-- 2. COLUMN REPAIR (if an earlier partial run left tables behind
--    without all columns, this adds the missing ones; existing
--    data is never touched)
-- ============================================================

alter table public.profiles
  add column if not exists email text,
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists mobile text,
  add column if not exists avatar_path text,
  add column if not exists role text not null default 'student',
  add column if not exists last_sign_in_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.categories
  add column if not exists name text,
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists created_at timestamptz not null default now();

alter table public.instructors
  add column if not exists name text,
  add column if not exists title text,
  add column if not exists bio text,
  add column if not exists avatar_path text,
  add column if not exists created_at timestamptz not null default now();

alter table public.courses
  add column if not exists title text,
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists short_description text,
  add column if not exists thumbnail_path text,
  add column if not exists instructor_id uuid references public.instructors (id) on delete set null,
  add column if not exists category_id uuid references public.categories (id) on delete set null,
  add column if not exists level text not null default 'Beginner',
  add column if not exists price numeric not null default 0,
  add column if not exists duration_minutes integer not null default 0,
  add column if not exists status text not null default 'draft',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.lessons
  add column if not exists course_id uuid references public.courses (id) on delete cascade,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists position integer not null default 0,
  add column if not exists duration_minutes integer not null default 0,
  add column if not exists video_path text,
  add column if not exists is_published boolean not null default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.resources
  add column if not exists course_id uuid references public.courses (id) on delete cascade,
  add column if not exists lesson_id uuid references public.lessons (id) on delete cascade,
  add column if not exists title text,
  add column if not exists file_path text,
  add column if not exists file_type text,
  add column if not exists file_size integer,
  add column if not exists is_published boolean not null default true,
  add column if not exists created_at timestamptz not null default now();

alter table public.enrollments
  add column if not exists student_id uuid references public.profiles (id) on delete cascade,
  add column if not exists student_email text,
  add column if not exists course_id uuid references public.courses (id) on delete cascade,
  add column if not exists progress integer not null default 0,
  add column if not exists status text not null default 'active',
  add column if not exists enrolled_at timestamptz not null default now();

alter table public.payments
  add column if not exists student_id uuid references public.profiles (id) on delete set null,
  add column if not exists student_email text,
  add column if not exists course_id uuid references public.courses (id) on delete set null,
  add column if not exists amount numeric not null default 0,
  add column if not exists currency text not null default 'INR',
  add column if not exists provider text,
  add column if not exists provider_payment_id text,
  add column if not exists status text not null default 'completed',
  add column if not exists created_at timestamptz not null default now();

alter table public.lesson_progress
  add column if not exists student_id uuid references public.profiles (id) on delete cascade,
  add column if not exists course_id uuid references public.courses (id) on delete cascade,
  add column if not exists lesson_id uuid references public.lessons (id) on delete cascade,
  add column if not exists completed_at timestamptz not null default now();

alter table public.badges
  add column if not exists name text,
  add column if not exists description text,
  add column if not exists icon text,
  add column if not exists course_id uuid references public.courses (id) on delete set null,
  add column if not exists created_at timestamptz not null default now();

alter table public.user_badges
  add column if not exists student_id uuid references public.profiles (id) on delete cascade,
  add column if not exists badge_id uuid references public.badges (id) on delete cascade,
  add column if not exists course_id uuid references public.courses (id) on delete set null,
  add column if not exists awarded_at timestamptz not null default now();

alter table public.certificates
  add column if not exists certificate_no text,
  add column if not exists student_id uuid references public.profiles (id) on delete cascade,
  add column if not exists student_email text,
  add column if not exists course_id uuid references public.courses (id) on delete cascade,
  add column if not exists status text not null default 'issued',
  add column if not exists issued_at timestamptz not null default now();

-- Indexes (idempotent)
create index if not exists courses_status_idx on public.courses (status);
create index if not exists courses_slug_idx on public.courses (slug);
create index if not exists lessons_course_idx on public.lessons (course_id, position);
create index if not exists resources_course_idx on public.resources (course_id);
create index if not exists resources_lesson_idx on public.resources (lesson_id);
create index if not exists enrollments_student_idx on public.enrollments (student_id);
create index if not exists enrollments_course_idx on public.enrollments (course_id);
create index if not exists payments_course_idx on public.payments (course_id);
create index if not exists lesson_progress_student_idx on public.lesson_progress (student_id, course_id);

-- ============================================================
-- 3. FUNCTIONS (all tables above already exist, so every
--    SELECT / INSERT inside a body resolves safely)
-- ============================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'student')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Nobody (not even the row owner) may change their own role;
-- only admins may change roles. Runs as definer so it can read
-- profiles regardless of RLS.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception 'Only admins can change user roles.';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- 4. TRIGGERS (target tables guaranteed to exist by §1)
-- ============================================================

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists protect_role on public.profiles;
create trigger protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

drop trigger if exists set_profiles_updated on public.profiles;
create trigger set_profiles_updated
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_courses_updated on public.courses;
create trigger set_courses_updated
  before update on public.courses
  for each row execute function public.set_updated_at();

drop trigger if exists set_lessons_updated on public.lessons;
create trigger set_lessons_updated
  before update on public.lessons
  for each row execute function public.set_updated_at();

-- ============================================================
-- 5. ROW LEVEL SECURITY
-- Public/anon: read published catalog only.
-- Students: + own enrollments/payments/progress/certificates.
-- Admins (profiles.role = 'admin'): full access everywhere.
-- ============================================================

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.instructors enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.resources enable row level security;
alter table public.enrollments enable row level security;
alter table public.payments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.certificates enable row level security;

-- profiles
drop policy if exists "profiles_owner_read" on public.profiles;
create policy "profiles_owner_read" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_owner_update" on public.profiles;
create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id or public.is_admin());
drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- categories / instructors: public read, admin write
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);
drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for insert with check (public.is_admin());
drop policy if exists "categories_admin_update" on public.categories;
create policy "categories_admin_update" on public.categories
  for update using (public.is_admin());
drop policy if exists "categories_admin_delete" on public.categories;
create policy "categories_admin_delete" on public.categories
  for delete using (public.is_admin());

drop policy if exists "instructors_public_read" on public.instructors;
create policy "instructors_public_read" on public.instructors
  for select using (true);
drop policy if exists "instructors_admin_write" on public.instructors;
create policy "instructors_admin_write" on public.instructors
  for insert with check (public.is_admin());
drop policy if exists "instructors_admin_update" on public.instructors;
create policy "instructors_admin_update" on public.instructors
  for update using (public.is_admin());
drop policy if exists "instructors_admin_delete" on public.instructors;
create policy "instructors_admin_delete" on public.instructors
  for delete using (public.is_admin());

-- courses: public reads published only; admin everything
drop policy if exists "courses_public_read_published" on public.courses;
create policy "courses_public_read_published" on public.courses
  for select using (status = 'published' or public.is_admin());
drop policy if exists "courses_admin_write" on public.courses;
create policy "courses_admin_write" on public.courses
  for insert with check (public.is_admin());
drop policy if exists "courses_admin_update" on public.courses;
create policy "courses_admin_update" on public.courses
  for update using (public.is_admin());
drop policy if exists "courses_admin_delete" on public.courses;
create policy "courses_admin_delete" on public.courses
  for delete using (public.is_admin());

-- lessons: public reads published lessons of published courses
drop policy if exists "lessons_public_read" on public.lessons;
create policy "lessons_public_read" on public.lessons
  for select using (
    (is_published = true and exists (
      select 1 from public.courses c
      where c.id = lessons.course_id and c.status = 'published'
    ))
    or public.is_admin()
  );
drop policy if exists "lessons_admin_write" on public.lessons;
create policy "lessons_admin_write" on public.lessons
  for insert with check (public.is_admin());
drop policy if exists "lessons_admin_update" on public.lessons;
create policy "lessons_admin_update" on public.lessons
  for update using (public.is_admin());
drop policy if exists "lessons_admin_delete" on public.lessons;
create policy "lessons_admin_delete" on public.lessons
  for delete using (public.is_admin());

-- resources: same visibility rule as lessons
drop policy if exists "resources_public_read" on public.resources;
create policy "resources_public_read" on public.resources
  for select using (
    (is_published = true and exists (
      select 1 from public.courses c
      where c.id = resources.course_id and c.status = 'published'
    ))
    or public.is_admin()
  );
drop policy if exists "resources_admin_write" on public.resources;
create policy "resources_admin_write" on public.resources
  for insert with check (public.is_admin());
drop policy if exists "resources_admin_update" on public.resources;
create policy "resources_admin_update" on public.resources
  for update using (public.is_admin());
drop policy if exists "resources_admin_delete" on public.resources;
create policy "resources_admin_delete" on public.resources
  for delete using (public.is_admin());

-- enrollments: owners manage own rows; admin everything
drop policy if exists "enrollments_owner_read" on public.enrollments;
create policy "enrollments_owner_read" on public.enrollments
  for select using (auth.uid() = student_id or public.is_admin());
drop policy if exists "enrollments_owner_insert" on public.enrollments;
create policy "enrollments_owner_insert" on public.enrollments
  for insert with check (auth.uid() = student_id or public.is_admin());
drop policy if exists "enrollments_owner_update" on public.enrollments;
create policy "enrollments_owner_update" on public.enrollments
  for update using (auth.uid() = student_id or public.is_admin());
drop policy if exists "enrollments_admin_delete" on public.enrollments;
create policy "enrollments_admin_delete" on public.enrollments
  for delete using (public.is_admin());

-- payments: owners read/insert own; admin everything
drop policy if exists "payments_owner_read" on public.payments;
create policy "payments_owner_read" on public.payments
  for select using (auth.uid() = student_id or public.is_admin());
drop policy if exists "payments_owner_insert" on public.payments;
create policy "payments_owner_insert" on public.payments
  for insert with check (auth.uid() = student_id or public.is_admin());
drop policy if exists "payments_admin_update" on public.payments;
create policy "payments_admin_update" on public.payments
  for update using (public.is_admin());
drop policy if exists "payments_admin_delete" on public.payments;
create policy "payments_admin_delete" on public.payments
  for delete using (public.is_admin());

-- lesson_progress: owners full access on own rows; admin everything
drop policy if exists "progress_owner_all" on public.lesson_progress;
create policy "progress_owner_all" on public.lesson_progress
  for all using (auth.uid() = student_id or public.is_admin())
  with check (auth.uid() = student_id or public.is_admin());

-- badges: public read; admin write
drop policy if exists "badges_public_read" on public.badges;
create policy "badges_public_read" on public.badges for select using (true);
drop policy if exists "badges_admin_insert" on public.badges;
create policy "badges_admin_insert" on public.badges
  for insert with check (public.is_admin());
drop policy if exists "badges_admin_update" on public.badges;
create policy "badges_admin_update" on public.badges
  for update using (public.is_admin());
drop policy if exists "badges_admin_delete" on public.badges;
create policy "badges_admin_delete" on public.badges
  for delete using (public.is_admin());

-- user_badges: owners read/insert own; admin everything
drop policy if exists "user_badges_owner_read" on public.user_badges;
create policy "user_badges_owner_read" on public.user_badges
  for select using (auth.uid() = student_id or public.is_admin());
drop policy if exists "user_badges_owner_insert" on public.user_badges;
create policy "user_badges_owner_insert" on public.user_badges
  for insert with check (auth.uid() = student_id or public.is_admin());
drop policy if exists "user_badges_admin_update" on public.user_badges;
create policy "user_badges_admin_update" on public.user_badges
  for update using (public.is_admin());
drop policy if exists "user_badges_admin_delete" on public.user_badges;
create policy "user_badges_admin_delete" on public.user_badges
  for delete using (public.is_admin());

-- certificates: owners read/insert own; admin everything
drop policy if exists "certs_owner_read" on public.certificates;
create policy "certs_owner_read" on public.certificates
  for select using (auth.uid() = student_id or public.is_admin());
drop policy if exists "certs_owner_insert" on public.certificates;
create policy "certs_owner_insert" on public.certificates
  for insert with check (auth.uid() = student_id or public.is_admin());
drop policy if exists "certs_admin_update" on public.certificates;
create policy "certs_admin_update" on public.certificates
  for update using (public.is_admin());
drop policy if exists "certs_admin_delete" on public.certificates;
create policy "certs_admin_delete" on public.certificates
  for delete using (public.is_admin());

-- ============================================================
-- 6. STORAGE: buckets + object policies
-- course-thumbnails + avatars: public read.
-- course-videos + course-notes: PRIVATE. Reads allowed for admins
-- and enrolled students (signed URLs honor these policies).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('course-thumbnails', 'course-thumbnails', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('course-videos', 'course-videos', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('course-notes', 'course-notes', false)
on conflict (id) do nothing;

-- thumbnails: public read, admin write
drop policy if exists "thumbs_public_read" on storage.objects;
create policy "thumbs_public_read" on storage.objects
  for select using (bucket_id = 'course-thumbnails');
drop policy if exists "thumbs_admin_write" on storage.objects;
create policy "thumbs_admin_write" on storage.objects
  for insert with check (bucket_id = 'course-thumbnails' and public.is_admin());
drop policy if exists "thumbs_admin_update" on storage.objects;
create policy "thumbs_admin_update" on storage.objects
  for update using (bucket_id = 'course-thumbnails' and public.is_admin());
drop policy if exists "thumbs_admin_delete" on storage.objects;
create policy "thumbs_admin_delete" on storage.objects
  for delete using (bucket_id = 'course-thumbnails' and public.is_admin());

-- avatars: public read, owners manage their own folder, admin all
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');
drop policy if exists "avatars_owner_write" on storage.objects;
create policy "avatars_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'avatars'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update" on storage.objects
  for update using (
    bucket_id = 'avatars'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );
drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'avatars'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
  );

-- private videos: admin full access; enrolled students may read
drop policy if exists "videos_admin_all" on storage.objects;
create policy "videos_admin_all" on storage.objects
  for all using (bucket_id = 'course-videos' and public.is_admin())
  with check (bucket_id = 'course-videos' and public.is_admin());
drop policy if exists "videos_enrolled_read" on storage.objects;
create policy "videos_enrolled_read" on storage.objects
  for select using (
    bucket_id = 'course-videos'
    and exists (
      select 1 from public.enrollments e
      join public.lessons l on l.course_id = e.course_id
      where e.student_id = auth.uid()
        and storage.objects.name like 'videos/' || l.course_id::text || '/%'
    )
  );

-- private notes: admin full access; enrolled students may read
drop policy if exists "notes_admin_all" on storage.objects;
create policy "notes_admin_all" on storage.objects
  for all using (bucket_id = 'course-notes' and public.is_admin())
  with check (bucket_id = 'course-notes' and public.is_admin());
drop policy if exists "notes_enrolled_read" on storage.objects;
create policy "notes_enrolled_read" on storage.objects
  for select using (
    bucket_id = 'course-notes'
    and exists (
      select 1 from public.enrollments e
      where e.student_id = auth.uid()
        and storage.objects.name like 'notes/' || e.course_id::text || '/%'
    )
  );

-- ---------- starter categories (harmless reference data) ----------
insert into public.categories (name, slug, description)
values
  ('Development', 'development', 'Web, backend and programming courses.'),
  ('Business', 'business', 'Finance, accounting and management.'),
  ('Design', 'design', 'UI, UX and visual design.'),
  ('Marketing', 'marketing', 'SEO, content and growth marketing.')
on conflict (slug) do nothing;
