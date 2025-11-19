-- ============================================
-- SUPABASE DATABASE SETUP FOR SCENE APP
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste & Run)

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 13 AND age <= 100),
  gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
  college_name TEXT,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  profile_picture_url TEXT,
  banner_image_url TEXT,
  bio TEXT CHECK (LENGTH(bio) <= 190),
  verified_seller BOOLEAN DEFAULT FALSE,
  government_verified BOOLEAN DEFAULT FALSE,
  seller_rating DECIMAL(3,2) DEFAULT 0.00 CHECK (seller_rating >= 0 AND seller_rating <= 5),
  total_sales INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  username_last_changed TIMESTAMPTZ,
  username_change_count INTEGER DEFAULT 0,
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
CREATE POLICY "Users can view other profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

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

-- 9. Create follows table for follower/following relationships
CREATE TABLE IF NOT EXISTS public.follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_follows_follower ON public.follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON public.follows(following_id);

-- Enable RLS for follows table
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- Allow users to view all follows (public social graph)
CREATE POLICY "Users can view all follows"
  ON public.follows
  FOR SELECT
  USING (true);

-- Allow users to follow others
CREATE POLICY "Users can follow others"
  ON public.follows
  FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Allow users to unfollow
CREATE POLICY "Users can unfollow"
  ON public.follows
  FOR DELETE
  USING (auth.uid() = follower_id);

-- 10. Create seller_verifications table for government document verification
CREATE TABLE IF NOT EXISTS public.seller_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  document_type TEXT NOT NULL CHECK (document_type IN ('aadhar', 'pan', 'driving_license', 'passport')),
  document_number TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMPTZ,
  rejected_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_seller_verifications_user ON public.seller_verifications(user_id);

-- Enable RLS
ALTER TABLE public.seller_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification
CREATE POLICY "Users can view own verification"
  ON public.seller_verifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can submit verification
CREATE POLICY "Users can submit verification"
  ON public.seller_verifications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger to update updated_at on seller_verifications
CREATE TRIGGER set_seller_verifications_updated_at
  BEFORE UPDATE ON public.seller_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 11. Function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment follower count for the user being followed
    UPDATE public.profiles
    SET follower_count = follower_count + 1
    WHERE id = NEW.following_id;

    -- Increment following count for the follower
    UPDATE public.profiles
    SET following_count = following_count + 1
    WHERE id = NEW.follower_id;

    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement follower count
    UPDATE public.profiles
    SET follower_count = GREATEST(0, follower_count - 1)
    WHERE id = OLD.following_id;

    -- Decrement following count
    UPDATE public.profiles
    SET following_count = GREATEST(0, following_count - 1)
    WHERE id = OLD.follower_id;

    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 12. Trigger to automatically update follower counts
CREATE TRIGGER update_follower_counts_trigger
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_follower_counts();

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Next steps:
-- 1. Verify the tables were created in Supabase Dashboard → Table Editor
-- 2. Test username availability function in SQL Editor:
--    SELECT public.is_username_available('testuser');
-- 3. Ensure RLS policies are active in Authentication → Policies
-- 4. Test follow/unfollow functionality
-- 5. Verify follower counts update automatically
