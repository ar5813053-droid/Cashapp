import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../design/tokens';

type Props = {
  onConfirm: () => void;
  label?: string;
};

const TRACK_WIDTH = 280;
const THUMB = 52;

export function SwipeToConfirm({ onConfirm, label = 'Swipe right to confirm' }: Props) {
  const x = useSharedValue(0);
  const confirmed = useSharedValue(false);

  const finish = () => {
    onConfirm();
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (confirmed.value) return;
      x.value = Math.max(0, Math.min(e.translationX, TRACK_WIDTH - THUMB - 8));
    })
    .onEnd(() => {
      if (confirmed.value) return;
      if (x.value > TRACK_WIDTH * 0.65) {
        x.value = withSpring(TRACK_WIDTH - THUMB - 8);
        confirmed.value = true;
        runOnJS(finish)();
      } else {
        x.value = withSpring(0);
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: x.value + THUMB / 2,
    opacity: interpolate(x.value, [0, TRACK_WIDTH * 0.5], [0.2, 0.6], Extrapolation.CLAMP),
  }));

  return (
    <View style={styles.wrap} accessibilityRole="button" accessibilityLabel={label}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
        <Text style={styles.label}>{label}</Text>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <Ionicons name="chevron-forward" size={22} color={colors.textDark} />
          </Animated.View>
        </GestureDetector>
      </View>
      <Text style={styles.alt} onPress={onConfirm} accessibilityRole="button">
        Or tap here to confirm
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: spacing.md },
  track: {
    width: TRACK_WIDTH,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.bgSheetMuted,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.success,
    borderRadius: 28,
  },
  label: {
    ...typography.caption,
    color: colors.textDarkMuted,
    textAlign: 'center',
    zIndex: 1,
  },
  thumb: {
    position: 'absolute',
    left: 4,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  alt: {
    ...typography.caption,
    color: colors.textDarkMuted,
    textDecorationLine: 'underline',
  },
});
