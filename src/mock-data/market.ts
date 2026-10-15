/** Demo market symbols only — not live brokerage data. */
export type MarketItem = {
  symbol: string;
  name: string;
  price: number;
  changePct: number;
};

export const MARKET_SYMBOLS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'AAPL', name: 'Apple' },
  { symbol: 'MSFT', name: 'Microsoft' },
] as const;

/**
 * Fetches public demo prices. Uses CoinGecko for crypto (no API key).
 * Stocks are omitted from live path when API fails — never invent live prices.
 */
export async function fetchMarketFeed(timeoutMs = 10000): Promise<MarketItem[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url =
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true';
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = (await res.json()) as Record<
      string,
      { usd?: number; usd_24h_change?: number }
    >;
    const map: { id: string; symbol: string; name: string }[] = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
      { id: 'solana', symbol: 'SOL', name: 'Solana' },
    ];
    return map.map((m) => {
      const row = data[m.id] || {};
      return {
        symbol: m.symbol,
        name: m.name,
        price: typeof row.usd === 'number' ? row.usd : 0,
        changePct: typeof row.usd_24h_change === 'number' ? row.usd_24h_change : 0,
      };
    });
  } finally {
    clearTimeout(timer);
  }
}
