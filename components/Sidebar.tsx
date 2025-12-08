import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SidebarMenuItem } from './SidebarMenuItem';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(280, SCREEN_WIDTH * 0.8);

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export function Sidebar({ visible, onClose }: SidebarProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in sidebar and fade in backdrop
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide out sidebar and fade out backdrop
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleNavigate = (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path as any);
    }, 250);
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Sidebar Panel */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              paddingTop: insets.top,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Social Features Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SOCIAL FEATURES</Text>

              <SidebarMenuItem
                icon="people"
                label="Hangout Buddy"
                onPress={() => handleNavigate('/hangouts')}
                badge="Soon"
              />

              <SidebarMenuItem
                icon="basketball"
                label="Sports Matchmaking"
                onPress={() => handleNavigate('/sports')}
                badge="Soon"
              />

              <SidebarMenuItem
                icon="albums"
                label="My Communities"
                onPress={() => handleNavigate('/my-communities')}
              />
            </View>

            {/* Utility Section */}
            <View style={styles.section}>
              <SidebarMenuItem
                icon="notifications"
                label="Notifications"
                onPress={() => handleNavigate('/notifications')}
              />

              <SidebarMenuItem
                icon="bookmark"
                label="Saved Items"
                onPress={() => handleNavigate('/saved')}
              />
            </View>

            {/* Future Features */}
            <View style={styles.section}>
              <SidebarMenuItem
                icon="fitness"
                label="AI Wellness"
                onPress={() => {}}
                badge="Coming Soon"
                disabled={true}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* App Info Section */}
            <View style={styles.section}>
              <SidebarMenuItem
                icon="help-circle"
                label="Help & Support"
                onPress={() => handleNavigate('/help')}
              />

              <SidebarMenuItem
                icon="information-circle"
                label="About"
                onPress={() => handleNavigate('/about')}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00311F',
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#666',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
    marginHorizontal: 20,
  },
});
