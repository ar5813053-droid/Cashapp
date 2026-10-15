import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Transaction } from '../types';
import { colors, spacing, radii, typography } from '../design/tokens';
import { formatMoney } from '../mock-data';

export function TransactionRow({ item }: { item: Transaction }) {
  const isIncome = item.amount > 0;
  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: item.iconColor === '#000000' ? '#111' : item.iconColor }]}>
        {item.icon === 'apple' && <Ionicons name="logo-apple" size={18} color="#fff" />}
        {item.icon === 'threads' && <Ionicons name="at" size={18} color="#fff" />}
        {item.icon === 'generic' && <Ionicons name="ellipse" size={10} color="#fff" />}
        {item.icon === 'transfer' && <Ionicons name="swap-horizontal" size={18} color="#fff" />}
      </View>
      <Text style={styles.name}>{item.merchant}</Text>
      <Text style={[styles.amount, isIncome && styles.income]}>
        {isIncome ? formatMoney(item.amount, true) : formatMoney(item.amount, true)}
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
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    ...typography.body,
    color: colors.textDark,
  },
  amount: {
    ...typography.body,
    color: colors.textDark,
    fontWeight: '600',
  },
  income: {
    color: colors.income,
  },
});
