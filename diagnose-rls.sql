-- ============================================================================
-- Diagnostic Script: Check RLS Policies and Profile Data
-- ============================================================================
-- This script will help diagnose why the profile query is hanging
-- ============================================================================

-- 1. Check if RLS is enabled on profiles table
SELECT
  tablename,
  rowsecurity AS "RLS Enabled"
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 2. List ALL policies on the profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- 3. Check if there are any profiles in the table
SELECT COUNT(*) AS "Total Profiles" FROM public.profiles;

-- 4. List all profiles (with limited info for privacy)
SELECT
  id,
  username,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- 5. Check auth users count
SELECT COUNT(*) AS "Total Auth Users" FROM auth.users;

-- 6. Check for users without profiles
SELECT
  au.id,
  au.email,
  au.created_at,
  CASE WHEN p.id IS NULL THEN 'NO PROFILE' ELSE 'HAS PROFILE' END AS profile_status
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 10;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Diagnostic complete!';
  RAISE NOTICE 'Check the results above.';
  RAISE NOTICE '========================================';
END $$;
