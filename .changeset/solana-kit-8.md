---
"solariskit": minor
---

Upgrade the Solana stack to `@solana/connector` 0.3.0 and `@solana/kit` v8. The `@solana/connector` peer range is now `^0.3.0` and the `@solana/kit` peer range is now `^8.6.0`. Solana consumers need `@tanstack/react-query` 5.103.1 or later, the peer range of `@solana/react`, which connector 0.3.0 depends on.

`@solana/web3.js` is no longer needed. `@solana/connector` lazy-imports it only for legacy web3.js transaction objects, which the Kit signer never uses. Bundlers must still resolve the import, so alias it to an empty module (see the README).

Remove the SolarisKit Solana auto-reconnect. Connector 0.3.0 always connects interactively, so a reconnect started by SolarisKit could open a wallet prompt on page load. The connector `autoConnect` now restores the session silently, and an explicit disconnect clears it. The `rk-solana-latest-id` and `rk-solana-reconnect-disabled` keys are no longer written.

`useSolanaKitTransactionSigner` accepts the connector `chain` option, and the `SolanaKitTransactionSignerOptions` type is exported. Connector 0.3.0 returns no signer when it cannot get a wallet chain from the active cluster, so apps with a custom cluster ID must pass `chain`.
