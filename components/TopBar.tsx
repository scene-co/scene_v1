import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
  onMenuPress?: () => void;
}

export function TopBar({ onMenuPress }: TopBarProps) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const isHomePage = pathname === '/home';
  const isEventsPage = pathname === '/events';
  const isForumsPage = pathname === '/forums';
  const isMarketplacePage = pathname === '/marketplace';
  const isProfilePage = pathname === '/profile';

  const handleMessagesPress = () => {
    router.push('/messages');
  };

  const handleAddUserPress = () => {
    router.push('/add-user');
  };

  const iconColor = (isHomePage || isForumsPage || isMarketplacePage || isProfilePage) ? '#00311F' : isEventsPage ? '#FBE4D8' : '#333';
  const containerStyle = isHomePage
    ? styles.containerHome
    : isEventsPage
    ? styles.containerEvents
    : isForumsPage
    ? styles.containerForums
    : isMarketplacePage
    ? styles.containerMarketplace
    : isProfilePage
    ? styles.containerProfile
    : styles.container;

  return (
    <View style={[containerStyle, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onMenuPress}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color={iconColor} />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/scene-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.rightButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleAddUserPress}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={26} color={iconColor} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleMessagesPress}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={26} color={iconColor} />
          </TouchableOpacity>
        </View>
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
  containerHome: {
    backgroundColor: '#FFF7E6',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 49, 31, 0.2)',
  },
  containerForums: {
    backgroundColor: '#FFF7E6',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 49, 31, 0.2)',
  },
  containerMarketplace: {
    backgroundColor: '#FFF7E6',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 49, 31, 0.2)',
  },
  containerProfile: {
    backgroundColor: '#FFF7E6',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 49, 31, 0.2)',
  },
  containerEvents: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(147, 51, 234, 0.2)',
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
    right: -25,
    width: 120,
    height: 40,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
