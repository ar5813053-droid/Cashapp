import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { DEMO_BALANCE, RECIPIENTS, CARDS, formatMoney } from '../../src/mock-data';
import { usePayment } from '../../src/context/PaymentContext';
import { Keypad } from '../../src/components/Keypad';

function evalExpression(expr: string): number {
  // Safe demo evaluator: digits, one operator, optional second operand
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
    // Replace trailing operator or append
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

  const continuePay = () => {
    if (value <= 0) return;
    setAmount(value);
    router.push('/payments/confirm');
  };

  const display =
    expr.includes('×') || expr.includes('+') || expr.includes('-') || expr.includes('÷')
      ? expr
      : value > 0
        ? `$${value % 1 === 0 ? value.toFixed(0) : value.toFixed(2)}`
        : '$0.00';

  const preview =
    /[+\-×÷]\d/.test(expr) && value > 0 ? `= ${value % 1 === 0 ? value : value.toFixed(2)}` : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-down" size={28} color={colors.textDarkMuted} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable onPress={() => setMode('Send')}>
          <Text style={[styles.tab, mode === 'Send' && styles.tabOn]}>Send</Text>
        </Pressable>
        <Pressable onPress={() => setMode('Request')}>
          <Text style={[styles.tab, mode === 'Request' && styles.tabOn]}>Request</Text>
        </Pressable>
      </View>

      <Text style={styles.recipient}>
        {recipient.name} · {card.last4} USD ▾
      </Text>

      </View>

      <Animated.View entering={FadeIn.duration(200)} style={styles.amountWrap}>
        <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
        {preview && <Text style={styles.preview}>{preview}</Text>}
        <Text style={styles.available}>Available {formatMoney(DEMO_BALANCE)}</Text>
      </Animated.View>

      <View style={styles.keypadArea}>
        <Keypad
          onDigit={onDigit}
          onOperator={onOperator}
          onBackspace={onBackspace}
          onDecimal={onDecimal}
        />
      </View>

      <Pressable
        style={[styles.continue, value <= 0 && styles.continueDisabled]}
        onPress={continuePay}
        disabled={value <= 0}
        accessibilityLabel="Continue to review"
      >
        <Text style={styles.continueText}>Continue</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgSheet },
  topBar: {
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: spacing.md,
  },
  tab: {
    ...typography.section,
    color: colors.textDarkMuted,
  },
  tabOn: {
    color: colors.textDark,
    fontWeight: '700',
  },
  recipient: {
    ...typography.caption,
    color: colors.textDarkSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  demo: { marginTop: spacing.sm, alignItems: 'center' },
  amountWrap: {
    alignItems: 'center',
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    minHeight: 120,
  },
  amount: {
    ...typography.amountLarge,
    color: colors.textDark,
  },
  preview: {
    ...typography.body,
    color: colors.textDarkMuted,
    marginTop: spacing.sm,
  },
  available: {
    ...typography.caption,
    color: colors.textDarkMuted,
    marginTop: spacing.sm,
  },
  keypadArea: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.md,
  },
  continue: {
    marginHorizontal: layout.screenPadding,
    marginBottom: spacing.lg,
    backgroundColor: colors.textDark,
    borderRadius: radii.full,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  continueDisabled: { opacity: 0.35 },
  continueText: {
    ...typography.section,
    color: '#fff',
  },
});
