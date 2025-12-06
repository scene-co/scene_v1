/**
 * Database Types
 * TypeScript types for Supabase database tables
 * Auto-generated types for type-safe database operations
 */

// ============================================
// FORUM TYPES
// ============================================

export interface ForumPost {
  id: string;
  user_id: string;
  category: string;
  title: string;
  content: string;
  preview: string;
  post_type: 'text' | 'image' | 'link';
  image_url?: string;
  link_url?: string;
  flair_text?: string;
  flair_color?: string;
  upvotes: number;
  downvotes: number;
  score: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumComment {
  id: string;
  post_id: string;
  parent_comment_id?: string;
  user_id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface ForumVote {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  vote_type: 'up' | 'down';
  created_at: string;
}

export interface CommunityMembership {
  id: string;
  user_id: string;
  category: string;
  joined_at: string;
}

// ============================================
// MESSAGING TYPES
// ============================================

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachment_url?: string;
  attachment_type?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// MARKETPLACE TYPES
// ============================================

export interface MarketplaceListing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  category: string;
  images: string[];
  status: 'active' | 'sold' | 'deleted';
  created_at: string;
  updated_at: string;
}

// ============================================
// PROFILE TYPES (if not already defined)
// ============================================

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  follower_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// DATABASE SCHEMA TYPE
// ============================================

export interface Database {
  public: {
    Tables: {
      forum_posts: {
        Row: ForumPost;
        Insert: Omit<ForumPost, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes' | 'score' | 'comment_count'>;
        Update: Partial<Omit<ForumPost, 'id' | 'user_id' | 'created_at'>>;
      };
      forum_comments: {
        Row: ForumComment;
        Insert: Omit<ForumComment, 'id' | 'created_at' | 'updated_at' | 'upvotes' | 'downvotes' | 'score'>;
        Update: Partial<Omit<ForumComment, 'id' | 'user_id' | 'post_id' | 'created_at'>>;
      };
      forum_votes: {
        Row: ForumVote;
        Insert: Omit<ForumVote, 'id' | 'created_at'>;
        Update: Partial<Omit<ForumVote, 'id' | 'user_id' | 'created_at'>>;
      };
      community_memberships: {
        Row: CommunityMembership;
        Insert: Omit<CommunityMembership, 'id' | 'joined_at'>;
        Update: Partial<Omit<CommunityMembership, 'id' | 'user_id' | 'joined_at'>>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'created_by' | 'created_at'>>;
      };
      conversation_participants: {
        Row: ConversationParticipant;
        Insert: Omit<ConversationParticipant, 'id' | 'joined_at'>;
        Update: Partial<Omit<ConversationParticipant, 'id' | 'conversation_id' | 'user_id' | 'joined_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at' | 'updated_at' | 'is_read'>;
        Update: Partial<Omit<Message, 'id' | 'conversation_id' | 'sender_id' | 'created_at'>>;
      };
      marketplace_listings: {
        Row: MarketplaceListing;
        Insert: Omit<MarketplaceListing, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MarketplaceListing, 'id' | 'seller_id' | 'created_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at' | 'follower_count' | 'following_count'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
    };
  };
}
