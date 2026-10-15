import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { PressableScale } from '../../src/components/PressableScale';
import { fetchMarketFeed, fetchSparkline, MARKET_CATALOG } from '../../src/mock-data/market';
import { useAppStore } from '../../src/store/AppStore';

const W = Dimensions.get('window').width - 40;

export default function TradeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, buy, sell, toggleWatch } = useAppStore();
  const meta = MARKET_CATALOG.find((m) => m.id === id) || MARKET_CATALOG[0];
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [qty, setQty] = useState('0.01');
  const [points, setPoints] = useState<{ t: number; v: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [tf, setTf] = useState(1);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const [feed, spark] = await Promise.all([
          fetchMarketFeed(),
          fetchSparkline(meta.id, tf).catch(() => [] as { t: number; v: number }[]),
        ]);
        if (!alive) return;
        const row = feed.find((f) => f.id === meta.id);
        if (row) {
          setPrice(row.price);
          setChange(row.changePct);
        }
        setPoints(spark);
      } catch {
        /* keep */
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [meta.id, tf]);

  const chart = useMemo(() => {
    if (points.length < 2) return null;
    const vals = points.map((p) => p.v);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;
    const h = 140;
    const step = W / (points.length - 1);
    const path = points
      .map((p, i) => {
        const x = i * step;
        const y = h - ((p.v - min) / range) * (h - 8) - 4;
        return `${x},${y}`;
      })
      .join(' ');
    return { path, h };
  }, [points]);

  const pos = state.positions.find((p) => p.symbol === meta.symbol);
  const watched = state.watchlist.includes(meta.id);

  const doBuy = () => {
    const q = parseFloat(qty);
    if (!price) {
      Alert.alert('No price', 'Cannot trade without a market reference price.');
      return;
    }
    if (busy) return;
    setBusy(true);
    const r = buy(meta.symbol, meta.name, q, price);
    setBusy(false);
    if (!r.ok) Alert.alert('Order rejected', r.error || 'Failed');
    else Alert.alert('Filled (demo)', `Bought ${q} ${meta.symbol} @ $${price}`);
  };

  const doSell = () => {
    const q = parseFloat(qty);
    if (!price) {
      Alert.alert('No price', 'Cannot trade without a market reference price.');
      return;
    }
    if (busy) return;
    setBusy(true);
    const r = sell(meta.symbol, q, price);
    setBusy(false);
    if (!r.ok) Alert.alert('Order rejected', r.error || 'Failed');
    else Alert.alert('Filled (demo)', `Sold ${q} ${meta.symbol} @ $${price}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <PressableScale onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </PressableScale>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.sym}>{meta.symbol}</Text>
          <Text style={styles.name}>{meta.name}</Text>
        </View>
        <PressableScale onPress={() => toggleWatch(meta.id)}>
          <Ionicons name={watched ? 'star' : 'star-outline'} size={22} color="#FBBF24" />
        </PressableScale>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.price}>
          ${price ? price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—'}
        </Text>
        <Text style={[styles.chg, change >= 0 ? styles.up : styles.down]}>
          {change >= 0 ? '+' : ''}
          {change.toFixed(2)}% · public reference
        </Text>

        <View style={styles.tfRow}>
          {[1, 7, 30, 90].map((d) => (
            <PressableScale key={d} onPress={() => setTf(d)} style={[styles.tf, tf === d && styles.tfOn]}>
              <Text style={styles.tfText}>{d === 1 ? '1D' : d === 7 ? '1W' : d === 30 ? '1M' : '3M'}</Text>
            </PressableScale>
          ))}
        </View>

        <View style={styles.chartBox}>
          {loading && !chart ? (
            <ActivityIndicator color="#fff" />
          ) : chart ? (
            <Svg width={W} height={chart.h}>
              <Polyline points={chart.path} fill="none" stroke="#3B82F6" strokeWidth={2} />
            </Svg>
          ) : (
            <Text style={styles.muted}>Chart unavailable (rate limit or offline)</Text>
          )}
        </View>

        {pos ? (
          <View style={styles.posBox}>
            <Text style={styles.posTitle}>Open position (demo)</Text>
            <Text style={styles.posLine}>
              Qty {pos.qty} · Avg ${pos.avgPrice.toFixed(2)} · Mkt $
              {(pos.qty * (price || pos.avgPrice)).toFixed(2)}
            </Text>
          </View>
        ) : null}

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          value={qty}
          onChangeText={setQty}
          keyboardType="decimal-pad"
          placeholderTextColor="#666"
        />
        <Text style={styles.hint}>Virtual cash ${state.cash.toFixed(2)} · 0.1% sim fee</Text>

        <View style={styles.actions}>
          <PressableScale style={[styles.btn, styles.buy]} onPress={doBuy} disabled={busy}>
            <Text style={styles.btnText}>Buy</Text>
          </PressableScale>
          <PressableScale style={[styles.btn, styles.sell]} onPress={doSell} disabled={busy}>
            <Text style={styles.btnText}>Sell</Text>
          </PressableScale>
        </View>
        <Text style={styles.disclaimer}>
          Paper trading only. Orders use the latest public reference price when available and never
          execute on a real exchange.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#05050A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing.sm,
  },
  sym: { ...typography.section, color: '#fff' },
  name: { ...typography.caption, color: colors.textMuted },
  body: { padding: layout.screenPadding, paddingBottom: 40 },
  price: { fontSize: 36, fontWeight: '700', color: '#fff', marginTop: spacing.lg },
  chg: { ...typography.caption, marginTop: 4 },
  up: { color: '#22C55E' },
  down: { color: '#EF4444' },
  tfRow: { flexDirection: 'row', gap: 8, marginTop: spacing.lg },
  tf: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tfOn: { backgroundColor: 'rgba(59,130,246,0.35)' },
  tfText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  chartBox: {
    height: 160,
    marginTop: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  muted: { color: colors.textMuted },
  posBox: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(59,130,246,0.12)',
  },
  posTitle: { color: '#fff', fontWeight: '600' },
  posLine: { color: colors.textSecondary, marginTop: 4, fontSize: 13 },
  label: { color: colors.textMuted, marginTop: spacing.xl, marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.md,
    padding: spacing.md,
    color: '#fff',
  },
  hint: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  actions: { flexDirection: 'row', gap: 12, marginTop: spacing.xl },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buy: { backgroundColor: '#16A34A' },
  sell: { backgroundColor: '#DC2626' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disclaimer: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.lg,
    lineHeight: 16,
  },
});
