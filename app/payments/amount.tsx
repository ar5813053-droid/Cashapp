import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { DEMO_BALANCE, RECIPIENTS, CARDS, formatMoney } from '../../src/mock-data';
import { usePayment } from '../../src/context/PaymentContext';
import { Keypad } from '../../src/components/Keypad';
import { SwipeToConfirm } from '../../src/components/SwipeToConfirm';
import { PressableScale } from '../../src/components/PressableScale';
import { evaluateExpression, isValidPaymentAmount } from '../../src/utils/safeCalc';

const H = Dimensions.get('window').height;
const COLLAPSED = Math.min(H * 0.72, 620);
const DISMISS_Y = 120;

export default function AmountScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { draft, setAmount, setExpression } = usePayment();
  const [expr, setExpr] = useState(draft.expression || '');
  const [mode, setMode] = useState<'Send' | 'Request'>('Send');
  const [processing, setProcessing] = useState(false);
  const translateY = useSharedValue(80);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
    backdrop.value = withTiming(1, { duration: 220 });
  }, [translateY, backdrop]);

  const close = useCallback(() => {
    translateY.value = withTiming(H, { duration: 240 });
    backdrop.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(router.back)();
    });
  }, [backdrop, router, translateY]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) translateY.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_Y || e.velocityY > 900) {
        runOnJS(close)();
      } else {
        translateY.value = withSpring(0, { damping: 16, stiffness: 200 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const dimStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value * 0.45,
  }));

  const evaluated = useMemo(() => evaluateExpression(expr), [expr]);
  const value = evaluated.ok ? evaluated.value : 0;
  const valid = evaluated.ok && isValidPaymentAmount(value);

  const update = useCallback(
    (next: string) => {
      setExpr(next);
      setExpression(next);
      const r = evaluateExpression(next);
      if (r.ok) setAmount(r.value);
      else setAmount(0);
    },
    [setAmount, setExpression]
  );

  const onDigit = (d: string) => {
    if (expr === '0') update(d);
    else update(expr + d);
  };
  const onOperator = (op: '+' | '-' | '×' | '÷') => {
    if (!expr) return;
    if (/[+\-×÷]$/.test(expr)) update(expr.slice(0, -1) + op);
    else update(expr + op);
  };
  const onBackspace = () => update(expr.slice(0, -1));
  const onDecimal = () => {
    const parts = expr.split(/[+\-×÷]/);
    const last = parts[parts.length - 1] ?? '';
    if (last.includes('.')) return;
    update(expr + (expr === '' || /[+\-×÷]$/.test(expr) ? '0.' : '.'));
  };
  const onEquals = () => {
    const r = evaluateExpression(expr);
    if (r.ok) update(String(r.value));
  };

  const recipient = RECIPIENTS.find((r) => r.id === draft.recipientId) ?? RECIPIENTS[1];
  const card = CARDS.find((c) => c.id === draft.cardId) ?? CARDS[0];

  const displayMain = (() => {
    if (!expr) return '$0';
    if (evaluated.ok && !/[+\-×÷]$/.test(expr) && /[+\-×÷]/.test(expr)) {
      return `$${evaluated.display}`;
    }
    if (/[+\-×÷]/.test(expr)) return expr;
    if (evaluated.ok) return `$${evaluated.display}`;
    return expr;
  })();

  const preview =
    evaluated.ok && /[+\-×÷]\d/.test(expr.replace(/\s/g, '')) && /[+\-×÷]/.test(expr)
      ? `= ${evaluated.display}`
      : null;

  const onConfirm = () => {
    if (!valid || processing) return;
    setAmount(value);
    setProcessing(true);
    setTimeout(() => router.replace('/payments/success'), 650);
  };

  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={close}>
        <Animated.View style={[styles.dim, dimStyle]} />
      </Pressable>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.sheet,
            sheetStyle,
            { height: COLLAPSED + insets.bottom, paddingBottom: insets.bottom + 8 },
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.tabs}>
            <PressableScale
              onPress={() => setMode('Send')}
              style={[styles.tabPill, mode === 'Send' && styles.tabPillOn]}
            >
              <Text style={[styles.tab, mode === 'Send' && styles.tabOn]}>Send</Text>
            </PressableScale>
            <PressableScale
              onPress={() => {
                setMode('Request');
                router.replace('/payments/request');
              }}
            >
              <Text style={[styles.tab, mode === 'Request' && styles.tabOn]}>Request</Text>
            </PressableScale>
          </View>

          <Text style={styles.recipient}>
            {recipient.name} · {card.last4} USD
          </Text>

          <View style={styles.amountWrap}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
              {displayMain}
            </Text>
            {preview ? <Text style={styles.preview}>{preview}</Text> : null}
            <Text style={styles.available}>Available {formatMoney(DEMO_BALANCE)}</Text>
          </View>

          {valid ? (
            <Animated.View entering={FadeInDown.springify().damping(16)} exiting={FadeOut}>
              {processing ? (
                <View style={styles.processing}>
                  <ActivityIndicator color={colors.textDark} />
                  <Text style={styles.processingText}>Processing simulation…</Text>
                </View>
              ) : (
                <SwipeToConfirm onConfirm={onConfirm} />
              )}
            </Animated.View>
          ) : (
            <View style={styles.swipePlaceholder} />
          )}

          <View style={styles.keypadArea}>
            <Keypad
              onDigit={onDigit}
              onOperator={onOperator}
              onBackspace={onBackspace}
              onDecimal={onDecimal}
            />
            <PressableScale style={styles.equals} onPress={onEquals}>
              <Text style={styles.equalsText}>=</Text>
            </PressableScale>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
  sheet: {
    backgroundColor: colors.bgSheet,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 8,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.25,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    elevation: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D8D8DE',
    marginBottom: 8,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  tabPill: { paddingHorizontal: spacing.lg, paddingVertical: 6, borderRadius: radii.full },
  tabPillOn: { backgroundColor: colors.pillDark },
  tab: { ...typography.section, color: colors.textDarkMuted },
  tabOn: { color: colors.textDark, fontWeight: '700' },
  recipient: {
    ...typography.caption,
    color: colors.textDarkSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  amountWrap: { alignItems: 'center', marginTop: spacing.lg, minHeight: 88 },
  amount: { ...typography.amountLarge, color: colors.textDark, maxWidth: '90%' },
  preview: { ...typography.body, color: colors.textDarkMuted, marginTop: 4 },
  available: { ...typography.caption, color: colors.textDarkMuted, marginTop: 4 },
  swipePlaceholder: { height: 12 },
  processing: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  processingText: { ...typography.caption, color: colors.textDarkSecondary },
  keypadArea: { flex: 1, justifyContent: 'flex-end' },
  equals: {
    alignSelf: 'center',
    marginBottom: 8,
    backgroundColor: colors.textDark,
    paddingHorizontal: 28,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
  },
  equalsText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});
