# SolarisKit

React wallet connection UI for Ethereum-compatible chains and Solana. SolarisKit is a pared-down
[RainbowKit](https://github.com/rainbow-me/rainbowkit) fork with connect, account, and network-selection modals,
customizable themes, and TypeScript types.

[Source](https://github.com/akshatmittal/solaris) ·
[Example app](https://github.com/akshatmittal/solaris/tree/main/apps/example) ·
[Changelog](https://github.com/akshatmittal/solaris/blob/main/packages/solariskit/CHANGELOG.md) ·
[Issues](https://github.com/akshatmittal/solaris/issues)

## Requirements

- Node.js 24 or newer.
- React and React DOM 18 or 19.
- Wagmi 3, Viem 2, and TanStack React Query 5 or newer.
- An ESM-capable React build tool with CSS imports. The package ships ESM and TypeScript declarations, not a CommonJS build.

Solana support is available separately through `solariskit/solana`; its optional dependencies are not needed for EVM-only apps.
The package still declares the EVM dependencies above as required peers, including for Solana-only installations.

## Installation

In an existing React app:

```bash
npm install solariskit wagmi@^3 viem@^2 @tanstack/react-query@^5
```

The default EVM wallet list includes Safe, injected browser wallets, Base, MetaMask Mobile, and WalletConnect.
Install the optional peers used by that list:

```bash
npm install @walletconnect/ethereum-provider@^2.21.1 @base-org/account@^2.5.1 @safe-global/safe-apps-provider@^0.18.6 @safe-global/safe-apps-sdk@^9.1.0
```

| Integration                       | Additional dependencies                                         |
| --------------------------------- | --------------------------------------------------------------- |
| Injected browser wallets          | None                                                            |
| WalletConnect and MetaMask Mobile | `@walletconnect/ethereum-provider`                              |
| Base Account                      | `@base-org/account`                                             |
| Safe                              | `@safe-global/safe-apps-provider`, `@safe-global/safe-apps-sdk` |
| Solana                            | `@solana/connector@^0.2.4`, `@solana/kit@^6.10.0`               |

These peers are optional at the package level, but required when using the corresponding integration.
To omit an integration and its dependencies, supply your own wallet list instead of using the default list.

## EVM quick start

Create a project in the [Reown Dashboard](https://dashboard.reown.com/) and replace `YOUR_PROJECT_ID` with its
WalletConnect project ID. The project ID is a public application identifier, not a private wallet key.
Configure the project's allowed origins for your app.

```tsx
"use client";

import { useState, type PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChainSelectButton, ConnectButton, getDefaultConfig, RainbowKitProvider } from "solariskit";
import { WagmiProvider } from "wagmi";
import { base, mainnet } from "wagmi/chains";
import "solariskit/styles.css";

const config = getDefaultConfig({
  appName: "My App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, base],
  ssr: true,
});

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default function App() {
  return (
    <Providers>
      <ChainSelectButton />
      <ConnectButton />
    </Providers>
  );
}
```

The provider is named **`RainbowKitProvider`**, not `SolarisKitProvider`. `ConnectButton` handles wallet connection and
account details; render `ChainSelectButton` separately for network selection. Use Wagmi hooks for EVM account state,
contract reads, and transaction submission.

### Configuration and RPC endpoints

`getDefaultConfig` returns a Wagmi config. It requires `appName`, `projectId`, and a non-empty `chains` list. It also accepts:

- `appDescription`, `appUrl`, and `appIcon` for wallet connection metadata.
- `wallets` for a custom grouped wallet list.
- `walletConnectParameters` for WalletConnect options.
- Wagmi configuration such as `ssr` and `transports` (not `client` or `connectors`, which SolarisKit manages).

Without `transports`, each chain uses Wagmi's `http()` transport and the chain's default public RPC. For production,
provide your own RPC endpoints to avoid public endpoint rate limits. Add this to the config above, importing `http`
from `wagmi`:

```tsx
transports: {
  [mainnet.id]: http("https://your-ethereum-rpc.example.com"),
  [base.id]: http("https://your-base-rpc.example.com"),
},
```

Use browser-safe RPC credentials and restrict them at your RPC provider; never embed private keys or server secrets.

### Custom wallet lists

The wallet factories exported by `solariskit/wallets` are `base`, `injectedWallet`, `metaMaskWallet`, `safeWallet`, and
`walletConnectWallet`. `metaMaskWallet` is the MetaMask Mobile integration; browser extension wallets are discovered
through the injected wallet flow.

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

For an existing Wagmi configuration, use `connectorsForWallets(wallets, { appName, projectId })` and pass the result as
`connectors` to Wagmi's `createConfig`. `getDefaultWallets()` returns the default grouped list; passing the app/project
parameters also returns its connectors. The `Wallet` and `WalletList` types support custom wallet integrations.

## Customize the UI

```tsx
import { darkTheme, RainbowKitProvider } from "solariskit";

<RainbowKitProvider
  modalSize="compact"
  theme={darkTheme({
    accentColor: "#6366f1",
    accentColorForeground: "white",
    borderRadius: "medium",
    fontStack: "system",
    overlayBlur: "small",
  })}
>
  {children}
</RainbowKitProvider>;
```

- Themes: `lightTheme`, `darkTheme`, and `midnightTheme`. For system color-scheme switching, pass
  `theme={{ lightMode: lightTheme(), darkMode: darkTheme() }}`. `cssStringFromTheme` and `cssObjectFromTheme` are also exported.
- Modal sizes: `"wide"` (default) or `"compact"`.
- Provider options: `initialChain`, `chainSearchThreshold`, `appInfo`, `avatar`, `showRecentTransactions`, and `id`.
  Use distinct `id` values for multiple independently themed providers on one page.
- `ConnectButton`: `label`, `accountStatus` (`"full"`, `"avatar"`, or `"address"`), and `showBalance`.
- `ChainSelectButton`: `chainStatus` (`"full"`, `"icon"`, `"name"`, or `"none"`).
- `accountStatus`, `showBalance`, and `chainStatus` also accept responsive values such as
  `{ smallScreen: "icon", largeScreen: "full" }` for `chainStatus`.
- `WalletButton` connects to a specific configured wallet, for example `<WalletButton wallet="metaMask" />`.
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

`useAccountModal` and `useChainModal` work similarly. Each hook returns its modal's open state and open function.
Open functions can be `undefined` when unavailable; disable the corresponding control. Render these hooks and all
wallet UI inside the providers shown in the quick start.

### Recent transactions and authentication

To display recent EVM transactions, enable `showRecentTransactions` on `RainbowKitProvider`. Call
`useAddRecentTransaction()` inside a connected component, then call the returned function after submitting a transaction
with `{ hash, description }` (and optionally `confirmations`). This tracks a submitted transaction; it does not send one.

For signature-based authentication, `createAuthenticationAdapter` accepts `getNonce`, `createMessage`, `verify`, and
`signOut` callbacks. Wrap `RainbowKitProvider` in `RainbowKitAuthenticationProvider` inside the Wagmi/Query providers,
passing `adapter` and `status` (`"loading"`, `"unauthenticated"`, or `"authenticated"`). Its optional `enabled` flag
defaults to `true`. Your backend must issue nonces, validate signatures and message contents, and manage sessions;
connecting a wallet alone does not authenticate a user.

## Solana quick start

Install the optional Solana peers in addition to the core installation:

```bash
npm install @solana/connector@^0.2.4 @solana/kit@^6.10.0
```

```tsx
"use client";

import {
  getDefaultSolanaConfig,
  SolanaChainSelectButton,
  SolanaConnectButton,
  SolanaKitProvider,
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
    <SolanaKitProvider
      config={config}
      modalSize="compact"
    >
      <SolanaChainSelectButton />
      <SolanaConnectButton />
    </SolanaKitProvider>
  );
}
```

This uses Wallet Standard discovery through `@solana/connector`. The Solana provider does not need a Wagmi or external
Query provider. WalletConnect is **not supported** by the Solana integration, and no WalletConnect project ID is needed.
Use your own production RPC endpoint when moving from devnet to mainnet.

The Solana entry point also exports:

- `SolanaWalletButton` (with `connectorId`) and its `SolanaWalletButton.Custom` render-prop API.
- `useSolanaConnectModal`, `useSolanaAccountModal`, and `useSolanaChainModal`.
- `useSolanaWallet`, `useSolanaWalletConnectors`, `useSolanaConnectWallet`, and `useSolanaDisconnectWallet`.
- `useSolanaBalance`, `useSolanaCluster`, `useSolanaClient`, and `useSolanaKitTransactionSigner`.
- Public configuration, cluster, wallet, and hook return types.

Use these under `SolanaKitProvider`. It accepts `theme`, `modalSize`, `appInfo`, `avatar`, and `id` for customization.
EVM and Solana providers can coexist in one app; give them distinct IDs. Both CSS entry points resolve to the same
stylesheet, so import it only once.

## Next.js and server rendering

Put providers, hooks, and wallet controls in client components (`"use client"`). In the Next.js App Router, render
your client `Providers` component around `children` in the root layout and import the stylesheet there or in your
provider module. Set `ssr: true` in the EVM config. Keep the config stable and create the Query client once per provider
instance, as above. Wallet controls appear after client hydration.

## Migrating from RainbowKit

Replace imports from `@rainbow-me/rainbowkit` with `solariskit`, including `solariskit/styles.css` and `solariskit/wallets`.
Retain names such as `RainbowKitProvider` and `RainbowKitAuthenticationProvider`.

This is not a complete drop-in replacement: it requires Wagmi 3, includes only the wallet factories listed above,
and separates network selection into `ChainSelectButton` rather than a `chainStatus` prop on `ConnectButton`.
Only US English translations are currently included. Check your imports and provider props against the shipped
TypeScript declarations rather than assuming all upstream RainbowKit APIs are available.

## Troubleshooting

- **Unstyled UI:** import `solariskit/styles.css` (or the Solana CSS alias) once in your app.
- **Missing provider/context:** check provider order and ensure controls use the provider for their ecosystem.
- **Missing wallet SDK module:** install the optional peers for every wallet in your configured list, or remove that wallet.
- **WalletConnect cannot connect:** use a real project ID, check allowed origins, and install its Ethereum provider peer.
- **Balances or network requests fail:** check RPC reachability, rate limits, and the selected chain/cluster.
- **An upstream wallet import is missing:** only the wallet factories documented here are shipped; use injected discovery
  or implement a custom `Wallet` for other integrations.

## License and credits

[MIT](https://github.com/akshatmittal/solaris/blob/main/LICENSE). SolarisKit is derived from
[RainbowKit](https://github.com/rainbow-me/rainbowkit) by Rainbow. See the
[repository](https://github.com/akshatmittal/solaris) for development and contribution details.
