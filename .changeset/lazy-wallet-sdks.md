---
"solariskit": patch
---

Wallet SDKs (WalletConnect, MetaMask Mobile, and Base) no longer load when the page loads. They load when the connect modal opens, when a `WalletButton` for that wallet mounts, or when the wallet connects. The wallet that connected last still loads at page load, so its session restores. If an app keeps more than one connection open, a WalletConnect or Base session that did not connect last no longer restores after a page reload. While a wallet's SDK loads, its row shows a spinner and cannot be selected. In the example app, this removes about 515 kB (transferred) of JavaScript from the page load.

Wallets with a QR code, such as WalletConnect, now open the QR step as soon as you select them. The QR area shows a spinner until the wallet returns its connection URI, which can take about a second.

Fixed: after you open WalletConnect and go back, MetaMask Mobile now shows its QR code. The two wallets share one WalletConnect provider, which reported the new URI only to the wallet that connected first. A QR wallet whose connection fails, before or after it shows the QR code (for example when the QR code expires after 5 minutes), now shows "Connection declined" with Retry instead of a QR code that no longer works. If no URI arrives in 30 seconds, for example when the WalletConnect relay is unreachable, the QR step shows "Couldn’t load QR code" with Retry. Retry requests a new QR code. Going back before the QR code loads no longer reopens the QR step.

The `connector` that `WalletButton` passes to its render function no longer has `getQrCodeUri()`. It has `watchQrCodeUri(onUri)` in its place, which calls `onUri` with each new QR code URI and returns a function that stops the watch.
