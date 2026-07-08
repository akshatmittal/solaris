---
"solariskit": minor
---

Add a Solana entrypoint with shared SolarisKit UI, ConnectorKit vNext wallet integration, Solana Kit-compatible hooks, shared Solana cluster icons, Solana-specific latest-wallet reconnect storage, a single merged Solana provider config, and example app wiring for independent Ethereum and Solana provider islands, including matching dummy transactions and explicit Solana cluster RPC configuration.

`@solana/connector` and `@solana/kit` are optional peer dependencies: install them alongside solariskit to use the `solariskit/solana` entrypoint; EVM-only consumers need no new dependencies. Also install `@solana/web3.js` so bundlers can resolve `@solana/connector`'s legacy-transaction compatibility path — it is code-split into a lazy chunk and only downloaded at runtime if a wallet returns a legacy web3.js transaction.
