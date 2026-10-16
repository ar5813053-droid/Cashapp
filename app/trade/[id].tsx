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
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { colors, spacing, radii, typography, layout } from '../../src/design/tokens';
import { PressableScale } from '../../src/components/PressableScale';
import { fetchMarketFeed, MARKET_CATALOG } from '../../src/mock-data/market';
import { useAppStore } from '../../src/store/AppStore';

const SCREEN_W = Dimensions.get('window').width;
const CHART_H = Math.max(320, Dimensions.get('window').height * 0.42);

function chartHtml(symbol: string, days: number) {
  // CoinGecko OHLC via public API in the WebView (no key)
  return `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<style>html,body{margin:0;padding:0;background:#0B0B12;height:100%;overflow:hidden}#c{width:100%;height:100%}</style>
<script src="https://unpkg.com/lightweight-charts@4.2.0/dist/lightweight-charts.standalone.production.js"></script>
</head><body><div id="c"></div>
<script>
const chart = LightweightCharts.createChart(document.getElementById('c'), {
  layout: { background: { color: '#0B0B12' }, textColor: '#9ca3af' },
  grid: { vertLines: { color: '#1f2937' }, horzLines: { color: '#1f2937' } },
  rightPriceScale: { borderColor: '#374151' },
  timeScale: { borderColor: '#374151' },
  crosshair: { mode: 0 },
});
const series = chart.addCandlestickSeries({
  upColor: '#22c55e', downColor: '#ef4444', borderVisible: false,
  wickUpColor: '#22c55e', wickDownColor: '#ef4444'
});
const vol = chart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: '',
  scaleMargins: { top: 0.8, bottom: 0 } });
vol.priceScale().applyOptions({ scaleMargins: { top: 0.85, bottom: 0 } });
const id = ${JSON.stringify(symbol)};
const days = ${days};
fetch('https://api.coingecko.com/api/v3/coins/'+id+'/ohlc?vs_currency=usd&days='+days)
  .then(r => r.json())
  .then(rows => {
    if (!Array.isArray(rows)) throw new Error('bad');
    const data = rows.map(r => ({
      time: Math.floor(r[0]/1000),
      open: r[1], high: r[2], low: r[3], close: r[4]
    })).sort((a,b)=>a.time-b.time);
    // dedupe times
    const map = new Map();
    data.forEach(d => map.set(d.time, d));
    const uniq = Array.from(map.values());
    series.setData(uniq);
    vol.setData(uniq.map(d => ({
      time: d.time,
      value: Math.abs(d.close - d.open),
      color: d.close >= d.open ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'
    })));
    chart.timeScale().fitContent();
  })
  .catch(e => {
    document.body.innerHTML = '<div style="color:#9ca3af;padding:16px;font-family:sans-serif">Chart data unavailable (offline or rate limit).</div>';
  });
window.addEventListener('resize', () => chart.applyOptions({ width: window.innerWidth, height: window.innerHeight }));
</script></body></html>`;
}

export default function TradeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { state, buy, sell, toggleWatch } = useAppStore();
  const meta = MARKET_CATALOG.find((m) => m.id === id) || MARKET_CATALOG[0];
  const [price, setPrice] = useState(0);
  const [change, setChange] = useState(0);
  const [qty, setQty] = useState('0.01');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [days, setDays] = useState(1);
  const [full, setFull] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const feed = await fetchMarketFeed();
        if (!alive) return;
        const row = feed.find((f) => f.id === meta.id);
        if (row) {
          setPrice(row.price);
          setChange(row.changePct);
        }
      } catch { /* */ }
      finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [meta.id]);

  const html = useMemo(() => chartHtml(meta.id, days), [meta.id, days]);
  const pos = state.positions.find((p) => p.symbol === meta.symbol);
  const watched = state.watchlist.includes(meta.id);
  const marks = price ? { [meta.symbol]: price } : {};

  const doBuy = () => {
    const q = parseFloat(qty);
    if (!price) { Alert.alert('No price', 'Cannot trade without a market reference.'); return; }
    if (busy) return;
    setBusy(true);
    const r = buy(meta.symbol, meta.name, q, price);
    setBusy(false);
    if (!r.ok) Alert.alert('Rejected', r.error || 'Failed');
    else Alert.alert('Filled (demo)', `Bought ${q} ${meta.symbol} @ $${price}`);
  };
  const doSell = () => {
    const q = parseFloat(qty);
    if (!price) { Alert.alert('No price', 'Cannot trade without a market reference.'); return; }
    if (busy) return;
    setBusy(true);
    const r = sell(meta.symbol, q, price);
    setBusy(false);
    if (!r.ok) Alert.alert('Rejected', r.error || 'Failed');
    else Alert.alert('Filled (demo)', `Sold ${q} ${meta.symbol} @ $${price}`);
  };

  const ChartBox = ({ height }: { height: number }) => (
    <View style={[styles.chartBox, { height }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={{ flex: 1, backgroundColor: '#0B0B12' }}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        setSupportMultipleWindows={false}
      />
    </View>
  );

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
        <PressableScale onPress={() => setFull(true)} style={{ marginRight: 12 }}>
          <Ionicons name="expand" size={20} color="#fff" />
        </PressableScale>
        <PressableScale onPress={() => toggleWatch(meta.id)}>
          <Ionicons name={watched ? 'star' : 'star-outline'} size={22} color="#FBBF24" />
        </PressableScale>
      </View>

      <ScrollView contentContainerStyle={styles.body} nestedScrollEnabled>
        <Text style={styles.price}>
          {loading && !price ? '…' : `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
        </Text>
        <Text style={[styles.chg, change >= 0 ? styles.up : styles.down]}>
          {change >= 0 ? '+' : ''}{change.toFixed(2)}% · CoinGecko reference
        </Text>

        <View style={styles.tfRow}>
          {[
            [1, '1D'],
            [7, '1W'],
            [30, '1M'],
            [90, '3M'],
          ].map(([d, label]) => (
            <PressableScale key={String(d)} onPress={() => setDays(Number(d))} style={[styles.tf, days === d && styles.tfOn]}>
              <Text style={styles.tfText}>{label}</Text>
            </PressableScale>
          ))}
        </View>

        <ChartBox height={CHART_H} />
        <Text style={styles.chartNote}>OHLC candlesticks · pinch/pan in chart · not TradingView</Text>

        {pos ? (
          <View style={styles.posBox}>
            <Text style={styles.posTitle}>Open position (demo)</Text>
            <Text style={styles.posLine}>
              Qty {pos.qty} · Avg ${pos.avgPrice.toFixed(2)} · Mkt ${(pos.qty * (price || pos.avgPrice)).toFixed(2)}
            </Text>
            <Text style={styles.posLine}>
              Unrealized {(((price || pos.avgPrice) - pos.avgPrice) * pos.qty).toFixed(2)} · Cash ${state.cash.toFixed(2)}
            </Text>
          </View>
        ) : null}

        <Text style={styles.label}>Quantity</Text>
        <TextInput style={styles.input} value={qty} onChangeText={setQty} keyboardType="decimal-pad" placeholderTextColor="#666" />
        <Text style={styles.hint}>0.1% sim fee · equity uses cash + mark-to-market</Text>

        <View style={styles.actions}>
          <PressableScale style={[styles.btn, styles.buy]} onPress={doBuy} disabled={busy}>
            <Text style={styles.btnText}>Buy</Text>
          </PressableScale>
          <PressableScale style={[styles.btn, styles.sell]} onPress={doSell} disabled={busy}>
            <Text style={styles.btnText}>Sell</Text>
          </PressableScale>
        </View>
        <Text style={styles.disclaimer}>Paper trading only. No real exchange execution.</Text>
      </ScrollView>

      <Modal visible={full} animationType="slide" onRequestClose={() => setFull(false)}>
        <SafeAreaView style={{ flex: 1, backgroundColor: '#0B0B12' }}>
          <View style={styles.header}>
            <PressableScale onPress={() => setFull(false)}>
              <Ionicons name="close" size={26} color="#fff" />
            </PressableScale>
            <Text style={[styles.sym, { marginLeft: 12 }]}>{meta.symbol} chart</Text>
          </View>
          <View style={{ flex: 1 }}>
            <ChartBox height={Dimensions.get('window').height - 80} />
          </View>
        </SafeAreaView>
      </Modal>
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
  price: { fontSize: 36, fontWeight: '700', color: '#fff', marginTop: spacing.md },
  chg: { ...typography.caption, marginTop: 4 },
  up: { color: '#22C55E' },
  down: { color: '#EF4444' },
  tfRow: { flexDirection: 'row', gap: 8, marginTop: spacing.md },
  tf: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)' },
  tfOn: { backgroundColor: 'rgba(59,130,246,0.35)' },
  tfText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  chartBox: {
    marginTop: spacing.md,
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  chartNote: { color: colors.textMuted, fontSize: 10, marginTop: 6 },
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
  btn: { flex: 1, height: 48, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center' },
  buy: { backgroundColor: '#16A34A', shadowColor: '#22C55E', shadowOpacity: 0.45, shadowRadius: 12, elevation: 6 },
  sell: { backgroundColor: '#DC2626', shadowColor: '#EF4444', shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  disclaimer: { color: colors.textMuted, fontSize: 11, marginTop: spacing.lg, lineHeight: 16 },
});
