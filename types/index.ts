import { User as SupabaseUser } from '@supabase/supabase-js';
import { Gender, IndianState } from '../constants/indianStates';

export interface UserProfile {
  id: string;
  first_name: string;
  username: string;
  age: number;
  gender: Gender;
  college_name?: string | null;
  state: IndianState | string;
  city: string;
  profile_picture_url?: string | null;
  banner_image_url?: string | null;
  bio?: string | null;
  verified_seller?: boolean;
  government_verified?: boolean;
  seller_rating?: number;
  total_sales?: number;
  follower_count?: number;
  following_count?: number;
  username_last_changed?: string | null;
  username_change_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AppUser extends SupabaseUser {
  profile?: UserProfile | null;
}

export interface AuthState {
  user: AppUser | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileSetupData {
  first_name: string;
  username: string;
  age: number;
  gender: Gender;
  college_name?: string;
  state: IndianState | string;
  city: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface SellerVerification {
  id: string;
  user_id: string;
  document_type: 'aadhar' | 'pan' | 'driving_license' | 'passport';
  document_number: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  verified_at?: string | null;
  rejected_reason?: string | null;
  submitted_at: string;
  reviewed_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdateData {
  first_name?: string;
  username?: string;
  bio?: string;
  profile_picture_url?: string;
  banner_image_url?: string;
  age?: number;
  gender?: Gender;
  college_name?: string;
  state?: IndianState | string;
  city?: string;
}

export type ProfileTab = 'posts' | 'marketplace' | 'events';

export interface TabConfig {
  id: ProfileTab;
  label: string;
  icon: string;
}
