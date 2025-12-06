import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { TabSelector, TabType } from '../components/TabSelector';
import { SortFilter, SortType } from '../components/SortFilter';
import { RedditStyleForumCard } from '../components/cards/RedditStyleForumCard';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { mockForumPosts } from '../data/mockForums';
import { ForumPost } from '../components/cards/ForumCard';

export default function ForumsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const [activeSort, setActiveSort] = useState<SortType>('hot');

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Sidebar menu coming soon!');
  };

  const filteredAndSortedPosts = useMemo(() => {
    let posts = [...mockForumPosts];

    // Filter by tab
    if (activeTab === 'popular') {
      // Popular: High score posts
      posts = posts.filter((post) => post.score > 200);
    } else if (activeTab === 'following') {
      // Following: Posts from joined categories
      posts = posts.filter((post) => post.isUserJoined);
    }

    // Sort posts based on activeSort (only for Explore tab, but we apply it to all)
    if (activeSort === 'hot') {
      // Hot algorithm: score / time
      posts.sort((a, b) => {
        const aHot = a.score / ((Date.now() - a.createdAt.getTime()) / (1000 * 60 * 60) + 2);
        const bHot = b.score / ((Date.now() - b.createdAt.getTime()) / (1000 * 60 * 60) + 2);
        return bHot - aHot;
      });
    } else if (activeSort === 'new') {
      // New: Most recent first
      posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (activeSort === 'top') {
      // Top: Highest score
      posts.sort((a, b) => b.score - a.score);
    } else if (activeSort === 'rising') {
      // Rising: Recent posts with growing engagement
      posts.sort((a, b) => {
        const aRising = (a.score / ((Date.now() - a.createdAt.getTime()) / (1000 * 60) + 1)) * a.commentCount;
        const bRising = (b.score / ((Date.now() - b.createdAt.getTime()) / (1000 * 60) + 1)) * b.commentCount;
        return bRising - aRising;
      });
    }

    return posts;
  }, [activeTab, activeSort]);

  const renderPost = ({ item }: { item: ForumPost }) => (
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
        data={filteredAndSortedPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
