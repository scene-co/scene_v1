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
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  hasProfile: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createProfile: (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<void>;
  checkEmailVerification: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROFILE_COMPLETED_KEY = '@profile_completed';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist yet
          console.log('Profile not found for user');
          setProfile(null);
          await AsyncStorage.removeItem(PROFILE_COMPLETED_KEY);
          return;
        }
        throw error;
      }

      setProfile(data);
      await AsyncStorage.setItem(PROFILE_COMPLETED_KEY, 'true');
    } catch (error) {
      console.error('Error loading profile:', error);
      setProfile(null);
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
        options: {
          emailRedirectTo: 'scene://',
        },
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

  const resendVerificationEmail = async () => {
    try {
      if (!user?.email) throw new Error('No user email found');

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Resend verification error:', error);
      throw new Error(error.message || 'Failed to resend verification email');
    }
  };

  const checkEmailVerification = async (): Promise<boolean> => {
    try {
      // First try to refresh the session to get latest user data
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (!refreshError && refreshedSession?.user) {
        // Session refresh successful
        setUser(refreshedSession.user);
        setSession(refreshedSession);
        return !!refreshedSession.user.email_confirmed_at;
      }

      // If refresh fails, fall back to getting current session
      // This handles the case where session is pending verification
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (currentSession?.user) {
        // Check if user data has been updated
        const { data: { user: latestUser }, error: userError } = await supabase.auth.getUser();

        if (!userError && latestUser) {
          setUser(latestUser);
          setSession(currentSession);
          return !!latestUser.email_confirmed_at;
        }
      }

      return false;
    } catch (error) {
      console.error('Check email verification error:', error);
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
    isAuthenticated: !!user,
    isEmailVerified: !!user?.email_confirmed_at,
    hasProfile: !!profile,
    login,
    signup,
    logout,
    createProfile,
    refreshProfile,
    checkUsernameAvailability,
    resendVerificationEmail,
    checkEmailVerification,
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
