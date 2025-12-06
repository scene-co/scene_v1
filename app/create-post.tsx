import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { uploadMultipleFiles } from '../services/storageService';
import { createPost } from '../services/forumService';

export const unstable_settings = {
  animation: 'slide_from_bottom',
};

type PostType = 'text' | 'image' | 'link';

export default function CreatePostScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('');
  const [postType, setPostType] = useState<PostType>('text');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Food',
    'Academics',
    'Music',
    'Career',
    'Lost & Found',
    'Sports',
    'Housing',
    'Events',
  ];

  const pickImages = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos to upload images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5, // Max 5 images
      });

      if (!result.canceled && result.assets.length > 0) {
        const uris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...uris].slice(0, 5)); // Keep max 5 images
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter content');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (postType === 'image' && selectedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image');
      return;
    }

    try {
      setUploading(true);

      let imageUrls: string[] = [];

      // Upload images if post type is image
      if (postType === 'image' && selectedImages.length > 0) {
        const result = await uploadMultipleFiles('post-images', selectedImages);

        if (!result.success || !result.urls) {
          Alert.alert('Upload Error', result.error || 'Failed to upload images');
          setUploading(false);
          return;
        }

        imageUrls = result.urls;
      }

      // Create the post in Supabase
      const postResult = await createPost({
        category,
        title,
        content,
        post_type: postType,
        image_url: imageUrls.length > 0 ? imageUrls[0] : undefined,
      });

      if (postResult.success) {
        Alert.alert(
          'Success',
          'Post created successfully!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', postResult.error || 'Failed to create post');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.postButton}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Post Type</Text>
          <View style={styles.postTypeSelector}>
            <TouchableOpacity
              style={[styles.typeButton, postType === 'text' && styles.typeButtonActive]}
              onPress={() => setPostType('text')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="document-text"
                size={20}
                color={postType === 'text' ? '#000' : '#999'}
              />
              <Text style={[styles.typeText, postType === 'text' && styles.typeTextActive]}>
                Text
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, postType === 'image' && styles.typeButtonActive]}
              onPress={() => setPostType('image')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="image"
                size={20}
                color={postType === 'image' ? '#000' : '#999'}
              />
              <Text style={[styles.typeText, postType === 'image' && styles.typeTextActive]}>
                Image
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, postType === 'link' && styles.typeButtonActive]}
              onPress={() => setPostType('link')}
              activeOpacity={0.7}
            >
              <Ionicons
                name="link"
                size={20}
                color={postType === 'link' ? '#000' : '#999'}
              />
              <Text style={[styles.typeText, postType === 'link' && styles.typeTextActive]}>
                Link
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Enter an interesting title..."
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Content *</Text>
          <TextInput
            style={styles.contentInput}
            placeholder="What would you like to discuss?"
            placeholderTextColor="#999"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </View>

        {postType === 'image' && (
          <View style={styles.section}>
            <Text style={styles.label}>Images (Max 5)</Text>

            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={pickImages}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={24} color="#00311F" />
              <Text style={styles.imagePickerText}>Select Images</Text>
            </TouchableOpacity>

            {selectedImages.length > 0 && (
              <View style={styles.imagePreviewContainer}>
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image
                      source={{ uri }}
                      style={styles.previewImage}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {postType === 'link' && (
          <View style={styles.section}>
            <Text style={styles.label}>URL</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="https://example.com"
              placeholderTextColor="#999"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerButton: {
    width: 60,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  postButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  postTypeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  typeButtonActive: {
    backgroundColor: '#E8E8E8',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  typeTextActive: {
    color: '#000',
  },
  categoryScroll: {
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  categoryButtonActive: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  titleInput: {
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  contentInput: {
    fontSize: 15,
    color: '#333',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 150,
  },
  placeholderSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#D3E1C4',
    borderRadius: 8,
    gap: 8,
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00311F',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 12,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
  },
});
