---
"solariskit": minor
---

WalletConnect now uses one connector and one WalletConnect client. Before, the wallet list made a second WalletConnect connector for the official WalletConnect modal, with its own client and session storage. Now the "Open" button shows the official modal (Reown AppKit) on the same client as the Solaris QR code, so a page loads one WalletConnect client instead of two.

- The `@walletconnect/ethereum-provider` peer is now `^2.26.0`. Install `@reown/appkit@^1.8.19` when you use WalletConnect. The official modal uses it: the "Open" button on desktop, and the wallet list on mobile. `@walletconnect/ethereum-provider` already depends on it, but strict package managers such as pnpm need it as a direct dependency.
- The modal has analytics, email, and social login turned off. Reown AppKit still sends one `INITIALIZE` event when it first opens.
- Removed the `walletConnectParameters` option from `getDefaultConfig` and `connectorsForWallets`, the `options` parameter of `walletConnectWallet`, and the `SolarisWalletConnectParameters` type. SolarisKit builds the WalletConnect metadata from `appName`, `appDescription`, `appUrl`, and `appIcon`, and keeps WalletConnect telemetry off. `getWalletConnectConnector` and custom wallets now get `{ projectId, metadata }`.
- WalletConnect now uses its default storage prefix. Existing WalletConnect sessions do not restore, so those users connect again once.
- Removed from `SolarisDetails`: `isWalletConnectModalConnector`, `walletConnectModalConnector`, and `showQrModal`.
