"use client";

import { useState, type PropsWithChildren } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, getDefaultConfig } from "solariskit";
import { http, WagmiProvider } from "wagmi";
import { base, bsc, mainnet, polygon } from "wagmi/chains";
import "solariskit/styles.css";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo";

const config = getDefaultConfig({
  appDescription: "",
  appName: "Solaris Example",
  appUrl: "http://localhost:3000",
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
