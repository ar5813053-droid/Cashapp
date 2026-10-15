import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Platform, LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, layout } from '../design/tokens';

const TABS = [
  { name: 'recipients', icon: 'people' as const },
  { name: 'index', icon: 'home' as const },
  { name: 'cards', icon: 'card' as const },
  { name: 'market', icon: 'trending-up' as const },
];

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [slotW, setSlotW] = useState(64);
  const activeIndex = (() => {
    const name = state.routes[state.index]?.name;
    const i = TABS.findIndex((t) => t.name === name);
    return i >= 0 ? i : 1;
  })();
  const indicatorX = useSharedValue(activeIndex * 64 + 6);

  useEffect(() => {
    indicatorX.value = withSpring(activeIndex * slotW + (slotW - 48) / 2, {
      damping: 16,
      stiffness: 200,
      mass: 0.65,
    });
  }, [activeIndex, slotW, indicatorX]);

  const onBarLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width - 20; // padding
    setSlotW(w / TABS.length);
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      <View style={styles.bar} onLayout={onBarLayout}>
        <Animated.View style={[styles.indicator, animStyle]} />
        {TABS.map((tab, i) => {
          const focused = activeIndex === i;
          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              onPress={() => {
                const route = state.routes.find((r) => r.name === tab.name);
                if (!route) return;
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(tab.name);
                }
              }}
              style={[styles.item, { width: slotW || 64 }]}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={focused ? colors.textDark : 'rgba(255,255,255,0.5)'}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navDark,
    borderRadius: 32,
    height: layout.bottomNavHeight,
    paddingHorizontal: 10,
    minWidth: 268,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: { elevation: 16 },
    }),
  },
  indicator: {
    position: 'absolute',
    left: 0,
    width: 48,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  item: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
