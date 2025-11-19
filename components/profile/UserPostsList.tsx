/**
 * UserPostsList Component
 * Displays user's forum posts
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import RedditStyleForumCard from '../cards/RedditStyleForumCard';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  upvotes: number;
  downvotes: number;
  replies: number;
  timestamp: string;
  category: string;
  flair?: string;
}

interface UserPostsListProps {
  userId: string;
  posts: ForumPost[];
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const UserPostsList: React.FC<UserPostsListProps> = ({
  userId,
  posts,
  loading = false,
  onRefresh,
  refreshing = false,
}) => {
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5865F2" />
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No posts yet</Text>
        <Text style={styles.emptySubtitle}>
          Posts created by this user will appear here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <RedditStyleForumCard
          {...item}
          onPress={() => {
            // Navigate to post detail
            console.log('Navigate to post:', item.id);
          }}
        />
      )}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default UserPostsList;
