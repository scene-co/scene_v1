# Supabase Backend Implementation Guide

This guide walks you through setting up the complete Supabase backend for the Scene app, including database tables, storage buckets, and Row Level Security policies.

## Prerequisites

- Supabase project created at [supabase.com](https://supabase.com)
- Supabase CLI installed (optional, for local development)
- Access to Supabase dashboard

## Step 1: Run Database Migrations

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - `001_create_forum_tables.sql`
   - `002_create_message_tables.sql`
   - `003_create_marketplace_tables.sql`
   - `004_create_vote_triggers.sql`
   - `005_create_rls_policies.sql`

**Steps:**
1. Click "New Query"
2. Copy the contents of the first migration file
3. Paste into the editor
4. Click "Run" or press Cmd/Ctrl + Enter
5. Repeat for each migration file

### Option B: Using Supabase CLI

```bash
# Make sure you're in the project root
cd /path/to/scene_v1

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 2: Set Up Storage Buckets

### Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets:

#### Bucket 1: avatars
- **Name:** `avatars`
- **Public:** ✅ Yes
- **File size limit:** 5 MB
- **Allowed MIME types:** image/jpeg, image/png, image/gif, image/webp

#### Bucket 2: banners
- **Name:** `banners`
- **Public:** ✅ Yes
- **File size limit:** 5 MB
- **Allowed MIME types:** image/jpeg, image/png, image/gif, image/webp

#### Bucket 3: post-images
- **Name:** `post-images`
- **Public:** ✅ Yes
- **File size limit:** 10 MB
- **Allowed MIME types:** image/jpeg, image/png, image/gif, image/webp

#### Bucket 4: marketplace-images
- **Name:** `marketplace-images`
- **Public:** ✅ Yes
- **File size limit:** 10 MB
- **Allowed MIME types:** image/jpeg, image/png, image/gif, image/webp

#### Bucket 5: message-attachments
- **Name:** `message-attachments`
- **Public:** ❌ No (private)
- **File size limit:** 20 MB
- **Allowed MIME types:** All types

### Set Up Storage Policies

For each **public** bucket (avatars, banners, post-images, marketplace-images), add these policies:

#### Policy 1: Public Read Access
```sql
-- Go to Storage > Policies > Select bucket > New Policy

-- Policy Name: Public Read Access
-- Policy Definition:
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'bucket-name');
```

#### Policy 2: Authenticated Upload
```sql
-- Policy Name: Authenticated users can upload
-- Policy Definition:
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'bucket-name');
```

#### Policy 3: Users can update own files
```sql
-- Policy Name: Users can update own files
-- Policy Definition:
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'bucket-name' AND auth.uid()::text = owner);
```

#### Policy 4: Users can delete own files
```sql
-- Policy Name: Users can delete own files
-- Policy Definition:
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'bucket-name' AND auth.uid()::text = owner);
```

**For message-attachments (private bucket):**

Only conversation participants can access files:
```sql
CREATE POLICY "Conversation participants can access"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'message-attachments' AND
  -- Add custom logic to check if user is conversation participant
  auth.uid() IN (
    SELECT user_id FROM conversation_participants
    WHERE conversation_id = (storage.objects.name::text)::uuid
  )
);
```

## Step 3: Enable Realtime (Optional but Recommended)

For real-time messaging and live updates:

1. Go to **Database** > **Replication**
2. Enable replication for these tables:
   - `messages`
   - `forum_posts`
   - `forum_votes`
   - `forum_comments`

## Step 4: Verify Setup

Run these queries in SQL Editor to verify everything is set up correctly:

```sql
-- Check if all tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Check storage buckets
SELECT * FROM storage.buckets;
```

## Step 5: Update Your .env File

Update your `.env` file with Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these values in:
**Settings** > **API** > **Project URL** and **Project API keys**

## Using the Services

### Forum Operations

```typescript
import {
  createPost,
  getPosts,
  voteOnPost,
  createComment,
  joinCommunity
} from './services/forumService';

// Create a post
const result = await createPost({
  category: 'Academics',
  title: 'Study Group for Finals',
  content: 'Looking for people to study with...',
  post_type: 'text',
  flair_text: 'STUDY',
  flair_color: '#34C759',
});

// Get posts
const { posts, total } = await getPosts('Academics', 20, 0);

// Vote on a post
await voteOnPost(postId, 'up');

// Join a community
await joinCommunity('Academics');
```

### Messaging

```typescript
import {
  createConversation,
  sendMessage,
  getMessages,
  subscribeToMessages
} from './services/messageService';

// Create a direct conversation
const { conversation } = await createConversation('direct', [otherUserId]);

// Send a message
await sendMessage(conversationId, 'Hello!');

// Get messages
const messages = await getMessages(conversationId);

// Subscribe to real-time updates
const subscription = subscribeToMessages(conversationId, (message) => {
  console.log('New message:', message);
});
```

### Marketplace

```typescript
import {
  createListing,
  getListings,
  searchListings
} from './services/marketplaceService';

// Create a listing
const { listing } = await createListing({
  title: 'Used Textbook',
  description: 'Calculus 2 textbook...',
  price: 50.00,
  condition: 'Good',
  category: 'textbooks',
  images: [imageUrl1, imageUrl2],
});

// Get listings
const { listings } = await getListings('textbooks');

// Search
const results = await searchListings('calculus');
```

### Storage

```typescript
import { uploadFile, uploadMultipleFiles } from './services/storageService';

// Upload single image
const { url } = await uploadFile('post-images', localFilePath);

// Upload multiple images
const { urls } = await uploadMultipleFiles('marketplace-images', [
  filePath1,
  filePath2,
  filePath3
]);
```

## Database Schema Overview

### Forum Tables
- `forum_posts` - Forum posts with votes and metadata
- `forum_comments` - Comments on posts (supports nesting)
- `forum_votes` - User votes on posts/comments
- `community_memberships` - User memberships in categories

### Messaging Tables
- `conversations` - Chat conversations (direct/group)
- `conversation_participants` - Users in conversations
- `messages` - Individual messages

### Marketplace Tables
- `marketplace_listings` - Product listings with images

## Troubleshooting

### Common Issues

**1. RLS Policy Errors**
```
Error: new row violates row-level security policy
```
**Solution:** Make sure RLS policies are created and user is authenticated

**2. Storage Upload Fails**
```
Error: new row violates row-level security policy for table "objects"
```
**Solution:** Check storage policies are set up for the bucket

**3. Foreign Key Violations**
```
Error: insert or update on table violates foreign key constraint
```
**Solution:** Make sure referenced records exist (e.g., profile exists before creating post)

### Useful SQL Queries

```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- View storage policies
SELECT * FROM storage.policies;

-- Count records in tables
SELECT
  'forum_posts' as table, COUNT(*) as count FROM forum_posts
UNION ALL
SELECT 'messages', COUNT(*) FROM messages
UNION ALL
SELECT 'marketplace_listings', COUNT(*) FROM marketplace_listings;
```

## Next Steps

1. ✅ Run all migrations
2. ✅ Set up storage buckets and policies
3. ✅ Enable realtime for live features
4. ✅ Update environment variables
5. ✅ Test with the provided service functions
6. 🚀 Start building your features!

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/scene-co/scene_v1/issues)
