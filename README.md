<div align="center">

# Solaris

### The best way to connect a wallet, on Ethereum and Solana.

Solaris is a React wallet kit for EVM chains and Solana. Your users get the same connect, account, and network modals on both. You get one package, one theme, and one API shape.

[![npm version](https://img.shields.io/npm/v/solariskit?style=flat-square&color=007AFF&label=solariskit)](https://www.npmjs.com/package/solariskit)
[![npm downloads](https://img.shields.io/npm/dm/solariskit?style=flat-square&color=007AFF)](https://www.npmjs.com/package/solariskit)
[![CI](https://img.shields.io/github/actions/workflow/status/akshatmittal/solaris/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/akshatmittal/solaris/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](./packages/solariskit/src)
[![License: MIT](https://img.shields.io/github/license/akshatmittal/solaris?style=flat-square&color=007AFF)](./LICENSE)

[**Demo**](https://gh.akshatmittal.com/solaris/) · [Documentation](./packages/solariskit/README.md) · [npm](https://www.npmjs.com/package/solariskit) · [Changelog](./packages/solariskit/CHANGELOG.md)

Coming from RainbowKit? Most of the API keeps its shape: see the [migration guide](./packages/solariskit/README.md#migrating-from-rainbowkit).

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/hero-dark.png" />
  <img alt="Solaris modals: EVM and Solana connect wallet lists, a WalletConnect QR code, and the network switcher, with connected EVM and Solana buttons" src="./.github/assets/hero-light.png" />
</picture>

</div>

## Why Solaris

Most wallet kits pick a side. Solaris takes both, and makes them feel like one product.

- **One kit, two ecosystems.** Each EVM button and modal hook has a `Solana` twin with the same look and the same theme. Wagmi and Viem run one side, Solana Kit and Wallet Standard run the other.
- **Wallet SDKs load on demand.** WalletConnect, Reown AppKit, and Base Account stay out of your first load. Each one loads when the connect modal opens, or at page load only if it was the last wallet used.
- **One WalletConnect client, not two.** The Solaris QR code and the official WalletConnect modal share one connector and one session. WalletConnect telemetry is off, and so are the modal's analytics, email, and social login.
- **Small and self-contained.** Four runtime dependencies and one static stylesheet, compiled by StyleX and scoped under `[data-solaris]`. Every wallet SDK is an optional peer, and Solana has its own `solariskit/solana` entry point.
- **Made for phones.** On screens narrower than 768px the modals become a bottom sheet. On a phone, a tap opens the wallet app. Solana Mobile Wallet Adapter is on by default.
- **Accessible modals.** Dialogs have a name, keep focus inside, and give it back when they close. Screen readers hear copy and connect results, text links clear 4.5:1 contrast with the default accent, and animation follows `prefers-reduced-motion`.
- **Your brand, not ours.** Start from light, dark, or midnight, then set the accent, radius, font, and overlay blur. One prop follows the OS color scheme.
- **A face for every address.** ENS names and avatars on Ethereum, and a deterministic [polycon](./packages/polycons) for every address without one.
- **Ready for the Next.js App Router.** Every file ships with `"use client"`, and the EVM config renders on the server with `ssr: true`.

## Quick start

### Ethereum

Wrap your app in three providers, then render the buttons.

```bash
npm install solariskit wagmi@^3 viem@^2 @tanstack/react-query@^5
# Peers for the default EVM wallet list: WalletConnect and Base
npm install @walletconnect/ethereum-provider@^2.26.0 @reown/appkit@^1.8.19 @base-org/account@^2.5.1
```

```tsx
"use client";

import { useState, type PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChainSelectButton, ConnectButton, getDefaultConfig, SolarisEthereumProvider } from "solariskit";
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
        <SolarisEthereumProvider>{children}</SolarisEthereumProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function Header() {
  return (
    <>
      <ChainSelectButton />
      <ConnectButton />
    </>
  );
}
```

`YOUR_PROJECT_ID` works for local testing. Before you ship, get your own WalletConnect project ID from the [Reown Dashboard](https://dashboard.reown.com/).

With Next.js, also add `serverExternalPackages: ["@base-org/account"]` to `next.config.ts`. Without it, `next build` stops with `Can't resolve '@x402/core/client'`, because the Base Account SDK loads a server package whose optional peers are not installed.

### Solana

Solana needs one more provider, and no `WagmiProvider`, `QueryClientProvider`, or WalletConnect project ID. Add its peers to the core install above; `wagmi` and `viem` stay required peers, even in a Solana-only app.

```bash
npm install @solana/connector@^0.3.0 @solana/kit@^8.6.0
```

```tsx
"use client";

import { getDefaultSolanaConfig, SolanaConnectButton, SolarisSolanaProvider } from "solariskit/solana";
import "solariskit/solana/styles.css";

const config = getDefaultSolanaConfig({ appName: "My App", network: "devnet" });

export function SolanaHeader() {
  return (
    <SolarisSolanaProvider config={config}>
      <SolanaConnectButton />
    </SolarisSolanaProvider>
  );
}
```

For mainnet, set `network: "mainnet"` and pass your own RPC in `clusters`: the public mainnet endpoint refuses browser requests. With Next.js and Turbopack, also [alias `@solana/web3.js` to an empty module](./packages/solariskit/README.md#solana-quick-start).

### Go further

Drop unused wallets and their peers with a [custom wallet list](./packages/solariskit/README.md#custom-wallet-lists), [theme the UI](./packages/solariskit/README.md#customize-the-ui), add [wallet sign-in and recent transactions](./packages/solariskit/README.md#recent-transactions-and-authentication), and set up [server rendering](./packages/solariskit/README.md#nextjs-and-server-rendering).

## Two ecosystems, one API shape

|                 | EVM                                                             | Solana                                                                                     |
| --------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Import from** | `solariskit`                                                    | `solariskit/solana`                                                                        |
| **Provider**    | `SolarisEthereumProvider`                                       | `SolarisSolanaProvider`                                                                    |
| **Buttons**     | `ConnectButton`, `ChainSelectButton`, `WalletButton`            | `SolanaConnectButton`, `SolanaChainSelectButton`, `SolanaWalletButton`                     |
| **Modal hooks** | `useConnectModal`, `useAccountModal`, `useChainModal`           | `useSolanaConnectModal`, `useSolanaAccountModal`, `useSolanaChainModal`                    |
| **Wallets**     | Injected (EIP-6963), WalletConnect, Base Account, Safe (opt-in) | Wallet Standard wallets, Mobile Wallet Adapter                                             |
| **Built on**    | Wagmi 3, Viem 2, TanStack Query 5                               | `@solana/connector`, Solana Kit 8                                                          |
| **Extras**      | Wallet sign-in adapter (SIWE-ready), recent transactions, ENS   | `useSolanaWallet`, `useSolanaBalance`, `useSolanaCluster`, `useSolanaKitTransactionSigner` |
| **Custom UI**   | `ConnectButton.Custom`, `WalletButton.Custom`                   | `SolanaWalletButton.Custom`                                                                |

## Inside this repo

| Path                                                       | Package                                                                          | Description                                       |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| [`packages/solariskit`](./packages/solariskit)             | [`solariskit`](https://www.npmjs.com/package/solariskit)                         | Wallet connection UI and hooks for EVM and Solana |
| [`packages/polycons`](./packages/polycons)                 | [`@akshatmittal/polycons`](https://www.npmjs.com/package/@akshatmittal/polycons) | Deterministic avatar images for addresses         |
| [`apps/example`](./apps/example)                           | [Demo](https://gh.akshatmittal.com/solaris/)                                     | Next.js app with EVM and Solana side by side      |
| [`tooling/typescript-config`](./tooling/typescript-config) | —                                                                                | Shared strict TypeScript config                   |

## Development

A pnpm and Turborepo monorepo on Node 26, built with tsdown, linted with oxlint, formatted with oxfmt, and released with Changesets.

```bash
pnpm install
pnpm dev          # watch the packages and run the example app at http://localhost:3000
pnpm build
pnpm format:check
pnpm lint
pnpm typecheck
```

To try WalletConnect locally, copy `apps/example/.env.example` to `apps/example/.env.local` and set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`. Run `pnpm changeset` for every change to a published package, and read the [contributing guide](./.github/CONTRIBUTING.md) before you open a pull request.

## License

[MIT](./LICENSE). Solaris began as a fork of [RainbowKit](https://github.com/rainbow-me/rainbowkit), and owes a lot to the team at Rainbow.
