import { Allura_400Regular, useFonts } from '@expo-google-fonts/allura';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen() {
  const [fontsLoaded] = useFonts({
    Allura_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <Image
          source={require('../assets/images/scene_blacklogo_png.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.tagline}>what's the scene?</Text>

        <Text style={styles.subtitle}>
          Your student social ecosystem
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/register' as any)}
          variant="primary"
        />

        <Button
          title="Sign In"
          onPress={() => router.push('/login' as any)}
          variant="outline"
          style={styles.signInButton}
        />
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
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  tagline: {
    fontFamily: 'Allura_400Regular',
    fontSize: 38,
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  signInButton: {
    marginTop: 12,
  },
});
