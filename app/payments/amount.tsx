import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { DEMO_BALANCE, RECIPIENTS, CARDS, formatMoney } from '../../src/mock-data';
import { usePayment } from '../../src/context/PaymentContext';
import { Keypad } from '../../src/components/Keypad';
import { SwipeToConfirm } from '../../src/components/SwipeToConfirm';
import { PressableScale } from '../../src/components/PressableScale';

function evalExpression(expr: string): number {
  const cleaned = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\s/g, '');
  if (!cleaned) return 0;
  const m = cleaned.match(/^(\d+\.?\d*)([+\-*/])(\d+\.?\d*)$/);
  if (m) {
    const a = parseFloat(m[1]);
    const b = parseFloat(m[3]);
    switch (m[2]) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b !== 0 ? a / b : a;
    }
  }
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

export default function AmountScreen() {
  const router = useRouter();
  const { draft, setAmount, setExpression } = usePayment();
  const [expr, setExpr] = useState(draft.expression || '');
  const [mode, setMode] = useState<'Send' | 'Request'>('Send');
  const [processing, setProcessing] = useState(false);

  const recipient = RECIPIENTS.find((r) => r.id === draft.recipientId) ?? RECIPIENTS[1];
  const card = CARDS.find((c) => c.id === draft.cardId) ?? CARDS[0];
  const value = useMemo(() => evalExpression(expr), [expr]);

  const update = useCallback(
    (next: string) => {
      setExpr(next);
      setExpression(next);
      setAmount(evalExpression(next));
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

  const onConfirm = () => {
    if (processing || value <= 0) return;
    setAmount(value);
    setProcessing(true);
    setTimeout(() => {
      router.replace('/payments/success');
    }, 650);
  };

  const display =
    /[+\-×÷]/.test(expr) && !/^\d+\.?\d*$/.test(expr)
      ? expr
      : value > 0
        ? `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`
        : '$0';

  return (
    <View style={styles.root}>
      <View style={styles.dim} />
      <SafeAreaView style={styles.sheet} edges={['top', 'bottom']}>
        <View style={styles.handle} />
        <View style={styles.tabs}>
          <PressableScale
            onPress={() => setMode('Send')}
            style={[styles.tabPill, mode === 'Send' && styles.tabPillOn]}
          >
            <Text style={[styles.tab, mode === 'Send' && styles.tabOn]}>Send</Text>
          </PressableScale>
          <PressableScale onPress={() => setMode('Request')}>
            <Text style={[styles.tab, mode === 'Request' && styles.tabOn]}>Request</Text>
          </PressableScale>
        </View>

        <Text style={styles.recipient}>
          {recipient.name} · {card.last4} USD ▾
        </Text>

        <Animated.View entering={FadeIn.duration(220)} style={styles.amountWrap}>
          <View style={styles.amountRow}>
            <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
              {display}
            </Text>
            <View style={[styles.avatar, { backgroundColor: recipient.avatarColor }]}>
              <Text style={styles.initials}>{recipient.initials}</Text>
            </View>
          </View>
          <Text style={styles.available}>Available {formatMoney(DEMO_BALANCE)}</Text>
        </Animated.View>

        <View style={styles.swipeArea}>
          {processing ? (
            <View style={styles.processing}>
              <ActivityIndicator color={colors.textDark} />
              <Text style={styles.processingText}>Processing simulation…</Text>
            </View>
          ) : (
            <SwipeToConfirm
              onConfirm={onConfirm}
              disabled={value <= 0}
            />
          )}
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keypadArea}
        >
          <Keypad
            onDigit={onDigit}
            onOperator={onOperator}
            onBackspace={onBackspace}
            onDecimal={onDecimal}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    flex: 1,
    marginTop: 12,
    backgroundColor: colors.bgSheet,
    borderTopLeftRadius: radii.sheet,
    borderTopRightRadius: radii.sheet,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E5',
    marginTop: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  tabPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    borderRadius: radii.full,
  },
  tabPillOn: { backgroundColor: colors.pillDark },
  tab: { ...typography.section, color: colors.textDarkMuted },
  tabOn: { color: colors.textDark, fontWeight: '700' },
  recipient: {
    ...typography.caption,
    color: colors.textDarkSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  amountWrap: {
    alignItems: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  amount: { ...typography.amountLarge, color: colors.textDark, maxWidth: '78%' },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontWeight: '700', fontSize: 13 },
  available: {
    ...typography.caption,
    color: colors.textDarkMuted,
    marginTop: spacing.sm,
  },
  swipeArea: {
    marginTop: spacing.xl,
    minHeight: 72,
    justifyContent: 'center',
  },
  processing: { alignItems: 'center', gap: spacing.sm },
  processingText: { ...typography.caption, color: colors.textDarkSecondary },
  keypadArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
  },
});
