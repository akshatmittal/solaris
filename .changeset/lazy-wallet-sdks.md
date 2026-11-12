---
"solariskit": patch
---

Wallet SDKs (WalletConnect, MetaMask Mobile, and Base) no longer load when the page loads. They load when the connect modal opens, when a `WalletButton` for that wallet mounts, or when the wallet connects. The wallet that connected last still loads at page load, so its session restores. While a wallet's SDK loads, its row shows a spinner and cannot be selected. In the example app, this removes about 515 kB (transferred) of JavaScript from the page load.

Wallets with a QR code, such as WalletConnect, now open the QR step as soon as you select them. The QR area shows a spinner until the wallet returns its connection URI, which can take about a second.

Fixed: after you open WalletConnect and go back, MetaMask Mobile now shows its QR code. The two wallets share one WalletConnect provider, which reported the new URI only to the wallet that connected first. A QR wallet that fails before it returns a URI now shows "Connection declined" with Retry.
