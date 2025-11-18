import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSetupSchema, ProfileSetupFormData } from '../schemas/profile';
import { FormInput } from '../components/FormInput';
import { FormDropdown } from '../components/FormDropdown';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { INDIAN_STATES, GENDER_OPTIONS } from '../constants/indianStates';

export default function ProfileSetupScreen() {
  const { createProfile, checkUsernameAvailability } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      username: '',
      age: undefined,
      gender: undefined,
      college_name: '',
      state: undefined,
      city: '',
    },
  });

  const checkUsername = async (username: string) => {
    if (username.length < 3) return;

    setIsCheckingUsername(true);
    try {
      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        setError('username', {
          type: 'manual',
          message: 'Username is already taken',
        });
      } else {
        clearErrors('username');
      }
    } catch (error) {
      console.error('Error checking username:', error);
    } finally {
      setIsCheckingUsername(false);
    }
  };

  const onSubmit = async (data: ProfileSetupFormData) => {
    try {
      setIsLoading(true);

      // Final username availability check
      const isAvailable = await checkUsernameAvailability(data.username);
      if (!isAvailable) {
        setError('username', {
          type: 'manual',
          message: 'Username is already taken',
        });
        return;
      }

      await createProfile({
        username: data.username,
        age: data.age,
        gender: data.gender,
        college_name: data.college_name || null,
        state: data.state,
        city: data.city,
      });

      // Navigate to home after successful profile creation
      router.replace('/home' as any);
    } catch (error: any) {
      Alert.alert(
        'Profile Setup Failed',
        error.message || 'Please try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Tell us a bit about yourself
          </Text>
        </View>

        <View style={styles.form}>
          <FormInput
            name="username"
            control={control}
            label="Username"
            placeholder="Choose a unique username"
            error={errors.username}
            onBlur={(e: any) => {
              if (e.nativeEvent?.text) {
                checkUsername(e.nativeEvent.text);
              }
            }}
          />
          {isCheckingUsername && (
            <Text style={styles.helperText}>Checking availability...</Text>
          )}

          <FormInput
            name="age"
            control={control}
            label="Age"
            placeholder="Enter your age"
            error={errors.age}
            keyboardType="number-pad"
          />

          <FormDropdown
            name="gender"
            control={control}
            label="Gender"
            error={errors.gender}
            options={GENDER_OPTIONS}
            placeholder="Select gender"
          />

          <FormInput
            name="college_name"
            control={control}
            label="College Name (Optional)"
            placeholder="Enter your college name"
            error={errors.college_name}
            autoCapitalize="words"
          />

          <FormDropdown
            name="state"
            control={control}
            label="State"
            error={errors.state}
            options={INDIAN_STATES}
            placeholder="Select state"
          />

          <FormInput
            name="city"
            control={control}
            label="City"
            placeholder="Enter your city"
            error={errors.city}
            autoCapitalize="words"
          />

          <Button
            title="Complete Setup"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    flex: 1,
  },
  submitButton: {
    marginTop: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: -12,
    marginBottom: 16,
  },
});
