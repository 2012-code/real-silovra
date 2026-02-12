-- Add missing columns to profiles table for Phase 3+ features
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS layout_mode text DEFAULT 'list';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_links jsonb DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS seo_settings jsonb DEFAULT NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_views integer DEFAULT 0;

-- Add click_count to links table for analytics
ALTER TABLE links ADD COLUMN IF NOT EXISTS click_count integer DEFAULT 0;

-- Create avatars storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Users can upload their own avatar" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow users to update their own avatar
CREATE POLICY "Users can update their own avatar" ON storage.objects
    FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
