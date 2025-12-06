-- ============================================
-- STORAGE POLICIES
-- ============================================
-- This migration creates Row Level Security policies for Supabase Storage buckets
-- Run this AFTER creating the storage buckets in Supabase Dashboard:
-- 1. avatars (public)
-- 2. banners (public)
-- 3. post-images (public)
-- 4. marketplace-images (public)
-- 5. message-attachments (private)

-- ============================================
-- AVATARS BUCKET POLICIES
-- ============================================

-- Policy 1: Anyone can view avatars
CREATE POLICY "Public Read Access - Avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy 2: Authenticated users can upload avatars
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Policy 3: Users can update their own avatar files
CREATE POLICY "Users can update own avatar files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- Policy 4: Users can delete their own avatar files
CREATE POLICY "Users can delete own avatar files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- ============================================
-- BANNERS BUCKET POLICIES
-- ============================================

-- Policy 1: Anyone can view banners
CREATE POLICY "Public Read Access - Banners"
ON storage.objects FOR SELECT
USING (bucket_id = 'banners');

-- Policy 2: Authenticated users can upload banners
CREATE POLICY "Authenticated users can upload banners"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banners');

-- Policy 3: Users can update their own banner files
CREATE POLICY "Users can update own banner files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'banners' AND auth.uid() = owner);

-- Policy 4: Users can delete their own banner files
CREATE POLICY "Users can delete own banner files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'banners' AND auth.uid() = owner);

-- ============================================
-- POST-IMAGES BUCKET POLICIES
-- ============================================

-- Policy 1: Anyone can view post images
CREATE POLICY "Public Read Access - Post Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Policy 2: Authenticated users can upload post images
CREATE POLICY "Authenticated users can upload post images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'post-images');

-- Policy 3: Users can update their own post image files
CREATE POLICY "Users can update own post image files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid() = owner);

-- Policy 4: Users can delete their own post image files
CREATE POLICY "Users can delete own post image files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'post-images' AND auth.uid() = owner);

-- ============================================
-- MARKETPLACE-IMAGES BUCKET POLICIES
-- ============================================

-- Policy 1: Anyone can view marketplace images
CREATE POLICY "Public Read Access - Marketplace Images"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketplace-images');

-- Policy 2: Authenticated users can upload marketplace images
CREATE POLICY "Authenticated users can upload marketplace images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'marketplace-images');

-- Policy 3: Users can update their own marketplace image files
CREATE POLICY "Users can update own marketplace image files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'marketplace-images' AND auth.uid() = owner);

-- Policy 4: Users can delete their own marketplace image files
CREATE POLICY "Users can delete own marketplace image files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'marketplace-images' AND auth.uid() = owner);

-- ============================================
-- MESSAGE-ATTACHMENTS BUCKET POLICIES (Private)
-- ============================================
-- Note: message-attachments is a PRIVATE bucket
-- For now, we'll just allow authenticated users to access their own files
-- In the future, you can add custom logic to check conversation participants

-- Policy 1: Users can view their own uploaded attachments
CREATE POLICY "Users can view own message attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  auth.uid() = owner
);

-- Policy 2: Authenticated users can upload message attachments
CREATE POLICY "Authenticated users can upload message attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'message-attachments');

-- Policy 3: Users can update their own message attachment files
CREATE POLICY "Users can update own message attachment files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'message-attachments' AND auth.uid() = owner);

-- Policy 4: Users can delete their own message attachment files
CREATE POLICY "Users can delete own message attachment files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'message-attachments' AND auth.uid() = owner);

-- ============================================
-- VERIFICATION
-- ============================================
-- Run this query to verify all policies were created:
-- SELECT * FROM storage.policies ORDER BY bucket_id, name;
