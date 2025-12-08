import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { Sidebar } from '../components/Sidebar';

export default function MyCommunitiesScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={() => setSidebarVisible(true)} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.centered}>
          <Ionicons name="albums-outline" size={80} color="#00311F" />
          <Text style={styles.title}>My Communities</Text>
          <Text style={styles.emptyText}>No communities joined yet</Text>
          <Text style={styles.description}>
            Join forum communities to see them here. Explore the Forums tab to discover
            communities that match your interests!
          </Text>
        </View>
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
  contentContainer: {
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00311F',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
