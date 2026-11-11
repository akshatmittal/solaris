---
"solariskit": minor
---

Remove legacy RainbowKit code.

- Remove the Rainbow enhanced-provider ENS fallback, its HTTP client, and its localStorage cache. ENS names come from wagmi `useEnsName` when mainnet is configured.
- Stop writing `rk-version` to localStorage.
- Remove the `__private__` export.
- Remove `@tanstack/react-query` from the peer dependencies. The package no longer imports it. wagmi still needs it.
- Remove unused helpers.
