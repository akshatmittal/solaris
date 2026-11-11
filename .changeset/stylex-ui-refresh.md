---
"solariskit": minor
---

Replace vanilla-extract with StyleX and redesign the UI.

Styles now compile at build time to one atomic stylesheet. `solariskit/styles.css` is smaller (about 27 kB, 5 kB gzip, down from 45 kB), and the runtime sprinkles class map is no longer in the JavaScript bundle. The `@vanilla-extract/*` and `clsx` dependencies are replaced by `@stylexjs/stylex`. The package is now marked `sideEffects: false`. Consumers still import `solariskit/styles.css` and need no StyleX build plugin.

The theme API does not change. `lightTheme`, `darkTheme`, `midnightTheme`, `cssStringFromTheme`, and `cssObjectFromTheme` keep their signatures, and themes still set the same `--rk-*` CSS variables.

The modals and buttons keep the same elements and layout, with a cleaner design:

- Typography uses the system UI font stack with a 400/500/600 weight scale. Dialog titles, section titles, and buttons use Title Case ("Connect Wallet", "Switch Network", "Verify Account", "Copy Address"). Descriptions and status text use sentence case.
- The light theme accent is `#0A66E0` for 4.5:1 text contrast. The dark blue preset uses dark text on its accent fill.
- Wallet and network rows are transparent with a hover fill. The selected network has a 10% accent tint and a "Connected" label. Wallet and network icons have no border. MetaMask Mobile uses the same fox icon as the MetaMask extension.
- All modals are 360px wide with a 24px content inset.
- The connecting views show a small spinner under the text, in the place where Retry appears after a decline. The wallet icon has no ring. The icon, text, and spinner or Retry are centered in the card together and do not move between the two states. Mobile wallet tiles show the same spinner in place of the label while connecting.
- The "What is a wallet?" screen and the compact Info button are removed. The compact footer and the mobile sheet link straight to the get-wallet page with "New to wallets? Get a Wallet".
- The QR code has no border card in light mode, and its modules align with the content edge. Its button reads "Get <wallet>".
- The account modal has clearer actions, a green "Copied" state, a "Clear All" link, and a pending-transaction dot on the avatar.
- The sign-in view and the empty state use line icons instead of images. When verification fails, the sign-in view drops the used nonce and shows Retry, which fetches a new one.
- The mobile sheet has a drag handle and a 4-column wallet grid with full names. Screens narrower than 375px use 2 columns.
- The account button shows a loader while the balance loads, and hides the balance and its divider if loading fails. `ConnectButton.Custom` gets `account.isBalanceLoading`.
- Trigger labels are trimmed to cap height, so names and balances center on their icons in every font.
- Buttons no longer grow on hover or shrink on press. On hover, the background fades over 100ms to an 8% tint of the text color, which also shows on dark and black backgrounds. Keyboard focus shows a visible outline.
- Dialogs animate out as well as in, including when a wallet connects or disconnects. With reduced motion, dialogs only fade.
- All motion uses one duration set: 100ms for hover and press, 150ms to open and 100ms to close dialogs, 200ms and 150ms for the mobile sheet, and 1s for every loading loop.
