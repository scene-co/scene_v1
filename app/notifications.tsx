import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.centered}>
          <Ionicons name="notifications-outline" size={80} color="#00311F" />
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.description}>
            You'll see notifications here when someone likes your posts, comments on your
            listings, or sends you a message.
          </Text>
        </View>
      </ScrollView>

      <BottomTabBar />
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
