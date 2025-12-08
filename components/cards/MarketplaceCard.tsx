import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  seller: string;
  images?: string[];
  description: string;
}

interface MarketplaceCardProps {
  item: MarketplaceItem;
}

export function MarketplaceCard({ item }: MarketplaceCardProps) {
  const handlePress = () => {
    router.push(`/marketplace-detail?id=${item.id}` as any);
  };

  const firstImage = item.images && item.images.length > 0 ? item.images[0] : null;
  const imageCount = item.images?.length || 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {firstImage ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: firstImage }} style={styles.image} />
          {imageCount > 1 && (
            <View style={styles.imageCountBadge}>
              <Ionicons name="images" size={12} color="#FFF" />
              <Text style={styles.imageCountText}>{imageCount}</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={32} color="#666" />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>
          <View style={styles.conditionBadge}>
            <Text style={styles.conditionText}>{item.condition}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.seller}>
            <Ionicons name="person-circle-outline" size={16} color="#666" />
            <Text style={styles.sellerText} numberOfLines={1}>{item.seller}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#D3E1C4',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  image: {
    width: '100%',
    height: 140,
    backgroundColor: '#F5F5F5',
  },
  imageCountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  imageCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  imagePlaceholder: {
    width: '100%',
    height: 140,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00311F',
    marginBottom: 8,
    lineHeight: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00311F',
  },
  conditionBadge: {
    backgroundColor: '#E8E8E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  conditionText: {
    fontSize: 11,
    color: '#00311F',
    fontWeight: '600',
  },
  footer: {
    marginTop: 4,
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
});
