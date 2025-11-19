import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { mockMarketplaceItems } from '../data/mockMarketplace';

export const unstable_settings = {
  animation: 'slide_from_bottom',
};

export default function MarketplaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const item = mockMarketplaceItems.find((i) => i.id === id);

  if (!item) {
    return (
      <View style={styles.container}>
        <Text>Item not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Details</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={64} color="#666" />
        </View>

        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.conditionBadge}>
              <Text style={styles.conditionText}>{item.condition}</Text>
            </View>
          </View>

          <Text style={styles.price}>₹{item.price.toLocaleString()}</Text>

          <View style={styles.sellerSection}>
            <Text style={styles.sectionTitle}>Seller Information</Text>
            <View style={styles.sellerRow}>
              <Ionicons name="person-circle" size={40} color="#666" />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{item.seller}</Text>
                <Text style={styles.sellerSubtext}>Member since 2024</Text>
              </View>
            </View>
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <TouchableOpacity style={styles.contactButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#FFF" />
            <Text style={styles.contactButtonText}>Contact Seller</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  imagePlaceholder: {
    width: '100%',
    height: 250,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  conditionBadge: {
    backgroundColor: '#E6F4FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  conditionText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 24,
  },
  sellerSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  sellerSubtext: {
    fontSize: 13,
    color: '#999',
  },
  descriptionSection: {
    marginBottom: 24,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
