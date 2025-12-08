import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';

export default function HelpScreen() {
  const handleEmail = () => {
    Linking.openURL('mailto:support@sceneapp.com');
  };

  return (
    <View style={styles.container}>
      <TopBar />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Ionicons name="help-circle" size={80} color="#00311F" />
          <Text style={styles.title}>Help & Support</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I create a post?</Text>
            <Text style={styles.answer}>
              Navigate to the Forums tab and tap the + button at the bottom right to create a new post.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I list an item for sale?</Text>
            <Text style={styles.answer}>
              Go to the Marketplace tab and tap the + button. Fill in the item details, add photos, and publish your listing.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.question}>How do I edit my profile?</Text>
            <Text style={styles.answer}>
              Go to your Profile tab and tap the "Edit Profile" button below your bio.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactButton} onPress={handleEmail}>
            <Ionicons name="mail" size={24} color="#FFF" />
            <Text style={styles.contactButtonText}>Email Support</Text>
          </TouchableOpacity>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00311F',
    marginTop: 16,
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
  faqItem: {
    marginBottom: 20,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  answer: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    backgroundColor: '#00311F',
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
