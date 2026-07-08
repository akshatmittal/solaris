import React, { useEffect, useMemo, useRef } from "react";

import type { AppProviderProps } from "@solana/connector/react";

import { AppProvider } from "@solana/connector/react";

import type { SolanaKitProviderProps } from "../../types";

import { AppContext, defaultAppInfo } from "../../../components/RainbowKitProvider/AppContext";
import {
  type AvatarComponent,
  AvatarContext,
  defaultAvatar,
} from "../../../components/RainbowKitProvider/AvatarContext";
import { ModalSizeOptions, ModalSizeProvider } from "../../../components/RainbowKitProvider/ModalSizeContext";
import { ShowBalanceProvider } from "../../../components/RainbowKitProvider/ShowBalanceContext";
import { ThemeIdProvider, ThemeRootStyle, useThemeRoot } from "../../../components/RainbowKitProvider/ThemeRootContext";
import { useFingerprint } from "../../../components/RainbowKitProvider/useFingerprint";
import { WalletButtonProvider } from "../../../components/RainbowKitProvider/WalletButtonContext";
import { lightTheme } from "../../../themes/lightTheme";
import { useSolanaConnectWallet, useSolanaWallet, useSolanaWalletConnectors } from "../../hooks";
import { addLatestSolanaWalletId, getLastConnectedSolanaWalletId } from "../../wallets/recentSolanaWalletIds";
import { SolanaModalProvider } from "./SolanaModalContext";

export type { SolanaKitProviderProps } from "../../types";

const defaultTheme = lightTheme();
const solanaDefaultLearnMoreUrl = "https://solana.com/learn";
const reconnectDelayMs = 250;

function splitConnectorKitConfig(config: SolanaKitProviderProps["config"]): {
  connectorConfig?: AppProviderProps["connectorConfig"];
  mobile?: AppProviderProps["mobile"];
} {
  if (!config) {
    return {};
  }

  const { mobile, ...connectorConfig } = config;
  return { connectorConfig, mobile };
}

function SolanaAutoConnect() {
  const attemptedReconnect = useRef(false);
  const connectRef = useRef<ReturnType<typeof useSolanaConnectWallet>["connect"] | null>(null);
  const wallet = useSolanaWallet();
  const walletRef = useRef(wallet);
  const connectors = useSolanaWalletConnectors();
  const { connect } = useSolanaConnectWallet();

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    walletRef.current = wallet;
  }, [wallet]);

  useEffect(() => {
    if (attemptedReconnect.current || wallet.isConnected || wallet.isConnecting) {
      return;
    }

    const walletId = getLastConnectedSolanaWalletId();
    const connector = connectors.find((connector) => connector.id === walletId);

    if (!walletId || !connector?.ready) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (attemptedReconnect.current) {
        return;
      }

      attemptedReconnect.current = true;

      // Recheck live wallet state: a user-initiated connect started in the
      // last few milliseconds must not be cancelled by the silent reconnect
      // (ConnectorKit aborts the older of two overlapping attempts).
      if (walletRef.current.isConnected || walletRef.current.isConnecting) {
        return;
      }

      void connectRef
        .current?.(walletId, {
          allowInteractiveFallback: false,
          silent: true,
        })
        .then(() => addLatestSolanaWalletId(walletId))
        .catch(() => {});
    }, reconnectDelayMs);

    return () => window.clearTimeout(timer);
  }, [connectors, wallet.isConnected, wallet.isConnecting]);

  return null;
}

export function SolanaKitProvider({
  appInfo,
  avatar,
  children,
  config,
  id,
  modalSize = ModalSizeOptions.WIDE,
  theme = defaultTheme,
}: SolanaKitProviderProps) {
  useFingerprint();

  const { themeCss, themeId } = useThemeRoot(id, theme);

  const appContext = useMemo(
    () => ({
      ...defaultAppInfo,
      learnMoreUrl: solanaDefaultLearnMoreUrl,
      ...appInfo,
    }),
    [appInfo],
  );
  const avatarContext: AvatarComponent = avatar ?? defaultAvatar;
  const { connectorConfig, mobile } = useMemo(() => splitConnectorKitConfig(config), [config]);

  return (
    <AppProvider
      connectorConfig={connectorConfig}
      mobile={mobile}
    >
      {config?.autoConnect !== false && <SolanaAutoConnect />}
      {/* WalletButtonProvider isolates ModalSizeProvider (which reads
          WalletButtonContext) from an outer EVM RainbowKitProvider when the
          providers are nested rather than siblings. */}
      <WalletButtonProvider>
        <ModalSizeProvider modalSize={modalSize}>
          <AvatarContext.Provider value={avatarContext}>
            <AppContext.Provider value={appContext}>
              <ThemeIdProvider id={themeId}>
                <ShowBalanceProvider>
                  <SolanaModalProvider>
                    <ThemeRootStyle
                      themeCss={themeCss}
                      themeId={themeId}
                    >
                      {children}
                    </ThemeRootStyle>
                  </SolanaModalProvider>
                </ShowBalanceProvider>
              </ThemeIdProvider>
            </AppContext.Provider>
          </AvatarContext.Provider>
        </ModalSizeProvider>
      </WalletButtonProvider>
    </AppProvider>
  );
}
