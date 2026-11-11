---
"solariskit": minor
---

Remove legacy RainbowKit code.

- Remove the Rainbow enhanced-provider ENS fallback, its HTTP client, and its localStorage cache. ENS names come from wagmi `useEnsName` when mainnet is configured.
- Stop writing `rk-version` to localStorage.
- Remove the `__private__` export.
- Remove `@tanstack/react-query` from the peer dependencies. The package no longer imports it. wagmi still needs it.
- Remove unused helpers.
- Remove the wide connect modal and the `modalSize` prop from `RainbowKitProvider` and `SolanaKitProvider`. The connect modal is always the 360px compact layout on desktop and the bottom sheet on mobile.
- Wallet grouping uses `Object.groupBy`. This needs Chrome 117, Firefox 119, or Safari 17.4 or later.
