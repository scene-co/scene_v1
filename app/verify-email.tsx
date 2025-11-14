import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

export default function VerifyEmailScreen() {
  const { user, logout, resendVerificationEmail, checkEmailVerification } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [pollInterval, setPollInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto-poll for verification status every 5 seconds
    const interval = setInterval(async () => {
      const verified = await checkEmailVerification();
      if (verified) {
        clearInterval(interval);
        // Show success message and redirect to login
        Alert.alert(
          'Email Verified! 🎉',
          'Your email has been verified successfully. Please sign in to continue.',
          [
            {
              text: 'Sign In',
              onPress: async () => {
                await logout();
                router.replace('/login' as any);
              },
            },
          ]
        );
      }
    }, 5000);

    setPollInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      await resendVerificationEmail();
      Alert.alert(
        'Email Sent',
        'A new verification email has been sent. Please check your inbox.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend email');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    try {
      setIsChecking(true);
      const verified = await checkEmailVerification();

      if (verified) {
        if (pollInterval) clearInterval(pollInterval);
        Alert.alert(
          'Email Verified! 🎉',
          'Your email has been verified successfully. Please sign in to continue.',
          [
            {
              text: 'Sign In',
              onPress: async () => {
                await logout();
                router.replace('/login' as any);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Not Verified Yet',
          'Please check your email and click the verification link.'
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to check verification');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📧</Text>
        </View>

        <Text style={styles.title}>Verify Your Email</Text>

        <Text style={styles.message}>
          We've sent a verification email to:
        </Text>

        <Text style={styles.email}>{user?.email}</Text>

        <Text style={styles.instructions}>
          Please check your inbox and click the verification link. After verification, you'll need to sign in again to continue.
        </Text>

        <View style={styles.noteContainer}>
          <Text style={styles.note}>
            💡 Tip: Check your spam folder if you don't see the email
          </Text>
          <Text style={[styles.note, { marginTop: 8 }]}>
            🔐 After verification, you'll be asked to sign in again for security
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="I've Verified, Continue"
          onPress={handleCheckVerification}
          loading={isChecking}
          variant="primary"
          style={styles.button}
        />

        <Button
          title="Resend Verification Email"
          onPress={handleResendEmail}
          loading={isResending}
          variant="outline"
          disabled={isResending}
        />

        <Text style={styles.autoCheckText}>
          ⏱️ Auto-checking verification status...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  noteContainer: {
    backgroundColor: '#E6F4FE',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    width: '100%',
  },
  note: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 12,
  },
  autoCheckText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
  },
});
