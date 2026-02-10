-- Init Schema for Profiles and Links

create table if not exists profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  display_name text,
  bio text,
  avatar_url text,
  theme_id text,
  custom_theme jsonb,
  updated_at timestamp with time zone,
  constraint username_length check (char_length(username) >= 3)
);

create table if not exists links (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  title text,
  url text,
  icon text,
  is_visible boolean default true,
  animation text,
  position integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
alter table links enable row level security;

create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

create policy "Links are viewable by everyone." on links for select using ( true );
create policy "Users can insert their own links." on links for insert with check ( auth.uid() = user_id );
create policy "Users can update own links." on links for update using ( auth.uid() = user_id );
create policy "Users can delete own links." on links for delete using ( auth.uid() = user_id );
