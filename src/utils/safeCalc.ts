/**
 * Safe arithmetic for payment keypad. No eval().
 * Supports + - × ÷ * / and decimals. One binary op or chain left-to-right for simple ops.
 */

export type CalcResult =
  | { ok: true; value: number; display: string }
  | { ok: false; error: string };

function tokenize(expr: string): string[] {
  const s = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\s/g, '');
  const tokens: string[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if ('+-*/'.includes(c)) {
      // unary minus
      if ((c === '-' || c === '+') && (tokens.length === 0 || '+-*/'.includes(tokens[tokens.length - 1]))) {
        let j = i + 1;
        while (j < s.length && /[0-9.]/.test(s[j])) j++;
        tokens.push(s.slice(i, j));
        i = j;
        continue;
      }
      tokens.push(c);
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      tokens.push(s.slice(i, j));
      i = j;
      continue;
    }
    throw new Error('Invalid character');
  }
  return tokens;
}

function applyOp(a: number, op: string, b: number): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    default:
      throw new Error('Unknown operator');
  }
}

/** Evaluate simple left-to-right or * / precedence */
export function evaluateExpression(expr: string): CalcResult {
  try {
    const cleaned = expr.trim();
    if (!cleaned) return { ok: false, error: 'empty' };
    // pure number
    if (/^-?\d+(\.\d+)?$/.test(cleaned.replace(/×/g, '*').replace(/÷/g, '/'))) {
      const n = parseFloat(cleaned);
      if (!Number.isFinite(n)) return { ok: false, error: 'invalid' };
      return { ok: true, value: n, display: formatNum(n) };
    }
    const tokens = tokenize(cleaned);
    if (tokens.length === 0) return { ok: false, error: 'empty' };
    if (tokens.length === 1) {
      const n = parseFloat(tokens[0]);
      if (!Number.isFinite(n)) return { ok: false, error: 'invalid' };
      return { ok: true, value: n, display: formatNum(n) };
    }
    // incomplete trailing operator
    if ('+-*/'.includes(tokens[tokens.length - 1])) {
      return { ok: false, error: 'incomplete' };
    }

    // First pass * /
    const stack: (string | number)[] = [];
    let i = 0;
    while (i < tokens.length) {
      const t = tokens[i];
      if (t === '*' || t === '/') {
        const a = Number(stack.pop());
        const b = parseFloat(tokens[i + 1]);
        if (!Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, error: 'invalid' };
        stack.push(applyOp(a, t, b));
        i += 2;
      } else {
        stack.push(t);
        i++;
      }
    }
    // Second pass + -
    let acc = Number(stack[0]);
    if (!Number.isFinite(acc)) return { ok: false, error: 'invalid' };
    for (let j = 1; j < stack.length; j += 2) {
      const op = String(stack[j]);
      const b = Number(stack[j + 1]);
      if (!Number.isFinite(b)) return { ok: false, error: 'invalid' };
      acc = applyOp(acc, op, b);
    }
    if (!Number.isFinite(acc)) return { ok: false, error: 'invalid' };
    // monetary precision
    const rounded = Math.round(acc * 100) / 100;
    return { ok: true, value: rounded, display: formatNum(rounded) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'error' };
  }
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return (Math.round(n * 100) / 100).toFixed(2).replace(/\.?0+$/, (m) => (m.includes('.') ? m.replace(/0+$/, '').replace(/\.$/, '') : m));
}

export function isValidPaymentAmount(n: number): boolean {
  return Number.isFinite(n) && n > 0 && n < 1e12;
}
