import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, { createContext, useState } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const MapContext = createContext<{
  targetLocation: { lat: number; lng: number } | null;
  centerOnLocation: (lat: number, lng: number) => void;
  resetTargetLocation: () => void;
}>({
  targetLocation: null,
  centerOnLocation: () => {},
  resetTargetLocation: () => {},
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number } | null>(null);

  const centerOnLocation = (lat: number, lng: number) => {
    setTargetLocation({ lat, lng });
  };

  const resetTargetLocation = () => {
    setTargetLocation(null);
  };

  return (
    <MapContext.Provider value={{ targetLocation, centerOnLocation, resetTargetLocation }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </MapContext.Provider>
  );
}
