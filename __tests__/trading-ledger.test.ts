/**
 * Lightweight accounting checks for the demo ledger rules.
 * Run conceptually in CI; pure functions mirrored from AppStore.
 */
function applyBuy(cash: number, qty: number, price: number) {
  const fee = Math.round(qty * price * 0.001 * 100) / 100;
  const cost = Math.round((qty * price + fee) * 100) / 100;
  if (cost > cash) return { ok: false as const, cash };
  return { ok: true as const, cash: Math.round((cash - cost) * 100) / 100, fee, cost };
}

function applySell(cash: number, held: number, qty: number, price: number) {
  if (qty > held) return { ok: false as const, cash, held };
  const fee = Math.round(qty * price * 0.001 * 100) / 100;
  const proceeds = Math.round((qty * price - fee) * 100) / 100;
  return {
    ok: true as const,
    cash: Math.round((cash + proceeds) * 100) / 100,
    held: held - qty,
  };
}

const buy = applyBuy(1000, 1, 100);
if (!buy.ok || buy.cash !== 899.9) throw new Error('buy failed ' + JSON.stringify(buy));
const reject = applyBuy(50, 1, 100);
if (reject.ok) throw new Error('should reject');
const sell = applySell(900, 1, 1, 110);
if (!sell.ok || sell.held !== 0) throw new Error('sell failed');
console.log('trading-ledger checks passed');
