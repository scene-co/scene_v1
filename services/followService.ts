/**
 * Follow service for handling follower/following relationships
 */

import { supabase } from '../lib/supabase';
import { Follow, UserProfile } from '../types';

/**
 * Follow a user
 */
export const followUser = async (
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if already following
    const { data: existing } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (existing) {
      return { success: false, error: 'Already following this user' };
    }

    // Create follow relationship
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });

    if (error) {
      console.error('Error following user:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in followUser:', error);
    return { success: false, error: 'Failed to follow user' };
  }
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (
  followerId: string,
  followingId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) {
      console.error('Error unfollowing user:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in unfollowUser:', error);
    return { success: false, error: 'Failed to unfollow user' };
  }
};

/**
 * Check if user is following another user
 */
export const isFollowing = async (
  followerId: string,
  followingId: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking follow status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isFollowing:', error);
    return false;
  }
};

/**
 * Get list of followers for a user
 */
export const getFollowers = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ followers: UserProfile[]; total: number }> => {
  try {
    // Get followers with profile data
    const { data, error, count } = await supabase
      .from('follows')
      .select('follower_id, profiles!follows_follower_id_fkey(*)', { count: 'exact' })
      .eq('following_id', userId)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching followers:', error);
      return { followers: [], total: 0 };
    }

    const followers = data?.map((item: any) => item.profiles) || [];
    return { followers, total: count || 0 };
  } catch (error) {
    console.error('Error in getFollowers:', error);
    return { followers: [], total: 0 };
  }
};

/**
 * Get list of users that a user is following
 */
export const getFollowing = async (
  userId: string,
  limit: number = 50,
  offset: number = 0
): Promise<{ following: UserProfile[]; total: number }> => {
  try {
    // Get following with profile data
    const { data, error, count } = await supabase
      .from('follows')
      .select('following_id, profiles!follows_following_id_fkey(*)', { count: 'exact' })
      .eq('follower_id', userId)
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching following:', error);
      return { following: [], total: 0 };
    }

    const following = data?.map((item: any) => item.profiles) || [];
    return { following, total: count || 0 };
  } catch (error) {
    console.error('Error in getFollowing:', error);
    return { following: [], total: 0 };
  }
};

/**
 * Get follower/following stats for a user
 */
export const getFollowStats = async (
  userId: string
): Promise<{ followerCount: number; followingCount: number }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('follower_count, following_count')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching follow stats:', error);
      return { followerCount: 0, followingCount: 0 };
    }

    return {
      followerCount: data?.follower_count || 0,
      followingCount: data?.following_count || 0,
    };
  } catch (error) {
    console.error('Error in getFollowStats:', error);
    return { followerCount: 0, followingCount: 0 };
  }
};

/**
 * Search followers by username
 */
export const searchFollowers = async (
  userId: string,
  searchQuery: string
): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('follower_id, profiles!follows_follower_id_fkey(*)')
      .eq('following_id', userId)
      .ilike('profiles.username', `%${searchQuery}%`)
      .limit(20);

    if (error) {
      console.error('Error searching followers:', error);
      return [];
    }

    return data?.map((item: any) => item.profiles) || [];
  } catch (error) {
    console.error('Error in searchFollowers:', error);
    return [];
  }
};

/**
 * Search following by username
 */
export const searchFollowing = async (
  userId: string,
  searchQuery: string
): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('follows')
      .select('following_id, profiles!follows_following_id_fkey(*)')
      .eq('follower_id', userId)
      .ilike('profiles.username', `%${searchQuery}%`)
      .limit(20);

    if (error) {
      console.error('Error searching following:', error);
      return [];
    }

    return data?.map((item: any) => item.profiles) || [];
  } catch (error) {
    console.error('Error in searchFollowing:', error);
    return [];
  }
};
