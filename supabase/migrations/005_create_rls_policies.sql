-- Migration: Row Level Security Policies
-- Description: Set up RLS policies for all tables

-- Enable RLS on all tables
ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- FORUM POSTS POLICIES
-- ============================================

-- Anyone can view posts
CREATE POLICY "Posts are viewable by everyone"
  ON forum_posts FOR SELECT
  USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON forum_posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON forum_posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON forum_posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- FORUM COMMENTS POLICIES
-- ============================================

-- Anyone can view comments
CREATE POLICY "Comments are viewable by everyone"
  ON forum_comments FOR SELECT
  USING (true);

-- Authenticated users can create comments
CREATE POLICY "Authenticated users can create comments"
  ON forum_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON forum_comments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON forum_comments FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- FORUM VOTES POLICIES
-- ============================================

-- Users can view all votes
CREATE POLICY "Votes are viewable by everyone"
  ON forum_votes FOR SELECT
  USING (true);

-- Authenticated users can create votes
CREATE POLICY "Authenticated users can create votes"
  ON forum_votes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update own votes"
  ON forum_votes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes"
  ON forum_votes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- COMMUNITY MEMBERSHIPS POLICIES
-- ============================================

-- Everyone can view memberships
CREATE POLICY "Memberships are viewable by everyone"
  ON community_memberships FOR SELECT
  USING (true);

-- Authenticated users can join communities
CREATE POLICY "Authenticated users can join communities"
  ON community_memberships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can leave communities they joined
CREATE POLICY "Users can leave own communities"
  ON community_memberships FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- CONVERSATIONS POLICIES
-- ============================================

-- Users can only view conversations they're part of
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- Authenticated users can create conversations
CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Conversation creators can update conversations
CREATE POLICY "Creators can update conversations"
  ON conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Conversation creators can delete conversations
CREATE POLICY "Creators can delete conversations"
  ON conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- ============================================
-- CONVERSATION PARTICIPANTS POLICIES
-- ============================================

-- Users can view participants in their conversations
CREATE POLICY "Users can view conversation participants"
  ON conversation_participants FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- Conversation creators can add participants
CREATE POLICY "Creators can add participants"
  ON conversation_participants FOR INSERT
  TO authenticated
  WITH CHECK (
    conversation_id IN (
      SELECT id
      FROM conversations
      WHERE created_by = auth.uid()
    )
  );

-- Users can leave conversations
CREATE POLICY "Users can leave conversations"
  ON conversation_participants FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in own conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- Conversation participants can send messages
CREATE POLICY "Participants can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT conversation_id
      FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- Senders can update their own messages
CREATE POLICY "Senders can update own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id);

-- Senders can delete their own messages
CREATE POLICY "Senders can delete own messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- ============================================
-- MARKETPLACE LISTINGS POLICIES
-- ============================================

-- Everyone can view active listings
CREATE POLICY "Active listings are viewable by everyone"
  ON marketplace_listings FOR SELECT
  USING (status = 'active' OR seller_id = auth.uid());

-- Authenticated users can create listings
CREATE POLICY "Authenticated users can create listings"
  ON marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own listings
CREATE POLICY "Sellers can update own listings"
  ON marketplace_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id);

-- Sellers can delete their own listings
CREATE POLICY "Sellers can delete own listings"
  ON marketplace_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);
