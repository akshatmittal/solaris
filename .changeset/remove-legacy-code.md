---
"solariskit": minor
---

Remove legacy RainbowKit code.

- Remove the Rainbow enhanced-provider ENS fallback, its HTTP client, and its localStorage cache. ENS names come from wagmi `useEnsName` when mainnet is configured.
- Stop writing `rk-version` to localStorage.
- Remove the `__private__` export.
- Remove `@tanstack/react-query` from the peer dependencies. The package no longer imports it. wagmi still needs it.
- Remove unused helpers.
- The modal switches between wide and compact using a `(min-width: 768px)` media query. Before, it used a resize listener with a 500ms debounce, so the switch is now immediate.
- Wallet grouping uses `Object.groupBy`. This needs Chrome 117, Firefox 119, or Safari 17.4 or later.
