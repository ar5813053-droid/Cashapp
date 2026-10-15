import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { fetchMarketFeed, type MarketItem } from '../../src/mock-data/market';
import { PressableScale } from '../../src/components/PressableScale';

type Status = 'idle' | 'loading' | 'ok' | 'error';

let memoryCache: { items: MarketItem[]; at: number } | null = null;

export default function MarketScreen() {
  const [status, setStatus] = useState<Status>('idle');
  const [items, setItems] = useState<MarketItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);
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
      setUpdatedAt(Date.now());
      setStatus('ok');
    } catch {
      if (memoryCache?.items?.length) {
        setItems(memoryCache.items);
        setUpdatedAt(memoryCache.at);
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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Market</Text>
        <PressableScale onPress={load} accessibilityLabel="Retry market feed" hitSlop={12}>
          <Ionicons name="refresh" size={20} color={colors.textPrimary} />
        </PressableScale>
      </View>
      <Text style={styles.disclaimer}>
        Public crypto quotes for illustration only — not investment advice.
      </Text>

      {status === 'loading' && items.length === 0 && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.textPrimary} />
          <Text style={styles.muted}>Loading market data…</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Unable to load market data</Text>
          <Text style={styles.muted}>Check your connection and try again.</Text>
          <PressableScale style={styles.retryBtn} onPress={load} accessibilityLabel="Retry">
            <Text style={styles.retryText}>Retry</Text>
          </PressableScale>
        </View>
      )}

      {(status === 'ok' || (status === 'loading' && items.length > 0)) && (
        <>
          {offlineLabel && (
            <Text style={styles.offlineTag}>
              Offline · Last updated {updatedAt ? new Date(updatedAt).toLocaleString() : '—'}
            </Text>
          )}
          <FlatList
            data={items}
            keyExtractor={(i) => i.symbol}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={status === 'loading'} onRefresh={load} tintColor="#fff" />
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View>
                  <Text style={styles.symbol}>{item.symbol}</Text>
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
              </View>
            )}
          />
        </>
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
  disclaimer: {
    ...typography.micro,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: layout.screenPadding,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: layout.screenPadding,
  },
  muted: { ...typography.caption, color: colors.textSecondary },
  errorTitle: { ...typography.section, color: colors.textPrimary },
  retryBtn: {
    marginTop: spacing.md,
    backgroundColor: colors.pill,
    paddingHorizontal: spacing.xxl,
    height: 44,
    borderRadius: radii.full,
    justifyContent: 'center',
  },
  retryText: { ...typography.label, color: colors.textPrimary },
  offlineTag: {
    ...typography.micro,
    color: colors.warning,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  list: {
    padding: layout.screenPadding,
    paddingBottom: layout.bottomNavHeight + 36,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  symbol: { ...typography.section, color: colors.textPrimary },
  name: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  price: { ...typography.body, color: colors.textPrimary, fontWeight: '700' },
  change: { ...typography.caption, marginTop: 2 },
  up: { color: colors.accentGreen },
  down: { color: colors.danger },
});
