# Supabase Integration Guide

This guide shows you how to integrate the Supabase backend with your existing Scene app components.

## Prerequisites

Before starting, make sure you have:
1. ✅ Run all migrations in Supabase dashboard
2. ✅ Created storage buckets and policies
3. ✅ Updated `.env` file with Supabase credentials

## Step 1: Update Supabase Client Configuration

Update your Supabase client to use the new database types:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

## Step 2: Integrate Forums

### Update Create Post Page

Update `app/create-post.tsx` to use the forum service:

```typescript
import { createPost, uploadFile } from '../services/forumService';
import { uploadFile as uploadImage } from '../services/storageService';

export default function CreatePostScreen() {
  const [category, setCategory] = useState('Academics');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'image' | 'link'>('text');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [flairText, setFlairText] = useState('');
  const [flairColor, setFlairColor] = useState('#34C759');
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      let imageUrl: string | undefined;

      // Upload image if post type is image
      if (postType === 'image' && selectedImage) {
        const { url, error } = await uploadImage('post-images', selectedImage);
        if (error) {
          Alert.alert('Error', 'Failed to upload image');
          setLoading(false);
          return;
        }
        imageUrl = url;
      }

      // Create the post
      const result = await createPost({
        category,
        title,
        content,
        post_type: postType,
        image_url: imageUrl,
        flair_text: flairText || undefined,
        flair_color: flairColor || undefined,
      });

      if (result.success) {
        Alert.alert('Success', 'Post created successfully!');
        router.back();
      } else {
        Alert.alert('Error', result.error || 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Your existing UI */}
      <Button
        title={loading ? 'Creating...' : 'Create Post'}
        onPress={handleCreatePost}
        disabled={loading}
      />
    </View>
  );
}
```

### Update Forums Page to Use Real Data

Update `app/forums.tsx` to fetch real posts:

```typescript
import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native';
import { getPosts, voteOnPost, getUserVote } from '../services/forumService';
import { ForumPost } from '../types/database.types';

export default function ForumsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('popular');
  const [activeSort, setActiveSort] = useState<SortType>('hot');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let fetchedPosts: ForumPost[] = [];

      if (activeTab === 'popular') {
        const { posts: popularPosts } = await getPosts(undefined, 20, 0, {
          minScore: 200,
        });
        fetchedPosts = popularPosts;
      } else if (activeTab === 'following') {
        const { posts: followingPosts } = await getPosts(undefined, 20, 0, {
          onlyJoined: true,
        });
        fetchedPosts = followingPosts;
      } else {
        // Explore - get all posts
        const { posts: allPosts } = await getPosts(undefined, 20, 0);
        fetchedPosts = allPosts;
      }

      setPosts(fetchedPosts);
    } catch (error) {
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    const result = await voteOnPost(postId, voteType);
    if (result.success) {
      // Refresh posts to get updated vote counts
      fetchPosts();
    }
  };

  return (
    <View style={styles.container}>
      <TopBar onMenuPress={handleMenuPress} />
      <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'explore' && (
        <SortFilter activeSort={activeSort} onSortChange={setActiveSort} />
      )}

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <RedditStyleForumCard
            post={item}
            onVote={handleVote}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <FloatingActionButton />
      <BottomTabBar />
    </View>
  );
}
```

### Update RedditStyleForumCard for Voting

Update `components/cards/RedditStyleForumCard.tsx`:

```typescript
interface RedditStyleForumCardProps {
  post: ForumPost;
  onVote?: (postId: string, voteType: 'up' | 'down') => void;
}

export function RedditStyleForumCard({ post, onVote }: RedditStyleForumCardProps) {
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    // Get user's current vote
    getUserVote(post.id).then((vote) => {
      setUserVote(vote);
    });
  }, [post.id]);

  const handleUpvote = () => {
    setUserVote(userVote === 'up' ? null : 'up');
    onVote?.(post.id, 'up');
  };

  const handleDownvote = () => {
    setUserVote(userVote === 'down' ? null : 'down');
    onVote?.(post.id, 'down');
  };

  return (
    <View style={styles.card}>
      {/* Voting */}
      <View style={styles.voting}>
        <TouchableOpacity onPress={handleUpvote}>
          <Ionicons
            name={userVote === 'up' ? 'arrow-up' : 'arrow-up-outline'}
            size={20}
            color={userVote === 'up' ? '#FF4500' : '#999'}
          />
        </TouchableOpacity>

        <Text style={styles.score}>{post.score}</Text>

        <TouchableOpacity onPress={handleDownvote}>
          <Ionicons
            name={userVote === 'down' ? 'arrow-down' : 'arrow-down-outline'}
            size={20}
            color={userVote === 'down' ? '#7193FF' : '#999'}
          />
        </TouchableOpacity>
      </View>

      {/* Rest of your card UI */}
    </View>
  );
}
```

## Step 3: Integrate Marketplace

Update `app/marketplace.tsx` to use real listings:

```typescript
import { getListings, searchListings } from '../services/marketplaceService';
import { MarketplaceListing } from '../types/database.types';

export default function MarketplaceScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const results = await searchListings(searchQuery, selectedCategory);
        setListings(results);
      } else {
        const { listings: fetchedListings } = await getListings(
          selectedCategory,
          'active',
          20,
          0
        );
        setListings(fetchedListings);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery]);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search marketplace..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Category filters */}
      <ScrollView horizontal>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setSelectedCategory(category.id)}
          >
            {/* Category UI */}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Listings grid */}
      <View style={styles.grid}>
        {listings.map((item) => (
          <View key={item.id} style={styles.gridItem}>
            <MarketplaceCard item={item} />
          </View>
        ))}
      </View>
    </View>
  );
}
```

## Step 4: Integrate Messaging

### Create Messages List Page

Update or create `app/messages.tsx`:

```typescript
import { getConversations, subscribeToMessages } from '../services/messageService';
import { Conversation } from '../types/database.types';

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const convos = await getConversations();
    setConversations(convos);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => router.push(`/chat/${item.id}`)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
```

### Create Chat Page

Create `app/chat/[id].tsx`:

```typescript
import { useLocalSearchParams } from 'expo-router';
import { getMessages, sendMessage, subscribeToMessages } from '../services/messageService';
import { Message } from '../types/database.types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    loadMessages();

    // Subscribe to real-time updates
    const subscription = subscribeToMessages(id, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  const loadMessages = async () => {
    const msgs = await getMessages(id);
    setMessages(msgs);
  };

  const handleSend = async () => {
    if (!messageText.trim()) return;

    const result = await sendMessage(id, messageText);
    if (result.success) {
      setMessageText('');
      // Message will be added via real-time subscription
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageBubble message={item} />}
        keyExtractor={(item) => item.id}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={handleSend}>
          <Ionicons name="send" size={24} color="#00311F" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
```

## Step 5: Image Upload Integration

When uploading images (profile pictures, post images, marketplace photos):

```typescript
import { uploadFile, uploadMultipleFiles } from '../services/storageService';
import * as ImagePicker from 'expo-image-picker';

// Single image upload
const handleImageUpload = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets[0]) {
    const { url, error } = await uploadFile(
      'post-images',
      result.assets[0].uri
    );

    if (url) {
      console.log('Image uploaded:', url);
      // Use the URL in your post/listing/profile
    }
  }
};

// Multiple images upload (for marketplace)
const handleMultipleImages = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
  });

  if (!result.canceled && result.assets.length > 0) {
    const uris = result.assets.map((asset) => asset.uri);
    const { urls, errors } = await uploadMultipleFiles('marketplace-images', uris);

    console.log('Uploaded images:', urls);
  }
};
```

## Testing Checklist

Before deploying, test these features:

### Forums
- [ ] Create a text post
- [ ] Create a post with an image
- [ ] Upvote and downvote posts
- [ ] Comment on posts
- [ ] Join a community
- [ ] Filter by Popular/Explore/Following
- [ ] Sort by Hot/New/Top/Rising

### Marketplace
- [ ] Create a listing with images
- [ ] Search for listings
- [ ] Filter by category
- [ ] Mark listing as sold
- [ ] Delete listing

### Messaging
- [ ] Start a direct conversation
- [ ] Send a text message
- [ ] Send an image
- [ ] Real-time message updates
- [ ] Create a group chat

## Troubleshooting

### Issue: "Row violates row-level security policy"
**Solution**: Make sure RLS policies are created and user is authenticated

### Issue: Images not uploading
**Solution**: Check storage bucket policies and ensure bucket is public

### Issue: Real-time not working
**Solution**: Enable replication for tables in Database > Replication

### Issue: Vote count not updating
**Solution**: Verify triggers are created from migration 004

## Next Steps

1. Replace all mock data with real Supabase data
2. Add error handling and loading states
3. Implement pagination for large lists
4. Add image caching for better performance
5. Set up push notifications for new messages
6. Add analytics tracking

## Support

- Supabase Docs: https://supabase.com/docs
- Scene GitHub: https://github.com/scene-co/scene_v1
