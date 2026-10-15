export type MarketItem = {
  id: string;
  symbol: string;
  name: string;
  price: number;
  changePct: number;
  updatedAt: number;
};

export const MARKET_CATALOG: { id: string; symbol: string; name: string }[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin' },
];

/** CoinGecko public API — crypto only, no key required. */
export async function fetchMarketFeed(timeoutMs = 12000): Promise<MarketItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const ids = MARKET_CATALOG.map((m) => m.id).join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as Record<string, { usd?: number; usd_24h_change?: number }>;
    const now = Date.now();
    return MARKET_CATALOG.map((m) => {
      const row = data[m.id] || {};
      return {
        id: m.id,
        symbol: m.symbol,
        name: m.name,
        price: typeof row.usd === 'number' ? row.usd : 0,
        changePct: typeof row.usd_24h_change === 'number' ? row.usd_24h_change : 0,
        updatedAt: now,
      };
    }).filter((x) => x.price > 0);
  } finally {
    clearTimeout(timer);
  }
}

/** Rough sparkline via market_chart (may rate-limit). */
export async function fetchSparkline(id: string, days = 1): Promise<{ t: number; v: number }[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { prices?: [number, number][] };
    return (data.prices || []).map(([t, v]) => ({ t, v }));
  } finally {
    clearTimeout(timer);
  }
}
