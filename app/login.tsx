import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';
import { loginSchema, LoginFormData } from '../schemas/auth';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email.trim(), data.password);
      // Navigation is handled by AuthContext/index.tsx based on profile status
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <View style={styles.form}>
            <FormInput
              name="email"
              control={control}
              label="Email or Username"
              placeholder="Enter your email"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              name="password"
              control={control}
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              secureTextEntry
            />

            <Button
              title="Sign In"
              onPress={handleSubmit(handleLogin)}
              loading={isLoading}
              style={styles.submitButton}
            />

            <Button
              title="Back to Welcome"
              onPress={() => router.back()}
              variant="outline"
              disabled={isLoading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginBottom: 12,
  },
});
