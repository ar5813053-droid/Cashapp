# Pulse Pay (Demo)

Offline-first **UI demo** fintech shell. Not a real bank.

## Standalone Android APK

GitHub Actions builds a **release** APK with the JavaScript bundle embedded.
It does **not** require Metro, Expo Go, or `localhost:8081`.

Download the latest artifact from Actions: **PulsePay-Standalone-APK**.

## Offline behavior

- Home, Cards, Recipients, Payments, Activity, Settings: local mock data only.
- **Market** tab: only feature that uses the network (CoinGecko public API). Offline shows “Unable to load market feed” + Retry.

## Develop

```bash
npm install
npx expo start
```

Package id: `com.demo.pulsepay`
