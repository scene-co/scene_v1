import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
  onMenuPress?: () => void;
}

export function TopBar({ onMenuPress }: TopBarProps) {
  const insets = useSafeAreaInsets();

  const handleMessagesPress = () => {
    router.push('/messages');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/scene-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleMessagesPress}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={26} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 40,
  },
});
