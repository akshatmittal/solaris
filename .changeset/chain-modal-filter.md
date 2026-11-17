---
"solariskit": minor
---

`openChainModal` from `useChainModal` takes an optional `filter`, so a page can show only some of the configured chains, for example `openChainModal({ filter: (chain) => chain.id === base.id })`. The filter applies to that opening only; `openChainModal()` without a filter lists every configured chain. The `ChainModalOptions` type is exported.

`ChainSelectButton` takes the same `filter`, for example `<ChainSelectButton filter={(chain) => chain.id === base.id} />`. It also takes `fullWidth`, which stretches the button to the width of its container, for example in a form.
