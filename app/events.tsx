import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { EventCard } from '../components/cards/EventCard';
import { mockEvents } from '../data/mockEvents';

export default function EventsScreen() {
  const handleMenuPress = () => {
    Alert.alert('Menu', 'Sidebar menu coming soon!');
  };

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Events</Text>
          <Text style={styles.subtitle}>
            Discover campus events, parties, and hangouts near you
          </Text>
        </View>

        <View style={styles.grid}>
          {mockEvents.map((event) => (
            <View key={event.id} style={styles.cardWrapper}>
              <EventCard event={event} />
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
