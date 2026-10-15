import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { fetchMarketFeed, type MarketItem } from '../../src/mock-data/market';
import { PressableScale } from '../../src/components/PressableScale';
import { useAppStore } from '../../src/store/AppStore';

type Status = 'idle' | 'loading' | 'ok' | 'error';
let memoryCache: { items: MarketItem[]; at: number } | null = null;

export default function MarketScreen() {
  const router = useRouter();
  const { state, equity, toggleWatch } = useAppStore();
  const [status, setStatus] = useState<Status>('idle');
  const [items, setItems] = useState<MarketItem[]>([]);
  const [query, setQuery] = useState('');
  const [offlineLabel, setOfflineLabel] = useState(false);
  const inflight = useRef(false);

  const load = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    setStatus('loading');
    setOfflineLabel(false);
    try {
      const data = await fetchMarketFeed(12000);
      memoryCache = { items: data, at: Date.now() };
      setItems(data);
      setStatus('ok');
    } catch {
      if (memoryCache?.items?.length) {
        setItems(memoryCache.items);
        setOfflineLabel(true);
        setStatus('ok');
      } else {
        setItems([]);
        setStatus('error');
      }
    } finally {
      inflight.current = false;
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const marks: Record<string, number> = {};
  for (const i of items) marks[i.symbol] = i.price;
  const eq = equity(marks);

  const filtered = items.filter(
    (i) =>
      i.symbol.toLowerCase().includes(query.toLowerCase()) ||
      i.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Market</Text>
        <PressableScale onPress={load} hitSlop={12}>
          <Ionicons name="refresh" size={20} color={colors.textPrimary} />
        </PressableScale>
      </View>

      <View style={styles.equity}>
        <Text style={styles.eqLabel}>Demo equity</Text>
        <Text style={styles.eqVal}>${eq.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Text>
        <Text style={styles.eqSub}>
          Cash ${eq.cash.toFixed(2)} · Portfolio ${eq.portfolio.toFixed(2)} · P/L{' '}
          <Text style={{ color: eq.pnl >= 0 ? '#22C55E' : '#EF4444' }}>
            {eq.pnl >= 0 ? '+' : ''}
            {eq.pnl.toFixed(2)}
          </Text>
        </Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search assets"
        placeholderTextColor="#666"
        value={query}
        onChangeText={setQuery}
      />

      {status === 'loading' && items.length === 0 && (
        <View style={styles.center}>
          <ActivityIndicator color="#fff" />
        </View>
      )}
      {status === 'error' && (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Unable to load market data</Text>
          <PressableScale style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>Retry</Text>
          </PressableScale>
        </View>
      )}
      {offlineLabel && (
        <Text style={styles.offline}>
          Offline / cached · {memoryCache ? new Date(memoryCache.at).toLocaleString() : ''}
        </Text>
      )}

      {(status === 'ok' || items.length > 0) && (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={status === 'loading'} onRefresh={load} tintColor="#fff" />
          }
          renderItem={({ item }) => (
            <PressableScale
              style={styles.row}
              onPress={() => router.push(`/trade/${item.id}`)}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.symbol}>{item.symbol}</Text>
                  <PressableScale
                    onPress={() => toggleWatch(item.id)}
                    hitSlop={8}
                  >
                    <Ionicons
                      name={state.watchlist.includes(item.id) ? 'star' : 'star-outline'}
                      size={14}
                      color="#FBBF24"
                    />
                  </PressableScale>
                </View>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.price}>
                  $
                  {item.price.toLocaleString(undefined, {
                    maximumFractionDigits: item.price > 100 ? 0 : 2,
                  })}
                </Text>
                <Text style={[styles.change, item.changePct >= 0 ? styles.up : styles.down]}>
                  {item.changePct >= 0 ? '+' : ''}
                  {item.changePct.toFixed(2)}%
                </Text>
              </View>
            </PressableScale>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    marginTop: spacing.md,
  },
  title: { ...typography.title, color: colors.textPrimary },
  equity: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(59,130,246,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  eqLabel: { ...typography.micro, color: colors.textMuted },
  eqVal: { fontSize: 28, fontWeight: '700', color: '#fff', marginTop: 4 },
  eqSub: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  search: {
    marginHorizontal: layout.screenPadding,
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    color: '#fff',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  errorTitle: { color: '#fff', fontWeight: '600' },
  retryBtn: {
    backgroundColor: colors.pill,
    paddingHorizontal: spacing.xxl,
    height: 44,
    borderRadius: radii.full,
    justifyContent: 'center',
  },
  retryText: { color: '#fff', fontWeight: '600' },
  offline: {
    ...typography.micro,
    color: colors.warning,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  list: { padding: layout.screenPadding, paddingBottom: layout.bottomNavHeight + 40 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  symbol: { ...typography.section, color: colors.textPrimary },
  name: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  price: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  change: { ...typography.caption, marginTop: 2 },
  up: { color: colors.accentGreen },
  down: { color: colors.danger },
});
