import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import {
  DEMO_BALANCE,
  DEMO_SPENDING,
  CARDS,
  TRANSACTIONS,
  formatBalanceParts,
} from '../../src/mock-data';
import { TransactionRow } from '../../src/components/TransactionRow';
import { PressableScale } from '../../src/components/PressableScale';
import { MerchantLogo } from '../../src/components/MerchantLogo';

export default function HomeScreen() {
  const router = useRouter();
  const { whole, cents } = formatBalanceParts(DEMO_BALANCE);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <PressableScale
            style={styles.avatar}
            onPress={() => router.push('/(tabs)/settings')}
            accessibilityLabel="Profile and settings"
          >
            <Ionicons name="person" size={18} color={colors.textPrimary} />
          </PressableScale>
          <PressableScale hitSlop={12} accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          </PressableScale>
        </View>

        <Text style={styles.balanceLabel}>Total balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceDollar}>$</Text>
          <Text style={styles.balanceWhole}>{whole}</Text>
          <Text style={styles.balanceCents}>{cents}</Text>
        </View>

        <View style={styles.actions}>
          <PressableScale
            style={styles.pillBtn}
            onPress={() => router.push('/(tabs)/recipients')}
            accessibilityLabel="Send"
          >
            <Ionicons name="arrow-up" size={15} color={colors.textPrimary} />
            <Text style={styles.pillText}>Send</Text>
          </PressableScale>
          <PressableScale
            style={styles.pillBtn}
            onPress={() => router.push('/(tabs)/recipients')}
            accessibilityLabel="Request"
          >
            <Text style={styles.pillText}>Request</Text>
          </PressableScale>
        </View>

        <View style={styles.midRow}>
          <View style={styles.spendingCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.spendingLabel}>Spending</Text>
              <Text style={styles.spendingValue}>${DEMO_SPENDING.toLocaleString()}</Text>
            </View>
            <View style={styles.merchantCluster}>
              {['Apple', 'Threads', 'Exoplan'].map((m, i) => (
                <View key={m} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}>
                  <MerchantLogo merchant={m} size={28} />
                </View>
              ))}
            </View>
          </View>
          <PressableScale
            style={styles.cardStack}
            onPress={() => router.push('/(tabs)/cards')}
            accessibilityLabel="View cards"
          >
            {CARDS.slice(0, 3).map((c, i) => (
              <View
                key={c.id}
                style={[
                  styles.stackCard,
                  {
                    backgroundColor: c.color,
                    top: i * 5,
                    right: i * 7,
                    zIndex: 3 - i,
                    transform: [{ rotate: `${7 - i * 5}deg` }],
                  },
                ]}
              />
            ))}
          </PressableScale>
        </View>

        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Transactions</Text>
            <PressableScale onPress={() => router.push('/(tabs)/activity')}>
              <Ionicons name="search" size={18} color={colors.textDarkMuted} />
            </PressableScale>
          </View>
          {TRANSACTIONS.map((t) => (
            <TransactionRow key={t.id} item={t} />
          ))}
          <PressableScale style={styles.seeAll} onPress={() => router.push('/(tabs)/activity')}>
            <Text style={styles.seeAllText}>See all activity</Text>
          </PressableScale>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.bottomNavHeight + 36,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  balanceDollar: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 8,
    marginRight: 2,
  },
  balanceWhole: {
    ...typography.balance,
    color: colors.textPrimary,
  },
  balanceCents: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pill,
    paddingHorizontal: spacing.lg,
    height: 40,
    borderRadius: radii.full,
  },
  pillText: {
    ...typography.label,
    color: colors.textPrimary,
  },
  midRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  spendingCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radii.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  spendingLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  spendingValue: {
    ...typography.section,
    color: colors.textPrimary,
    marginTop: 2,
  },
  merchantCluster: { flexDirection: 'row', alignItems: 'center' },
  cardStack: { width: 88, height: 64 },
  stackCard: {
    position: 'absolute',
    width: 70,
    height: 46,
    borderRadius: 10,
  },
  sheet: {
    marginTop: spacing.xxl,
    backgroundColor: colors.bgSheet,
    borderRadius: radii.sheet,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E2E6',
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sheetTitle: {
    ...typography.section,
    color: colors.textDark,
  },
  seeAll: {
    marginTop: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  seeAllText: {
    ...typography.label,
    color: colors.textDarkSecondary,
  },
});
