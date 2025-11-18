-- ============================================================================
-- SQL Script: Remove Email Verification Requirement from RLS Policies
-- ============================================================================
--
-- Purpose: Update Row-Level Security (RLS) policies to allow authenticated users
--          to create profiles WITHOUT email verification requirement.
--
-- What this script does:
-- 1. Drops the old INSERT policy that required email verification
-- 2. Creates a new INSERT policy that only requires authentication
--
-- When to run this:
-- - After removing email verification from your app code
-- - Before testing user registration flow
--
-- How to run this:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Paste this entire script
-- 3. Click "Run" or press Cmd/Ctrl + Enter
-- 4. Verify success message appears
--
-- ============================================================================

-- Drop the old email verification-aware policies
DROP POLICY IF EXISTS "Verified users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Drop existing policies if they already exist (to avoid error 42710)
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;

-- ============================================================================
-- SELECT Policy: Allow users to read their own profile
-- ============================================================================
CREATE POLICY "Enable read access for own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- ============================================================================
-- INSERT Policy: Allow users to create their own profile
-- ============================================================================
CREATE POLICY "Enable insert for authenticated users"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- UPDATE Policy: Allow users to update their own profile
-- ============================================================================
CREATE POLICY "Enable update for own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Verify the policies were created
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS policies updated successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Email verification is no longer required.';
  RAISE NOTICE 'Users can now:';
  RAISE NOTICE '  - Read their own profile (SELECT)';
  RAISE NOTICE '  - Create their profile (INSERT)';
  RAISE NOTICE '  - Update their profile (UPDATE)';
  RAISE NOTICE '========================================';
END $$;
