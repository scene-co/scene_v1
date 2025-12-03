/**
 * ProfileTabs Component
 * Tab selector for Posts, Marketplace, and Events
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileTab, TabConfig } from '../../types';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  postCount?: number;
  listingCount?: number;
  eventCount?: number;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  onTabChange,
  postCount = 0,
  listingCount = 0,
  eventCount = 0,
}) => {
  const tabs: TabConfig[] = [
    { id: 'posts', label: 'Posts', icon: 'chatbox-outline' },
    { id: 'marketplace', label: 'Listings', icon: 'pricetag-outline' },
    { id: 'events', label: 'Events', icon: 'calendar-outline' },
  ];

  const getCounts = (tabId: ProfileTab): number => {
    switch (tabId) {
      case 'posts':
        return postCount;
      case 'marketplace':
        return listingCount;
      case 'events':
        return eventCount;
      default:
        return 0;
    }
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = getCounts(tab.id);

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.id)}
          >
            <View style={styles.tabContent}>
              <Ionicons
                name={tab.icon as any}
                size={18}
                color={isActive ? '#00311F' : '#666'}
              />
              <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{count}</Text>
                </View>
              )}
            </View>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 49, 31, 0.2)',
    backgroundColor: '#FFF7E6',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTab: {
    // Active tab styling handled by indicator
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabLabel: {
    fontWeight: '600',
    color: '#00311F',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#00311F',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  countBadge: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
});

export default ProfileTabs;
