import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            animationDuration: 200,
          }}
        />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
