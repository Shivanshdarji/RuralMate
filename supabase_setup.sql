-- ============================================================
-- RuralMate Supabase SQL Setup
-- Run this in Supabase SQL Editor (supabase.com → Project → SQL Editor)
-- ============================================================

-- ─── profiles table ──────────────────────────────────────────────────────────
create table if not exists profiles (
  id              text primary key,      -- NextAuth user id (phone number)
  name            text,
  phone           text,
  village         text,
  district        text,
  state           text,
  land_acres      text,
  main_crops      text,                  -- comma-separated e.g. "Wheat, Mustard"
  livestock       text,                  -- comma-separated e.g. "Cattle, Goat"
  profile_complete boolean default false,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── user_settings table ─────────────────────────────────────────────────────
create table if not exists user_settings (
  user_id                 text primary key references profiles(id) on delete cascade,
  language                text default 'hi',
  notifications_weather   boolean default true,
  notifications_market    boolean default true,
  notifications_schemes   boolean default true,
  notifications_pest      boolean default true,
  units_area              text default 'acre',
  units_weight            text default 'quintal',
  units_currency          text default 'inr',
  theme                   text default 'dark',
  voice_language          text default 'hi-IN',
  auto_location           boolean default true,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- ─── Row Level Security (allow all for anon key, adjust for production) ───────
alter table profiles enable row level security;
alter table user_settings enable row level security;

-- Allow read/write for all (use anon key). For production, restrict by user id.
create policy "Allow all on profiles" on profiles for all using (true) with check (true);
create policy "Allow all on user_settings" on user_settings for all using (true) with check (true);
