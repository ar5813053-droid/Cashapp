function equity(cash: number, qty: number, mark: number) {
  return Math.round((cash + qty * mark) * 100) / 100;
}
function buy(cash: number, qty: number, price: number, feeRate = 0) {
  const fee = Math.round(qty * price * feeRate * 100) / 100;
  const cost = Math.round((qty * price + fee) * 100) / 100;
  if (cost > cash) return null;
  return { cash: Math.round((cash - cost) * 100) / 100, qty, avg: price };
}
function sell(cash: number, held: number, avg: number, qty: number, price: number, feeRate = 0) {
  if (qty > held) return null;
  const fee = Math.round(qty * price * feeRate * 100) / 100;
  const proceeds = Math.round((qty * price - fee) * 100) / 100;
  const realized = Math.round((price - avg) * qty * 100) / 100 - fee;
  return {
    cash: Math.round((cash + proceeds) * 100) / 100,
    held: held - qty,
    realized,
  };
}

// profit scenario
let cash = 1000;
const b = buy(cash, 1, 100)!;
cash = b.cash;
if (equity(cash, 1, 100) !== 1000) throw new Error('entry equity');
if (equity(cash, 1, 120) !== 1020) throw new Error('unrealized');
const s = sell(cash, 1, 100, 1, 120)!;
if (s.cash !== 1020 || s.realized !== 20) throw new Error('profit close ' + JSON.stringify(s));

// loss
cash = 1000;
const b2 = buy(cash, 1, 100)!;
const s2 = sell(b2.cash, 1, 100, 1, 80)!;
if (s2.cash !== 980 || s2.realized !== -20) throw new Error('loss ' + JSON.stringify(s2));

console.log('trading-ledger checks passed');
