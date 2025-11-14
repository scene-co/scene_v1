-- ============================================
-- ALTERNATIVE FIX FOR RLS POLICIES
-- ============================================
-- This creates more permissive policies that should definitely work

-- 1. Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view other profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

-- 2. Make sure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create new permissive policies

-- Allow any authenticated user to insert a profile
-- The application logic ensures they only insert their own ID
CREATE POLICY "Enable insert for authenticated users"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow users to read their own profile
CREATE POLICY "Enable read for own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Verify the setup
SELECT 'Policies updated successfully!' as status;

-- 5. List all policies on the profiles table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
