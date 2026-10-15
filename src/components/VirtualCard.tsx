import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { VirtualCard as CardType } from '../types';
import { radii, spacing, typography, layout, shadows } from '../design/tokens';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  card: CardType;
  width?: number;
  height?: number;
  onPress?: () => void;
  showActions?: boolean;
  onToggleFreeze?: () => void;
};

export function VirtualCardView({
  card,
  width = layout.cardWidth,
  height = layout.cardHeight,
  onPress,
  showActions = false,
  onToggleFreeze,
}: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      style={[
        styles.card,
        { backgroundColor: card.color, width, height },
        animStyle,
      ]}
    >
      <View style={styles.row}>
        <Text style={[styles.label, { color: card.textColor }]}>{card.label}</Text>
        <Text style={[styles.last4, { color: card.textColor }]}>··· {card.last4}</Text>
      </View>

      {showActions && (
        <View style={styles.actions}>
          <View style={styles.actionBtn}>
            <Ionicons name="snow-outline" size={16} color={card.textColor} />
          </View>
          <View style={styles.actionBtn}>
            <Ionicons name="keypad-outline" size={16} color={card.textColor} />
          </View>
          <View style={styles.actionBtn}>
            <Ionicons name="settings-outline" size={16} color={card.textColor} />
          </View>
          <Pressable
            onPress={onToggleFreeze}
            style={[styles.toggle, card.frozen && styles.toggleOn]}
            hitSlop={8}
          >
            <View style={[styles.toggleKnob, card.frozen && styles.toggleKnobOn]} />
          </Pressable>
        </View>
      )}

      <View style={styles.watermark}>
        <View style={[styles.circle, { borderColor: card.textColor + '33' }]} />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.card,
    padding: spacing.xl,
    justifyContent: 'space-between',
    overflow: 'hidden',
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  label: {
    ...typography.body,
    fontWeight: '600',
  },
  last4: {
    ...typography.caption,
    fontWeight: '600',
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 'auto' as unknown as number,
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: {
    marginLeft: 'auto',
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 2,
    justifyContent: 'center',
  },
  toggleOn: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
  toggleKnobOn: {
    alignSelf: 'flex-end',
  },
  watermark: {
    position: 'absolute',
    right: -20,
    bottom: -30,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 24,
    opacity: 0.15,
  },
});
