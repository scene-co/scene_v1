/**
 * UserEventsList Component
 * Displays user's created events
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import EventCard from '../cards/EventCard';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
}

interface UserEventsListProps {
  userId: string;
  events: Event[];
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const UserEventsList: React.FC<UserEventsListProps> = ({
  userId,
  events,
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

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No events yet</Text>
        <Text style={styles.emptySubtitle}>
          Events created by this user will appear here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <EventCard
            {...item}
            onPress={() => {
              // Navigate to event detail
              console.log('Navigate to event:', item.id);
            }}
          />
        </View>
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
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginBottom: 16,
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

export default UserEventsList;
