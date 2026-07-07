"use client";

import { useState, type PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "solariskit";
import { SolanaKitProvider, getDefaultSolanaConfig, type SolanaCluster } from "solariskit/solana";
import { http, WagmiProvider } from "wagmi";
import { base, bsc, mainnet, polygon } from "wagmi/chains";
import "solariskit/styles.css";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo";
const appName = "Solaris Example";
const appUrl = "http://localhost:3000";
const solanaClusters = [
  {
    id: "solana:mainnet",
    label: "Mainnet",
    url: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL ?? "https://public.rpc.solanavibestation.com",
  },
  {
    id: "solana:devnet",
    label: "Devnet",
    url: process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL ?? "https://api.devnet.solana.com",
  },
] satisfies SolanaCluster[];

const ethereumConfig = getDefaultConfig({
  appDescription: "",
  appName,
  appUrl,
  chains: [mainnet, base, bsc, polygon],
  projectId: walletConnectProjectId,
  ssr: true,
  transports: {
    [mainnet.id]: http("https://mainnet.gateway.tenderly.co"),
    [base.id]: http("https://base.gateway.tenderly.co"),
    [bsc.id]: http("https://56.rpc.thirdweb.com"),
    [polygon.id]: http("https://polygon.gateway.tenderly.co"),
  },
});

const solanaConfig = getDefaultSolanaConfig({
  appName,
  appUrl,
  autoConnect: true,
  clusters: solanaClusters,
  enableMobile: true,
  network: "mainnet",
  wallets: {
    featured: ["Phantom", "Solflare", "Backpack"],
  },
});

export function Providers({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export function EthereumProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={ethereumConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          id="ethereum"
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function SolanaProviders({ children }: PropsWithChildren) {
  return (
    <SolanaKitProvider
      config={solanaConfig}
      id="solana"
      modalSize="compact"
    >
      {children}
    </SolanaKitProvider>
  );
}
