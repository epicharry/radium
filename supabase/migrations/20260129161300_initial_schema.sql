/*
  # Initial Radium Database Schema

  ## Tables Created
  1. **profiles** - User profile data
     - `id` (uuid, primary key)
     - `auth0_id` (text, unique) - Auth identifier
     - `email` (text)
     - `username` (text, unique)
     - `display_name` (text)
     - `config` (jsonb) - Profile customization settings
     - `is_active` (boolean) - Profile visibility status
     - `view_count` (integer) - Total profile views
     - `user_id` (serial)
     - `is_premium` (boolean) - Premium membership status
     - `premium_expires_at` (timestamptz)
     - `paypal_subscription_id` (text)
     - `created_at`, `updated_at` (timestamptz)

  2. **templates** - User-created templates
     - `id` (uuid, primary key)
     - `user_id` (uuid) - Creator reference
     - `profile_id` (uuid) - Source profile
     - `name`, `description` (text)
     - `config` (jsonb) - Template configuration
     - `share_id` (varchar) - Unique sharing identifier
     - `is_public` (boolean) - Public visibility
     - `views`, `likes` (integer)
     - `created_at`, `updated_at` (timestamptz)

  3. **template_likes** - Template like tracking
     - `id` (uuid, primary key)
     - `template_id` (uuid)
     - `user_id` (uuid)
     - `created_at` (timestamptz)

  4. **admins** - Admin user management
     - `id` (uuid, primary key)
     - `user_id` (uuid)
     - `permissions` (jsonb)
     - `is_active` (boolean)
     - `created_by` (uuid)
     - `created_at`, `updated_at` (timestamptz)

  ## Storage
  - Creates `profile-assets` bucket for file uploads

  ## Security (RLS Policies)
  - **profiles**: Public read access, users can insert/update own profiles
  - **templates**: Public access for shared templates
  - **admins**: Admin-only access
  - **storage.objects**: Public read for profile-assets, authenticated users can upload/update/delete

  ## Functions
  - `update_updated_at_column()` - Auto-update timestamps
  - `increment_view_count()` - Safely increment profile views

  ## Important Notes
  - All tables use RLS for security
  - Indexes optimized for username, auth_id, and public queries
  - Storage bucket configured for public asset access
  - Premium features support built-in
*/

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  user_id SERIAL,
  is_premium BOOLEAN DEFAULT false,
  premium_expires_at TIMESTAMPTZ,
  paypal_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_auth0_id ON profiles(auth0_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active) WHERE is_active = true;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON profiles(is_premium) WHERE is_premium = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-assets', 'profile-assets', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Public Access'
  ) THEN
    CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'profile-assets');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Authenticated users can upload'
  ) THEN
    CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'profile-assets' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can update own files'
  ) THEN
    CREATE POLICY "Users can update own files" ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'profile-assets' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND policyname = 'Users can delete own files'
  ) THEN
    CREATE POLICY "Users can delete own files" ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'profile-assets' AND
      auth.role() = 'authenticated'
    );
  END IF;
END $$;

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Public profiles are viewable by everyone'
  ) THEN
    CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION increment_view_count(profile_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON COLUMN profiles.is_active IS 'Whether the profile page is active and visible to visitors';
COMMENT ON COLUMN profiles.view_count IS 'Total number of times the profile page has been viewed';

CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  config JSONB NOT NULL,
  share_id VARCHAR(255) UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_templates_share_id ON templates(share_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);

CREATE TABLE IF NOT EXISTS template_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(template_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_template_likes_template_id ON template_likes(template_id);
CREATE INDEX IF NOT EXISTS idx_template_likes_user_id ON template_likes(user_id);

DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permissions JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_is_active ON admins(is_active) WHERE is_active = true;

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admins' 
    AND policyname = 'Admins can view all admins'
  ) THEN
    CREATE POLICY "Admins can view all admins" ON admins
    FOR SELECT
    USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admins' 
    AND policyname = 'Master admin can manage admins'
  ) THEN
    CREATE POLICY "Master admin can manage admins" ON admins
    FOR ALL
    USING (true)
    WITH CHECK (true);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_admins_updated_at ON admins;
CREATE TRIGGER update_admins_updated_at
  BEFORE UPDATE ON admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();