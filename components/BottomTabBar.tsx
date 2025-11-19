import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export function BottomTabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const tabs = [
    {
      name: 'Home',
      path: '/home',
      icon: require('../assets/images/home_icon.png'),
      ionicon: 'home' as const,
    },
    {
      name: 'Forums',
      path: '/forums',
      icon: require('../assets/images/forums_icons.png'),
      ionicon: 'book' as const,
    },
    {
      name: 'Events',
      path: '/events',
      icon: require('../assets/images/events_icon.png'),
      ionicon: 'calendar' as const,
    },
    {
      name: 'Market',
      path: '/marketplace',
      icon: require('../assets/images/marketplace_icon.png'),
      ionicon: 'storefront' as const,
      useIonicon: true,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: require('../assets/images/profile_icon.png'),
      ionicon: 'person' as const,
    },
  ];

  const handleTabPress = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.tab}
            onPress={() => handleTabPress(tab.path)}
            activeOpacity={0.7}
          >
            {tab.useIonicon ? (
              <Ionicons
                name={tab.ionicon}
                size={24}
                color={isActive ? '#007AFF' : '#999'}
                style={styles.iconMargin}
              />
            ) : (
              <Image
                source={tab.icon}
                style={[
                  styles.icon,
                  isActive && styles.iconActive,
                ]}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: '#999',
  },
  iconActive: {
    tintColor: '#007AFF',
  },
  iconMargin: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  labelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
