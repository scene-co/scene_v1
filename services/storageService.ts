/**
 * Storage Service
 * Handles file uploads to Supabase Storage
 */

import { supabase } from '../lib/supabase';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export type StorageBucket =
  | 'avatars'
  | 'banners'
  | 'post-images'
  | 'marketplace-images'
  | 'message-attachments';

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  bucket: StorageBucket,
  filePath: string,
  fileName?: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Read file as base64
    const base64 = await readAsStringAsync(filePath, {
      encoding: 'base64',
    });

    // Generate unique filename if not provided
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const fileExtension = filePath.split('.').pop();
    const finalFileName = fileName || `${timestamp}-${randomString}.${fileExtension}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(finalFileName, decode(base64), {
        contentType: getContentType(fileExtension),
        upsert: false,
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { success: false, error: error.message };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(finalFileName);

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error('Error in uploadFile:', error);
    return { success: false, error: error.message || 'Failed to upload file' };
  }
};

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (
  bucket: StorageBucket,
  filePaths: string[]
): Promise<{ success: boolean; urls?: string[]; error?: string }> => {
  try {
    const uploadPromises = filePaths.map(path => uploadFile(bucket, path));
    const results = await Promise.all(uploadPromises);

    const failed = results.find(r => !r.success);
    if (failed) {
      return { success: false, error: failed.error };
    }

    const urls = results.map(r => r.url!);
    return { success: true, urls };
  } catch (error: any) {
    console.error('Error in uploadMultipleFiles:', error);
    return { success: false, error: error.message || 'Failed to upload files' };
  }
};

/**
 * Delete a file from storage
 */
export const deleteFile = async (
  bucket: StorageBucket,
  fileUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract file path from URL
    const fileName = fileUrl.split('/').pop();
    if (!fileName) {
      return { success: false, error: 'Invalid file URL' };
    }

    const { error } = await supabase.storage.from(bucket).remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in deleteFile:', error);
    return { success: false, error: error.message || 'Failed to delete file' };
  }
};

/**
 * Get content type based on file extension
 */
const getContentType = (extension?: string): string => {
  if (!extension) return 'application/octet-stream';

  const contentTypes: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
  };

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Compress and upload image (placeholder for future implementation)
 */
export const uploadCompressedImage = async (
  bucket: StorageBucket,
  filePath: string,
  quality: number = 0.7
): Promise<{ success: boolean; url?: string; error?: string }> => {
  // TODO: Implement image compression using expo-image-manipulator
  // For now, just upload the original
  return uploadFile(bucket, filePath);
};
