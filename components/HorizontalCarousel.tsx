import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface HorizontalCarouselProps {
  children: React.ReactNode;
}

export function HorizontalCarousel({ children }: HorizontalCarouselProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}
      decelerationRate="fast"
      snapToInterval={296}
      snapToAlignment="start"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 24,
  },
  contentContainer: {
    paddingRight: 24,
    gap: 16,
  },
});
