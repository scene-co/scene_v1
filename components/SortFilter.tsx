import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type SortType = 'hot' | 'new' | 'top' | 'rising';

interface SortFilterProps {
  activeSort: SortType;
  onSortChange: (sort: SortType) => void;
}

export function SortFilter({ activeSort, onSortChange }: SortFilterProps) {
  const sorts: { id: SortType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'hot', label: 'Hot', icon: 'flame' },
    { id: 'new', label: 'New', icon: 'sparkles' },
    { id: 'top', label: 'Top', icon: 'trophy' },
    { id: 'rising', label: 'Rising', icon: 'trending-up' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sorts.map((sort) => {
          const isActive = activeSort === sort.id;
          return (
            <TouchableOpacity
              key={sort.id}
              style={[styles.sortButton, isActive && styles.sortButtonActive]}
              onPress={() => onSortChange(sort.id)}
              activeOpacity={0.6}
            >
              <Ionicons
                name={sort.icon}
                size={16}
                color={isActive ? '#000' : '#999'}
              />
              <Text style={[styles.sortText, isActive && styles.sortTextActive]}>
                {sort.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF7E6',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  sortButtonActive: {
    backgroundColor: '#E8E8E8',
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  sortTextActive: {
    color: '#000',
  },
});
