# Screen inventory & visual corrections

Demo UI only — not a real bank. Reference: product walkthrough video (~15s).

## Screens

| Screen | Route | Notes |
|--------|-------|-------|
| Home | `/(tabs)` | Balance, spending+avatars, fanned cards, transactions sheet |
| Cards | `/(tabs)/cards` | Digital cards + freeze |
| Recipients | `/(tabs)/recipients` | Grid + list → payment |
| Amount | `/payments/amount` | Keypad + operators |
| Confirm | `/payments/confirm` | Swipe to confirm |
| Success | `/payments/success` | Green check |
| Activity | `/(tabs)/activity` | Search + rows |
| Settings | `/(tabs)/settings` | Demo toggles |

## This polish pass

- Home: spending avatar cluster, larger fanned card stack (`app/(tabs)/index.tsx`)
- Amounts: `-60 $` style (`src/mock-data/index.ts`)
- Reduced motion hook (`src/animations/reducedMotion.ts`)

## Remaining gaps

Not pixel-perfect; initials not photos; system fonts on Android; no full physics card carousel.
