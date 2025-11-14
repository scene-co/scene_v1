-- ============================================
-- SUPABASE EMAIL VERIFICATION SETUP
-- ============================================
-- This SQL configures email verification and proper RLS policies

-- 1. Drop all existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view other profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read for own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON public.profiles;

-- 2. Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create email verification-aware RLS policies

-- Allow verified users to insert their own profile
CREATE POLICY "Verified users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = id
    AND
    (SELECT email_confirmed_at FROM auth.users WHERE id = auth.uid()) IS NOT NULL
  );

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Verify email confirmation is enabled in Supabase settings
-- (This must be done in Supabase Dashboard → Authentication → Settings)

-- To check email confirmation setting:
-- Go to: Supabase Dashboard → Authentication → Settings
-- Ensure "Enable email confirmations" is ENABLED

-- 5. Configure email redirect URL for deep linking
-- Go to: Supabase Dashboard → Authentication → URL Configuration
-- Add redirect URL: scene://

-- 6. Optional: Configure email template
-- Go to: Supabase Dashboard → Authentication → Email Templates
-- Customize the "Confirm signup" template

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'profiles';

-- Test email verification check (run after creating a user)
-- Replace 'YOUR_USER_ID' with actual user ID
-- SELECT id, email, email_confirmed_at
-- FROM auth.users
-- WHERE id = 'YOUR_USER_ID';

SELECT 'Email verification RLS policies created successfully!' as message;

-- ============================================
-- IMPORTANT NOTES
-- ============================================
-- 1. Users MUST verify their email before creating a profile
-- 2. The INSERT policy checks for email_confirmed_at IS NOT NULL
-- 3. Make sure to enable email confirmations in Supabase Dashboard
-- 4. Configure redirect URL to: scene://
