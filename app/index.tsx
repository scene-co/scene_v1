import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function Index() {
  const { isAuthenticated, isEmailVerified, hasProfile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // User is logged in
        if (!isEmailVerified) {
          // User needs to verify email first
          router.replace('/verify-email' as any);
        } else if (hasProfile) {
          // User has completed profile setup
          router.replace('/home' as any);
        } else {
          // User needs to complete profile setup
          router.replace('/profile-setup' as any);
        }
      } else {
        // User is not logged in, show welcome screen
        router.replace('/welcome' as any);
      }
    }
  }, [isAuthenticated, isEmailVerified, hasProfile, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
