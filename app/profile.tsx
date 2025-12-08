/**
 * Profile Screen
 * Discord-inspired profile with banner, avatar, tabs, and user content
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { Sidebar } from '../components/Sidebar';
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
import { getUserListings } from '../services/marketplaceService';
import { getUserHostedEvents } from '../services/eventsService';

export default function ProfileScreen() {
  const { profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');
  const [refreshing, setRefreshing] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Real data from backend
  const [posts, setPosts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleMenuPress = () => {
    setSidebarVisible(true);
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

  // Fetch user's marketplace listings
  const fetchListings = async () => {
    try {
      const userListings = await getUserListings();
      setListings(userListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  // Fetch user's hosted events
  const fetchEvents = async () => {
    try {
      const userEvents = await getUserHostedEvents();
      setEvents(userEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Fetch forum posts - TODO: implement when forum posts service is ready
  const fetchPosts = async () => {
    try {
      // TODO: Implement getUserPosts from forumService
      setPosts([]);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    if (profile?.id) {
      setLoading(true);
      Promise.all([fetchListings(), fetchEvents(), fetchPosts()]).finally(() => {
        setLoading(false);
      });
    }
  }, [profile?.id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProfile();
    await Promise.all([fetchListings(), fetchEvents(), fetchPosts()]);
    setRefreshing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return (
          <UserPostsList
            userId={profile?.id || ''}
            posts={posts}
            loading={loading}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        );
      case 'marketplace':
        return (
          <UserMarketplaceList
            userId={profile?.id || ''}
            items={listings}
            loading={loading}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        );
      case 'events':
        return (
          <UserEventsList
            userId={profile?.id || ''}
            events={events}
            loading={loading}
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
          postCount={posts.length}
          listingCount={listings.length}
          eventCount={events.length}
        />

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>

      <BottomTabBar />

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
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
