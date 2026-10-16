import { evaluateExpression, isValidPaymentAmount } from '../src/utils/safeCalc';

const cases: [string, number][] = [
  ['2×4', 8],
  ['2 * 4', 8],
  ['25 + 15', 40],
  ['50 - 12', 38],
  ['6 × 7', 42],
  ['100 ÷ 4', 25],
  ['2.5 × 4', 10],
  ['10', 10],
];
for (const [expr, expected] of cases) {
  const r = evaluateExpression(expr);
  if (!r.ok || r.value !== expected) throw new Error(`${expr} => ${JSON.stringify(r)} expected ${expected}`);
}
const z = evaluateExpression('10 ÷ 0');
if (z.ok) throw new Error('div zero should fail');
const inc = evaluateExpression('2×');
if (inc.ok) throw new Error('incomplete should fail');
if (!isValidPaymentAmount(8) || isValidPaymentAmount(0)) throw new Error('amount gate');
console.log('safeCalc checks passed');
