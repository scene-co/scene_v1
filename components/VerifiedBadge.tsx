/**
 * Verified Badge Component
 * Displays verified seller badge with different styles for government vs rating verified
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerifiedBadgeProps {
  verified: boolean;
  governmentVerified?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  onPress?: () => void;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  verified,
  governmentVerified = false,
  size = 'medium',
  showLabel = false,
  onPress,
}) => {
  if (!verified) return null;

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const badgeColor = governmentVerified ? '#5865F2' : '#43B581';
  const labelText = governmentVerified ? 'Gov. Verified' : 'Verified Seller';

  const BadgeContent = (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={iconSize} color={badgeColor} />
      {showLabel && (
        <Text style={[styles.label, { color: badgeColor }]}>{labelText}</Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {BadgeContent}
      </TouchableOpacity>
    );
  }

  return BadgeContent;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default VerifiedBadge;
