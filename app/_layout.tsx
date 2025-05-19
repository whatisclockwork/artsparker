import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { AuthProvider } from '@/components/auth/AuthProvider';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-Bold': Inter_700Bold,
    'Playfair-Regular': PlayfairDisplay_400Regular,
    'Playfair-SemiBold': PlayfairDisplay_600SemiBold,
    'Playfair-Bold': PlayfairDisplay_700Bold,
    'PressStart2P': PressStart2P_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded or if there's an error
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Keep splash screen visible while fonts are loading
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ErrorBoundary>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="light" />
      </ErrorBoundary>
    </AuthProvider>
  );
}