/**
 * Date utility functions for Scene app
 */

/**
 * Format a date as "Month Day, Year" (e.g., "January 15, 2024")
 */
export const formatMemberSince = (dateString: string | undefined): string => {
  if (!dateString) return 'Unknown';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Unknown';
  }
};

/**
 * Check if user can change their username based on cooldown
 * Rules: Max 2 changes per day, with 1 day cooldown between changes
 */
export const canChangeUsername = (
  lastChanged: string | null | undefined,
  changeCount: number | undefined
): { canChange: boolean; reason?: string } => {
  // If never changed, allow change
  if (!lastChanged) {
    return { canChange: true };
  }

  const now = new Date();
  const lastChangedDate = new Date(lastChanged);
  const hoursSinceLastChange = (now.getTime() - lastChangedDate.getTime()) / (1000 * 60 * 60);

  // Check if 24 hours have passed since last change
  if (hoursSinceLastChange < 24) {
    return {
      canChange: false,
      reason: `You can change your username again in ${Math.ceil(24 - hoursSinceLastChange)} hours`
    };
  }

  // Reset count if it's been more than 24 hours
  const count = changeCount || 0;

  // Check if within same day and already changed 2 times
  const isSameDay =
    lastChangedDate.getDate() === now.getDate() &&
    lastChangedDate.getMonth() === now.getMonth() &&
    lastChangedDate.getFullYear() === now.getFullYear();

  if (isSameDay && count >= 2) {
    return {
      canChange: false,
      reason: 'You have reached the maximum of 2 username changes per day'
    };
  }

  return { canChange: true };
};

/**
 * Get the next date when username can be changed
 */
export const getNextUsernameChangeDate = (lastChanged: string | null | undefined): Date | null => {
  if (!lastChanged) return null;

  const lastChangedDate = new Date(lastChanged);
  const nextChangeDate = new Date(lastChangedDate.getTime() + (24 * 60 * 60 * 1000));

  return nextChangeDate;
};

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds < 60) {
    return 'just now';
  }

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Format date for display in posts/comments
 */
export const formatPostDate = (dateString: string): string => {
  if (isToday(dateString)) {
    return formatRelativeTime(dateString);
  }

  const date = new Date(dateString);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff < 7) {
    return formatRelativeTime(dateString);
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
