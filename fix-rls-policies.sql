-- ============================================
-- FIX RLS POLICIES FOR PROFILES TABLE
-- ============================================
-- Run this SQL in your Supabase SQL Editor if you're getting RLS errors

-- 1. Drop existing policies (if they exist)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view other profiles" ON public.profiles;

-- 2. Recreate the policies with correct permissions

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow authenticated users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Verify RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- VERIFICATION
-- ============================================
-- After running this, test by inserting a profile:
-- This should work when you're authenticated

SELECT 'RLS policies have been reset successfully!' as message;
