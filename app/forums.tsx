import React, { useState, useMemo, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { TabSelector, TabType } from '../components/TabSelector';
import { SortFilter, SortType } from '../components/SortFilter';
import { RedditStyleForumCard } from '../components/cards/RedditStyleForumCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { getPosts } from '../services/forumService';
import { ForumPost as DBForumPost } from '../types/database.types';
import { ForumPost as CardForumPost } from '../components/cards/ForumCard';

// Helper function to get time ago
const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

// Convert database post to card post format
const convertToCardPost = (dbPost: any): CardForumPost => {
  const createdDate = new Date(dbPost.created_at);
  const timeAgo = getTimeAgo(createdDate);

  return {
    id: dbPost.id,
    author: 'Anonymous', // TODO: Join with profiles table to get username
    authorId: dbPost.user_id,
    category: dbPost.category,
    title: dbPost.title,
    content: dbPost.content,
    preview: dbPost.preview || dbPost.content.substring(0, 200),
    score: dbPost.score,
    upvotes: dbPost.upvotes || 0,
    downvotes: dbPost.downvotes || 0,
    commentCount: dbPost.comment_count,
    replies: dbPost.comment_count,
    timestamp: timeAgo,
    createdAt: createdDate,
    postType: dbPost.post_type,
    flair: dbPost.flair_text && dbPost.flair_color
      ? { text: dbPost.flair_text, color: dbPost.flair_color }
      : undefined,
    userVote: null, // TODO: Get user's vote from database
    isUserJoined: false, // TODO: Check if user joined this category
  };
};

export default function ForumsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const [activeSort, setActiveSort] = useState<SortType>('hot');
  const [posts, setPosts] = useState<DBForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Sidebar menu coming soon!');
  };

  // Fetch posts from Supabase
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { posts: fetchedPosts } = await getPosts(undefined, 50, 0);
      setPosts(fetchedPosts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const filteredAndSortedPosts = useMemo(() => {
    let filteredPosts = [...posts];

    // Filter by tab
    if (activeTab === 'popular') {
      // Popular: High score posts
      filteredPosts = filteredPosts.filter((post) => post.score > 5);
    } else if (activeTab === 'following') {
      // Following: Posts from joined categories (implement later)
      // For now, show all posts
      filteredPosts = filteredPosts;
    }

    // Sort posts based on activeSort
    if (activeSort === 'hot') {
      // Hot algorithm: score / time
      filteredPosts.sort((a, b) => {
        const aTime = new Date(a.created_at).getTime();
        const bTime = new Date(b.created_at).getTime();
        const aHot = a.score / ((Date.now() - aTime) / (1000 * 60 * 60) + 2);
        const bHot = b.score / ((Date.now() - bTime) / (1000 * 60 * 60) + 2);
        return bHot - aHot;
      });
    } else if (activeSort === 'new') {
      // New: Most recent first
      filteredPosts.sort((a, b) => {
        const aTime = new Date(a.created_at).getTime();
        const bTime = new Date(b.created_at).getTime();
        return bTime - aTime;
      });
    } else if (activeSort === 'top') {
      // Top: Highest score
      filteredPosts.sort((a, b) => b.score - a.score);
    } else if (activeSort === 'rising') {
      // Rising: Recent posts with growing engagement
      filteredPosts.sort((a, b) => {
        const aTime = new Date(a.created_at).getTime();
        const bTime = new Date(b.created_at).getTime();
        const aRising = (a.score / ((Date.now() - aTime) / (1000 * 60) + 1)) * a.comment_count;
        const bRising = (b.score / ((Date.now() - bTime) / (1000 * 60) + 1)) * b.comment_count;
        return bRising - aRising;
      });
    }

    return filteredPosts;
  }, [posts, activeTab, activeSort]);

  // Convert posts to card format for rendering
  const cardPosts = useMemo(() => {
    return filteredAndSortedPosts.map(convertToCardPost);
  }, [filteredAndSortedPosts]);

  const renderPost = ({ item }: { item: CardForumPost }) => (
    <RedditStyleForumCard post={item} />
  );

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'explore' && (
        <SortFilter activeSort={activeSort} onSortChange={setActiveSort} />
      )}

      <FlatList
        data={cardPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      <FloatingActionButton />

      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
});
