import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
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

const { width: W } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { whole, cents } = formatBalanceParts(DEMO_BALANCE);
  const glow = useSharedValue(0.55);

  useEffect(() => {
    glow.value = withTiming(0.75, { duration: 1200 });
  }, [glow]);

  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#061028', '#0A1A4A', '#0B1230', '#050508']}
        locations={[0, 0.35, 0.65, 1]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.radial, glowStyle]} pointerEvents="none" />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(320)} style={styles.header}>
            <PressableScale
              style={styles.avatar}
              onPress={() => router.push('/(tabs)/settings')}
            >
              <Ionicons name="person" size={18} color={colors.textPrimary} />
            </PressableScale>
            <PressableScale hitSlop={12}>
              <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
            </PressableScale>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(60).springify().damping(16)}>
            <Text style={styles.balanceLabel}>Total balance</Text>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceDollar}>$</Text>
              <Text style={styles.balanceWhole}>{whole}</Text>
              <Text style={styles.balanceCents}>{cents}</Text>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(120).springify().damping(16)}
            style={styles.actions}
          >
            <PressableScale
              style={styles.pillBtn}
              onPress={() => router.push('/(tabs)/recipients')}
            >
              <Ionicons name="arrow-up" size={14} color={colors.textPrimary} />
              <Text style={styles.pillText}>Send</Text>
            </PressableScale>
            <PressableScale
              style={styles.pillBtn}
              onPress={() => router.push('/(tabs)/recipients')}
            >
              <Text style={styles.pillText}>Request</Text>
            </PressableScale>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(180).springify().damping(16)}
            style={styles.midRow}
          >
            <View style={styles.spendingCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.spendingLabel}>Spending</Text>
                <Text style={styles.spendingValue}>
                  ${DEMO_SPENDING.toLocaleString()}
                </Text>
              </View>
              <View style={styles.merchantCluster}>
                {['Exoplan', 'Threads', 'Apple'].map((m, i) => (
                  <View key={m} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: 3 - i }}>
                    <MerchantLogo merchant={m} size={26} />
                  </View>
                ))}
              </View>
            </View>
            <PressableScale
              style={styles.cardStack}
              onPress={() => router.push('/(tabs)/cards')}
            >
              {CARDS.slice(0, 3).map((c, i) => (
                <View
                  key={c.id}
                  style={[
                    styles.stackCard,
                    {
                      backgroundColor: c.color,
                      top: i * 6,
                      right: i * 9,
                      zIndex: 3 - i,
                      transform: [{ rotate: `${10 - i * 7}deg` }],
                    },
                  ]}
                />
              ))}
            </PressableScale>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(240).springify().damping(18)}
            style={styles.sheet}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Ionicons name="menu" size={18} color={colors.textDarkMuted} />
              <Text style={styles.sheetTitle}>Transactions</Text>
              <PressableScale onPress={() => router.push('/(tabs)/activity')}>
                <Ionicons name="search" size={18} color={colors.textDarkMuted} />
              </PressableScale>
            </View>
            {TRANSACTIONS.map((t) => (
              <TransactionRow key={t.id} item={t} />
            ))}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  radial: {
    position: 'absolute',
    top: -40,
    left: W * 0.1,
    width: W * 0.8,
    height: W * 0.8,
    borderRadius: W,
    backgroundColor: colors.heroGlow,
  },
  safe: { flex: 1 },
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xl,
  },
  balanceRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  balanceDollar: {
    fontSize: 34,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 10,
    marginRight: 2,
  },
  balanceWhole: { ...typography.balance, color: colors.textPrimary },
  balanceCents: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 14,
  },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  pillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: spacing.lg,
    height: 38,
    borderRadius: radii.full,
  },
  pillText: { ...typography.label, color: colors.textPrimary },
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
    backgroundColor: 'rgba(20,24,40,0.85)',
    borderRadius: radii.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  spendingLabel: { ...typography.caption, color: colors.textSecondary },
  spendingValue: { ...typography.section, color: colors.textPrimary, marginTop: 2 },
  merchantCluster: { flexDirection: 'row' },
  cardStack: { width: 96, height: 72 },
  stackCard: {
    position: 'absolute',
    width: 74,
    height: 48,
    borderRadius: 12,
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
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4E4E8',
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sheetTitle: { ...typography.section, color: colors.textDark },
});
