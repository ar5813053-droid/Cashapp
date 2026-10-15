import { colors } from '../design/tokens';
import type { VirtualCard, Recipient, LinkedAccount, Transaction } from '../types';

/** Demo-only sample data. Not real accounts or balances. */
export const DEMO_BALANCE = 7854.43;
export const DEMO_SPENDING = 1385;

export const CARDS: VirtualCard[] = [
  {
    id: 'c1',
    label: 'Digital card',
    last4: '7642',
    color: colors.cardYellow,
    textColor: '#1A1A00',
    frozen: false,
  },
  {
    id: 'c2',
    label: 'Digital card',
    last4: '5123',
    color: colors.cardMint,
    textColor: '#003322',
    frozen: false,
  },
  {
    id: 'c3',
    label: 'Digital card',
    last4: '3413',
    color: colors.cardBlue,
    textColor: '#FFFFFF',
    frozen: true,
  },
];

export const RECIPIENTS: Recipient[] = [
  { id: 'r1', name: 'Sarah', handle: '@sarahdesi…', avatarColor: '#F472B6', initials: 'S' },
  { id: 'r2', name: 'Pavlo', handle: '@designwitha…', avatarColor: '#60A5FA', initials: 'P' },
  { id: 'r3', name: 'Jordan', handle: '@jordan.creat…', avatarColor: '#34D399', initials: 'J' },
  { id: 'r4', name: 'Chris', handle: '@chrisgraph…', avatarColor: '#A78BFA', initials: 'C' },
  { id: 'r5', name: 'Emily', handle: '@emilyartis…', avatarColor: '#FB7185', initials: 'E' },
  { id: 'r6', name: 'Taylor', handle: '@taylorcrea…', avatarColor: '#FBBF24', initials: 'T' },
];

export const LINKED_ACCOUNTS: LinkedAccount[] = [
  { id: 'a1', name: 'Gigi Hadid', bank: 'Chase', last4: '2983', avatarColor: '#34D399', initials: 'GH' },
  { id: 'a2', name: 'Bella Hadid', bank: 'Mastercard', last4: '9283', avatarColor: '#FBBF24', initials: 'BH' },
  { id: 'a3', name: 'Imaan Hammam', bank: 'HSBC', last4: '4567', avatarColor: '#60A5FA', initials: 'IH' },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', merchant: 'Apple', amount: -60, icon: 'apple', iconColor: '#000000', date: 'Today' },
  { id: 't2', merchant: 'Threads', amount: -300, icon: 'threads', iconColor: '#000000', date: 'Today' },
  { id: 't3', merchant: 'Apple', amount: 2000, icon: 'apple', iconColor: '#000000', date: 'Yesterday' },
  { id: 't4', merchant: 'Exoplan', amount: -20, icon: 'generic', iconColor: '#22C55E', date: 'Yesterday' },
  { id: 't5', merchant: 'Cafe Local', amount: -14.5, icon: 'generic', iconColor: '#F59E0B', date: 'Mon' },
];

/** Match reference: "-60 $" / "2 000 $" style for transaction rows. */
export function formatMoney(n: number, showSign = false): string {
  const abs = Math.abs(n);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).replace(/,/g, ' ');
  if (showSign) {
    if (n > 0) return `${formatted} $`;
    if (n < 0) return `-${formatted} $`;
  }
  return `$${formatted.replace(/ /g, ',')}`;
}

export function formatBalanceParts(n: number): { whole: string; cents: string } {
  const whole = Math.floor(n).toLocaleString('en-US');
  const cents = (n % 1).toFixed(2).slice(1); // ".43"
  return { whole, cents };
}
