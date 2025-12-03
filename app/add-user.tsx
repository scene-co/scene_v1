/**
 * Add User Screen
 * Allows users to search for and add other users by username
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { UserProfile } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function AddUserScreen() {
  const insets = useSafeAreaInsets();
  const { user, followUser, isFollowing } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  const handleSearch = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return;
    }

    setLoading(true);
    try {
      // Search for users by username
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', `%${username.trim()}%`)
        .neq('id', user?.id) // Exclude current user from results
        .limit(10);

      if (error) throw error;

      if (!data || data.length === 0) {
        Alert.alert('No Results', 'No users found with that username');
        setSearchResults([]);
        return;
      }

      setSearchResults(data);

      // Check following status for each user
      const followingStatus: Record<string, boolean> = {};
      for (const profile of data) {
        followingStatus[profile.id] = await isFollowing(profile.id);
      }
      setFollowingStates(followingStatus);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to search for user');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUser = async (userId: string, userName: string) => {
    try {
      const result = await followUser(userId);

      if (result.success) {
        Alert.alert('Success', `You are now following ${userName}`);
        // Update following state
        setFollowingStates(prev => ({ ...prev, [userId]: true }));
      } else {
        Alert.alert('Error', result.error || 'Failed to follow user');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to follow user');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#00311F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add User</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchSection}>
          <Ionicons name="search" size={24} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.searchButtonText}>Search User</Text>
          )}
        </TouchableOpacity>

        {searchResults.length === 0 ? (
          <View style={styles.infoSection}>
            <Ionicons name="information-circle-outline" size={24} color="#00311F" />
            <Text style={styles.infoText}>
              Enter a username to search for users. Once found, you can view their profile and
              follow them.
            </Text>
          </View>
        ) : (
          <View style={styles.resultsSection}>
            <Text style={styles.resultTitle}>Search Results</Text>
            {searchResults.map((profile) => (
              <View key={profile.id} style={styles.userCard}>
                <TouchableOpacity
                  style={styles.userInfo}
                  onPress={() => router.push(`/user/${profile.id}` as any)}
                >
                  {profile.profile_picture_url ? (
                    <Image
                      source={{ uri: profile.profile_picture_url }}
                      style={styles.profilePic}
                    />
                  ) : (
                    <View style={styles.profilePicPlaceholder}>
                      <Ionicons name="person" size={32} color="#666" />
                    </View>
                  )}
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{profile.first_name}</Text>
                    <Text style={styles.userUsername}>@{profile.username}</Text>
                    {profile.bio && (
                      <Text style={styles.userBio} numberOfLines={2}>
                        {profile.bio}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.followButton,
                    followingStates[profile.id] && styles.followingButton,
                  ]}
                  onPress={() => handleFollowUser(profile.id, profile.first_name)}
                  disabled={followingStates[profile.id]}
                >
                  <Text
                    style={[
                      styles.followButtonText,
                      followingStates[profile.id] && styles.followingButtonText,
                    ]}
                  >
                    {followingStates[profile.id] ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 49, 31, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00311F',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#00311F',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 49, 31, 0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#00311F',
    lineHeight: 20,
  },
  resultsSection: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00311F',
    marginBottom: 16,
  },
  userCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  profilePic: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
  },
  profilePicPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00311F',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  followButton: {
    backgroundColor: '#00311F',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  followingButton: {
    backgroundColor: '#D3E1C4',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  followingButtonText: {
    color: '#00311F',
  },
});
