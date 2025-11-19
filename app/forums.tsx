import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { ForumCard } from '../components/cards/ForumCard';
import { mockForumPosts } from '../data/mockForums';

export default function ForumsScreen() {
  const handleMenuPress = () => {
    Alert.alert('Menu', 'Sidebar menu coming soon!');
  };

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Forums</Text>
          <Text style={styles.subtitle}>
            Join discussions, ask questions, and connect with other students
          </Text>
        </View>

        <View style={styles.grid}>
          {mockForumPosts.map((post) => (
            <View key={post.id} style={styles.cardWrapper}>
              <ForumCard post={post} />
            </View>
          ))}
        </View>
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
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },
  grid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 0,
  },
});
