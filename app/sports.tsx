import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';

export default function SportsScreen() {
  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.centered}>
          <View style={styles.iconContainer}>
            <Ionicons name="basketball" size={80} color="#00311F" />
          </View>

          <Text style={styles.title}>Sports Matchmaking</Text>
          <Text style={styles.subtitle}>Coming Soon</Text>

          <Text style={styles.description}>
            Find players for your next game! Create sports invites, specify time and venue,
            and match with fellow students who want to play. Perfect for pickup games and
            regular sports meetups.
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="football" size={24} color="#00311F" />
              <Text style={styles.featureText}>Football</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="tennisball" size={24} color="#00311F" />
              <Text style={styles.featureText}>Badminton</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="basketball" size={24} color="#00311F" />
              <Text style={styles.featureText}>Basketball</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="fitness" size={24} color="#00311F" />
              <Text style={styles.featureText}>Cricket</Text>
            </View>
          </View>
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
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D3E1C4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00311F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFC107',
    fontWeight: '600',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  featureItem: {
    alignItems: 'center',
    width: 100,
  },
  featureText: {
    fontSize: 14,
    color: '#00311F',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 8,
  },
});
