/**
 * UserMarketplaceList Component
 * Displays user's marketplace listings
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import MarketplaceCard from '../cards/MarketplaceCard';

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  image?: string;
  seller: string;
  condition: string;
  description?: string;
}

interface UserMarketplaceListProps {
  userId: string;
  items: MarketplaceItem[];
  loading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const UserMarketplaceList: React.FC<UserMarketplaceListProps> = ({
  userId,
  items,
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

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No listings yet</Text>
        <Text style={styles.emptySubtitle}>
          Marketplace items listed by this user will appear here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <MarketplaceCard
            {...item}
            onPress={() => {
              // Navigate to item detail
              console.log('Navigate to item:', item.id);
            }}
          />
        </View>
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
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
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 1,
    maxWidth: '48%',
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

export default UserMarketplaceList;
