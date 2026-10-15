import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, layout } from '../design/tokens';

export const TAB_ORDER = ['recipients', 'index', 'cards', 'market'] as const;

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  recipients: 'people',
  index: 'home',
  cards: 'card',
  market: 'trending-up',
};

const INDICATOR_W = 40;
const INDICATOR_H = 28;

type Props = MaterialTopTabBarProps;

export function FloatingTabBar({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [barW, setBarW] = useState(280);
  const routeName = state.routes[state.index]?.name ?? 'index';
  const activeIndex = Math.max(
    0,
    TAB_ORDER.indexOf(routeName as (typeof TAB_ORDER)[number])
  );
  const slotW = (barW - 16) / TAB_ORDER.length;
  const indicatorX = useSharedValue(0);

  useEffect(() => {
    const target = 8 + activeIndex * slotW + (slotW - INDICATOR_W) / 2;
    indicatorX.value = withSpring(target, {
      damping: 18,
      stiffness: 220,
      mass: 0.6,
    });
  }, [activeIndex, slotW, indicatorX]);

  const onBarLayout = (e: LayoutChangeEvent) => {
    setBarW(e.nativeEvent.layout.width);
  };

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.bar} onLayout={onBarLayout}>
        <Animated.View style={[styles.indicator, animStyle]} />
        {TAB_ORDER.map((name) => {
          const focused = routeName === name;
          const route = state.routes.find((r) => r.name === name);
          return (
            <Pressable
              key={name}
              accessibilityRole="button"
              accessibilityState={{ selected: focused }}
              style={[styles.item, { width: slotW || 64 }]}
              onPress={() => {
                if (!route) return;
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(name);
                }
              }}
            >
              <Ionicons
                name={ICONS[name]}
                size={18}
                color={focused ? colors.textDark : 'rgba(255,255,255,0.45)'}
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
    zIndex: 50,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.navDark,
    borderRadius: 28,
    height: 52,
    paddingHorizontal: 8,
    minWidth: 260,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.35,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: { elevation: 14 },
    }),
  },
  indicator: {
    position: 'absolute',
    left: 0,
    top: (52 - INDICATOR_H) / 2,
    width: INDICATOR_W,
    height: INDICATOR_H,
    borderRadius: INDICATOR_H / 2,
    backgroundColor: '#FFFFFF',
  },
  item: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
