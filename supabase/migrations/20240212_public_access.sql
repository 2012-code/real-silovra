-- Enable public read access for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- Enable public read access for links (only visible ones)
create policy "Public links are viewable by everyone"
  on links for select
  using ( is_visible = true );
