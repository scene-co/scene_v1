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
import { createListing } from '../services/marketplaceService';

export const unstable_settings = {
  animation: 'slide_from_bottom',
};

type ConditionType = 'New' | 'Like New' | 'Good' | 'Fair';

const conditionOptions = [
  { value: 'New' as ConditionType, label: 'New', icon: 'sparkles' as const, color: '#10B981' },
  { value: 'Like New' as ConditionType, label: 'Like New', icon: 'star' as const, color: '#3B82F6' },
  { value: 'Good' as ConditionType, label: 'Good', icon: 'thumbs-up' as const, color: '#F59E0B' },
  { value: 'Fair' as ConditionType, label: 'Fair', icon: 'checkmark' as const, color: '#6B7280' },
];

export default function CreateListingScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>('');
  const [condition, setCondition] = useState<ConditionType>('Good');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const categories = ['Textbooks', 'Furniture', 'Electronics', 'Accessories'];

  const pickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photos to upload images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uris = result.assets.map((asset) => asset.uri);
        setSelectedImages((prev) => [...prev, ...uris].slice(0, 5));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your listing');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description');
      return;
    }
    if (!price.trim() || isNaN(parseFloat(price))) {
      Alert.alert('Invalid Price', 'Please enter a valid price');
      return;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category');
      return;
    }

    try {
      setUploading(true);

      let imageUrls: string[] = [];

      // Upload images if any selected
      if (selectedImages.length > 0) {
        const result = await uploadMultipleFiles('marketplace-images', selectedImages);

        if (!result.success || !result.urls) {
          Alert.alert('Upload Error', result.error || 'Failed to upload images');
          setUploading(false);
          return;
        }

        imageUrls = result.urls;
      }

      // Create the listing in Supabase
      const listingResult = await createListing({
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        condition,
        category,
        images: imageUrls,
      });

      if (listingResult.success) {
        Alert.alert(
          'Success!',
          'Your listing has been created successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', listingResult.error || 'Failed to create listing');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create listing');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Listing</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#00311F" />
          ) : (
            <Text style={styles.postButton}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Introduction to Computer Science Textbook"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* Price Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Price <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Condition Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Condition <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.conditionGrid}>
            {conditionOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.conditionButton,
                  condition === option.value && styles.conditionButtonActive,
                  condition === option.value && { borderColor: option.color },
                ]}
                onPress={() => setCondition(option.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={condition === option.value ? option.color : '#999'}
                />
                <Text
                  style={[
                    styles.conditionText,
                    condition === option.value && { color: option.color },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryGrid}>
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
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your item's features, condition, and any other relevant details..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Photos (Optional)</Text>
          <Text style={styles.hint}>Add up to 5 photos to showcase your item</Text>

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImages}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={24} color="#00311F" />
            <Text style={styles.imagePickerText}>
              {selectedImages.length > 0 ? 'Add More Photos' : 'Add Photos'}
            </Text>
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
                    <Ionicons name="close-circle" size={28} color="#FF3B30" />
                  </TouchableOpacity>
                  {index === 0 && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryBadgeText}>Primary</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb-outline" size={20} color="#F59E0B" />
            <Text style={styles.tipTitle}>Tips for a great listing</Text>
          </View>
          <Text style={styles.tipText}>• Use clear, well-lit photos</Text>
          <Text style={styles.tipText}>• Be honest about the condition</Text>
          <Text style={styles.tipText}>• Price competitively</Text>
          <Text style={styles.tipText}>• Include all relevant details</Text>
        </View>
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
    fontWeight: '700',
    color: '#333',
  },
  postButton: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00311F',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    fontSize: 16,
    color: '#333',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    textAlign: 'right',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 14,
  },
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  conditionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  conditionButtonActive: {
    backgroundColor: '#FFF',
    borderWidth: 2,
  },
  conditionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: '#00311F',
    borderColor: '#00311F',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  descriptionInput: {
    fontSize: 15,
    color: '#333',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 140,
    backgroundColor: '#FAFAFA',
  },
  hint: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#D3E1C4',
    borderRadius: 12,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#00311F',
    borderStyle: 'dashed',
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
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#00311F',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
  tipsSection: {
    margin: 20,
    padding: 16,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400E',
  },
  tipText: {
    fontSize: 13,
    color: '#78350F',
    marginBottom: 6,
    lineHeight: 18,
  },
});
