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
  FadeInDown,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radii, typography } from '../../src/design/tokens';
import { DEMO_BALANCE, RECIPIENTS, CARDS, formatMoney } from '../../src/mock-data';
import { usePayment } from '../../src/context/PaymentContext';
import { Keypad } from '../../src/components/Keypad';
import { SwipeToConfirm } from '../../src/components/SwipeToConfirm';
import { PressableScale } from '../../src/components/PressableScale';
import { evaluateExpression, isValidPaymentAmount } from '../../src/utils/safeCalc';
import { successFeedback } from '../../src/utils/feedback';

const H = Dimensions.get('window').height;
// Taller sheet so swipe + keypad both fit
const SHEET_H = Math.min(H * 0.88, 720);
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
    .activeOffsetY(12)
    .failOffsetX([-24, 24])
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
    opacity: backdrop.value * 0.5,
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
    successFeedback();
    setTimeout(() => router.replace('/payments/success'), 700);
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
            { height: SHEET_H + insets.bottom, paddingBottom: Math.max(insets.bottom, 10) },
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

          {/* Compact amount so keypad sits higher and slider is fully visible */}
          <View style={styles.amountWrap}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
              {displayMain}
            </Text>
            {preview ? <Text style={styles.preview}>{preview}</Text> : null}
            <Text style={styles.available}>Available {formatMoney(DEMO_BALANCE)}</Text>
          </View>

          {/* Slider zone — always reserved height when valid so it never clips under keypad */}
          <View style={styles.swipeZone}>
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
            ) : null}
          </View>

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
    paddingTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: -8 },
    elevation: 24,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D0D0D6',
    marginBottom: 6,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  tabPill: { paddingHorizontal: spacing.lg, paddingVertical: 5, borderRadius: radii.full },
  tabPillOn: { backgroundColor: colors.pillDark },
  tab: { ...typography.section, color: colors.textDarkMuted },
  tabOn: { color: colors.textDark, fontWeight: '700' },
  recipient: {
    ...typography.caption,
    color: colors.textDarkSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  amountWrap: {
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: 4,
    minHeight: 64,
  },
  amount: {
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1.2,
    color: colors.textDark,
    maxWidth: '90%',
  },
  preview: { ...typography.body, color: colors.textDarkMuted, marginTop: 2 },
  available: { ...typography.caption, color: colors.textDarkMuted, marginTop: 2 },
  swipeZone: {
    minHeight: 78,
    justifyContent: 'center',
    marginBottom: 4,
  },
  processing: { alignItems: 'center', gap: 8, paddingVertical: 12 },
  processingText: { ...typography.caption, color: colors.textDarkSecondary },
  keypadArea: {
    flexGrow: 0,
    paddingBottom: 4,
  },
  equals: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: colors.textDark,
    paddingHorizontal: 28,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  equalsText: { color: '#fff', fontWeight: '700', fontSize: 18 },
});
