import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import type { PaymentDraft } from '../types';
import { CARDS } from '../mock-data';

type Ctx = {
  draft: PaymentDraft;
  setRecipient: (id: string) => void;
  setCard: (id: string) => void;
  setAmount: (n: number) => void;
  setExpression: (s: string) => void;
  reset: () => void;
};

const defaultDraft: PaymentDraft = {
  recipientId: null,
  amount: 0,
  cardId: CARDS[0]?.id ?? null,
  expression: '',
};

const PaymentContext = createContext<Ctx | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<PaymentDraft>(defaultDraft);

  const setRecipient = useCallback((id: string) => {
    setDraft((d) => ({ ...d, recipientId: id }));
  }, []);

  const setCard = useCallback((id: string) => {
    setDraft((d) => ({ ...d, cardId: id }));
  }, []);

  const setAmount = useCallback((n: number) => {
    setDraft((d) => ({ ...d, amount: n }));
  }, []);

  const setExpression = useCallback((s: string) => {
    setDraft((d) => ({ ...d, expression: s }));
  }, []);

  const reset = useCallback(() => setDraft(defaultDraft), []);

  const value = useMemo(
    () => ({ draft, setRecipient, setCard, setAmount, setExpression, reset }),
    [draft, setRecipient, setCard, setAmount, setExpression, reset]
  );

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
}

export function usePayment() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayment must be used within PaymentProvider');
  return ctx;
}
