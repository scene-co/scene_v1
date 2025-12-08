import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBar } from '../components/BottomTabBar';
import { TopBar } from '../components/TopBar';
import { Sidebar } from '../components/Sidebar';
import { EventCard } from '../components/cards/EventCard';
import { EventSearchBar } from '../components/EventSearchBar';
import { CategoryCircle } from '../components/CategoryCircle';
import { mockEvents } from '../data/mockEvents';
import { getEvents, Event } from '../services/eventsService';

type Category = 'all' | 'sports' | 'social' | 'academic' | 'cultural' | 'technical';

export default function EventsScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { id: 'all' as Category, label: 'All', icon: 'apps' as const },
    { id: 'sports' as Category, label: 'Sports', icon: 'basketball' as const },
    { id: 'social' as Category, label: 'Social', icon: 'people' as const },
    { id: 'academic' as Category, label: 'Academic', icon: 'book' as const },
    { id: 'cultural' as Category, label: 'Cultural', icon: 'color-palette' as const },
    { id: 'technical' as Category, label: 'Technical', icon: 'code-slash' as const },
  ];

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  // Fetch events from database
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const category = activeCategory === 'all' ? undefined : activeCategory;
      const { events: fetchedEvents } = await getEvents(category, 'active', 50, 0);
      setEvents(fetchedEvents);
    } catch (error) {
      Alert.alert('Error', 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  // Use real events if available, fallback to mock events
  const displayEvents = events.length > 0 ? events : mockEvents;

  return (
    <LinearGradient
      colors={['#16041a', '#1f0b2e', '#2d1b3d', '#3a2449']}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}
    >
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#FFF" />
        }
      >
        {/* Search Bar */}
        <EventSearchBar placeholder="Search for events" />

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <FlatList
            horizontal
            data={categories}
            renderItem={({ item }) => (
              <CategoryCircle
                label={item.label}
                icon={item.icon}
                isActive={activeCategory === item.id}
                onPress={() => setActiveCategory(item.id)}
              />
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Happening This Week */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's happening this week</Text>
          <FlatList
            horizontal
            data={displayEvents.slice(0, 4)}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <EventCard event={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselList}
          />
        </View>

        {/* Featured Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured events</Text>
          <FlatList
            horizontal
            data={displayEvents.slice(2, 6)}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <EventCard event={item} />
              </View>
            )}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselList}
          />
        </View>

        {/* All Events - Grid Layout */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All events</Text>
          {displayEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyStateText}>No events yet</Text>
              <Text style={styles.emptyStateSubtext}>Be the first to create an event!</Text>
            </View>
          ) : (
            <View style={styles.gridContainer}>
              {displayEvents.map((event) => (
                <View key={event.id} style={styles.gridItem}>
                  <EventCard event={event} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Spacer for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-event' as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#1D0F2F" />
      </TouchableOpacity>

      <BottomTabBar />

      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
    paddingTop: 20,
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  carouselList: {
    paddingHorizontal: 20,
  },
  carouselItem: {
    width: 340,
    marginRight: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48.5%',
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFC107',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
});
