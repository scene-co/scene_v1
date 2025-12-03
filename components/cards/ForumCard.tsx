import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export interface ForumPost {
  id: string;
  title: string;
  preview: string;
  content: string;
  author: string;
  authorId: string;
  replies: number;
  commentCount: number;
  timestamp: string;
  createdAt: Date;
  category: string;
  forumName?: string;
  forumId?: string;
  upvotes: number;
  downvotes: number;
  score: number;
  userVote: 'up' | 'down' | null;
  flair?: {
    text: string;
    color: string;
  };
  postType: 'text' | 'image' | 'link';
  thumbnailUrl?: string;
  isUserJoined: boolean;
}

interface ForumCardProps {
  post: ForumPost;
}

export function ForumCard({ post }: ForumCardProps) {
  const handlePress = () => {
    router.push(`/forum-detail?id=${post.id}` as any);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{post.category}</Text>
        </View>
        <Text style={styles.timestamp}>{post.timestamp}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {post.title}
      </Text>

      <Text style={styles.preview} numberOfLines={3}>
        {post.preview}
      </Text>

      <View style={styles.footer}>
        <View style={styles.author}>
          <Ionicons name="person-circle-outline" size={16} color="#666" />
          <Text style={styles.authorText}>{post.author}</Text>
        </View>

        <View style={styles.replies}>
          <Ionicons name="chatbubble-outline" size={14} color="#000" />
          <Text style={styles.repliesText}>{post.replies} replies</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: '#DFB6B2',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: '#000',
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  preview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  authorText: {
    fontSize: 13,
    color: '#666',
  },
  replies: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  repliesText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
});
