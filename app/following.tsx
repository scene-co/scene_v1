/**
 * Following List Screen
 * Displays list of users that the current user is following
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getFollowing } from '../services/followService';
import { UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function FollowingScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const { user } = useAuth();

  const [following, setFollowing] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFollowing();
  }, [userId]);

  const loadFollowing = async () => {
    setLoading(true);
    try {
      const result = await getFollowing(userId || user?.id || '');
      setFollowing(result.following);
    } catch (error) {
      console.error('Error loading following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFollowing();
    setRefreshing(false);
  };

  const renderFollowingItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        // Navigate to user's profile
        console.log('Navigate to user:', item.username);
      }}
    >
      <View style={styles.userInfo}>
        {item.profile_picture_url ? (
          <Image source={{ uri: item.profile_picture_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color="#999" />
          </View>
        )}
        <View style={styles.userText}>
          <Text style={styles.userName}>{item.first_name}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Following</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5865F2" />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Following ({following.length})</Text>
        <View style={{ width: 28 }} />
      </View>

      {following.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>Not following anyone yet</Text>
          <Text style={styles.emptySubtitle}>
            Users you follow will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={following}
          keyExtractor={(item) => item.id}
          renderItem={renderFollowingItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
});
