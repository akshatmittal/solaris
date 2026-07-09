# solariskit

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
