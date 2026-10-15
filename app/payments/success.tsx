import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../../src/design/tokens';
import { RECIPIENTS, formatMoney } from '../../src/mock-data';
import { usePayment } from '../../src/context/PaymentContext';

export default function SuccessScreen() {
  const router = useRouter();
  const { draft, reset } = usePayment();
  const recipient = RECIPIENTS.find((r) => r.id === draft.recipientId) ?? RECIPIENTS[1];
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 140 });
    opacity.value = withDelay(80, withTiming(1, { duration: 280 }));
  }, [scale, opacity]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const close = () => {
    reset();
    router.replace('/(tabs)');
  };

  return (
    <Pressable style={styles.screen} onPress={close} accessibilityLabel="Close">
      <Animated.View style={[styles.content, checkStyle]}>
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={44} color="#fff" />
        </View>
        <Text style={styles.amount}>{formatMoney(draft.amount || 0)}</Text>
        <Text style={styles.sent}>Sent to {recipient.name}</Text>
        <Text style={styles.sub}>Simulated · no real payment</Text>
      </Animated.View>
      <Text style={styles.hint}>Tap anywhere to close</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { alignItems: 'center', gap: spacing.md },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2.5,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  amount: {
    ...typography.amountLarge,
    color: '#fff',
    fontSize: 44,
  },
  sent: {
    ...typography.section,
    color: 'rgba(255,255,255,0.92)',
  },
  sub: {
    ...typography.micro,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  hint: {
    position: 'absolute',
    bottom: 48,
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
  },
});
