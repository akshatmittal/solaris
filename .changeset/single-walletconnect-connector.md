---
"solariskit": minor
---

WalletConnect now uses one connector and one WalletConnect client. Before, the wallet list made a second WalletConnect connector for the official WalletConnect modal, with its own client and session storage. Now the "Open" button shows the official modal (Reown AppKit) on the same client as the Solaris QR code, so a page loads one WalletConnect client instead of two.

- Install `@reown/appkit@^1.8.19` when you use WalletConnect. The official modal uses it: the "Open" button on desktop, and the wallet list on mobile. `@walletconnect/ethereum-provider` already depends on it, but strict package managers such as pnpm need it as a direct dependency.
- The modal has analytics, email, and social login turned off. Reown AppKit still sends one `INITIALIZE` event when it first opens.
- `walletConnectParameters.qrModalOptions` (theme, recommended and excluded wallets, custom wallets, wallet images, terms and privacy links) now styles this modal.
- Sessions made through the old modal connector (storage prefix `clientOne`) do not restore. Those users connect again once. QR code sessions (prefix `clientTwo`) still restore.
- Removed from `SolarisDetails`: `isWalletConnectModalConnector`, `walletConnectModalConnector`, and `showQrModal`.
