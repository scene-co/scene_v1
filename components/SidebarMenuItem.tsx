import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SidebarMenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  badge?: string; // e.g., "Soon", "New", "Beta"
  badgeCount?: number; // e.g., 5 for notifications
  showBadge?: boolean;
  disabled?: boolean;
}

export function SidebarMenuItem({
  icon,
  label,
  onPress,
  badge,
  badgeCount,
  showBadge,
  disabled = false,
}: SidebarMenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, disabled && styles.menuItemDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={24} color={disabled ? '#999' : '#00311F'} />
      </View>

      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>

      {badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}

      {showBadge && badgeCount && badgeCount > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{badgeCount}</Text>
        </View>
      )}

      {!disabled && !badge && !showBadge && (
        <Ionicons name="chevron-forward" size={18} color="#999" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  menuItemDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  labelDisabled: {
    color: '#999',
  },
  badge: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFF',
  },
  countBadge: {
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
  },
});
