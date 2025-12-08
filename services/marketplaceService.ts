/**
 * Marketplace Service
 * Handles all marketplace operations (listings, searches)
 */

import { supabase } from '../lib/supabase';

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

export interface CreateListingData {
  title: string;
  description: string;
  price: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  category: string;
  images: string[];
}

// ============================================
// LISTING OPERATIONS
// ============================================

/**
 * Create a new marketplace listing
 */
export const createListing = async (
  listingData: CreateListingData
): Promise<{ success: boolean; listing?: MarketplaceListing; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('marketplace_listings')
      .insert({
        seller_id: user.id,
        ...listingData,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating listing:', error);
      return { success: false, error: error.message };
    }

    return { success: true, listing: data };
  } catch (error: any) {
    console.error('Error in createListing:', error);
    return { success: false, error: error.message || 'Failed to create listing' };
  }
};

/**
 * Get all marketplace listings with filters
 */
export const getListings = async (
  category?: string,
  status: 'active' | 'sold' | 'deleted' = 'active',
  limit: number = 20,
  offset: number = 0
): Promise<{ listings: MarketplaceListing[]; total: number }> => {
  try {
    let query = supabase
      .from('marketplace_listings')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching listings:', error);
      return { listings: [], total: 0 };
    }

    return { listings: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error in getListings:', error);
    return { listings: [], total: 0 };
  }
};

/**
 * Get a single listing by ID
 */
export const getListingById = async (listingId: string): Promise<{ success: boolean; listing?: MarketplaceListing; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('id', listingId)
      .single();

    if (error) {
      console.error('Error fetching listing:', error);
      return { success: false, error: error.message };
    }

    return { success: true, listing: data };
  } catch (error: any) {
    console.error('Error in getListingById:', error);
    return { success: false, error: error.message || 'Failed to fetch listing' };
  }
};

/**
 * Get user's own listings
 */
export const getUserListings = async (): Promise<MarketplaceListing[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('marketplace_listings')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user listings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserListings:', error);
    return [];
  }
};

/**
 * Update a listing
 */
export const updateListing = async (
  listingId: string,
  updates: Partial<CreateListingData>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('marketplace_listings')
      .update(updates)
      .eq('id', listingId);

    if (error) {
      console.error('Error updating listing:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in updateListing:', error);
    return { success: false, error: error.message || 'Failed to update listing' };
  }
};

/**
 * Mark listing as sold
 */
export const markAsSold = async (listingId: string): Promise<{ success: boolean; error?: string }> => {
  return updateListing(listingId, { status: 'sold' } as any);
};

/**
 * Delete a listing (soft delete)
 */
export const deleteListing = async (listingId: string): Promise<{ success: boolean; error?: string }> => {
  return updateListing(listingId, { status: 'deleted' } as any);
};

/**
 * Search listings
 */
export const searchListings = async (
  searchQuery: string,
  category?: string
): Promise<MarketplaceListing[]> => {
  try {
    let query = supabase
      .from('marketplace_listings')
      .select('*')
      .eq('status', 'active')
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false })
      .limit(20);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching listings:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchListings:', error);
    return [];
  }
};
