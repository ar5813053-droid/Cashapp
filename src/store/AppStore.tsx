import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { VirtualCard } from '../types';
import { CARDS as DEFAULT_CARDS } from '../mock-data';

const KEY = '@justpay/v3';

export type Profile = {
  displayName: string;
  username: string;
  avatarUri: string | null;
  accent: string;
  currency: string;
};

export type Position = {
  id: string;
  symbol: string;
  name: string;
  qty: number;
  avgPrice: number;
  side: 'long';
};

export type TradeRecord = {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;
  fee: number;
  at: number;
  status: 'filled' | 'rejected';
  note?: string;
};

export type AppState = {
  profile: Profile;
  startingCash: number;
  cash: number;
  positions: Position[];
  trades: TradeRecord[];
  cards: VirtualCard[];
  watchlist: string[];
};

const defaultState: AppState = {
  profile: {
    displayName: 'Alex',
    username: '@alex',
    avatarUri: null,
    accent: '#3B82F6',
    currency: 'USD',
  },
  startingCash: 10000,
  cash: 10000,
  positions: [],
  trades: [],
  cards: DEFAULT_CARDS.map((c) => ({ ...c })),
  watchlist: ['bitcoin', 'ethereum', 'solana'],
};

type Ctx = {
  ready: boolean;
  state: AppState;
  setProfile: (p: Partial<Profile>) => void;
  setStartingCash: (n: number) => void;
  resetPortfolio: () => void;
  setCards: (cards: VirtualCard[]) => void;
  toggleWatch: (id: string) => void;
  buy: (symbol: string, name: string, qty: number, price: number) => { ok: boolean; error?: string };
  sell: (symbol: string, qty: number, price: number) => { ok: boolean; error?: string };
  equity: (marks: Record<string, number>) => { cash: number; portfolio: number; total: number; pnl: number };
};

const AppCtx = createContext<Ctx | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as AppState;
          setState({ ...defaultState, ...parsed, profile: { ...defaultState.profile, ...parsed.profile } });
        }
      } catch {
        /* keep defaults */
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => undefined);
  }, [state, ready]);

  const setProfile = useCallback((p: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...p } }));
  }, []);

  const setStartingCash = useCallback((n: number) => {
    const v = Math.max(0, Math.round(n * 100) / 100);
    setState((s) => ({
      ...s,
      startingCash: v,
      // Adjust cash by delta from previous starting only if no positions? Keep simple: set both when no positions
      cash: s.positions.length === 0 ? v : s.cash,
    }));
  }, []);

  const resetPortfolio = useCallback(() => {
    setState((s) => ({
      ...s,
      cash: s.startingCash,
      positions: [],
      trades: [],
    }));
  }, []);

  const setCards = useCallback((cards: VirtualCard[]) => {
    setState((s) => ({ ...s, cards }));
  }, []);

  const toggleWatch = useCallback((id: string) => {
    setState((s) => {
      const has = s.watchlist.includes(id);
      return {
        ...s,
        watchlist: has ? s.watchlist.filter((x) => x !== id) : [...s.watchlist, id],
      };
    });
  }, []);

  const buy = useCallback((symbol: string, name: string, qty: number, price: number) => {
    if (!(qty > 0) || !(price > 0)) return { ok: false, error: 'Invalid quantity or price' };
    const fee = Math.round(qty * price * 0.001 * 100) / 100; // 0.1% sim fee
    const cost = Math.round((qty * price + fee) * 100) / 100;
    let result: { ok: boolean; error?: string } = { ok: true };
    setState((s) => {
      if (cost > s.cash + 1e-9) {
        result = { ok: false, error: 'Insufficient virtual cash' };
        return s;
      }
      const existing = s.positions.find((p) => p.symbol === symbol);
      let positions: Position[];
      if (existing) {
        const newQty = existing.qty + qty;
        const avg = (existing.avgPrice * existing.qty + price * qty) / newQty;
        positions = s.positions.map((p) =>
          p.symbol === symbol ? { ...p, qty: newQty, avgPrice: avg } : p
        );
      } else {
        positions = [
          ...s.positions,
          {
            id: `${symbol}-${Date.now()}`,
            symbol,
            name,
            qty,
            avgPrice: price,
            side: 'long',
          },
        ];
      }
      const trade: TradeRecord = {
        id: `t-${Date.now()}`,
        symbol,
        side: 'buy',
        qty,
        price,
        fee,
        at: Date.now(),
        status: 'filled',
      };
      return { ...s, cash: Math.round((s.cash - cost) * 100) / 100, positions, trades: [trade, ...s.trades] };
    });
    return result;
  }, []);

  const sell = useCallback((symbol: string, qty: number, price: number) => {
    if (!(qty > 0) || !(price > 0)) return { ok: false, error: 'Invalid quantity or price' };
    let result: { ok: boolean; error?: string } = { ok: true };
    setState((s) => {
      const pos = s.positions.find((p) => p.symbol === symbol);
      if (!pos || pos.qty < qty) {
        result = { ok: false, error: 'Insufficient holdings' };
        return s;
      }
      const fee = Math.round(qty * price * 0.001 * 100) / 100;
      const proceeds = Math.round((qty * price - fee) * 100) / 100;
      const left = pos.qty - qty;
      const positions =
        left <= 1e-9
          ? s.positions.filter((p) => p.symbol !== symbol)
          : s.positions.map((p) => (p.symbol === symbol ? { ...p, qty: left } : p));
      const trade: TradeRecord = {
        id: `t-${Date.now()}`,
        symbol,
        side: 'sell',
        qty,
        price,
        fee,
        at: Date.now(),
        status: 'filled',
      };
      return {
        ...s,
        cash: Math.round((s.cash + proceeds) * 100) / 100,
        positions,
        trades: [trade, ...s.trades],
      };
    });
    return result;
  }, []);

  const equity = useCallback(
    (marks: Record<string, number>) => {
      let portfolio = 0;
      for (const p of state.positions) {
        const m = marks[p.symbol] ?? p.avgPrice;
        portfolio += p.qty * m;
      }
      portfolio = Math.round(portfolio * 100) / 100;
      const total = Math.round((state.cash + portfolio) * 100) / 100;
      const pnl = Math.round((total - state.startingCash) * 100) / 100;
      return { cash: state.cash, portfolio, total, pnl };
    },
    [state.cash, state.positions, state.startingCash]
  );

  const value = useMemo(
    () => ({
      ready,
      state,
      setProfile,
      setStartingCash,
      resetPortfolio,
      setCards,
      toggleWatch,
      buy,
      sell,
      equity,
    }),
    [ready, state, setProfile, setStartingCash, resetPortfolio, setCards, toggleWatch, buy, sell, equity]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useAppStore outside provider');
  return ctx;
}
