# solariskit

## 1.12.0

### Minor Changes

- 67c1af6: WalletConnect now uses one connector and one WalletConnect client. Before, the wallet list made a second WalletConnect connector for the official WalletConnect modal, with its own client and session storage. Now the "Open" button shows the official modal (Reown AppKit) on the same client as the Solaris QR code, so a page loads one WalletConnect client instead of two.

  - The `@walletconnect/ethereum-provider` peer is now `^2.26.0`. Install `@reown/appkit@^1.8.19` when you use WalletConnect. The official modal uses it: the "Open" button on desktop, and the wallet list on mobile. `@walletconnect/ethereum-provider` already depends on it, but strict package managers such as pnpm need it as a direct dependency.
  - The modal has analytics, email, and social login turned off. Reown AppKit still sends one `INITIALIZE` event when it first opens.
  - Removed the `walletConnectParameters` option from `getDefaultConfig` and `connectorsForWallets`, the `options` parameter of `walletConnectWallet`, and the `SolarisWalletConnectParameters` type. SolarisKit builds the WalletConnect metadata from `appName`, `appDescription`, `appUrl`, and `appIcon`, and keeps WalletConnect telemetry off. `getWalletConnectConnector` and custom wallets now get `{ projectId, metadata }`.
  - WalletConnect now uses its default storage prefix. Existing WalletConnect sessions do not restore, so those users connect again once.
  - With Sign-In with Ethereum, a connect through the official modal now opens the Solaris sign-in step right away. Before, the user had to click the connect button again. Opening the modal also no longer disconnects the pending connect.
  - Removed from `SolarisDetails`: `isWalletConnectModalConnector`, `walletConnectModalConnector`, and `showQrModal`.

## 1.11.0

### Minor Changes

- 4f6e3eb: The default EVM wallet list is now Browser Wallet, WalletConnect, and Base, in that order. Safe is no longer in the default list of `getDefaultConfig` and `getDefaultWallets`, so apps that use the default list no longer need the `@safe-global/safe-apps-provider` and `@safe-global/safe-apps-sdk` peers. To keep Safe, pass your own list that includes `safeWallet` from `solariskit/wallets`:

  ```ts
  import { base, injectedWallet, safeWallet, walletConnectWallet } from "solariskit/wallets";

  getDefaultConfig({
    // ...
    wallets: [{ groupName: "Popular", wallets: [injectedWallet, safeWallet, walletConnectWallet, base] }],
  });
  ```

## 1.10.0

### Minor Changes

- 3f19641: Rename every RainbowKit name to Solaris. The old names are removed, so update your code:

  - `RainbowKitProvider` is now `SolarisEthereumProvider`, and `RainbowKitProviderProps` is now `SolarisEthereumProviderProps`.
  - `SolanaKitProvider` (from `solariskit/solana`) is now `SolarisSolanaProvider`, and `SolanaKitProviderProps` is now `SolarisSolanaProviderProps`. Its `config` type, `SolanaKitConfig`, is now `SolarisSolanaConfig`.
  - `RainbowKitAuthenticationProvider` is now `SolarisAuthenticationProvider`.
  - The `RainbowKitWalletConnectParameters` type is now `SolarisWalletConnectParameters`.
  - A custom `Wallet`'s `createConnector` now receives `walletDetails.solarisDetails` instead of `walletDetails.rkDetails`. Its `isRainbowKitConnector` field is now `isSolarisConnector`, also on the `connector` that `WalletButton.Custom` passes to its render function.
  - The theme CSS custom properties are now `--solaris-*` instead of `--rk-*`. The provider root attribute is now `data-solaris` instead of `data-rk`. Update any CSS that reads these.
  - The components no longer render `data-testid` attributes.

  Saved wallet and transaction state in `localStorage` keeps its keys, so recent wallets and pending transactions survive the upgrade.

## 1.9.0

### Minor Changes

- c6e2521: Polish the modal layout, motion, and touch behavior.

  - The Verify Account step always shows a full-width Cancel button. Its buttons are 48px tall below 768px and 44px from 768px.
  - The network modal uses larger icons, hides the scrollbar, and does not focus the search on touch screens (`pointer: coarse`) instead of on mobile user agents.
  - Fix: the connect button fetches the balance whenever `showBalance` shows it at any screen size, and CSS shows or hides it by width. Before, an iPad or a wide phone in landscape left the balance empty, because the fetch followed the user agent.
  - Screen width now chooses the layout, not the user agent. Screens narrower than 768px get the bottom sheet; wider screens get the dialog. An iPad now gets a 360px dialog instead of a full-width sheet, and a narrow desktop window gets the sheet.
  - The EVM and Solana connect modals show wallets as a list on every device; the mobile wallet grid is removed. The user agent still chooses what a tap does: phones and tablets open the wallet app, and desktop browsers show the QR code or use the extension. On mobile, a tap now also opens the same status step as desktop ("Opening X…", "Accept connection request in the wallet", Back, and Retry after a decline); before, the list stayed and a decline showed under it. After Back, a connecting wallet shows a spinner and stays selectable, so you can reopen its status or repeat the deep link.
  - Opening the WalletConnect modal no longer leaves an empty screen while its SDK loads. The connect modal stays open, on mobile with the "Opening WalletConnect…" status, and closes when the WalletConnect modal can show. Before, it closed at once, and on a slow network nothing showed for several seconds. On desktop, the "Open" button shows "Opening…" while it waits, and "Connection declined" if the WalletConnect modal fails to load. While the WalletConnect modal loads, the mobile status step shows no confirmation text, because no request waits in a wallet yet.
  - With an app disclaimer, the mobile connect view shows the disclaimer in place of the "New to wallets? Get a Wallet" footer, the same as on desktop. Before, the mobile view showed both.
  - On wider screens the dialog has a fixed top edge instead of being centered, so it does not move when its height changes, for example while you filter the network list.
  - Fix: modals fit short screens, such as a phone in landscape. Content taller than the screen scrolls with a thin scrollbar, and a new view starts at the top. The network list and the desktop wallet list shrink so the title, search, and footer stay visible. Before, content outside the screen could not be reached.
  - Dialog exits use a strong ease-out curve instead of `ease-in`. The mobile sheet uses an iOS-style sheet curve.
  - Buttons, triggers, and links scale to 0.97 while pressed; network, transaction, and wallet rows darken past their hover color. Disabled controls do not react to a press. With reduced motion turned on, nothing scales.
  - Hover styles apply only to devices with a mouse or trackpad, so they no longer stick after a tap on touch screens.
  - Controls fire taps without the double-tap delay, and a long press no longer selects their label.
  - The sheet keeps every view above the iPhone home indicator. Before, only the mobile wallet list did this.
  - The wallet list and the wallet pane fade in when they replace each other, and the Copy Address icon crossfades to the Copied icon. Icons do not animate when the account modal opens.
  - The spinner turns faster (750ms per turn).
  - The network search gets focus when the network modal opens on desktop, and the native search clear button is hidden.
  - Long network names in `ChainSelectButton` truncate at 160px and show the full name on hover.
  - The Verify Account and mobile connecting views give the dialog its accessible name.
  - Balances below 0.001 show as 0 instead of an exponent such as `1e-7`. Large balances use the en-US compact format (`12.3K` instead of `12.3k`, `1.2M` instead of `1.2m`).
  - Truncated ENS names end with an ellipsis character (`…`) instead of three periods.
  - The transaction statuses and the "Back", "Close", and "Chain Selector" labels are now translation strings.

- 60a18c9: Remove the MetaMask Mobile wallet (`metaMaskWallet`). It was a WalletConnect connector with a MetaMask icon and deep link, so it gave the same result as the WalletConnect wallet. The default wallet list is now, in order, injected browser wallets, Safe, Base, and WalletConnect. The MetaMask extension still shows in the "Installed" group, and MetaMask Mobile still connects through WalletConnect.

  Breaking: `solariskit/wallets` no longer exports `metaMaskWallet` or `MetaMaskWalletOptions`, and `<WalletButton wallet="metaMask" />` no longer finds a wallet. Remove `metaMaskWallet` from custom wallet lists.

### Patch Changes

- 91df2b5: Wallet SDKs (WalletConnect, MetaMask Mobile, and Base) no longer load when the page loads. They load when the connect modal opens, when a `WalletButton` for that wallet mounts, or when the wallet connects. The wallet that connected last still loads at page load, so its session restores. If an app keeps more than one connection open, a WalletConnect or Base session that did not connect last no longer restores after a page reload. While a wallet's SDK loads, its row shows a spinner and cannot be selected. In the example app, this removes about 515 kB (transferred) of JavaScript from the page load.

  Wallets with a QR code, such as WalletConnect, now open the QR step as soon as you select them. The QR area shows a spinner until the wallet returns its connection URI, which can take about a second.

  Fixed: after you open WalletConnect and go back, MetaMask Mobile now shows its QR code. The two wallets share one WalletConnect provider, which reported the new URI only to the wallet that connected first. A QR wallet whose connection fails, before or after it shows the QR code (for example when the QR code expires after 5 minutes), now shows "Connection declined" with Retry instead of a QR code that no longer works. If no URI arrives in 30 seconds, for example when the WalletConnect relay is unreachable, the QR step shows "Couldn’t load QR code" with Retry. Retry requests a new QR code. Going back before the QR code loads no longer reopens the QR step.

  The `connector` that `WalletButton` passes to its render function no longer has `getQrCodeUri()`. It has `watchQrCodeUri(onUri)` in its place, which calls `onUri` with each new QR code URI and returns a function that stops the watch.

- e31050a: Build with tsdown 0.23. The type declarations in `dist` have a new layout, but the exported types do not change.

## 1.8.0

### Minor Changes

- e5bb98f: Remove legacy RainbowKit code.

  - Remove the Rainbow enhanced-provider ENS fallback, its HTTP client, and its localStorage cache. ENS names come from wagmi `useEnsName` when mainnet is configured.
  - Stop writing `rk-version` to localStorage.
  - Remove the `__private__` export.
  - Remove `@tanstack/react-query` from the peer dependencies. The package no longer imports it. wagmi still needs it.
  - Remove unused helpers.
  - Remove the wide connect modal and the `modalSize` prop from `RainbowKitProvider` and `SolanaKitProvider`. The connect modal is always the 360px compact layout on desktop and the bottom sheet on mobile.
  - Wallet grouping uses `Object.groupBy`. This needs Chrome 117, Firefox 119, or Safari 17.4 or later.

- 3967211: Make the bundle smaller. An app with the provider, `ConnectButton`, and `getDefaultConfig` now adds about 104 kB minified (38 kB gzip) instead of 115 kB (40 kB gzip).

  - Ship the library as one file per module instead of one bundle per entry, so bundlers drop the code that the app does not import. An import of the themes only now adds about 3 kB instead of 14 kB.
  - Remove the theme variables that no component uses: the colors `actionButtonBorder`, `actionButtonBorderMobile`, `connectButtonInnerBackground`, `downloadBottomCardBackground`, `downloadTopCardBackground`, `generalBorderDim`, and `selectedOptionBorder`, and the shadows `profileDetailsAction`, `selectedOption`, `selectedWallet`, and `walletLogo`. Remove these keys from custom themes that set them.
  - Minify `styles.css`.
  - Optimize the wallet icons and the inline icon paths.

- 87ee57a: Replace vanilla-extract with StyleX and redesign the UI.

  Styles now compile at build time to one atomic stylesheet. `solariskit/styles.css` is smaller (about 27 kB, 5 kB gzip, down from 45 kB), and the runtime sprinkles class map is no longer in the JavaScript bundle. The `@vanilla-extract/*` and `clsx` dependencies are replaced by `@stylexjs/stylex`. The package is now marked `sideEffects: false`. Consumers still import `solariskit/styles.css` and need no StyleX build plugin.

  The theme API does not change. `lightTheme`, `darkTheme`, `midnightTheme`, `cssStringFromTheme`, and `cssObjectFromTheme` keep their signatures, and themes still set the same `--rk-*` CSS variables.

  The modals and buttons keep the same elements and layout, with a cleaner design:

  - The modals and buttons use the page font by default (new `fontStack: "inherit"`, now the default). `fontStack: "system"` and `"rounded"` still give a fixed font stack. Typography uses a 400/500/600 weight scale. Dialog titles, section titles, and buttons use Title Case ("Connect Wallet", "Switch Network", "Verify Account", "Copy Address"). Descriptions and status text use sentence case.
  - The default blue accent uses the Apple system blues with white text: `#007AFF` in the light theme, and `#0A84FF` in the dark and midnight themes.
  - Scrolling wallet and network lists use a thin rounded scrollbar in the dim text color, with no arrows or track. The mobile network list still hides its scrollbar.
  - Wallet and network rows are transparent with a hover fill. The selected network has a 10% accent tint and a "Connected" label. Wallet and network icons have no border. MetaMask Mobile uses the same fox icon as the MetaMask extension.
  - All modals are 360px wide with a 24px content inset.
  - The connecting views show a small spinner under the text, in the place where Retry appears after a decline. The wallet icon has no ring. The icon, text, and spinner or Retry are centered in the card together and do not move between the two states. Mobile wallet tiles show the same spinner in place of the label while connecting.
  - The "What is a wallet?" screen and the compact Info button are removed. The compact footer and the mobile sheet link straight to the get-wallet page with "New to wallets? Get a Wallet".
  - The QR code has no border card in light mode, and its modules align with the content edge. Its button reads "Get <wallet>".
  - The account modal has clearer actions, a green "Copied" state, a "Clear All" link, and a pending-transaction dot on the avatar.
  - The sign-in view and the empty state use line icons instead of images. When verification fails, the sign-in view drops the used nonce and shows Retry, which fetches a new one.
  - The mobile sheet has a 4-column wallet grid with full names. It shows the same labelled groups as desktop, so installed wallets (EIP-6963) appear in an "Installed" group above "Popular". Screens narrower than 375px use 2 columns.
  - The account button shows a loader while the balance loads, and hides the balance and its divider if loading fails or when `showBalance` hides it on small screens. `ConnectButton.Custom` gets `account.isBalanceLoading`.
  - Trigger labels are trimmed to cap height, so names and balances center on their icons in every font.
  - Buttons no longer grow on hover or shrink on press. On hover, the background fades over 100ms to an 8% tint of the text color, which also shows on dark and black backgrounds. Keyboard focus shows a visible outline.
  - Dialogs animate out as well as in, including when a wallet connects or disconnects. With reduced motion, dialogs only fade.
  - All motion uses one duration set: 100ms for hover and press, 150ms to open and 100ms to close dialogs, 200ms and 150ms for the mobile sheet, and 1s for every loading loop.

### Patch Changes

- 39fff32: Align the Solana and EVM connect flows.

  - The Solana connect modal now uses the EVM status view on desktop. Picking a wallet shows "Opening <wallet>…" with a spinner and a back button, and a declined connection shows "Connection declined" with Retry.
  - The Solana connect modal no longer closes when the wallet declines the connection, and it no longer shows the raw wallet error when it opens again.
  - On mobile, EVM wallet tiles now show a spinner while connecting, and both EVM and Solana sheets show "Connection declined" when the wallet declines.
  - On desktop, an EVM wallet that declines at once (within 50ms) now shows Retry instead of a spinner that never stops.

- aa507aa: Modals now animate their height when the content changes, for example from the wallet list to the connecting status, to the sign-in step, or while filtering networks. The width stays fixed. The animation uses the 150ms enter duration, does not run when a modal first opens, and is off with reduced motion.
- 7868da3: Keep the network modal open when the network switch fails, for example when the user rejects the request in the wallet. The modal now closes only after a successful switch.
- 7868da3: Fix the status flash on a network row for wallets that switch the network without a confirmation. A row that shows "Connected" no longer shows "Confirm in wallet" also, and "Confirm in wallet" now shows after a delay of 300 ms.
- 7fba85b: Simplify the build. The `[data-rk]` selector prefix now comes from the Lightning CSS step in the StyleX plugin, so PostCSS, Autoprefixer, `postcss-prefix-selector`, and `@rollup/plugin-replace` are no longer dev dependencies. `styles.css` drops vendor prefixes that the default browserslist does not need, such as `-moz-appearance` and `::-moz-placeholder`. The package version is set with tsdown `define`, and translations load as JSON.
- 88f6ae2: Present Solaris as a standalone project. The READMEs, package metadata, and example app describe SolarisKit on its own, with a short note that it started as a fork of RainbowKit. The LICENSE keeps the original RainbowKit copyright notice.
- Updated dependencies [88f6ae2]
  - @akshatmittal/polycons@1.1.1

## 1.7.0

### Minor Changes

- 51a99d4: Upgrade the Solana stack to `@solana/connector` 0.3.0 and `@solana/kit` v8. The `@solana/connector` peer range is now `^0.3.0` and the `@solana/kit` peer range is now `^8.6.0`. Solana consumers need `@tanstack/react-query` 5.103.1 or later, the peer range of `@solana/react`, which connector 0.3.0 depends on.

  `@solana/web3.js` is no longer needed. `@solana/connector` lazy-imports it only for legacy web3.js transaction objects, which the Kit signer never uses. Bundlers must still resolve the import, so alias it to an empty module (see the README).

  Remove the SolarisKit Solana auto-reconnect. Connector 0.3.0 always connects interactively, so a reconnect started by SolarisKit could open a wallet prompt on page load. The connector `autoConnect` now restores the session silently, and an explicit disconnect clears it. The `rk-solana-latest-id` and `rk-solana-reconnect-disabled` keys are no longer written.

  `useSolanaKitTransactionSigner` accepts the connector `chain` option, and the `SolanaKitTransactionSignerOptions` type is exported. Connector 0.3.0 returns no signer when it cannot get a wallet chain from the active cluster, so apps with a custom cluster ID must pass `chain`.

### Patch Changes

- ee57b45: Upgrade `qr` to 0.7.2 and replace the `cuer` dependency with a built-in QR code renderer adapted from `cuer@0.0.3`. `cuer@0.0.3` requests a zero-width quiet zone, which `qr` 0.6 and later reject, so it cannot render QR codes with current `qr` releases. The built-in renderer produces the same QR code markup as before.

## 1.6.2

### Patch Changes

- 17e309b: Add an npm package README covering installation, EVM and Solana setup, wallet dependencies, customization, and migration guidance.
- ba6596b: Keep wallet providers and recent transactions working when browser storage is unavailable, use the browser wallet as the default WalletButton, respect disabled authentication, allow retrying a failed sign-in nonce request, enable the Solana wallet-picker fallback, and display Solana connection errors on mobile.

  On storage recovery, merge retained unsaved transaction snapshots with the latest stored data to preserve other tabs' unrelated transactions without retaining an ever-growing mutation queue. Local hashes take precedence, and local clears apply to their account and chain. Keep storage reads guarded without runtime validation of the stored transaction schema. Simplify fingerprint and transaction persistence wrappers and rely on shared storage guards for ENS caching.

  Continue observing wallet changes while authentication is disabled, and defer sign-out until authentication is re-enabled if the wallet changed.

  Retain at most 10 completed transactions per account and chain without limiting pending transactions.

## 1.6.1

### Patch Changes

- 215fd43: Align the compact Solana connect modal sizing with the EVM connect modal, update the default Solana learn-more destination, and show an actionable empty state when no wallets are detected.
- 2a09694: Remove the repository test suite and its supporting tooling.

## 1.6.0

### Minor Changes

- 8d873c1: Upgrade the supported Solana stack to `@solana/kit` v6 and refresh project dependencies to their latest compatible releases.
- 8d873c1: Tighten selected internal utility and provider types, and remove the unused `emojiAvatarForAddress` helper export.

## 1.5.0

### Minor Changes

- 0321bdf: Add a Solana entrypoint with shared SolarisKit UI, ConnectorKit vNext wallet integration, Solana Kit-compatible hooks, shared Solana cluster icons, Solana-specific latest-wallet reconnect storage, a single merged Solana provider config, and example app wiring for independent Ethereum and Solana provider islands, including matching dummy transactions and explicit Solana cluster RPC configuration.

  `@solana/connector` and `@solana/kit` are optional peer dependencies: install them alongside solariskit to use the `solariskit/solana` entrypoint; EVM-only consumers need no new dependencies. Also install `@solana/web3.js` so bundlers can resolve `@solana/connector`'s legacy-transaction compatibility path — it is code-split into a lazy chunk and only downloaded at runtime if a wallet returns a legacy web3.js transaction.

### Patch Changes

- b14414e: Fix wallet modal search, copied-address feedback, Solana config imports and connection state, Solana provider reconnect config, and wallet ID and reconnect storage failure handling.

## 1.4.0

### Minor Changes

- 7dd56c5: Add a `fullWidth` prop to `ChainSelectButton` for filling its parent container.
- aea20f8: Split the chain selector out of `ConnectButton`.

  `ConnectButton` now only renders the wallet connect/account button. Use the new `ChainSelectButton` export when you need the chain selector or wrong-network button independently.

## 1.3.0

### Minor Changes

- 0a6b1ec: fix: always sync after connector to deal with spotty connectors

## 1.2.0

### Minor Changes

- dc13687: Pin `qr`
- 2f01f2f: Add persistent network picker

## 1.1.0

### Minor Changes

- 6d17a66: Connectors are now peer deps

### Patch Changes

- Updated dependencies [63e423b]
  - @akshatmittal/polycons@1.1.0
