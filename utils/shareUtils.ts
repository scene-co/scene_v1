/**
 * Share utility functions for Scene app
 */

import { Share, Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

/**
 * Share a user profile
 */
export const shareProfile = async (username: string, userId: string): Promise<void> => {
  try {
    const profileUrl = `https://scene.app/profile/${username}`;
    const message = `Check out @${username}'s profile on Scene!`;

    const shareContent = {
      message: Platform.OS === 'ios' ? message : `${message}\n${profileUrl}`,
      url: Platform.OS === 'ios' ? profileUrl : undefined,
      title: 'Share Profile'
    };

    const result = await Share.share(shareContent);

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        console.log('Shared via:', result.activityType);
      } else {
        console.log('Profile shared successfully');
      }
    } else if (result.action === Share.dismissedAction) {
      console.log('Share dismissed');
    }
  } catch (error) {
    console.error('Error sharing profile:', error);
    throw new Error('Failed to share profile');
  }
};

/**
 * Share a marketplace listing
 */
export const shareMarketplaceListing = async (
  title: string,
  price: number,
  listingId: string
): Promise<void> => {
  try {
    const listingUrl = `https://scene.app/marketplace/${listingId}`;
    const message = `Check out "${title}" for ₹${price} on Scene Marketplace!`;

    const shareContent = {
      message: Platform.OS === 'ios' ? message : `${message}\n${listingUrl}`,
      url: Platform.OS === 'ios' ? listingUrl : undefined,
      title: 'Share Listing'
    };

    await Share.share(shareContent);
  } catch (error) {
    console.error('Error sharing listing:', error);
    throw new Error('Failed to share listing');
  }
};

/**
 * Share a forum post
 */
export const shareForumPost = async (
  title: string,
  postId: string,
  author: string
): Promise<void> => {
  try {
    const postUrl = `https://scene.app/forums/${postId}`;
    const message = `"${title}" by @${author} on Scene Forums`;

    const shareContent = {
      message: Platform.OS === 'ios' ? message : `${message}\n${postUrl}`,
      url: Platform.OS === 'ios' ? postUrl : undefined,
      title: 'Share Post'
    };

    await Share.share(shareContent);
  } catch (error) {
    console.error('Error sharing post:', error);
    throw new Error('Failed to share post');
  }
};

/**
 * Share an event
 */
export const shareEvent = async (
  title: string,
  date: string,
  eventId: string
): Promise<void> => {
  try {
    const eventUrl = `https://scene.app/events/${eventId}`;
    const message = `Join me at "${title}" on ${date}! RSVP on Scene`;

    const shareContent = {
      message: Platform.OS === 'ios' ? message : `${message}\n${eventUrl}`,
      url: Platform.OS === 'ios' ? eventUrl : undefined,
      title: 'Share Event'
    };

    await Share.share(shareContent);
  } catch (error) {
    console.error('Error sharing event:', error);
    throw new Error('Failed to share event');
  }
};

/**
 * Check if sharing is available
 */
export const isSharingAvailable = async (): Promise<boolean> => {
  return await Sharing.isAvailableAsync();
};

/**
 * Generate a deep link for profile
 */
export const generateProfileDeepLink = (username: string): string => {
  return `scene://profile/${username}`;
};

/**
 * Copy text to clipboard (for share links)
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  // Will implement when we add clipboard functionality
  console.log('Copy to clipboard:', text);
};
