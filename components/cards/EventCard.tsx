import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  image?: string;
  description: string;
}

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const handlePress = () => {
    router.push(`/event-detail?id=${event.id}` as any);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="calendar" size={32} color="#007AFF" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.infoText}>{event.date} • {event.time}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.attendees}>
            <Ionicons name="people-outline" size={14} color="#007AFF" />
            <Text style={styles.attendeesText}>{event.attendees} attending</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    backgroundColor: '#F5F5F5',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  attendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  attendeesText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
});
