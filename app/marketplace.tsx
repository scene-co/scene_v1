import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { Sidebar } from '../components/Sidebar';
import { MarketplaceCard, MarketplaceItem } from '../components/cards/MarketplaceCard';
import { getListings } from '../services/marketplaceService';
import { MarketplaceListing } from '../types/database.types';

type CategoryType = 'all' | 'Textbooks' | 'Furniture' | 'Electronics' | 'Accessories';

const categories = [
  { id: 'all' as CategoryType, label: 'All Items', icon: 'grid-outline' as const },
  { id: 'Textbooks' as CategoryType, label: 'Textbooks', icon: 'book-outline' as const },
  { id: 'Furniture' as CategoryType, label: 'Furniture', icon: 'bed-outline' as const },
  { id: 'Electronics' as CategoryType, label: 'Electronics', icon: 'laptop-outline' as const },
  { id: 'Accessories' as CategoryType, label: 'Accessories', icon: 'watch-outline' as const },
];

// Convert database listing to card item format
const convertToCardItem = (listing: MarketplaceListing): MarketplaceItem => {
  return {
    id: listing.id,
    title: listing.title,
    price: listing.price,
    condition: listing.condition,
    seller: 'Anonymous', // TODO: Join with profiles table to get username
    images: listing.images,
    description: listing.description,
  };
};

export default function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleFiltersPress = () => {
    Alert.alert('Filters', 'Filter options coming soon!');
  };

  // Fetch listings from Supabase
  const fetchListings = async () => {
    setLoading(true);
    try {
      const category = selectedCategory === 'all' ? undefined : selectedCategory;
      const { listings: fetchedListings } = await getListings(category, 'active', 50, 0);
      setListings(fetchedListings);
    } catch (error) {
      Alert.alert('Error', 'Failed to load listings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListings();
  };

  // Filter listings based on search query
  const filteredListings = listings.filter((listing) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.category.toLowerCase().includes(query)
    );
  });

  // Convert listings to card items
  const cardItems = filteredListings.map(convertToCardItem);

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for items"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
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
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'ALL ITEMS' : selectedCategory.toUpperCase()}
          </Text>
          <Text style={styles.itemCount}>{cardItems.length} items</Text>
        </View>

        {/* Items Grid */}
        <View style={styles.grid}>
          {cardItems.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <MarketplaceCard item={item} />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/create-listing' as any)}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00311F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
