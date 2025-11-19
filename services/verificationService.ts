/**
 * Verification service for seller verification
 */

import { supabase } from '../lib/supabase';
import { SellerVerification } from '../types';

// Threshold for automatic verified seller badge
const RATING_THRESHOLD = 4.5;
const SALES_THRESHOLD = 10;

/**
 * Check if user is eligible for verified seller badge based on rating/sales
 */
export const checkVerificationEligibility = async (
  userId: string
): Promise<{ eligible: boolean; reason?: string }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('seller_rating, total_sales, government_verified, verified_seller')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking verification eligibility:', error);
      return { eligible: false, reason: 'Error checking eligibility' };
    }

    // Already verified
    if (data.verified_seller || data.government_verified) {
      return { eligible: true, reason: 'Already verified' };
    }

    // Check if meets threshold
    const rating = data.seller_rating || 0;
    const sales = data.total_sales || 0;

    if (rating >= RATING_THRESHOLD && sales >= SALES_THRESHOLD) {
      return { eligible: true };
    }

    return {
      eligible: false,
      reason: `Need ${RATING_THRESHOLD} rating and ${SALES_THRESHOLD} sales. Current: ${rating.toFixed(1)} rating, ${sales} sales`,
    };
  } catch (error) {
    console.error('Error in checkVerificationEligibility:', error);
    return { eligible: false, reason: 'Failed to check eligibility' };
  }
};

/**
 * Submit government document for verification
 */
export const submitGovernmentVerification = async (
  userId: string,
  documentType: 'aadhar' | 'pan' | 'driving_license' | 'passport',
  documentNumber: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if already submitted
    const { data: existing } = await supabase
      .from('seller_verifications')
      .select('id, verification_status')
      .eq('user_id', userId)
      .single();

    if (existing) {
      if (existing.verification_status === 'pending') {
        return { success: false, error: 'Verification is already pending review' };
      }
      if (existing.verification_status === 'approved') {
        return { success: false, error: 'You are already verified' };
      }
    }

    // Submit new verification or update rejected one
    const verificationData = {
      user_id: userId,
      document_type: documentType,
      document_number: documentNumber,
      verification_status: 'pending' as const,
      submitted_at: new Date().toISOString(),
    };

    if (existing) {
      // Update existing rejected verification
      const { error } = await supabase
        .from('seller_verifications')
        .update(verificationData)
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating verification:', error);
        return { success: false, error: error.message };
      }
    } else {
      // Insert new verification
      const { error } = await supabase
        .from('seller_verifications')
        .insert(verificationData);

      if (error) {
        console.error('Error submitting verification:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error in submitGovernmentVerification:', error);
    return { success: false, error: 'Failed to submit verification' };
  }
};

/**
 * Get user's verification status
 */
export const getVerificationStatus = async (
  userId: string
): Promise<SellerVerification | null> => {
  try {
    const { data, error } = await supabase
      .from('seller_verifications')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching verification status:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getVerificationStatus:', error);
    return null;
  }
};

/**
 * Calculate seller rating (placeholder - will be implemented with marketplace)
 */
export const calculateSellerRating = async (
  userId: string
): Promise<number> => {
  try {
    // TODO: Implement actual rating calculation based on marketplace reviews
    // For now, return the stored rating from profile
    const { data, error } = await supabase
      .from('profiles')
      .select('seller_rating')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching seller rating:', error);
      return 0;
    }

    return data?.seller_rating || 0;
  } catch (error) {
    console.error('Error in calculateSellerRating:', error);
    return 0;
  }
};

/**
 * Automatically grant verified badge if eligible
 */
export const grantVerifiedBadgeIfEligible = async (
  userId: string
): Promise<{ granted: boolean; reason?: string }> => {
  try {
    const eligibility = await checkVerificationEligibility(userId);

    if (!eligibility.eligible) {
      return { granted: false, reason: eligibility.reason };
    }

    // Grant verified seller badge
    const { error } = await supabase
      .from('profiles')
      .update({ verified_seller: true })
      .eq('id', userId);

    if (error) {
      console.error('Error granting verified badge:', error);
      return { granted: false, reason: error.message };
    }

    return { granted: true };
  } catch (error) {
    console.error('Error in grantVerifiedBadgeIfEligible:', error);
    return { granted: false, reason: 'Failed to grant badge' };
  }
};

/**
 * Update seller stats (to be called after successful sale)
 */
export const updateSellerStats = async (
  userId: string,
  rating: number
): Promise<void> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_sales, seller_rating')
      .eq('id', userId)
      .single();

    if (!profile) return;

    const newTotalSales = (profile.total_sales || 0) + 1;
    const currentRating = profile.seller_rating || 0;

    // Calculate new average rating
    const newRating = currentRating === 0
      ? rating
      : (currentRating * (newTotalSales - 1) + rating) / newTotalSales;

    await supabase
      .from('profiles')
      .update({
        total_sales: newTotalSales,
        seller_rating: newRating,
      })
      .eq('id', userId);

    // Check if now eligible for automatic verification
    await grantVerifiedBadgeIfEligible(userId);
  } catch (error) {
    console.error('Error updating seller stats:', error);
  }
};

/**
 * Get verification requirements
 */
export const getVerificationRequirements = (): {
  ratingThreshold: number;
  salesThreshold: number;
} => {
  return {
    ratingThreshold: RATING_THRESHOLD,
    salesThreshold: SALES_THRESHOLD,
  };
};
