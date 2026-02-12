-- Create a function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  username_val text;
begin
  -- Try to get username from metadata
  username_val := new.raw_user_meta_data->>'username';
  
  -- If no username (e.g. Google OAuth), generate one from email
  if username_val is null then
    username_val := split_part(new.email, '@', 1);
    -- Ensure uniqueness by appending 4 distinct random digits
    username_val := username_val || '_' || floor(random() * 9000 + 1000)::text;
  end if;

  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    username_val,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Create the trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
