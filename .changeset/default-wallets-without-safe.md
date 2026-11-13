---
"solariskit": minor
---

The default EVM wallet list is now Browser Wallet, WalletConnect, and Base, in that order. Safe is no longer in the default list of `getDefaultConfig` and `getDefaultWallets`, so apps that use the default list no longer need the `@safe-global/safe-apps-provider` and `@safe-global/safe-apps-sdk` peers. To keep Safe, pass your own list that includes `safeWallet` from `solariskit/wallets`:

```ts
import { base, injectedWallet, safeWallet, walletConnectWallet } from "solariskit/wallets";

getDefaultConfig({
  // ...
  wallets: [{ groupName: "Popular", wallets: [injectedWallet, safeWallet, walletConnectWallet, base] }],
});
```
