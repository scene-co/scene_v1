import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface SearchBarProps {
  placeholder?: string;
}

export function SearchBar({ placeholder = 'Search marketplace, events, users...' }: SearchBarProps) {
  const handlePress = () => {
    router.push('/search');
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={styles.container}
    >
      <Ionicons name="search" size={20} color="#999" style={styles.icon} />
      <View style={styles.inputPlaceholder}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          editable={false}
          pointerEvents="none"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
  },
  icon: {
    marginRight: 8,
  },
  inputPlaceholder: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
});
