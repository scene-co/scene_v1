import { Text, View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { TopBar } from '../components/TopBar';
import { SearchBar } from '../components/SearchBar';
import { BottomTabBar } from '../components/BottomTabBar';
import { SectionHeader } from '../components/SectionHeader';
import { HorizontalCarousel } from '../components/HorizontalCarousel';
import { EventCard } from '../components/cards/EventCard';
import { MarketplaceCard } from '../components/cards/MarketplaceCard';
import { ForumCard } from '../components/cards/ForumCard';
import { mockEvents } from '../data/mockEvents';
import { mockMarketplaceItems } from '../data/mockMarketplace';
import { mockForumPosts } from '../data/mockForums';
import { useEffect, useState } from 'react';

export default function Home() {
  const { profile } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting('Good morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good afternoon');
    } else if (hour >= 17 && hour < 22) {
      setGreeting('Good evening');
    } else {
      setGreeting('Good night');
    }
  }, []);

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Sidebar menu coming soon!');
  };

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingText}>{greeting},</Text>
          <Text style={styles.nameText}>{profile?.first_name || 'User'}</Text>
        </View>

        <SearchBar />

        <View style={styles.section}>
          <SectionHeader title="Events" seeAllPath="/events" />
          <HorizontalCarousel>
            {mockEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </HorizontalCarousel>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Marketplace" seeAllPath="/marketplace" />
          <HorizontalCarousel>
            {mockMarketplaceItems.map((item) => (
              <MarketplaceCard key={item.id} item={item} />
            ))}
          </HorizontalCarousel>
        </View>

        <View style={styles.section}>
          <SectionHeader title="Forums" seeAllPath="/forums" />
          <HorizontalCarousel>
            {mockForumPosts.map((post) => (
              <ForumCard key={post.id} post={post} />
            ))}
          </HorizontalCarousel>
        </View>
      </ScrollView>

      <BottomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  greetingSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 38,
  },
  nameText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#666',
    lineHeight: 32,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
});
