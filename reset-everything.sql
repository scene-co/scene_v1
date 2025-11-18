-- ============================================================================
-- RESET SCRIPT: Delete all users and profiles to start fresh
-- ============================================================================
-- WARNING: This will delete ALL test data!
-- ============================================================================

-- Delete all profiles first (if any exist)
DELETE FROM public.profiles;

-- Delete all auth users (this will cascade and clean up everything)
-- Note: You cannot delete users via SQL in Supabase, must use dashboard

-- Verify everything is clean
SELECT COUNT(*) AS "Remaining Profiles" FROM public.profiles;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Profiles deleted!';
  RAISE NOTICE 'Now delete users manually from dashboard:';
  RAISE NOTICE 'https://app.supabase.com/project/hodibzqnglyjmgkykfaa/auth/users';
  RAISE NOTICE '========================================';
END $$;
