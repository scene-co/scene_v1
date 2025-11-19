/**
 * ProfileAbout Component
 * Displays bio and member since information
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatMemberSince } from '../../utils/dateUtils';

interface ProfileAboutProps {
  bio?: string | null;
  memberSince?: string;
  city?: string;
  state?: string;
  collegeName?: string | null;
}

const ProfileAbout: React.FC<ProfileAboutProps> = ({
  bio,
  memberSince,
  city,
  state,
  collegeName,
}) => {
  return (
    <View style={styles.container}>
      {bio && (
        <>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.bioText}>{bio}</Text>
          <View style={styles.divider} />
        </>
      )}

      <View style={styles.metaInfo}>
        {memberSince && (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.metaText}>
              Member since {formatMemberSince(memberSince)}
            </Text>
          </View>
        )}

        {city && state && (
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.metaText}>
              {city}, {state}
            </Text>
          </View>
        )}

        {collegeName && (
          <View style={styles.metaItem}>
            <Ionicons name="school-outline" size={16} color="#666" />
            <Text style={styles.metaText}>{collegeName}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginBottom: 16,
  },
  metaInfo: {
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProfileAbout;
