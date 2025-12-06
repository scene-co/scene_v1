/**
 * Forum Service
 * Handles all forum-related operations (posts, comments, votes)
 */

import { supabase } from '../lib/supabase';

export interface ForumPost {
  id: string;
  user_id: string;
  category: string;
  title: string;
  content: string;
  preview?: string;
  post_type: 'text' | 'image' | 'link';
  image_url?: string;
  link_url?: string;
  thumbnail_url?: string;
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
  user_id: string;
  parent_id?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  score: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  category: string;
  title: string;
  content: string;
  post_type: 'text' | 'image' | 'link';
  image_url?: string;
  link_url?: string;
  flair_text?: string;
  flair_color?: string;
}

// ============================================
// POST OPERATIONS
// ============================================

/**
 * Create a new forum post
 */
export const createPost = async (postData: CreatePostData): Promise<{ success: boolean; post?: ForumPost; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const preview = postData.content.substring(0, 200);

    const { data, error } = await supabase
      .from('forum_posts')
      .insert({
        user_id: user.id,
        ...postData,
        preview,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return { success: false, error: error.message };
    }

    return { success: true, post: data };
  } catch (error: any) {
    console.error('Error in createPost:', error);
    return { success: false, error: error.message || 'Failed to create post' };
  }
};

/**
 * Get all forum posts with pagination
 */
export const getPosts = async (
  category?: string,
  limit: number = 20,
  offset: number = 0
): Promise<{ posts: ForumPost[]; total: number }> => {
  try {
    let query = supabase
      .from('forum_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], total: 0 };
    }

    return { posts: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error in getPosts:', error);
    return { posts: [], total: 0 };
  }
};

/**
 * Get a single post by ID
 */
export const getPostById = async (postId: string): Promise<ForumPost | null> => {
  try {
    const { data, error } = await supabase
      .from('forum_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPostById:', error);
    return null;
  }
};

/**
 * Update a forum post
 */
export const updatePost = async (
  postId: string,
  updates: Partial<CreatePostData>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('forum_posts')
      .update(updates)
      .eq('id', postId);

    if (error) {
      console.error('Error updating post:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in updatePost:', error);
    return { success: false, error: error.message || 'Failed to update post' };
  }
};

/**
 * Delete a forum post
 */
export const deletePost = async (postId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in deletePost:', error);
    return { success: false, error: error.message || 'Failed to delete post' };
  }
};

// ============================================
// VOTING OPERATIONS
// ============================================

/**
 * Vote on a post
 */
export const voteOnPost = async (
  postId: string,
  voteType: 'up' | 'down'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('forum_votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single();

    if (existingVote) {
      // If same vote type, remove the vote
      if (existingVote.vote_type === voteType) {
        const { error } = await supabase
          .from('forum_votes')
          .delete()
          .eq('id', existingVote.id);

        if (error) {
          return { success: false, error: error.message };
        }
      } else {
        // Update to new vote type
        const { error } = await supabase
          .from('forum_votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);

        if (error) {
          return { success: false, error: error.message };
        }
      }
    } else {
      // Create new vote
      const { error } = await supabase
        .from('forum_votes')
        .insert({
          user_id: user.id,
          post_id: postId,
          vote_type: voteType,
        });

      if (error) {
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in voteOnPost:', error);
    return { success: false, error: error.message || 'Failed to vote' };
  }
};

/**
 * Get user's vote on a post
 */
export const getUserVoteOnPost = async (postId: string): Promise<'up' | 'down' | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('forum_votes')
      .select('vote_type')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single();

    if (error || !data) return null;

    return data.vote_type as 'up' | 'down';
  } catch (error) {
    console.error('Error in getUserVoteOnPost:', error);
    return null;
  }
};

// ============================================
// COMMENT OPERATIONS
// ============================================

/**
 * Create a comment on a post
 */
export const createComment = async (
  postId: string,
  content: string,
  parentId?: string
): Promise<{ success: boolean; comment?: ForumComment; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('forum_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        parent_id: parentId,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return { success: false, error: error.message };
    }

    return { success: true, comment: data };
  } catch (error: any) {
    console.error('Error in createComment:', error);
    return { success: false, error: error.message || 'Failed to create comment' };
  }
};

/**
 * Get comments for a post
 */
export const getCommentsByPostId = async (
  postId: string
): Promise<ForumComment[]> => {
  try {
    const { data, error } = await supabase
      .from('forum_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCommentsByPostId:', error);
    return [];
  }
};

// ============================================
// COMMUNITY OPERATIONS
// ============================================

/**
 * Join a community
 */
export const joinCommunity = async (category: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('community_memberships')
      .insert({
        user_id: user.id,
        category,
      });

    if (error) {
      console.error('Error joining community:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in joinCommunity:', error);
    return { success: false, error: error.message || 'Failed to join community' };
  }
};

/**
 * Leave a community
 */
export const leaveCommunity = async (category: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('community_memberships')
      .delete()
      .eq('user_id', user.id)
      .eq('category', category);

    if (error) {
      console.error('Error leaving community:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in leaveCommunity:', error);
    return { success: false, error: error.message || 'Failed to leave community' };
  }
};

/**
 * Check if user is member of a community
 */
export const isUserMemberOfCommunity = async (category: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('community_memberships')
      .select('id')
      .eq('user_id', user.id)
      .eq('category', category)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking membership:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isUserMemberOfCommunity:', error);
    return false;
  }
};
