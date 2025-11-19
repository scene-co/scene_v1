import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { VoteButton } from '../VoteButton';
import { ForumPost } from './ForumCard';

interface RedditStyleForumCardProps {
  post: ForumPost;
}

export function RedditStyleForumCard({ post }: RedditStyleForumCardProps) {
  const handlePress = () => {
    router.push(`/forum-detail?id=${post.id}` as any);
  };

  const handleUpvote = () => {
    Alert.alert('Upvote', 'Upvote functionality will be connected to backend');
  };

  const handleDownvote = () => {
    Alert.alert('Downvote', 'Downvote functionality will be connected to backend');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share functionality coming soon');
  };

  const handleSave = () => {
    Alert.alert('Save', 'Save functionality coming soon');
  };

  const handleJoin = () => {
    Alert.alert('Join', `Join ${post.category} category coming soon`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <VoteButton
          score={post.score}
          userVote={post.userVote}
          onUpvote={handleUpvote}
          onDownvote={handleDownvote}
        />
      </View>

      <TouchableOpacity
        style={styles.rightSection}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.category}>c/{post.category}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.author}>u/{post.author}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.mainContent}>
            {post.flair && (
              <View style={[styles.flairBadge, { backgroundColor: post.flair.color + '20' }]}>
                <Text style={[styles.flairText, { color: post.flair.color }]}>
                  {post.flair.text}
                </Text>
              </View>
            )}

            <Text style={styles.title} numberOfLines={2}>
              {post.title}
            </Text>

            <Text style={styles.preview} numberOfLines={3}>
              {post.preview}
            </Text>
          </View>

          {post.postType !== 'text' && post.thumbnailUrl && (
            <View style={styles.thumbnail}>
              <Ionicons
                name={post.postType === 'image' ? 'image' : 'link'}
                size={32}
                color="#CCC"
              />
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
            <Ionicons name="chatbubble-outline" size={16} color="#999" />
            <Text style={styles.actionText}>{post.commentCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={16} color="#999" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Ionicons name="bookmark-outline" size={16} color="#999" />
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>

          {!post.isUserJoined && (
            <TouchableOpacity style={styles.joinButton} onPress={handleJoin}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 10,
  },
  leftSection: {
    paddingLeft: 8,
    paddingRight: 4,
  },
  rightSection: {
    flex: 1,
    paddingRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  separator: {
    fontSize: 12,
    color: '#CCC',
    marginHorizontal: 4,
  },
  author: {
    fontSize: 12,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  mainContent: {
    flex: 1,
  },
  flairBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  flairText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },
  preview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  thumbnail: {
    width: 70,
    height: 70,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
  },
  joinButton: {
    marginLeft: 'auto',
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: '#34C759',
    borderRadius: 16,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
});
