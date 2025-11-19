import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface SectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
  seeAllPath?: string;
}

export function SectionHeader({ title, onSeeAllPress, seeAllPath }: SectionHeaderProps) {
  const handleSeeAll = () => {
    if (seeAllPath) {
      router.push(seeAllPath as any);
    } else if (onSeeAllPress) {
      onSeeAllPress();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={handleSeeAll} activeOpacity={0.7}>
        <Text style={styles.seeAll}>See All →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});
