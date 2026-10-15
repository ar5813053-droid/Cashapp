import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Transaction } from '../types';
import { colors, spacing, typography } from '../design/tokens';
import { formatMoney } from '../mock-data';
import { MerchantLogo } from './MerchantLogo';

export function TransactionRow({ item }: { item: Transaction }) {
  const isIncome = item.amount > 0;
  return (
    <View style={styles.row}>
      <MerchantLogo merchant={item.merchant} />
      <View style={styles.mid}>
        <Text style={styles.name} numberOfLines={1}>
          {item.merchant}
        </Text>
        {!!item.date && <Text style={styles.date}>{item.date}</Text>}
      </View>
      <Text style={[styles.amount, isIncome ? styles.income : styles.outgoing]}>
        {formatMoney(item.amount, true)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  mid: { flex: 1 },
  name: {
    ...typography.body,
    color: colors.textDark,
  },
  date: {
    ...typography.micro,
    color: colors.textDarkMuted,
    marginTop: 2,
  },
  amount: {
    ...typography.body,
    fontWeight: '600',
  },
  income: { color: colors.income },
  outgoing: { color: colors.textDark },
});
