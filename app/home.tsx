import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useFonts, Allura_400Regular } from '@expo-google-fonts/allura';

export default function Home() {
  const { user, profile, logout } = useAuth();

  const [fontsLoaded] = useFonts({
    Allura_400Regular,
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.tagline}>let's explore what's the scene</Text>

        {profile && (
          <View style={styles.profileInfo}>
            <Text style={styles.username}>@{profile.username}</Text>
            <Text style={styles.details}>
              {profile.age} • {profile.gender}
            </Text>
            {profile.college_name && (
              <Text style={styles.details}>{profile.college_name}</Text>
            )}
            <Text style={styles.details}>
              {profile.city}, {profile.state}
            </Text>
          </View>
        )}

        {user && (
          <Text style={styles.email}>{user.email}</Text>
        )}

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Main navigation and features coming soon...
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagline: {
    fontFamily: 'Allura_400Regular',
    fontSize: 32,
    color: '#007AFF',
    marginBottom: 32,
    textAlign: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    width: '100%',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  details: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  placeholder: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#E6F4FE',
    borderRadius: 12,
    width: '100%',
  },
  placeholderText: {
    fontSize: 14,
    color: '#007AFF',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
