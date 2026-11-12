---
"solariskit": patch
---

Wallet SDKs (WalletConnect, MetaMask Mobile, Base, and Safe) no longer load when the page loads. They load when the connect modal opens, when a `WalletButton` for that wallet mounts, or when the wallet connects. The wallet that connected last still loads at page load, so its session restores. While a wallet's SDK loads, its row shows a spinner and cannot be selected. In the example app, this removes about 515 kB (transferred) of JavaScript from the page load.
