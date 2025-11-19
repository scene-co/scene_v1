/**
 * ProfileHeader Component
 * Displays banner, profile picture, and settings button (Discord-inspired)
 */

import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import VerifiedBadge from '../VerifiedBadge';

const { width } = Dimensions.get('window');

interface ProfileHeaderProps {
  profilePictureUrl?: string | null;
  bannerImageUrl?: string | null;
  verified?: boolean;
  governmentVerified?: boolean;
  onSettingsPress?: () => void;
  isOwnProfile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profilePictureUrl,
  bannerImageUrl,
  verified = false,
  governmentVerified = false,
  onSettingsPress,
  isOwnProfile = true,
}) => {
  const renderBanner = () => {
    if (bannerImageUrl) {
      return (
        <ImageBackground source={{ uri: bannerImageUrl }} style={styles.banner} resizeMode="cover">
          {isOwnProfile && (
            <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
              <Ionicons name="settings-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          )}
        </ImageBackground>
      );
    }

    return (
      <LinearGradient
        colors={['#5865F2', '#7983F5', '#9C9EF8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        {isOwnProfile && (
          <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <Ionicons name="settings-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        )}
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      {renderBanner()}
      <View style={styles.profilePictureContainer}>
        <View style={styles.profilePictureWrapper}>
          {profilePictureUrl ? (
            <Image source={{ uri: profilePictureUrl }} style={styles.profilePicture} />
          ) : (
            <View style={styles.profilePicturePlaceholder}>
              <Ionicons name="person" size={50} color="#999" />
            </View>
          )}
          {verified && (
            <View style={styles.verifiedBadgeContainer}>
              <VerifiedBadge verified={verified} governmentVerified={governmentVerified} size="medium" />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  banner: {
    width: '100%',
    height: 140,
    backgroundColor: '#36393F',
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePictureContainer: {
    position: 'absolute',
    top: 90,
    left: 16,
  },
  profilePictureWrapper: {
    position: 'relative',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
    backgroundColor: '#F5F5F5',
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadgeContainer: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 2,
  },
});

export default ProfileHeader;
