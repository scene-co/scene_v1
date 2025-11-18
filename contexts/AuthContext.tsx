import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';

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
