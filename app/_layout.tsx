import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { PaymentProvider } from '../src/context/PaymentContext';
import { AppStoreProvider } from '../src/store/AppStore';
import { colors } from '../src/design/tokens';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AppStoreProvider>
        <PaymentProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'fade_from_bottom',
              animationDuration: 280,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="activity" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="trade/[id]" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="payments/request" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="cards/edit" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen
              name="payments/amount"
              options={{
                presentation: 'transparentModal',
                animation: 'slide_from_bottom',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            />
            <Stack.Screen
              name="payments/confirm"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                contentStyle: { backgroundColor: colors.bgSheet },
              }}
            />
            <Stack.Screen
              name="payments/success"
              options={{ presentation: 'fullScreenModal', animation: 'fade' }}
            />
          </Stack>
        </PaymentProvider>
      </AppStoreProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
