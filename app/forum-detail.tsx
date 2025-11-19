import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VoteButton } from '../components/VoteButton';
import { mockForumPosts } from '../data/mockForums';

export const unstable_settings = {
  animation: 'slide_from_bottom',
};

export default function ForumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const post = mockForumPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Post not found</Text>
      </View>
    );
  }

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

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Forum Thread</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.postHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>c/{post.category}</Text>
            </View>
            {post.flair && (
              <View style={[styles.flairBadge, { backgroundColor: post.flair.color + '20' }]}>
                <Text style={[styles.flairText, { color: post.flair.color }]}>
                  {post.flair.text}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>

        <Text style={styles.title}>{post.title}</Text>

        <View style={styles.authorRow}>
          <Ionicons name="person-circle" size={32} color="#666" />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>u/{post.author}</Text>
            <Text style={styles.authorSubtext}>Active member</Text>
          </View>
        </View>

        <View style={styles.postContent}>
          <Text style={styles.postText}>{post.content}</Text>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.voteSection}>
            <VoteButton
              score={post.score}
              userVote={post.userVote}
              onUpvote={handleUpvote}
              onDownvote={handleDownvote}
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#999" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Ionicons name="bookmark-outline" size={20} color="#999" />
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="chatbubble-outline" size={16} color="#007AFF" />
            <Text style={styles.statText}>{post.commentCount} comments</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="eye-outline" size={16} color="#666" />
            <Text style={styles.statText}>247 views</Text>
          </View>
        </View>

        <View style={styles.repliesSection}>
          <Text style={styles.sectionTitle}>Replies ({post.replies})</Text>
          <View style={styles.replyPlaceholder}>
            <Ionicons name="chatbubbles-outline" size={48} color="#CCC" />
            <Text style={styles.placeholderText}>
              Replies will be loaded from backend
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.replyBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.replyInput}
          placeholder="Write a reply..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#E6F4FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  flairBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  flairText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  authorSubtext: {
    fontSize: 12,
    color: '#999',
  },
  postContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#F0F0F0',
  },
  postText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 16,
  },
  voteSection: {
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  repliesSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  replyPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  replyInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
