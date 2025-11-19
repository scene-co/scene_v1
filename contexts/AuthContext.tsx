import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, ProfileUpdateData } from '../types';
import { canChangeUsername } from '../utils/dateUtils';
import { followUser as followUserService, unfollowUser as unfollowUserService, isFollowing as checkIsFollowing } from '../services/followService';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isLoadingProfile: boolean;
  isAuthenticated: boolean;
  hasProfile: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createProfile: (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  updateProfile: (profileData: ProfileUpdateData) => Promise<void>;
  validateUsernameChange: (newUsername: string) => Promise<{ canChange: boolean; reason?: string }>;
  followUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  unfollowUser: (userId: string) => Promise<{ success: boolean; error?: string }>;
  isFollowing: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_COMPLETED_KEY = '@profile_completed';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    // Initialize auth state
    initializeAuth();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProfile = async (userId: string) => {
    setIsLoadingProfile(true);
    try {
      console.log('[AuthContext] Loading profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist yet
          console.log('[AuthContext] Profile not found for user (PGRST116)');
          setProfile(null);
          await AsyncStorage.removeItem(PROFILE_COMPLETED_KEY);
          return;
        }
        console.error('[AuthContext] Database error loading profile:', error);
        throw error;
      }

      console.log('[AuthContext] Profile loaded successfully:', data);
      setProfile(data);
      await AsyncStorage.setItem(PROFILE_COMPLETED_KEY, 'true');
    } catch (error: any) {
      console.error('[AuthContext] Error loading profile:', error);
      console.error('[AuthContext] Error code:', error?.code);
      console.error('[AuthContext] Error message:', error?.message);
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadProfile(data.user.id);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Failed to login');
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // User created successfully, but profile not yet created
        setUser(data.user);
        setProfile(null);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Failed to sign up');
    }
  };

  const createProfile = async (
    profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
  ) => {
    try {
      if (!user) throw new Error('No authenticated user');

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.id,
            ...profileData,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      await AsyncStorage.setItem(PROFILE_COMPLETED_KEY, 'true');
    } catch (error: any) {
      console.error('Create profile error:', error);
      throw new Error(error.message || 'Failed to create profile');
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('is_username_available', {
        username_to_check: username,
      });

      if (error) {
        console.error('Error checking username:', error);
        return false;
      }

      return data as boolean;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      setSession(null);
      await AsyncStorage.removeItem(PROFILE_COMPLETED_KEY);

      router.replace('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Failed to logout');
    }
  };

  const updateProfile = async (profileData: ProfileUpdateData) => {
    try {
      if (!user) throw new Error('No authenticated user');

      // If username is being changed, validate cooldown
      if (profileData.username && profileData.username !== profile?.username) {
        const validation = await validateUsernameChange(profileData.username);
        if (!validation.canChange) {
          throw new Error(validation.reason || 'Cannot change username at this time');
        }

        // Update username change tracking
        const currentDate = new Date().toISOString();
        const isSameDay = profile?.username_last_changed &&
          new Date(profile.username_last_changed).toDateString() === new Date().toDateString();

        profileData.username_last_changed = currentDate;
        (profileData as any).username_change_count = isSameDay
          ? (profile?.username_change_count || 0) + 1
          : 1;
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (error: any) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const validateUsernameChange = async (
    newUsername: string
  ): Promise<{ canChange: boolean; reason?: string }> => {
    if (!profile) {
      return { canChange: false, reason: 'No profile found' };
    }

    // Check if username is actually changing
    if (newUsername === profile.username) {
      return { canChange: true };
    }

    // Check cooldown
    const cooldownCheck = canChangeUsername(
      profile.username_last_changed,
      profile.username_change_count
    );

    if (!cooldownCheck.canChange) {
      return cooldownCheck;
    }

    // Check if username is available
    const isAvailable = await checkUsernameAvailability(newUsername);
    if (!isAvailable) {
      return { canChange: false, reason: 'Username is already taken' };
    }

    return { canChange: true };
  };

  const followUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const result = await followUserService(user.id, userId);

    // Refresh profile to update following count
    if (result.success) {
      await refreshProfile();
    }

    return result;
  };

  const unfollowUser = async (userId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const result = await unfollowUserService(user.id, userId);

    // Refresh profile to update following count
    if (result.success) {
      await refreshProfile();
    }

    return result;
  };

  const isFollowing = async (userId: string): Promise<boolean> => {
    if (!user) return false;
    return await checkIsFollowing(user.id, userId);
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    isLoading,
    isLoadingProfile,
    isAuthenticated: !!user,
    hasProfile: !!profile,
    login,
    signup,
    logout,
    createProfile,
    refreshProfile,
    checkUsernameAvailability,
    updateProfile,
    validateUsernameChange,
    followUser,
    unfollowUser,
    isFollowing,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
