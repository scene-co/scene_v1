import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryCircleProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive?: boolean;
  onPress: () => void;
}

export function CategoryCircle({ label, icon, isActive = false, onPress }: CategoryCircleProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.circle, isActive && styles.circleActive]}>
        <Ionicons
          name={icon}
          size={28}
          color={isActive ? '#FFF' : '#D4D4D8'}
        />
      </View>
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 20,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2D1B3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#3D2B4D',
  },
  circleActive: {
    backgroundColor: '#9333EA',
    borderColor: '#A855F7',
  },
  label: {
    fontSize: 12,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  labelActive: {
    color: '#FFF',
    fontWeight: '600',
  },
});
