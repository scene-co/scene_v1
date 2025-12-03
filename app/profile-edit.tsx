/**
 * Edit Profile Screen (Modal)
 * Allows users to edit their profile information
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileEditScreen() {
  const { profile, updateProfile, validateUsernameChange } = useAuth();
  const insets = useSafeAreaInsets();

  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [username, setUsername] = useState(profile?.username || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [profilePicUri, setProfilePicUri] = useState(profile?.profile_picture_url);
  const [bannerUri, setBannerUri] = useState(profile?.banner_image_url);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const bioCharCount = bio?.length || 0;
  const bioMaxLength = 190;

  const handleBioChange = (text: string) => {
    if (text.length <= bioMaxLength) {
      setBio(text);
    }
  };

  const selectProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permission');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setProfilePicUri(result.assets[0].uri);
      // TODO: Upload to Supabase Storage when implemented
    }
  };

  const selectBanner = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permission');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setBannerUri(result.assets[0].uri);
      // TODO: Upload to Supabase Storage when implemented
    }
  };

  const handleUsernameBlur = async () => {
    if (username === profile?.username) {
      setUsernameError(null);
      return;
    }

    const validation = await validateUsernameChange(username);
    if (!validation.canChange) {
      setUsernameError(validation.reason || 'Invalid username');
    } else {
      setUsernameError(null);
    }
  };

  const handleSave = async () => {
    if (usernameError) {
      Alert.alert('Error', usernameError);
      return;
    }

    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return;
    }

    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        first_name: firstName.trim(),
        username: username.trim(),
        bio: bio.trim() || null,
        // TODO: Add image URLs when upload is implemented
      });

      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderBanner = () => {
    if (bannerUri) {
      return (
        <Image source={{ uri: bannerUri }} style={styles.bannerImage} resizeMode="cover" />
      );
    }

    return (
      <LinearGradient
        colors={['#D3E1C4', '#A8C5A1', '#7FA87E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerImage}
      />
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#00311F" />
          ) : (
            <Text style={styles.saveButton}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner Upload */}
        <TouchableOpacity style={styles.bannerContainer} onPress={selectBanner}>
          {renderBanner()}
          <View style={styles.uploadOverlay}>
            <Ionicons name="camera" size={32} color="#FFF" />
            <Text style={styles.uploadText}>Change Banner</Text>
          </View>
        </TouchableOpacity>

        {/* Profile Picture Upload */}
        <View style={styles.profilePicContainer}>
          <TouchableOpacity onPress={selectProfilePicture}>
            {profilePicUri ? (
              <Image source={{ uri: profilePicUri }} style={styles.profilePic} />
            ) : (
              <View style={styles.profilePicPlaceholder}>
                <Ionicons name="person" size={40} color="#999" />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Display Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your name"
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[styles.input, usernameError && styles.inputError]}
              value={username}
              onChangeText={setUsername}
              onBlur={handleUsernameBlur}
              placeholder="Enter username"
              maxLength={20}
              autoCapitalize="none"
            />
            {usernameError && <Text style={styles.errorText}>{usernameError}</Text>}
            <Text style={styles.helperText}>Max 2 changes per day, 24-hour cooldown</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>About Me</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={handleBioChange}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              maxLength={bioMaxLength}
            />
            <Text style={styles.charCount}>
              {bioCharCount}/{bioMaxLength}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7E6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 49, 31, 0.2)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#00311F',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00311F',
  },
  content: {
    flex: 1,
  },
  bannerContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 24,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF7E6',
    backgroundColor: '#F5F5F5',
  },
  profilePicPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFF7E6',
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D3E1C4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFF7E6',
  },
  form: {
    paddingHorizontal: 16,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#F5F5F5',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});
