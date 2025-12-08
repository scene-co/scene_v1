import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Image
            source={require('../assets/images/scene-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>Scene</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Scene</Text>
          <Text style={styles.description}>
            Scene is your all-in-one student social ecosystem. Connect with fellow students,
            buy and sell items, join forums, discover events, and make new friends - all in
            one place.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>

          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubbles" size={24} color="#00311F" />
              <Text style={styles.featureText}>Forums & Communities</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="storefront" size={24} color="#00311F" />
              <Text style={styles.featureText}>Student Marketplace</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="calendar" size={24} color="#00311F" />
              <Text style={styles.featureText}>Campus Events</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="people" size={24} color="#00311F" />
              <Text style={styles.featureText}>Social Networking</Text>
            </View>

            <View style={styles.featureItem}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#00311F" />
              <Text style={styles.featureText}>Direct Messaging</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with care for students</Text>
          <Text style={styles.copyright}>© 2024 Scene. All rights reserved.</Text>
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
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00311F',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#999',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00311F',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  copyright: {
    fontSize: 12,
    color: '#999',
  },
});
