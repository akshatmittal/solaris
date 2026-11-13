---
"solariskit": minor
---

Rename every RainbowKit name to Solaris. The old names are removed, so update your code:

- `RainbowKitProvider` is now `SolarisEthereumProvider`, and `RainbowKitProviderProps` is now `SolarisEthereumProviderProps`.
- `SolanaKitProvider` (from `solariskit/solana`) is now `SolarisSolanaProvider`, and `SolanaKitProviderProps` is now `SolarisSolanaProviderProps`.
- `RainbowKitAuthenticationProvider` is now `SolarisAuthenticationProvider`.
- The `RainbowKitWalletConnectParameters` type is now `SolarisWalletConnectParameters`.
- A custom `Wallet`'s `createConnector` now receives `walletDetails.solarisDetails` instead of `walletDetails.rkDetails`.
- The theme CSS custom properties are now `--solaris-*` instead of `--rk-*`. The provider root attribute is now `data-solaris` instead of `data-rk`. Update any CSS that reads these.
- The components no longer render `data-testid` attributes.

Saved wallet and transaction state in `localStorage` keeps its keys, so recent wallets and pending transactions survive the upgrade.
