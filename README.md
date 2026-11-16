<div align="center">

# Solaris

### The best way to connect a wallet, on Ethereum and Solana.

Your users get the same polished connect, account, and network flows on every chain they bring. You ship one provider per ecosystem, one theme, and no glue code between them.

[![npm version](https://img.shields.io/npm/v/solariskit?style=flat-square&color=0E76FD&label=solariskit)](https://www.npmjs.com/package/solariskit)
[![npm downloads](https://img.shields.io/npm/dm/solariskit?style=flat-square&color=0E76FD)](https://www.npmjs.com/package/solariskit)
[![CI](https://img.shields.io/github/actions/workflow/status/akshatmittal/solaris/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/akshatmittal/solaris/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](./packages/solariskit/src)
[![License: MIT](https://img.shields.io/github/license/akshatmittal/solaris?style=flat-square&color=0E76FD)](./LICENSE)

[**Demo**](https://gh.akshatmittal.com/solaris/) · [Documentation](./packages/solariskit/README.md) · [npm](https://www.npmjs.com/package/solariskit) · [Changelog](./packages/solariskit/CHANGELOG.md)

<br />

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./.github/assets/hero-dark.png" />
  <img alt="Solaris connect, WalletConnect QR, account, and network modals, with connected EVM and Solana buttons" src="./.github/assets/hero-light.png" />
</picture>

</div>

## Why Solaris

Most wallet kits pick a side. Solaris takes both, and makes them feel like one product.

- **Ethereum and Solana, side by side.** Same modals, same buttons, same avatars, same theme. Wagmi and Viem on one side, Solana Kit and Wallet Standard on the other, and your users never feel the seam.
- **WalletConnect without the double load.** The Solaris QR code and the official WalletConnect modal run on one connector and one client. Telemetry, analytics, email, and social login stay off.
- **Ships only what you import.** Every wallet SDK is an optional peer, Solana sits behind its own `solariskit/solana` entry point, and the unbundled ESM build lets your bundler drop the rest.
- **Styles that stay in their lane.** StyleX compiles everything to one static stylesheet, scoped under `[data-solaris]`. No runtime CSS-in-JS, and nothing leaks into your app.
- **Make it yours.** Start from light, dark, or midnight, then tune the accent, radius, font, and overlay blur. Follow the OS color scheme with a single prop.
- **Accessible from the first click.** Focus stays inside the modal, screen readers hear copy and connect results, and text links clear 4.5:1 contrast in the default themes.
- **Every address gets a face.** ENS names and avatars on Ethereum, and a deterministic geometric [polycon](./packages/polycons) for every address without one.
- **At home in Next.js.** `"use client"` is baked into the build and the EVM config is SSR-safe, so it drops straight into the App Router.
- **Typed all the way down.** Configs, wallets, hooks, and themes ship with strict TypeScript declarations.

## Two ecosystems, one API shape

Learn it once. The Solana API follows the same shape as the EVM one.

|                 | EVM                                                    | Solana                                                                  |
| --------------- | ------------------------------------------------------ | ----------------------------------------------------------------------- |
| **Import from** | `solariskit`                                           | `solariskit/solana`                                                     |
| **Provider**    | `SolarisEthereumProvider`                              | `SolarisSolanaProvider`                                                 |
| **Buttons**     | `ConnectButton`, `ChainSelectButton`, `WalletButton`   | `SolanaConnectButton`, `SolanaChainSelectButton`, `SolanaWalletButton`  |
| **Modal hooks** | `useConnectModal`, `useAccountModal`, `useChainModal`  | `useSolanaConnectModal`, `useSolanaAccountModal`, `useSolanaChainModal` |
| **Wallets**     | Injected (EIP-6963), WalletConnect, Base Account, Safe | Wallet Standard wallets and Mobile Wallet Adapter                       |
| **Built on**    | Wagmi 3, Viem 2, TanStack Query 5                      | `@solana/connector`, Solana Kit                                         |
| **Extras**      | Sign-In with Ethereum, recent transactions, ENS        | Balance, cluster, and Kit transaction signer hooks                      |
| **Custom UI**   | `ConnectButton.Custom`, `WalletButton.Custom`          | `SolanaWalletButton.Custom`                                             |

## Quick start

A working connect button takes three providers and two components.

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
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
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

Solana is one provider away. No Wagmi, no WalletConnect project ID:

```bash
npm install @solana/connector@^0.3.0 @solana/kit@^8.6.0
```

```tsx
import { getDefaultSolanaConfig, SolanaConnectButton, SolarisSolanaProvider } from "solariskit/solana";
import "solariskit/solana/styles.css";

const config = getDefaultSolanaConfig({ appName: "My App", network: "mainnet" });

<SolarisSolanaProvider config={config}>
  <SolanaConnectButton />
</SolarisSolanaProvider>;
```

Don't need every default wallet? Pass your own list and skip their peers. The [documentation](./packages/solariskit/README.md) goes deeper on theming, custom wallets, Sign-In with Ethereum, server rendering, and [moving over from RainbowKit](./packages/solariskit/README.md#migrating-from-rainbowkit).

## Inside this repo

| Path                        | Package                                                                          | Description                                       |
| --------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| `packages/solariskit`       | [`solariskit`](https://www.npmjs.com/package/solariskit)                         | Wallet connection UI and hooks for EVM and Solana |
| `packages/polycons`         | [`@akshatmittal/polycons`](https://www.npmjs.com/package/@akshatmittal/polycons) | Deterministic avatar images for addresses         |
| `apps/example`              | [Demo](https://gh.akshatmittal.com/solaris/)                                     | Next.js app with EVM and Solana side by side      |
| `tooling/typescript-config` | —                                                                                | Shared strict TypeScript config                   |

## Development

A pnpm and Turborepo monorepo on Node 26, built with tsdown, linted with oxlint, formatted with oxfmt, and released with Changesets.

```bash
pnpm install
pnpm dev          # watch the library and run the example app
pnpm build
pnpm format:check
pnpm lint
pnpm typecheck
```

Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `apps/example/.env.local` to try WalletConnect locally. Add a changeset with `pnpm changeset` for every change to a published package. Read the [contributing guide](./.github/CONTRIBUTING.md) before you open a pull request.

## License

[MIT](./LICENSE). Solaris began as a fork of [RainbowKit](https://github.com/rainbow-me/rainbowkit), and owes a lot to the team at Rainbow.
