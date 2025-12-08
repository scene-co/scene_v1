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
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { uploadMultipleFiles } from '../services/storageService';
import { createEvent } from '../services/eventsService';
import DateTimePicker from '@react-native-community/datetimepicker';

export const unstable_settings = {
  animation: 'slide_from_bottom',
};

type CategoryType = 'sports' | 'academic' | 'social' | 'cultural' | 'technical' | 'other';

const categoryOptions = [
  { value: 'sports' as CategoryType, label: 'Sports', icon: 'basketball' as const, color: '#EF4444' },
  { value: 'academic' as CategoryType, label: 'Academic', icon: 'book' as const, color: '#3B82F6' },
  { value: 'social' as CategoryType, label: 'Social', icon: 'people' as const, color: '#10B981' },
  { value: 'cultural' as CategoryType, label: 'Cultural', icon: 'color-palette' as const, color: '#F59E0B' },
  { value: 'technical' as CategoryType, label: 'Technical', icon: 'code-slash' as const, color: '#8B5CF6' },
  { value: 'other' as CategoryType, label: 'Other', icon: 'ellipsis-horizontal' as const, color: '#6B7280' },
];

export default function CreateEventScreen() {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<CategoryType>('social');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

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

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date): string => {
    return date.toTimeString().split(' ')[0].substring(0, 5);
  };

  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDisplayTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Missing Information', 'Please enter a title for your event');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Missing Information', 'Please enter a location');
      return;
    }

    // Check if event date is in the future
    const now = new Date();
    if (eventDate < now) {
      Alert.alert('Invalid Date', 'Event date must be in the future');
      return;
    }

    try {
      setUploading(true);

      let imageUrls: string[] = [];

      // Upload images if any selected
      if (selectedImages.length > 0) {
        const result = await uploadMultipleFiles('event-images', selectedImages);

        if (!result.success || !result.urls) {
          Alert.alert('Upload Error', result.error || 'Failed to upload images');
          setUploading(false);
          return;
        }

        imageUrls = result.urls;
      }

      // Create the event in Supabase
      const eventResult = await createEvent({
        title: title.trim(),
        description: description.trim(),
        event_date: formatDate(eventDate),
        event_time: formatTime(eventTime),
        location: location.trim(),
        category,
        max_participants: maxParticipants ? parseInt(maxParticipants) : undefined,
        images: imageUrls,
      });

      if (eventResult.success) {
        Alert.alert(
          'Success!',
          'Your event has been created successfully',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      } else {
        Alert.alert('Error', eventResult.error || 'Failed to create event');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create event');
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
        <Text style={styles.headerTitle}>Create Event</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#FFC107" />
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
            Event Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Weekend Football Match"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          <Text style={styles.charCount}>{title.length}/100</Text>
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.categoryGrid}>
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.categoryButton,
                  category === option.value && styles.categoryButtonActive,
                  category === option.value && { borderColor: option.color },
                ]}
                onPress={() => setCategory(option.value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={option.icon}
                  size={20}
                  color={category === option.value ? option.color : '#999'}
                />
                <Text
                  style={[
                    styles.categoryText,
                    category === option.value && { color: option.color },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date & Time Pickers */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Date & Time <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.dateTimeContainer}>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={20} color="#FFC107" />
              <Text style={styles.dateTimeText}>{formatDisplayDate(eventDate)}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="time-outline" size={20} color="#FFC107" />
              <Text style={styles.dateTimeText}>{formatDisplayTime(eventTime)}</Text>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={eventDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setEventDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={eventTime}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedTime) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedTime) {
                  setEventTime(selectedTime);
                }
              }}
            />
          )}
        </View>

        {/* Location Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Location <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., College Football Ground"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
            maxLength={100}
          />
        </View>

        {/* Max Participants Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Max Participants (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 20"
            placeholderTextColor="#999"
            value={maxParticipants}
            onChangeText={setMaxParticipants}
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>Leave empty for unlimited participants</Text>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Description <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Describe your event, what participants should bring, skill level required, etc..."
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
          <Text style={styles.hint}>Add up to 5 photos to showcase your event</Text>

          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImages}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={24} color="#FFC107" />
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
            <Text style={styles.tipTitle}>Tips for a great event</Text>
          </View>
          <Text style={styles.tipText}>• Choose a clear, descriptive title</Text>
          <Text style={styles.tipText}>• Be specific about location and time</Text>
          <Text style={styles.tipText}>• Mention any requirements or prerequisites</Text>
          <Text style={styles.tipText}>• Add photos to attract more participants</Text>
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
    color: '#FFC107',
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flex: 1,
    minWidth: '30%',
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
  categoryButtonActive: {
    backgroundColor: '#FFF',
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
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
    marginTop: 6,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 12,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#FFC107',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFC107',
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
    backgroundColor: '#FFC107',
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
