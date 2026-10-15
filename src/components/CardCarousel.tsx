import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Dimensions, AccessibilityInfo } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import type { VirtualCard } from '../types';
import { VirtualCardView } from './VirtualCard';
import { colors, spacing, layout } from '../design/tokens';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = Math.min(SCREEN_W - layout.screenPadding * 2, 340);
const CARD_H = 172;
const SIDE_PEEK = 28;

type Props = {
  cards: VirtualCard[];
  onIndexChange?: (index: number) => void;
  onToggleFreeze?: (id: string) => void;
};

export function CardCarousel({ cards, onIndexChange, onToggleFreeze }: Props) {
  const count = cards.length;
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      // @ts-expect-error RN subscription shape varies
      sub?.remove?.();
    };
  }, []);

  const notify = useCallback(
    (i: number) => {
      setIndex(i);
      onIndexChange?.(i);
    },
    [onIndexChange]
  );

  const springConfig = useMemo(
    () =>
      reduceMotion
        ? { damping: 30, stiffness: 400, mass: 0.4 }
        : { damping: 18, stiffness: 160, mass: 0.8 },
    [reduceMotion]
  );

  const pan = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-16, 16])
    .onBegin(() => {
      startX.value = translateX.value;
    })
    .onUpdate((e) => {
      if (count <= 1) return;
      const min = -(count - 1) * CARD_W;
      const max = 0;
      const next = startX.value + e.translationX;
      translateX.value = Math.min(max + 40, Math.max(min - 40, next));
    })
    .onEnd((e) => {
      if (count <= 1) {
        translateX.value = withSpring(0, springConfig);
        return;
      }
      const velocity = e.velocityX;
      let next = Math.round(-translateX.value / CARD_W);
      if (velocity < -600) next += 1;
      else if (velocity > 600) next -= 1;
      next = Math.max(0, Math.min(count - 1, next));
      translateX.value = withSpring(-next * CARD_W, springConfig);
      runOnJS(notify)(next);
    });

  // Keep shared value in sync if cards length changes
  useEffect(() => {
    if (index > count - 1) {
      const i = Math.max(0, count - 1);
      translateX.value = -i * CARD_W;
      notify(i);
    }
  }, [count, index, notify, translateX]);

  if (count === 0) {
    return <View style={styles.empty} />;
  }

  return (
    <View style={styles.wrap}>
      <GestureDetector gesture={pan}>
        <View style={styles.stage}>
          {cards.map((card, i) => (
            <CarouselCard
              key={card.id}
              card={card}
              index={i}
              translateX={translateX}
              reduceMotion={reduceMotion}
              onToggleFreeze={onToggleFreeze}
            />
          ))}
        </View>
      </GestureDetector>

      {count > 1 && (
        <View style={styles.dots} accessibilityRole="tablist">
          {cards.map((c, i) => (
            <View
              key={c.id}
              style={[styles.dot, i === index && styles.dotActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: i === index }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function CarouselCard({
  card,
  index,
  translateX,
  reduceMotion,
  onToggleFreeze,
}: {
  card: VirtualCard;
  index: number;
  translateX: SharedValue<number>;
  reduceMotion: boolean;
  onToggleFreeze?: (id: string) => void;
}) {
  const style = useAnimatedStyle(() => {
    const center = -index * CARD_W;
    const dist = translateX.value - center;
    const progress = dist / CARD_W;

    const scale = reduceMotion
      ? 1
      : interpolate(Math.abs(progress), [0, 1], [1, 0.9], Extrapolation.CLAMP);
    const rotate = reduceMotion
      ? '0deg'
      : `${interpolate(progress, [-1, 0, 1], [6, 0, -6], Extrapolation.CLAMP)}deg`;
    const opacity = interpolate(Math.abs(progress), [0, 1, 1.5], [1, 0.55, 0.25], Extrapolation.CLAMP);
    const translateY = reduceMotion
      ? 0
      : interpolate(Math.abs(progress), [0, 1], [0, 10], Extrapolation.CLAMP);

    return {
      transform: [
        { translateX: translateX.value + index * CARD_W },
        { translateY },
        { scale },
        { rotateZ: rotate },
      ],
      opacity,
      zIndex: Math.round(100 - Math.abs(progress) * 10),
    };
  });

  return (
    <Animated.View style={[styles.cardSlot, style]}>
      <VirtualCardView
        card={card}
        width={CARD_W}
        height={CARD_H}
        showActions
        onToggleFreeze={() => onToggleFreeze?.(card.id)}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.xl,
  },
  stage: {
    height: CARD_H + 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSlot: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.lg,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: colors.textPrimary,
    width: 18,
    borderRadius: 4,
  },
  empty: {
    height: CARD_H,
  },
});
