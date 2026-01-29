/*
  # Update Authentication to Supabase

  ## Changes
  - Rename `auth0_id` column to `user_id` to work with Supabase auth
  - Update related indexes and constraints

  ## Important Notes
  - This migration safely updates the authentication system to use Supabase
  - Preserves existing data and relationships
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'auth0_id'
  ) THEN
    ALTER TABLE profiles RENAME COLUMN auth0_id TO supabase_user_id;
    
    DROP INDEX IF EXISTS idx_profiles_auth0_id;
    CREATE INDEX IF NOT EXISTS idx_profiles_supabase_user_id ON profiles(supabase_user_id);
  END IF;
END $$;