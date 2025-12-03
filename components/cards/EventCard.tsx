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
      activeOpacity={0.8}
    >
      {event.image ? (
        <Image source={{ uri: event.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="calendar" size={48} color="#9333EA" />
        </View>
      )}

      {/* Bookmark Icon */}
      <TouchableOpacity style={styles.bookmarkButton} onPress={(e) => e.stopPropagation()}>
        <Ionicons name="bookmark-outline" size={24} color="#FFF" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoText}>{event.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.locationText} numberOfLines={1}>{event.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    aspectRatio: 340 / 450,
    backgroundColor: '#2D1B3D',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: 360,
    backgroundColor: '#3D2B4D',
  },
  imagePlaceholder: {
    width: '100%',
    height: 360,
    backgroundColor: '#3D2B4D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    padding: 16,
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 6,
    lineHeight: 22,
  },
  infoRow: {
    marginBottom: 2,
  },
  infoText: {
    fontSize: 13,
    color: '#D4D4D8',
    fontWeight: '500',
  },
  locationText: {
    fontSize: 12,
    color: '#A1A1AA',
  },
});
