
// smoke runner
function equity(cash, qty, mark) { return Math.round((cash + qty * mark) * 100) / 100; }
function buy(cash, qty, price) {
  const cost = Math.round(qty * price * 100) / 100;
  if (cost > cash) return null;
  return { cash: Math.round((cash - cost) * 100) / 100 };
}
function sell(cash, held, avg, qty, price) {
  if (qty > held) return null;
  const proceeds = Math.round(qty * price * 100) / 100;
  return { cash: Math.round((cash + proceeds) * 100) / 100, realized: Math.round((price - avg) * qty * 100) / 100 };
}
let cash = 1000;
const b = buy(cash, 1, 100);
if (equity(b.cash, 1, 120) !== 1020) throw new Error('unrealized');
const s = sell(b.cash, 1, 100, 1, 120);
if (s.cash !== 1020 || s.realized !== 20) throw new Error('profit');
const b2 = buy(1000, 1, 100);
const s2 = sell(b2.cash, 1, 100, 1, 80);
if (s2.cash !== 980) throw new Error('loss');
console.log('smoke ok');
