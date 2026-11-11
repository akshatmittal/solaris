"use client";

import { useState, type PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  createAuthenticationAdapter,
  darkTheme,
  getDefaultConfig,
  lightTheme,
  type AuthenticationStatus,
} from "solariskit";
import { SolanaKitProvider, getDefaultSolanaConfig, type SolanaCluster } from "solariskit/solana";
import { isHex } from "viem";
import { createSiweMessage, generateSiweNonce, parseSiweMessage } from "viem/siwe";
import { http, WagmiProvider } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { arbitrum, avalanche, base, bsc, ink, linea, mainnet, optimism, polygon, unichain } from "wagmi/chains";
import "solariskit/styles.css";

import { kitSettings } from "./settings";

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

const fonts = { body: "var(--font-inter), ui-sans-serif, system-ui, sans-serif" };
const kitThemes = { dark: { ...darkTheme(), fonts }, light: { ...lightTheme(), fonts } };

const ethereumConfig = getDefaultConfig({
  appDescription: "",
  appName,
  appUrl,
  chains: [mainnet, base, bsc, polygon, arbitrum, optimism, avalanche, linea, unichain, ink],
  projectId: walletConnectProjectId,
  ssr: true,
  transports: {
    [mainnet.id]: http("https://mainnet.gateway.tenderly.co"),
    [base.id]: http("https://base.gateway.tenderly.co"),
    [bsc.id]: http("https://56.rpc.thirdweb.com"),
    [polygon.id]: http("https://polygon.gateway.tenderly.co"),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [avalanche.id]: http(),
    [linea.id]: http(),
    [unichain.id]: http(),
    [ink.id]: http(),
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

export function EthereumProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());
  const [{ theme }] = useQueryStates(kitSettings);
  const [authStatus, setAuthStatus] = useState<AuthenticationStatus>("unauthenticated");
  // Sign-In with Ethereum, verified in the browser so the example needs no backend.
  const [authAdapter] = useState(() => {
    const issuedNonces = new Set<string>();

    return createAuthenticationAdapter({
      createMessage: ({ address, chainId, nonce }) =>
        createSiweMessage({
          address,
          chainId,
          domain: window.location.host,
          nonce,
          statement: "Sign in to the Solaris example.",
          uri: window.location.origin,
          version: "1",
        }),
      getNonce: async () => {
        const nonce = generateSiweNonce();
        issuedNonces.add(nonce);
        return nonce;
      },
      signOut: async () => {
        setAuthStatus("unauthenticated");
      },
      verify: async ({ message, signature }) => {
        const { nonce } = parseSiweMessage(message);
        if (!isHex(signature) || !nonce || !issuedNonces.delete(nonce)) {
          return false;
        }
        const valid = await getPublicClient(ethereumConfig).verifySiweMessage({
          message,
          nonce,
          signature,
        });
        if (valid) {
          setAuthStatus("authenticated");
        }
        return valid;
      },
    });
  });

  return (
    <WagmiProvider config={ethereumConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authAdapter}
          status={authStatus}
        >
          <RainbowKitProvider
            id="ethereum"
            theme={kitThemes[theme]}
          >
            {children}
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function SolanaProviders({ children }: PropsWithChildren) {
  const [{ theme }] = useQueryStates(kitSettings);

  return (
    <SolanaKitProvider
      config={solanaConfig}
      id="solana"
      theme={kitThemes[theme]}
    >
      {children}
    </SolanaKitProvider>
  );
}
