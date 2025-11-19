/**
 * ProfileInfo Component
 * Displays name, username, and action buttons
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import VerifiedBadge from '../VerifiedBadge';

interface ProfileInfoProps {
  firstName: string;
  username: string;
  verified?: boolean;
  governmentVerified?: boolean;
  followerCount?: number;
  followingCount?: number;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onEditProfile?: () => void;
  onShare?: () => void;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  firstName,
  username,
  verified = false,
  governmentVerified = false,
  followerCount = 0,
  followingCount = 0,
  isOwnProfile = true,
  isFollowing = false,
  onEditProfile,
  onShare,
  onFollow,
  onUnfollow,
  onFollowersPress,
  onFollowingPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.nameContainer}>
        <Text style={styles.displayName}>{firstName}</Text>
        {verified && (
          <VerifiedBadge verified={verified} governmentVerified={governmentVerified} size="medium" />
        )}
      </View>

      <Text style={styles.username}>@{username}</Text>

      {/* Follower/Following Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={onFollowersPress} style={styles.statItem}>
          <Text style={styles.statCount}>{followerCount}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>

        <View style={styles.statDivider} />

        <TouchableOpacity onPress={onFollowingPress} style={styles.statItem}>
          <Text style={styles.statCount}>{followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {isOwnProfile ? (
          <>
            <TouchableOpacity style={styles.editButton} onPress={onEditProfile}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={onShare}>
              <Ionicons name="share-outline" size={18} color="#333" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.unfollowButton]}
              onPress={isFollowing ? onUnfollow : onFollow}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.unfollowButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton} onPress={onShare}>
              <Ionicons name="share-outline" size={18} color="#333" />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  displayName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#5865F2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  followButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#5865F2',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  unfollowButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  unfollowButtonText: {
    color: '#333',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
});

export default ProfileInfo;
