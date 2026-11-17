# SolarisKit documentation

The reference for `solariskit`, the React wallet kit for EVM chains and Solana. New here? Start with the [quick start](https://github.com/akshatmittal/solaris#quick-start).

[Demo](https://gh.akshatmittal.com/solaris/) · [Source](https://github.com/akshatmittal/solaris) · [Example source](https://github.com/akshatmittal/solaris/tree/main/apps/example) · [Changelog](https://github.com/akshatmittal/solaris/blob/main/packages/solariskit/CHANGELOG.md) · [Issues](https://github.com/akshatmittal/solaris/issues)

## Requirements

- Node.js 24 or newer.
- React and React DOM 18 or 19.
- Wagmi 3, Viem 2, and TanStack React Query 5 or newer.
- An ESM-capable React build tool with CSS imports. The package ships ESM and TypeScript declarations, not a CommonJS build.

Solana support is available separately through `solariskit/solana`; its optional dependencies are not needed for EVM-only apps. The package still declares the EVM dependencies above as required peers, including for Solana-only installations.

## Installation

The [quick start](https://github.com/akshatmittal/solaris#quick-start) has the install commands for the core package, the default EVM wallet list, and Solana.

The default EVM wallet list includes injected browser wallets, WalletConnect, and Base, in that order. Safe is not in the default list; add `safeWallet` to your own list to use it. Each integration needs these optional peers:

| Integration              | Additional dependencies                                         |
| ------------------------ | --------------------------------------------------------------- |
| Injected browser wallets | None                                                            |
| WalletConnect            | `@walletconnect/ethereum-provider`, `@reown/appkit`             |
| Base Account             | `@base-org/account`                                             |
| Safe                     | `@safe-global/safe-apps-provider`, `@safe-global/safe-apps-sdk` |
| Solana                   | `@solana/connector@^0.3.0`, `@solana/kit@^8.6.0`                |

These peers are optional at the package level, but required when using the corresponding integration. WalletConnect uses `@reown/appkit` for the official WalletConnect modal: the "Open" button on desktop, and the wallet list on mobile. To omit an integration and its dependencies, supply your own wallet list instead of using the default list.

## EVM quick start

The [quick start](https://github.com/akshatmittal/solaris#ethereum) has the full EVM sample. Replace `YOUR_PROJECT_ID` with a WalletConnect project ID from the [Reown Dashboard](https://dashboard.reown.com/). The project ID is a public application identifier, not a private wallet key. Configure the project's allowed origins for your app.

The EVM provider is **`SolarisEthereumProvider`**. `ConnectButton` handles wallet connection and account details; render `ChainSelectButton` separately for network selection. Use Wagmi hooks for EVM account state, contract reads, and transaction submission.

### Configuration and RPC endpoints

`getDefaultConfig` returns a Wagmi config. It requires `appName`, `projectId`, and a non-empty `chains` list. It also accepts:

- `appDescription`, `appUrl`, and `appIcon` for wallet connection metadata. SolarisKit builds the WalletConnect metadata from these and `appName`. WalletConnect telemetry is off, and the official WalletConnect modal has analytics, email, and social login turned off.
- `wallets` for a custom grouped wallet list.
- Wagmi configuration such as `ssr` and `transports` (not `client` or `connectors`, which SolarisKit manages).

Without `transports`, each chain uses Wagmi's `http()` transport and the chain's default public RPC. For production, provide your own RPC endpoints to avoid public endpoint rate limits. Add this to your `getDefaultConfig` call, importing `http` from `wagmi`:

```tsx
transports: {
  [mainnet.id]: http("https://your-ethereum-rpc.example.com"),
  [base.id]: http("https://your-base-rpc.example.com"),
},
```

Use browser-safe RPC credentials and restrict them at your RPC provider; never embed private keys or server secrets.

### Custom wallet lists

The wallet factories exported by `solariskit/wallets` are `base`, `injectedWallet`, `safeWallet`, and `walletConnectWallet`. Browser extension wallets, such as MetaMask, are discovered through the injected wallet flow.

For an injected-only setup with no optional wallet SDKs or WalletConnect project:

```tsx
import { getDefaultConfig } from "solariskit";
import { injectedWallet } from "solariskit/wallets";
import { mainnet } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "My App",
  projectId: "", // Required config field, unused by injectedWallet.
  chains: [mainnet],
  wallets: [{ groupName: "Browser wallets", wallets: [injectedWallet] }],
});
```

For an existing Wagmi configuration, use `connectorsForWallets(wallets, { appName, projectId })` and pass the result as `connectors` to Wagmi's `createConfig`. `getDefaultWallets()` returns the default grouped list; passing the app/project parameters also returns its connectors. The `Wallet` and `WalletList` types support custom wallet integrations.

## Customize the UI

```tsx
import { darkTheme, SolarisEthereumProvider } from "solariskit";

<SolarisEthereumProvider
  theme={darkTheme({
    accentColor: "#6366f1",
    accentColorForeground: "white",
    borderRadius: "medium",
    fontStack: "inherit",
    overlayBlur: "small",
  })}
>
  {children}
</SolarisEthereumProvider>;
```

- Fonts: `fontStack` is `"inherit"` by default, so the modals and buttons use the page font. Use `"system"` or `"rounded"` for a fixed font stack.
- Themes: `lightTheme`, `darkTheme`, and `midnightTheme`. For system color-scheme switching, pass `theme={{ lightMode: lightTheme(), darkMode: darkTheme() }}`. `cssStringFromTheme` and `cssObjectFromTheme` are also exported.
- Provider options: `initialChain`, `chainSearchThreshold`, `appInfo`, `avatar`, `showRecentTransactions`, and `id`. Use distinct `id` values for multiple independently themed providers on one page.
- `ConnectButton`: `label`, `accountStatus` (`"full"`, `"avatar"`, or `"address"`), and `showBalance`.
- `ChainSelectButton`: `chainStatus` (`"full"`, `"icon"`, `"name"`, or `"none"`).
- `accountStatus`, `showBalance`, and `chainStatus` also accept responsive values such as `{ smallScreen: "icon", largeScreen: "full" }` for `chainStatus`.
- `WalletButton` connects to a specific configured wallet, for example `<WalletButton wallet="base" />`.
- `ConnectButton.Custom` and `WalletButton.Custom` expose render-prop APIs for custom buttons.

### Open modals from your own buttons

```tsx
import { useConnectModal } from "solariskit";

export function CustomConnectButton() {
  const { openConnectModal } = useConnectModal();

  return (
    <button
      disabled={!openConnectModal}
      onClick={openConnectModal}
    >
      Connect wallet
    </button>
  );
}
```

`useAccountModal` and `useChainModal` work similarly. Each hook returns its modal's open state and open function. Open functions can be `undefined` when unavailable; disable the corresponding control. Render these hooks and all wallet UI inside the providers shown in the [quick start](https://github.com/akshatmittal/solaris#quick-start).

`openChainModal` takes an optional `filter` to list only some of the configured chains, for example on a page that supports fewer chains than the app:

```tsx
openChainModal?.({ filter: (chain) => chain.id === base.id || chain.id === optimism.id });
```

The filter applies to that opening only. Calling `openChainModal()` without it, or `ChainSelectButton`, lists every configured chain again.

### Recent transactions and authentication

To display recent EVM transactions, enable `showRecentTransactions` on `SolarisEthereumProvider`. Call `useAddRecentTransaction()` inside a connected component, then call the returned function after submitting a transaction with `{ hash, description }` (and optionally `confirmations`). This tracks a submitted transaction; it does not send one.

For signature-based authentication, `createAuthenticationAdapter` accepts `getNonce`, `createMessage`, `verify`, and `signOut` callbacks. Wrap `SolarisEthereumProvider` in `SolarisAuthenticationProvider` inside the Wagmi/Query providers, passing `adapter` and `status` (`"loading"`, `"unauthenticated"`, or `"authenticated"`). Its optional `enabled` flag defaults to `true`. Your backend must issue nonces, validate signatures and message contents, and manage sessions; connecting a wallet alone does not authenticate a user.

## Solana quick start

Install the optional Solana peers in addition to the core installation:

```bash
npm install @solana/connector@^0.3.0 @solana/kit@^8.6.0
```

The Solana integration needs `@tanstack/react-query` 5.103.1 or later. `@solana/connector` depends on `@solana/react`, which has this peer range.

```tsx
"use client";

import {
  getDefaultSolanaConfig,
  SolanaChainSelectButton,
  SolanaConnectButton,
  SolarisSolanaProvider,
} from "solariskit/solana";
import "solariskit/solana/styles.css";

const config = getDefaultSolanaConfig({
  appName: "My App",
  appUrl: "https://your-app.example.com",
  network: "devnet",
  clusters: [{ id: "solana:devnet", label: "Devnet", url: "https://api.devnet.solana.com" }],
  autoConnect: true,
  enableMobile: true,
  wallets: { featured: ["Phantom", "Solflare", "Backpack"] },
});

export default function SolanaApp() {
  return (
    <SolarisSolanaProvider config={config}>
      <SolanaChainSelectButton />
      <SolanaConnectButton />
    </SolarisSolanaProvider>
  );
}
```

This uses Wallet Standard discovery through `@solana/connector`. The Solana provider does not need a Wagmi or external Query provider. WalletConnect is **not supported** by the Solana integration, and no WalletConnect project ID is needed. Use your own production RPC endpoint when moving from devnet to mainnet.

`@solana/connector` lazy-imports `@solana/web3.js` only to convert legacy web3.js transaction objects, which the Kit signer never uses. You do not need to install `@solana/web3.js`, but your bundler must resolve the import. In Next.js with Turbopack, alias it to an empty module (a file containing `export {};`):

```ts
// next.config.ts
const nextConfig = {
  turbopack: {
    resolveAlias: {
      "@solana/web3.js": "./src/empty.ts",
    },
  },
};
```

If pnpm still installs it as a `@solana/connector` peer, remove it with the override `"@solana/connector>@solana/web3.js": "-"`.

`useSolanaKitTransactionSigner` returns no signer when it cannot get a wallet chain from the active cluster, for example with a custom cluster ID. For a custom cluster, give the chain, for example `useSolanaKitTransactionSigner({ chain: "solana:devnet" })`.

The Solana entry point also exports:

- `SolanaWalletButton` (with `connectorId`) and its `SolanaWalletButton.Custom` render-prop API.
- `useSolanaConnectModal`, `useSolanaAccountModal`, and `useSolanaChainModal`.
- `useSolanaWallet`, `useSolanaWalletConnectors`, `useSolanaConnectWallet`, and `useSolanaDisconnectWallet`.
- `useSolanaBalance`, `useSolanaCluster`, `useSolanaClient`, and `useSolanaKitTransactionSigner`.
- Public configuration, cluster, wallet, and hook return types.

Use these under `SolarisSolanaProvider`. It accepts `theme`, `appInfo`, `avatar`, and `id` for customization. EVM and Solana providers can coexist in one app; give them distinct IDs. Both CSS entry points resolve to the same stylesheet, so import it only once.

## Next.js and server rendering

Put providers, hooks, and wallet controls in client components (`"use client"`). In the Next.js App Router, render your client `Providers` component around `children` in the root layout and import the stylesheet there or in your provider module. Set `ssr: true` in the EVM config. Keep the config stable and create the Query client once per provider instance. Wallet controls appear after client hydration.

With the default EVM wallet list, also add `serverExternalPackages: ["@base-org/account"]` to `next.config.ts`. Without it, `next build` stops with `Can't resolve '@x402/core/client'`, because the Base Account SDK loads a server package whose optional peers are not installed.

## Migrating from RainbowKit

Replace imports from `@rainbow-me/rainbowkit` with `solariskit`, including `solariskit/styles.css` and `solariskit/wallets`. Then rename these APIs:

| RainbowKit                                                                   | Solaris                         |
| ---------------------------------------------------------------------------- | ------------------------------- |
| `RainbowKitProvider`                                                         | `SolarisEthereumProvider`       |
| `RainbowKitProviderProps`                                                    | `SolarisEthereumProviderProps`  |
| `RainbowKitAuthenticationProvider`                                           | `SolarisAuthenticationProvider` |
| `RainbowKitWalletConnectParameters` and `walletConnectParameters`            | Removed                         |
| `walletDetails.rkDetails` in a custom `Wallet`                               | `walletDetails.solarisDetails`  |
| `isRainbowKitConnector` (wallet details and `WalletButton.Custom` connector) | `isSolarisConnector`            |
| `--rk-*` CSS custom properties                                               | `--solaris-*`                   |
| `[data-rk]` selector                                                         | `[data-solaris]`                |
| `data-testid="rk-*"` attributes                                              | Removed                         |

This is not a complete drop-in replacement: it requires Wagmi 3, includes only the wallet factories listed above, and separates network selection into `ChainSelectButton` rather than a `chainStatus` prop on `ConnectButton`. Only US English translations are currently included. Check your imports and provider props against the shipped TypeScript declarations rather than assuming all RainbowKit APIs are available.

## Troubleshooting

- **Unstyled UI:** import `solariskit/styles.css` (or the Solana CSS alias) once in your app.
- **Missing provider/context:** check provider order and ensure controls use the provider for their ecosystem.
- **Missing wallet SDK module:** install the optional peers for every wallet in your configured list, or remove that wallet.
- **WalletConnect cannot connect:** use a real project ID, check allowed origins, and install its peers, `@walletconnect/ethereum-provider` and `@reown/appkit`.
- **Balances or network requests fail:** check RPC reachability, rate limits, and the selected chain/cluster.
- **A wallet import is missing:** only the wallet factories documented here are shipped; use injected discovery or implement a custom `Wallet` for other integrations.

## License and credits

[MIT](https://github.com/akshatmittal/solaris/blob/main/LICENSE). See the [repository](https://github.com/akshatmittal/solaris) for development and contribution details.

SolarisKit started as a fork of [RainbowKit](https://github.com/rainbow-me/rainbowkit) by Rainbow.
