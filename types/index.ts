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
