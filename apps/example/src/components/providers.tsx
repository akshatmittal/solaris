"use client";

import { useState, type PropsWithChildren } from "react";

import { RainbowKitProvider, darkTheme, getDefaultConfig } from "solariskit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "solariskit/styles.css";
import { WagmiProvider } from "wagmi";
import { base, mainnet } from "wagmi/chains";

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "demo";

const config = getDefaultConfig({
  appDescription: "",
  appName: "Solaris Example",
  appUrl: "http://localhost:3000",
  chains: [mainnet, base],
  projectId: walletConnectProjectId,
  ssr: true,
});

export function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
