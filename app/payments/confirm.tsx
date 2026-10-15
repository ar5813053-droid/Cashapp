import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, layout } from '../../src/design/tokens';
import { DEMO_BALANCE, RECIPIENTS, CARDS, formatMoney } from '../../src/mock-data';
import { usePayment } from '../../src/context/PaymentContext';
import { SwipeToConfirm } from '../../src/components/SwipeToConfirm';
import { PressableScale } from '../../src/components/PressableScale';

export default function ConfirmScreen() {
  const router = useRouter();
  const { draft } = usePayment();
  const [processing, setProcessing] = useState(false);
  const recipient = RECIPIENTS.find((r) => r.id === draft.recipientId) ?? RECIPIENTS[1];
  const card = CARDS.find((c) => c.id === draft.cardId) ?? CARDS[0];
  const amount = draft.amount;

  const onConfirm = () => {
    if (processing) return;
    setProcessing(true);
    // Simulated processing delay — no real transfer
    setTimeout(() => {
      router.replace('/payments/success');
    }, 700);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <PressableScale onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-down" size={28} color={colors.textDarkMuted} />
        </PressableScale>
      </View>

      <View style={styles.tabs}>
        <Text style={[styles.tab, styles.tabOn]}>Send</Text>
        <Text style={styles.tab}>Request</Text>
      </View>

      <Text style={styles.recipient}>
        {recipient.name} · {card.last4} USD
      </Text>

      <Text style={styles.simNote}>Simulated transfer — no real funds move</Text>

      <View style={styles.amountWrap}>
        <Text style={styles.amount}>{formatMoney(amount)}</Text>
        <View style={[styles.avatar, { backgroundColor: recipient.avatarColor }]}>
          <Text style={styles.initials}>{recipient.initials}</Text>
        </View>
        <Text style={styles.available}>Available {formatMoney(DEMO_BALANCE)}</Text>
      </View>

      <View style={styles.confirmArea}>
        {processing ? (
          <View style={styles.processing}>
            <ActivityIndicator color={colors.textDark} />
            <Text style={styles.processingText}>Processing simulation…</Text>
          </View>
        ) : (
          <SwipeToConfirm onConfirm={onConfirm} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bgSheet },
  topBar: { alignItems: 'center', paddingTop: spacing.sm },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.xxl,
    marginTop: spacing.md,
  },
  tab: { ...typography.section, color: colors.textDarkMuted },
  tabOn: { color: colors.textDark, fontWeight: '700' },
  recipient: {
    ...typography.caption,
    color: colors.textDarkSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  simNote: {
    ...typography.micro,
    color: colors.textDarkMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  amountWrap: {
    alignItems: 'center',
    marginTop: spacing.huge,
    gap: spacing.md,
  },
  amount: { ...typography.amountLarge, color: colors.textDark },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: '#fff', fontWeight: '700', fontSize: 13 },
  available: { ...typography.caption, color: colors.textDarkMuted },
  confirmArea: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.huge,
  },
  processing: { alignItems: 'center', gap: spacing.md },
  processingText: { ...typography.caption, color: colors.textDarkSecondary },
});
