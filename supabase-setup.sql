-- ============================================
-- SUPABASE DATABASE SETUP FOR SCENE APP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste & Run)

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 100),
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
  college_name TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create index on username for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their own profile (one-time during registration)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Optional: Allow users to view other users' public profiles (for social features)
-- Uncomment this if you want users to see each other's profiles
-- CREATE POLICY "Users can view other profiles"
--   ON public.profiles
--   FOR SELECT
--   USING (true);

-- 5. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to auto-update updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 7. Create function to check if username is available
CREATE OR REPLACE FUNCTION public.is_username_available(username_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE username = username_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.is_username_available(TEXT) TO authenticated;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Verify the table was created in Supabase Dashboard → Table Editor
-- 2. Test username availability function in SQL Editor:
--    SELECT public.is_username_available('testuser');
-- 3. Ensure RLS policies are active in Authentication → Policies
