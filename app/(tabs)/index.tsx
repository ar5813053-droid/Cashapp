import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
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
import { VirtualCardView } from '../../src/components/VirtualCard';
import { TransactionRow } from '../../src/components/TransactionRow';
import { DemoBanner } from '../../src/components/DemoBanner';

const { width: SCREEN_W } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { whole, cents } = formatBalanceParts(DEMO_BALANCE);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.avatar}
            onPress={() => router.push('/(tabs)/settings')}
            accessibilityLabel="Profile and settings"
          >
            <Ionicons name="person" size={20} color={colors.textPrimary} />
          </Pressable>
          <Pressable hitSlop={12} accessibilityLabel="Notifications">
            <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.demoRow}>
          <DemoBanner compact />
        </View>

        {/* Balance */}
        <Text style={styles.balanceLabel}>Total balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceDollar}>$</Text>
          <Text style={styles.balanceWhole}>{whole}</Text>
          <Text style={styles.balanceCents}>{cents}</Text>
        </View>

        {/* Send / Request */}
        <View style={styles.actions}>
          <Pressable
            style={styles.pillBtn}
            onPress={() => router.push('/(tabs)/recipients')}
            accessibilityLabel="Send money"
          >
            <Ionicons name="arrow-up" size={16} color={colors.textPrimary} />
            <Text style={styles.pillText}>Send</Text>
          </Pressable>
          <Pressable
            style={styles.pillBtn}
            onPress={() => router.push('/(tabs)/recipients')}
            accessibilityLabel="Request money"
          >
            <Text style={styles.pillText}>Request</Text>
          </Pressable>
        </View>

        {/* Spending pill + fanned card stack (reference layout) */}
        <View style={styles.midRow}>
          <View style={styles.spendingCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.spendingLabel}>Spending</Text>
              <Text style={styles.spendingValue}>
                ${DEMO_SPENDING.toLocaleString()}
              </Text>
            </View>
            <View style={styles.avatarCluster}>
              {['#34D399', '#F97316', '#60A5FA'].map((c, i) => (
                <View
                  key={c}
                  style={[
                    styles.miniAvatar,
                    { backgroundColor: c, marginLeft: i === 0 ? 0 : -10, zIndex: 3 - i },
                  ]}
                />
              ))}
              <View style={[styles.miniAvatar, styles.plusAvatar, { marginLeft: -10 }]}>
                <Text style={styles.plusText}>+2</Text>
              </View>
            </View>
          </View>
          <Pressable
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
                    top: i * 6,
                    right: i * 8,
                    zIndex: 3 - i,
                    transform: [{ rotate: `${8 - i * 6}deg` }],
                  },
                ]}
              />
            ))}
          </Pressable>
        </View>

        {/* Transactions sheet */}
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Ionicons name="menu" size={20} color={colors.textDarkMuted} />
            <Text style={styles.sheetTitle}>Transactions</Text>
            <Ionicons name="search" size={20} color={colors.textDarkMuted} />
          </View>
          {TRANSACTIONS.map((t) => (
            <TransactionRow key={t.id} item={t} />
          ))}
          <Pressable
            style={styles.seeAll}
            onPress={() => router.push('/(tabs)/activity')}
          >
            <Text style={styles.seeAllText}>See all activity</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: layout.bottomNavHeight + 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoRow: { marginTop: spacing.md, marginBottom: spacing.sm },
  balanceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  balanceDollar: {
    fontSize: 36,
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
    fontSize: 24,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
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
  avatarCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.bgCard,
  },
  plusAvatar: {
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardStack: {
    width: 100,
    height: 72,
  },
  stackCard: {
    position: 'absolute',
    width: 78,
    height: 52,
    borderRadius: 12,
  },
  sheet: {
    marginTop: spacing.xxl,
    backgroundColor: colors.bgSheet,
    borderRadius: radii.sheet,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    minHeight: 320,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E4',
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    ...typography.section,
    color: colors.textDark,
  },
  seeAll: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  seeAllText: {
    ...typography.label,
    color: colors.textDarkSecondary,
  },
});
