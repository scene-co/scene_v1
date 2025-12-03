import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BottomTabBar } from '../components/BottomTabBar';
import { EventCard } from '../components/cards/EventCard';
import { EventSearchBar } from '../components/EventSearchBar';
import { CategoryCircle } from '../components/CategoryCircle';
import { mockEvents } from '../data/mockEvents';

type Category = 'all' | 'music' | 'sports' | 'social' | 'academic' | 'parties';

export default function EventsScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const categories = [
    { id: 'all' as Category, label: 'All', icon: 'apps' as const },
    { id: 'music' as Category, label: 'Music', icon: 'musical-notes' as const },
    { id: 'sports' as Category, label: 'Sports', icon: 'basketball' as const },
    { id: 'social' as Category, label: 'Social', icon: 'people' as const },
    { id: 'academic' as Category, label: 'Academic', icon: 'book' as const },
    { id: 'parties' as Category, label: 'Parties', icon: 'wine' as const },
  ];

  return (
    <LinearGradient
      colors={['#16041a', '#1f0b2e', '#2d1b3d', '#3a2449']}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}
    >
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
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
            data={mockEvents.slice(0, 4)}
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
            data={mockEvents.slice(2, 6)}
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
          <View style={styles.gridContainer}>
            {mockEvents.map((event) => (
              <View key={event.id} style={styles.gridItem}>
                <EventCard event={event} />
              </View>
            ))}
          </View>
        </View>

        {/* Spacer for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomTabBar />
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
    paddingTop: 60,
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
});
