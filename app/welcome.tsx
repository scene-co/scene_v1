import { ShantellSans_500Medium_Italic, useFonts } from '@expo-google-fonts/shantell-sans';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Button } from '../components/Button';

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

export default function WelcomeScreen() {
  const [fontsLoaded] = useFonts({
    ShantellSans_500Medium_Italic,
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

      {/* Top Characters Row */}
      <View style={styles.topCharacters}>
        <Image
          source={require('../assets/images/character-1.png')}
          style={styles.character1}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-2.png')}
          style={styles.character2}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-3.png')}
          style={styles.character3}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-4.png')}
          style={styles.character4}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-5.png')}
          style={styles.character5}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-6.png')}
          style={styles.character6}
          resizeMode="contain"
        />
      </View>

      {/* Center Content */}
      <View style={styles.content}>
        <Image
          source={require('../assets/images/scene_blacklogo_png.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.tagline}>What's the Scene?</Text>

        <Text style={styles.subtitle}>
          Your student social ecosystem
        </Text>
      </View>

      {/* Bottom Characters Row */}
      <View style={styles.bottomCharacters}>
        <Image
          source={require('../assets/images/character-7.png')}
          style={styles.character7}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-8.png')}
          style={styles.character8}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-9.png')}
          style={styles.character9}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-10.png')}
          style={styles.character10}
          resizeMode="contain"
        />
        <Image
          source={require('../assets/images/character-11.png')}
          style={styles.character11}
          resizeMode="contain"
        />
      </View>

      {/* Buttons */}
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
    backgroundColor: '#FFF7E6',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  topCharacters: {
    position: 'relative',
    width: '100%',
    height: 150,
    marginTop: 20,
  },
  bottomCharacters: {
    position: 'relative',
    width: '100%',
    height: 140,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  tagline: {
    fontFamily: 'ShantellSans_500Medium_Italic',
    fontSize: 32,
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
  // Individual character styles - easily adjustable
  character1: {
    position: 'absolute',
    left: -5,
    top: 50,
    width: 100,
    height: 150,
  },
  character2: {
    position: 'absolute',
    left: 70,
    top: 5,
    width: 100,
    height: 150,
  },
  character3: {
    position: 'absolute',
    left: 80,
    top: 90,
    width: 175,
    height: 95,
  },
  character4: {
    position: 'absolute',
    right: 40,
    top: 5,
    width: 140,
    height: 125,
  },
  character5: {
    position: 'absolute',
    right: 15,
    top: 55,
    width: 120,
    height: 140,
  },
  character6: {
    position: 'absolute',
    right: -30,
    top: 9,
    width: 105,
    height: 120,
  },
  character7: {
    position: 'absolute',
    left: 0,
    bottom: 10,
    width: 70,
    height: 140,
  },
  character8: {
    position: 'absolute',
    left: 60,
    bottom: 5,
    width: 70,
    height: 150,
  },
  character9: {
    position: 'absolute',
    left: 140,
    bottom: 40,
    width: 70,
    height: 140,
  },
  character10: {
    position: 'absolute',
    right: 26,
    bottom: -30,
    width: 140,
    height: 170,
    zIndex: 2,    // bring to front
  },
  character11: {
    position: 'absolute',
    right: -20,
    bottom: 20,
    width: 150,
    height: 120,
    zIndex: 1,    // keep behind
  },
  
});
