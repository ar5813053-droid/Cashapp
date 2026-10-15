import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { DEMO_BALANCE, RECIPIENTS, CARDS, formatMoney } from '../../src/mock-data';
import { usePayment } from '../../src/context/PaymentContext';
import { SwipeToConfirm } from '../../src/components/SwipeToConfirm';
import { DemoBanner } from '../../src/components/DemoBanner';

export default function ConfirmScreen() {
  const router = useRouter();
  const { draft } = usePayment();
  const recipient = RECIPIENTS.find((r) => r.id === draft.recipientId) ?? RECIPIENTS[1];
  const card = CARDS.find((c) => c.id === draft.cardId) ?? CARDS[0];
  const amount = draft.amount;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-down" size={28} color={colors.textDarkMuted} />
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Text style={[styles.tab, styles.tabOn]}>Send</Text>
        <Text style={styles.tab}>Request</Text>
      </View>

      <Text style={styles.recipient}>
        {recipient.name} · {card.last4} USD ▾
      </Text>

      <View style={styles.demo}>
        <DemoBanner />
      </View>

      <View style={styles.amountWrap}>
        <Text style={styles.amount}>{formatMoney(amount)}</Text>
        <View style={[styles.avatar, { backgroundColor: recipient.avatarColor }]}>
          <Text style={styles.initials}>{recipient.initials}</Text>
        </View>
        <Text style={styles.available}>Available {formatMoney(DEMO_BALANCE)}</Text>
      </View>

      <View style={styles.confirmArea}>
        <SwipeToConfirm onConfirm={() => router.replace('/payments/success')} />
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
  demo: { marginTop: spacing.md, alignItems: 'center' },
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
});
