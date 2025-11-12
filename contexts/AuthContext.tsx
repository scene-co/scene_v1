import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call - replace with actual API endpoint
      // For demo purposes, we'll accept any email/password combination
      // In production, you would make an actual API call here
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Generate a mock token and user data
      const mockToken = `token_${Date.now()}`;
      const userData: User = {
        id: `user_${Date.now()}`,
        email: email,
        name: email.split('@')[0], // Use email prefix as name
      };

      // Store token and user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
      setUser(userData);
      
      // Navigate to home screen
      router.replace('/home' as any);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Generate a mock token and user data
      const mockToken = `token_${Date.now()}`;
      const userData: User = {
        id: `user_${Date.now()}`,
        email: email,
        name: name || email.split('@')[0],
      };

      // Store token and user data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      
      setUser(userData);
      
      // Navigate to home screen
      router.replace('/home' as any);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      setUser(null);
      
      // Navigate to login screen
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
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

