import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { MarketplaceCard } from '../components/cards/MarketplaceCard';
import { mockMarketplaceItems } from '../data/mockMarketplace';

export default function MarketplaceScreen() {
  const handleMenuPress = () => {
    Alert.alert('Menu', 'Sidebar menu coming soon!');
  };

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Marketplace</Text>
          <Text style={styles.subtitle}>
            Buy and sell textbooks, furniture, and other items with fellow students
          </Text>
        </View>

        <View style={styles.grid}>
          {mockMarketplaceItems.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
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
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },
  grid: {
    paddingHorizontal: 24,
    gap: 16,
  },
  cardWrapper: {
    marginBottom: 0,
  },
});
