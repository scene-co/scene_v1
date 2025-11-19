/**
 * Profile Screen
 * Discord-inspired profile with banner, avatar, tabs, and user content
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { useAuth } from '../contexts/AuthContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileInfo from '../components/profile/ProfileInfo';
import ProfileAbout from '../components/profile/ProfileAbout';
import ProfileTabs from '../components/profile/ProfileTabs';
import UserPostsList from '../components/profile/UserPostsList';
import UserMarketplaceList from '../components/profile/UserMarketplaceList';
import UserEventsList from '../components/profile/UserEventsList';
import { ProfileTab } from '../types';
import { shareProfile } from '../utils/shareUtils';

export default function ProfileScreen() {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual data from backend
  const mockPosts = [];
  const mockListings = [];
  const mockEvents = [];

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleEditProfile = () => {
    router.push('/profile-edit');
  };

  const handleShare = async () => {
    if (profile) {
      try {
        await shareProfile(profile.username, profile.id);
      } catch (error) {
        console.error('Error sharing profile:', error);
      }
    }
  };

  const handleFollowers = () => {
    router.push({
      pathname: '/followers',
      params: { userId: profile?.id },
    });
  };

  const handleFollowing = () => {
    router.push({
      pathname: '/following',
      params: { userId: profile?.id },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    // TODO: Refresh user content based on active tab
    setRefreshing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <UserPostsList
            userId={profile?.id || ''}
            posts={mockPosts}
            loading={false}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        );
      case 'marketplace':
        return (
          <UserMarketplaceList
            userId={profile?.id || ''}
            items={mockListings}
            loading={false}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        );
      case 'events':
        return (
          <UserEventsList
            userId={profile?.id || ''}
            events={mockEvents}
            loading={false}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        );
      default:
        return null;
    }
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <TopBar onMenuPress={handleMenuPress} />
        <View style={styles.emptyState}>
          {/* Loading or error state */}
        </View>
        <BottomTabBar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        stickyHeaderIndices={[3]}
      >
        {/* Header with Banner and Profile Picture */}
        <ProfileHeader
          profilePictureUrl={profile.profile_picture_url}
          bannerImageUrl={profile.banner_image_url}
          verified={profile.verified_seller}
          governmentVerified={profile.government_verified}
          onSettingsPress={handleSettings}
          isOwnProfile={true}
        />

        {/* Name, Username, and Action Buttons */}
        <ProfileInfo
          firstName={profile.first_name}
          username={profile.username}
          verified={profile.verified_seller}
          governmentVerified={profile.government_verified}
          followerCount={profile.follower_count}
          followingCount={profile.following_count}
          isOwnProfile={true}
          onEditProfile={handleEditProfile}
          onShare={handleShare}
          onFollowersPress={handleFollowers}
          onFollowingPress={handleFollowing}
        />

        {/* About Me and Member Since */}
        <ProfileAbout
          bio={profile.bio}
          memberSince={profile.created_at}
          city={profile.city}
          state={profile.state}
          collegeName={profile.college_name}
        />

        {/* Tabs */}
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          postCount={mockPosts.length}
          listingCount={mockListings.length}
          eventCount={mockEvents.length}
        />

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
