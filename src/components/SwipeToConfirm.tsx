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
import { colors, spacing, typography } from '../design/tokens';
import { heavyTap } from '../utils/feedback';

type Props = {
  onConfirm: () => void;
  label?: string;
  disabled?: boolean;
};

const TRACK_WIDTH = 300;
const THUMB = 56;

export function SwipeToConfirm({
  onConfirm,
  label = 'Swipe right to confirm',
  disabled = false,
}: Props) {
  const x = useSharedValue(0);
  const confirmed = useSharedValue(false);

  const finish = () => {
    heavyTap();
    onConfirm();
  };

  const pan = Gesture.Pan()
    .enabled(!disabled)
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
    width: x.value + THUMB,
    opacity: interpolate(x.value, [0, TRACK_WIDTH * 0.5], [0.2, 0.45], Extrapolation.CLAMP),
  }));

  return (
    <View style={[styles.wrap, disabled && styles.disabled]}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyle]} />
        <Text style={styles.label}>{label}</Text>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <View style={styles.thumbInner} />
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.md },
  disabled: { opacity: 0.4 },
  track: {
    width: TRACK_WIDTH,
    height: THUMB + 10,
    borderRadius: (THUMB + 10) / 2,
    backgroundColor: '#ECECF0',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.accentGreen,
    borderRadius: (THUMB + 10) / 2,
  },
  label: {
    ...typography.caption,
    color: colors.textDarkMuted,
    textAlign: 'center',
  },
  thumb: {
    position: 'absolute',
    left: 5,
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  thumbInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#C5C5CE',
  },
});
