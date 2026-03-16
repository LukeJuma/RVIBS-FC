-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- Players
create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  position text not null,
  number integer not null,
  photo text default '',
  nationality text default 'Kenya',
  appearances integer default 0,
  goals integer default 0,
  assists integer default 0,
  biography text default '',
  created_at timestamptz default now()
);

-- Fixtures
create table if not exists fixtures (
  id uuid primary key default gen_random_uuid(),
  home_team text not null,
  away_team text not null,
  home_team_logo text default '',
  away_team_logo text default '',
  date date not null,
  time text not null,
  venue text not null,
  competition text not null,
  home_score integer,
  away_score integer,
  status text not null default 'upcoming',
  created_at timestamptz default now()
);

-- News
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text not null,
  content text not null,
  category text not null,
  image text default '',
  date date not null,
  author text not null,
  featured boolean default false,
  created_at timestamptz default now()
);

-- Gallery
create table if not exists gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  title text not null,
  category text not null,
  date date not null,
  created_at timestamptz default now()
);

-- Standings
create table if not exists standings (
  id uuid primary key default gen_random_uuid(),
  position integer default 0,
  team text not null unique,
  team_logo text default '',
  played integer default 0,
  won integer default 0,
  drawn integer default 0,
  lost integer default 0,
  goals_for integer default 0,
  goals_against integer default 0,
  goal_difference integer default 0,
  points integer default 0,
  created_at timestamptz default now()
);

-- Activity Log
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  category text not null,
  created_at timestamptz default now()
);

-- Storage bucket for images
insert into storage.buckets (id, name, public)
values ('rvibs-images', 'rvibs-images', true)
on conflict do nothing;

-- Allow public read on images bucket
create policy "Public read images" on storage.objects
  for select using (bucket_id = 'rvibs-images');

-- Allow authenticated users to upload
create policy "Auth upload images" on storage.objects
  for insert with check (bucket_id = 'rvibs-images');

create policy "Auth delete images" on storage.objects
  for delete using (bucket_id = 'rvibs-images');

-- Enable Row Level Security but allow all for now (admin handles auth in app)
alter table players enable row level security;
alter table fixtures enable row level security;
alter table news enable row level security;
alter table gallery enable row level security;
alter table standings enable row level security;
alter table activity_log enable row level security;

-- Public read policies
create policy "Public read players" on players for select using (true);
create policy "Public read fixtures" on fixtures for select using (true);
create policy "Public read news" on news for select using (true);
create policy "Public read gallery" on gallery for select using (true);
create policy "Public read standings" on standings for select using (true);
create policy "Public read activity" on activity_log for select using (true);

-- Anon write policies (admin auth handled in app layer)
create policy "Anon write players" on players for all using (true) with check (true);
create policy "Anon write fixtures" on fixtures for all using (true) with check (true);
create policy "Anon write news" on news for all using (true) with check (true);
create policy "Anon write gallery" on gallery for all using (true) with check (true);
create policy "Anon write standings" on standings for all using (true) with check (true);
create policy "Anon write activity" on activity_log for all using (true) with check (true);

-- ── Polls ─────────────────────────────────────────────────────────────────
create table if not exists polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  type text not null default 'motm', -- 'motm' | 'player_of_month'
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  text text not null,
  votes integer default 0
);

create table if not exists poll_votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid references polls(id) on delete cascade,
  option_id uuid references poll_options(id) on delete cascade,
  voter_key text not null, -- localStorage fingerprint to prevent double voting
  created_at timestamptz default now(),
  unique(poll_id, voter_key)
);

alter table polls enable row level security;
alter table poll_options enable row level security;
alter table poll_votes enable row level security;

create policy "Public read polls" on polls for select using (true);
create policy "Public read poll_options" on poll_options for select using (true);
create policy "Public read poll_votes" on poll_votes for select using (true);

create policy "Anon write polls" on polls for all using (true) with check (true);
create policy "Anon write poll_options" on poll_options for all using (true) with check (true);
create policy "Anon write poll_votes" on poll_votes for all using (true) with check (true);

-- Add role column to players for coaching staff
alter table players add column if not exists role text default '';

-- ── Fan Content (Supabase-backed) ─────────────────────────────────────────

create table if not exists fan_spotlights (
  id uuid primary key default gen_random_uuid(),
  type text not null, -- 'fan_of_month' | 'seal_of_season'
  name text not null,
  photo text default '',
  quote text default '',
  since text default '',
  period text default '', -- month name or season e.g. "March 2026" / "2025/26"
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists away_trips (
  id uuid primary key default gen_random_uuid(),
  fixture text not null,
  date date not null,
  venue text not null,
  departure_point text default '',
  departure_time text default '',
  interested_fans text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists matchday_info (
  id uuid primary key default gen_random_uuid(),
  stadium text not null,
  address text default '',
  capacity text default '',
  gates_open text default '',
  tips text[] default '{}',
  updated_at timestamptz default now()
);

alter table fan_spotlights enable row level security;
alter table away_trips enable row level security;
alter table matchday_info enable row level security;

create policy "Public read fan_spotlights" on fan_spotlights for select using (true);
create policy "Public read away_trips" on away_trips for select using (true);
create policy "Public read matchday_info" on matchday_info for select using (true);

create policy "Anon write fan_spotlights" on fan_spotlights for all using (true) with check (true);
create policy "Anon write away_trips" on away_trips for all using (true) with check (true);
create policy "Anon write matchday_info" on matchday_info for all using (true) with check (true);

-- Seed default matchday info
insert into matchday_info (stadium, address, capacity, gates_open, tips)
values (
  'Seals Arena', 'Nakuru, Kenya', '900', '2 hours before kick-off',
  array[
    'Arrive early — gates open 2 hours before kick-off',
    'Wear your blue and white with pride',
    'Maximum fun guaranteed',
    'Family Space available',
    'Follow @rvib_seals on Instagram for live updates'
  ]
) on conflict do nothing;
