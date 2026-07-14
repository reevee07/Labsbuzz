-- =========================================================================
-- Labsbuzz - Initial Database Schema
-- Diagnostic lab test price comparison & booking platform
-- =========================================================================
-- Run via: supabase db push  (or paste into Supabase SQL Editor)
-- =========================================================================

create extension if not exists "pgcrypto";

-- =========================================================================
-- USERS
-- Application-level auth (custom JWT, not Supabase Auth) so we control
-- role-based access (customer / lab_owner) explicitly server-side.
-- =========================================================================
create type user_role as enum ('customer', 'lab_owner');

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role user_role not null default 'customer',
  name text not null,
  phone text not null unique,
  email text not null unique,
  password_hash text not null,
  avatar_url text,
  reset_token_hash text,
  reset_token_expires timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_users_email on users (email);
create index if not exists idx_users_phone on users (phone);
create index if not exists idx_users_role on users (role);

-- =========================================================================
-- LABS
-- =========================================================================
create table if not exists labs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users (id) on delete cascade,
  name text not null,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  latitude double precision not null,
  longitude double precision not null,
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  logo_url text,
  phone text not null,
  verified boolean not null default false,
  nabl_certified boolean not null default false,
  opens_at time,
  closes_at time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_labs_owner unique (owner_id)
);

create index if not exists idx_labs_owner on labs (owner_id);
create index if not exists idx_labs_city on labs (city);
create index if not exists idx_labs_lat_lng on labs (latitude, longitude);
create index if not exists idx_labs_verified on labs (verified);

-- =========================================================================
-- TESTS  (global catalogue: CBC, Vitamin D, LFT, KFT, MRI, etc.)
-- =========================================================================
create table if not exists tests (
  id uuid primary key default gen_random_uuid(),
  test_name text not null,
  category text not null,
  created_at timestamptz not null default now(),
  constraint uq_tests_name unique (test_name)
);

create index if not exists idx_tests_category on tests (category);
create index if not exists idx_tests_name_trgm on tests using gin (test_name gin_trgm_ops);

-- Enable trigram extension for fast ILIKE search (falls back gracefully if unavailable)
create extension if not exists pg_trgm;

-- =========================================================================
-- LAB_TESTS  (join table: lab-specific pricing & availability for a test)
-- =========================================================================
create table if not exists lab_tests (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references labs (id) on delete cascade,
  test_id uuid not null references tests (id) on delete cascade,
  price numeric(10, 2) not null check (price >= 0),
  discounted_price numeric(10, 2) check (discounted_price >= 0),
  turnaround_time text not null,
  home_collection boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_lab_tests unique (lab_id, test_id),
  constraint chk_discount_lte_price check (
    discounted_price is null or discounted_price <= price
  )
);

create index if not exists idx_lab_tests_lab on lab_tests (lab_id);
create index if not exists idx_lab_tests_test on lab_tests (test_id);
create index if not exists idx_lab_tests_active on lab_tests (is_active);

-- =========================================================================
-- BOOKINGS
-- =========================================================================
create type booking_status as enum ('pending', 'confirmed', 'completed', 'cancelled');

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  lab_id uuid not null references labs (id) on delete cascade,
  lab_test_id uuid not null references lab_tests (id) on delete restrict,
  booking_date date not null,
  booking_time text not null,
  booking_status booking_status not null default 'pending',
  home_collection boolean not null default false,
  address text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_bookings_user on bookings (user_id);
create index if not exists idx_bookings_lab on bookings (lab_id);
create index if not exists idx_bookings_status on bookings (booking_status);
create index if not exists idx_bookings_date on bookings (booking_date);

-- =========================================================================
-- REVIEWS
-- =========================================================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  lab_id uuid not null references labs (id) on delete cascade,
  rating numeric(2, 1) not null check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamptz not null default now(),
  constraint uq_reviews_user_lab unique (user_id, lab_id)
);

create index if not exists idx_reviews_lab on reviews (lab_id);
create index if not exists idx_reviews_user on reviews (user_id);

-- =========================================================================
-- FAVORITES (Saved Labs)
-- =========================================================================
create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  lab_id uuid not null references labs (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint uq_favorites_user_lab unique (user_id, lab_id)
);

create index if not exists idx_favorites_user on favorites (user_id);

-- =========================================================================
-- NOTIFICATIONS
-- =========================================================================
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users (id) on delete cascade,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user on notifications (user_id);
create index if not exists idx_notifications_read on notifications (read);

-- =========================================================================
-- updated_at auto-touch trigger
-- =========================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at before update on users
  for each row execute function set_updated_at();
create trigger trg_labs_updated_at before update on labs
  for each row execute function set_updated_at();
create trigger trg_lab_tests_updated_at before update on lab_tests
  for each row execute function set_updated_at();
create trigger trg_bookings_updated_at before update on bookings
  for each row execute function set_updated_at();

-- =========================================================================
-- ROW LEVEL SECURITY
-- Backend uses the Supabase service_role key (bypasses RLS) for all
-- application logic, since auth/authorization is handled in the Node API
-- via custom JWTs. RLS is enabled here as defense-in-depth in case the
-- anon/public key is ever exposed to a client directly.
-- =========================================================================
alter table users enable row level security;
alter table labs enable row level security;
alter table tests enable row level security;
alter table lab_tests enable row level security;
alter table bookings enable row level security;
alter table reviews enable row level security;
alter table favorites enable row level security;
alter table notifications enable row level security;

-- Public read-only access for catalogue/browse data (tests, verified labs, active lab_tests, reviews)
create policy "Public can read tests" on tests
  for select using (true);

create policy "Public can read verified labs" on labs
  for select using (verified = true);

create policy "Public can read active lab_tests" on lab_tests
  for select using (is_active = true);

create policy "Public can read reviews" on reviews
  for select using (true);

-- No public insert/update/delete policies are defined for any table:
-- all writes must go through the backend service_role connection.
