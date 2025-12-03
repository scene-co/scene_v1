import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

export default function Index() {
  const { isAuthenticated, hasProfile, isLoading } = useAuth();

  useEffect(() => {
    console.log('[Index] Auth state:', {
      isLoading,
      isAuthenticated,
      hasProfile,
    });

    if (!isLoading) {
      if (isAuthenticated) {
        // User is logged in
        if (hasProfile) {
          // User has completed profile setup
          console.log('[Index] Routing to /home');
          router.replace('/home' as any);
        } else {
          // User needs to complete profile setup
          console.log('[Index] Routing to /profile-setup');
          router.replace('/profile-setup' as any);
        }
      } else {
        // User is not logged in, show welcome screen
        console.log('[Index] Routing to /welcome');
        router.replace('/welcome' as any);
      }
    }
  }, [isAuthenticated, hasProfile, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#000" />
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
