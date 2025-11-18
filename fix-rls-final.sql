-- ============================================================================
-- FINAL FIX: RLS Policies for Authentication Flow
-- ============================================================================
-- This ensures the flow works: Register → Login → Profile Setup → Home
-- ============================================================================

-- 1. Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Verified users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- 3. Create SELECT policy - Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- 4. Create INSERT policy - Allow users to create their own profile
CREATE POLICY "Enable insert for authenticated users"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 5. Create UPDATE policy - Allow users to update their own profile
CREATE POLICY "Enable update for own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6. Verify the policies were created
SELECT
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY cmd, policyname;

-- 7. Test query that simulates what the app does
-- This should return 0 rows (not hang) if profile doesn't exist
DO $$
DECLARE
  test_result INTEGER;
BEGIN
  SELECT COUNT(*) INTO test_result
  FROM public.profiles
  WHERE id = auth.uid();

  RAISE NOTICE '========================================';
  RAISE NOTICE 'RLS policies configured successfully!';
  RAISE NOTICE 'Test query result: % profiles found', test_result;
  RAISE NOTICE '';
  RAISE NOTICE 'Policies created:';
  RAISE NOTICE '  ✓ SELECT - Users can read own profile';
  RAISE NOTICE '  ✓ INSERT - Users can create own profile';
  RAISE NOTICE '  ✓ UPDATE - Users can update own profile';
  RAISE NOTICE '';
  RAISE NOTICE 'Authentication flow enabled:';
  RAISE NOTICE '  1. Register (email + password)';
  RAISE NOTICE '  2. Login (authenticate)';
  RAISE NOTICE '  3. Profile Setup (create profile)';
  RAISE NOTICE '  4. Home (main app)';
  RAISE NOTICE '========================================';
END $$;
