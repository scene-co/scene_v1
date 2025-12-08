import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Animated } from 'react-native';
import { router, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface TabButtonProps {
  tab: {
    name: string;
    path: string;
    icon: any;
    ionicon: any;
    useIonicon?: boolean;
  };
  isActive: boolean;
  isEventsPage: boolean;
  isHomePage: boolean;
  isForumsPage: boolean;
  isMarketplacePage: boolean;
  isProfilePage: boolean;
  isDarkPage: boolean;
  onPress: () => void;
}

function TabButton({
  tab,
  isActive,
  isEventsPage,
  isHomePage,
  isForumsPage,
  isMarketplacePage,
  isProfilePage,
  isDarkPage,
  onPress,
}: TabButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.spring(iconScaleAnim, {
        toValue: 1.1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.85,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: iconScaleAnim }],
          }}
        >
          {tab.useIonicon ? (
            <View
              style={[
                isDarkPage && styles.iconWrapperBase,
                isActive && isEventsPage && styles.iconWrapperActive,
                isActive &&
                  (isHomePage || isForumsPage) &&
                  styles.iconWrapperActiveHome,
                !isDarkPage && styles.iconMargin,
              ]}
            >
              <Ionicons
                name={tab.ionicon}
                size={24}
                color={
                  isEventsPage
                    ? isActive
                      ? '#FFC107'
                      : '#D4D4D8'
                    : isHomePage || isForumsPage || isMarketplacePage || isProfilePage
                    ? isActive
                      ? '#00311F'
                      : '#666'
                    : isActive
                    ? '#000'
                    : '#999'
                }
              />
            </View>
          ) : (
            <View
              style={[
                isDarkPage && styles.iconWrapperBase,
                isActive && isEventsPage && styles.iconWrapperActive,
                isActive &&
                  (isHomePage || isForumsPage || isMarketplacePage || isProfilePage) &&
                  styles.iconWrapperActiveHome,
              ]}
            >
              <Image
                source={tab.icon}
                style={[
                  styles.icon,
                  !isDarkPage && styles.iconMargin,
                  isActive &&
                    (isEventsPage
                      ? styles.iconActiveEvents
                      : isHomePage || isForumsPage || isMarketplacePage || isProfilePage
                      ? styles.iconActiveHome
                      : styles.iconActive),
                  !isActive && isDarkPage && styles.iconInactiveDark,
                ]}
                resizeMode="contain"
              />
            </View>
          )}
        </Animated.View>
        <Text
          style={[
            styles.label,
            isActive &&
              (isEventsPage
                ? styles.labelActiveEvents
                : isHomePage || isForumsPage || isMarketplacePage || isProfilePage
                ? styles.labelActiveHome
                : styles.labelActive),
            !isActive && isDarkPage && styles.labelInactiveDark,
          ]}
        >
          {tab.name}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

export function BottomTabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const isEventsPage = pathname === '/events';
  const isHomePage = pathname === '/home';
  const isForumsPage = pathname === '/forums';
  const isMarketplacePage = pathname === '/marketplace';
  const isProfilePage = pathname === '/profile';

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

  const isDarkPage = isEventsPage || isHomePage || isForumsPage || isMarketplacePage || isProfilePage;

  return (
    <View
      style={[
        styles.container,
        isEventsPage && styles.containerTranslucent,
        isHomePage && styles.containerHome,
        isForumsPage && styles.containerForums,
        isMarketplacePage && styles.containerMarketplace,
        isProfilePage && styles.containerProfile,
        { paddingBottom: insets.bottom },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <TabButton
            key={tab.path}
            tab={tab}
            isActive={isActive}
            isEventsPage={isEventsPage}
            isHomePage={isHomePage}
            isForumsPage={isForumsPage}
            isMarketplacePage={isMarketplacePage}
            isProfilePage={isProfilePage}
            isDarkPage={isDarkPage}
            onPress={() => handleTabPress(tab.path)}
          />
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
  containerTranslucent: {
    backgroundColor: 'rgba(29, 15, 47, 0.85)',
    borderTopColor: 'rgba(147, 51, 234, 0.2)',
  },
  containerHome: {
    backgroundColor: '#FFF7E6',
    borderTopColor: 'rgba(0, 49, 31, 0.2)',
  },
  containerForums: {
    backgroundColor: '#FFF7E6',
    borderTopColor: 'rgba(0, 49, 31, 0.2)',
  },
  containerMarketplace: {
    backgroundColor: '#FFF7E6',
    borderTopColor: 'rgba(0, 49, 31, 0.2)',
  },
  containerProfile: {
    backgroundColor: '#FFF7E6',
    borderTopColor: 'rgba(0, 49, 31, 0.2)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconWrapperBase: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconWrapperActive: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderWidth: 1.5,
    borderColor: '#FFC107',
  },
  iconWrapperActiveHome: {
    backgroundColor: 'rgba(0, 49, 31, 0.15)',
    borderWidth: 1.5,
    borderColor: '#00311F',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#999',
  },
  iconActive: {
    tintColor: '#000',
  },
  iconActiveEvents: {
    tintColor: '#FFC107',
  },
  iconActiveHome: {
    tintColor: '#00311F',
  },
  iconInactiveDark: {
    tintColor: '#666',
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
    color: '#000',
    fontWeight: '600',
  },
  labelActiveEvents: {
    color: '#FFC107',
    fontWeight: '600',
  },
  labelActiveHome: {
    color: '#00311F',
    fontWeight: '600',
  },
  labelInactiveDark: {
    color: '#666',
    fontWeight: '500',
  },
});
