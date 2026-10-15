# Pulse Pay — Phase 1 (UI Demo)

Premium iOS-style **fintech UI demo** built with Expo + React Native.

**This is not a real banking or payment app.** All balances, cards, recipients, and transfers are mock data. Every flow is clearly labelled **DEMO**.

## Reference

Designed from a supplied product walkthrough video:

1. Home dashboard (balance, card stack, transactions sheet)
2. Cards (stacked digital cards, freeze toggle)
3. Recipients (avatar grid + account list)
4. Amount keypad (operators + numeric pad)
5. Swipe-to-confirm
6. Green success screen

## Stack

- Expo SDK 52
- Expo Router
- TypeScript
- React Native Reanimated
- React Native Gesture Handler

## Run

```bash
cd pulse-pay
npm install --legacy-peer-deps
npx expo start
```

Then press `a` for Android emulator, `i` for iOS simulator, or scan the QR code with Expo Go.

```bash
npm run typecheck
```

## Screens

| Route | Description |
|-------|-------------|
| `/(tabs)` | Home dashboard |
| `/(tabs)/cards` | Virtual cards |
| `/(tabs)/recipients` | Pick recipient → payment |
| `/(tabs)/activity` | Transaction list |
| `/(tabs)/settings` | Demo preferences |
| `/payments/amount` | Keypad |
| `/payments/confirm` | Swipe to confirm |
| `/payments/success` | Success animation |

## Structure

```
app/                 Expo Router screens
src/components/      Reusable UI
src/design/tokens.ts Design system
src/mock-data/       Sample balances & lists
src/context/         Payment draft state
```
