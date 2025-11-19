import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TopBar } from '../components/TopBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, profile, logout } = useAuth();

  const handleMenuPress = () => {
    console.log('Menu pressed');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color="#007AFF" />
          </View>
          <Text style={styles.name}>{profile?.first_name || 'User'}</Text>
          <Text style={styles.username}>@{profile?.username}</Text>
        </View>

        {profile && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Age</Text>
                  <Text style={styles.infoValue}>{profile.age}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Gender</Text>
                  <Text style={styles.infoValue}>{profile.gender}</Text>
                </View>
              </View>

              {profile.college_name && (
                <View style={styles.infoRowSingle}>
                  <Text style={styles.infoLabel}>College</Text>
                  <Text style={styles.infoValue}>{profile.college_name}</Text>
                </View>
              )}

              <View style={styles.infoRowSingle}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>
                  {profile.city}, {profile.state}
                </Text>
              </View>
            </View>
          </View>
        )}

        {user && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRowSingle}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FFF" style={styles.logoutIcon} />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E6F4FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#666',
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoRowSingle: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
