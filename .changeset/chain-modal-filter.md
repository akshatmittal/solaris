---
"solariskit": minor
---

`openChainModal` from `useChainModal` takes an optional `filter`, so a page can show only some of the configured chains, for example `openChainModal({ filter: (chain) => chain.id === base.id })`. The filter applies to that opening only; `ChainSelectButton` and `openChainModal()` without a filter list every configured chain. The `ChainModalOptions` type is exported.
