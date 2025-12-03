import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { MarketplaceCard } from '../components/cards/MarketplaceCard';
import { mockMarketplaceItems } from '../data/mockMarketplace';

type CategoryType = 'all' | 'textbooks' | 'furniture' | 'electronics' | 'accessories';

const categories = [
  { id: 'all' as CategoryType, label: 'All Items', icon: 'grid-outline' as const },
  { id: 'textbooks' as CategoryType, label: 'Textbooks', icon: 'book-outline' as const },
  { id: 'furniture' as CategoryType, label: 'Furniture', icon: 'bed-outline' as const },
  { id: 'electronics' as CategoryType, label: 'Electronics', icon: 'laptop-outline' as const },
  { id: 'accessories' as CategoryType, label: 'Accessories', icon: 'watch-outline' as const },
];

export default function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Sidebar menu coming soon!');
  };

  const handleFiltersPress = () => {
    Alert.alert('Filters', 'Filter options coming soon!');
  };

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchPlaceholder}>Search for items</Text>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFiltersPress}
          >
            <Ionicons name="options-outline" size={18} color="#00311F" />
            <Text style={styles.filterButtonText}>Filters</Text>
            <Ionicons name="chevron-down" size={16} color="#00311F" />
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons
                name={category.icon}
                size={18}
                color={selectedCategory === category.id ? '#00311F' : '#666'}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ALL ITEMS</Text>
          <Text style={styles.itemCount}>{mockMarketplaceItems.length} items</Text>
        </View>

        {/* Items Grid */}
        <View style={styles.grid}>
          {mockMarketplaceItems.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <MarketplaceCard item={item} />
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
    backgroundColor: '#FFF7E6',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#666',
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#00311F',
    marginRight: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00311F',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: '#D3E1C4',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  categoryTextActive: {
    fontWeight: '600',
    color: '#00311F',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00311F',
    letterSpacing: 1,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});
