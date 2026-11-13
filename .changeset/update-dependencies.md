---
"solariskit": patch
"@akshatmittal/polycons": patch
"example": patch
---

Update the workspace dependencies and move the project to Node 26 and pnpm 12. The packages are now built with TypeScript 7 and tsdown 0.23. The type declarations in `dist` now come from the TypeScript 7 compiler, one file for each source file. The exported types do not change. The `engines` field of the published packages still allows Node 24.

The example app gets `next` 16.4.6, `nuqs` 2.10.3, `@walletconnect/ethereum-provider` 2.26.0, `react` and `react-dom` 19.3.1, `viem` 2.57.18, and `wagmi` 3.7.11. `@base-org/account` stays at 2.5.7, because 2.6.0 needs `@coinbase/cdp-sdk` 1.56 or later, which imports its optional `@x402/*` peers in code that the Next.js server build reaches.
