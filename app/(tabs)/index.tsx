import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
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
import { useAppStore } from '../../src/store/AppStore';

const { width: W } = Dimensions.get('window');
const HERO_H = Math.min(420, W * 1.05);

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useAppStore();
  const { whole, cents } = formatBalanceParts(state.cash);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {/* Soft bundled gradient — no hard-edged circle */}
          <View style={styles.heroWrap} pointerEvents="box-none">
            <ImageBackground
              source={require('../../assets/hero-gradient.jpg')}
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
              resizeMode="cover"
            >
              <View style={styles.heroFade} />
            </ImageBackground>

            <Animated.View entering={FadeIn.duration(320)} style={styles.header}>
              <PressableScale
                style={styles.avatar}
                onPress={() => router.push('/settings')}
              >
                {state.profile.avatarUri ? (
                  <Image source={{ uri: state.profile.avatarUri }} style={{ width: 36, height: 36, borderRadius: 18 }} />
                ) : (
                  <Ionicons name="person" size={18} color={colors.textPrimary} />
                )}
              </PressableScale>
              <PressableScale hitSlop={12}>
                <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
              </PressableScale>
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(50).springify().damping(16)}>
              <Text style={styles.balanceLabel}>Total balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceDollar}>$</Text>
                <Text style={styles.balanceWhole}>{whole}</Text>
                <Text style={styles.balanceCents}>{cents}</Text>
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(100).springify().damping(16)}
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
              entering={FadeInDown.delay(150).springify().damping(16)}
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
                        top: i * 5,
                        right: i * 8,
                        zIndex: 3 - i,
                        transform: [{ rotate: `${9 - i * 6}deg` }],
                      },
                    ]}
                  />
                ))}
              </PressableScale>
            </Animated.View>
          </View>

          <Animated.View
            entering={FadeInDown.delay(200).springify().damping(18)}
            style={styles.sheet}
          >
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Ionicons name="menu" size={18} color={colors.textDarkMuted} />
              <Text style={styles.sheetTitle}>Transactions</Text>
              <PressableScale onPress={() => router.push('/activity')}>
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
  root: { flex: 1, backgroundColor: '#000000' },
  safe: { flex: 1 },
  scroll: {
    paddingBottom: layout.bottomNavHeight + 44,
  },
  heroWrap: {
    minHeight: HERO_H,
    paddingHorizontal: layout.screenPadding,
    paddingBottom: spacing.lg,
    overflow: 'hidden',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroImageStyle: {
    // Soft crop: brightest glow sits lower (matches reference)
    resizeMode: 'cover',
  },
  heroFade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
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
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(96,165,250,0.45)',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
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
    backgroundColor: 'rgba(12,16,32,0.72)',
    borderRadius: radii.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  spendingLabel: { ...typography.caption, color: colors.textSecondary },
  spendingValue: { ...typography.section, color: colors.textPrimary, marginTop: 2 },
  merchantCluster: { flexDirection: 'row' },
  cardStack: { width: 88, height: 64 },
  stackCard: {
    position: 'absolute',
    width: 68,
    height: 44,
    borderRadius: 11,
  },
  sheet: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.md,
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
