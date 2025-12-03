import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EventSearchBarProps {
  placeholder?: string;
  onChangeText?: (text: string) => void;
}

export function EventSearchBar({ placeholder = 'Search for events', onChangeText }: EventSearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#A1A1AA" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#71717A"
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 27, 61, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3D2B4D',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFF',
    fontWeight: '400',
  },
});
