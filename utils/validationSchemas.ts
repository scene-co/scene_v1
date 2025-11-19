/**
 * Validation schemas for Scene app using Zod
 */

import { z } from 'zod';

/**
 * Profile update validation schema
 */
export const profileUpdateSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .optional(),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .optional(),
  bio: z
    .string()
    .max(190, 'Bio must be less than 190 characters')
    .optional()
    .nullable(),
  age: z
    .number()
    .min(13, 'You must be at least 13 years old')
    .max(100, 'Invalid age')
    .optional(),
  college_name: z.string().max(100).optional().nullable(),
  city: z.string().min(1, 'City is required').max(100).optional(),
  state: z.string().min(1, 'State is required').optional(),
});

/**
 * Username change validation schema
 */
export const usernameChangeSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
});

/**
 * Bio validation schema
 */
export const bioSchema = z.object({
  bio: z
    .string()
    .max(190, 'Bio must be less than 190 characters')
    .optional()
    .nullable(),
});

/**
 * Seller verification submission schema
 */
export const sellerVerificationSchema = z.object({
  document_type: z.enum(['aadhar', 'pan', 'driving_license', 'passport'], {
    errorMap: () => ({ message: 'Please select a valid document type' }),
  }),
  document_number: z
    .string()
    .min(5, 'Document number is required')
    .max(50, 'Document number is too long'),
});

/**
 * Account settings validation schema
 */
export const accountSettingsSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  currentPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword && data.newPassword !== data.confirmPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);

/**
 * Validate username format (client-side quick check)
 */
export const isValidUsername = (username: string): boolean => {
  if (username.length < 3 || username.length > 20) {
    return false;
  }

  return /^[a-zA-Z0-9_]+$/.test(username);
};

/**
 * Validate bio length
 */
export const isValidBio = (bio: string): boolean => {
  return bio.length <= 190;
};

/**
 * Sanitize bio (remove potentially harmful content)
 */
export const sanitizeBio = (bio: string): string => {
  // Remove script tags and potentially harmful HTML
  let sanitized = bio.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit to 190 characters
  if (sanitized.length > 190) {
    sanitized = sanitized.substring(0, 190);
  }

  return sanitized;
};

/**
 * Validate profile picture URL
 */
export const isValidImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return validExtensions.some(ext => urlObj.pathname.toLowerCase().endsWith(ext));
  } catch {
    return false;
  }
};

/**
 * Export all validation functions
 */
export const validators = {
  isValidUsername,
  isValidBio,
  sanitizeBio,
  isValidImageUrl,
};
