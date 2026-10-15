import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout } from '../../src/design/tokens';
import { Platform, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function TabIcon({
  name,
  focused,
  color,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  color: string;
}) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconActive]}>
      <Ionicons name={name} size={20} color={focused ? colors.textDark : color} />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            bottom: bottom,
            height: layout.bottomNavHeight,
          },
        ],
        tabBarActiveTintColor: colors.textDark,
        tabBarInactiveTintColor: colors.textDarkMuted,
        tabBarItemStyle: styles.item,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="recipients"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="people" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: 'Recipients',
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="card" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: 'Cards',
        }}
      />
      <Tabs.Screen
        name="market"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="trending-up" focused={focused} color={color} />
          ),
          tabBarAccessibilityLabel: 'Market',
        }}
      />
      <Tabs.Screen name="activity" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    paddingHorizontal: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  item: {
    paddingVertical: 4,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActive: {
    backgroundColor: '#F0F0F3',
  },
});
