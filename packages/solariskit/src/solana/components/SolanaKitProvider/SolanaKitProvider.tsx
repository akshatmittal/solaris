import React, { useEffect, useRef } from "react";

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
import {
  ThemeIdProvider,
  createThemeRootProps,
  createThemeRootSelector,
} from "../../../components/RainbowKitProvider/ThemeRootContext";
import { useFingerprint } from "../../../components/RainbowKitProvider/useFingerprint";
import { cssStringFromTheme } from "../../../css/cssStringFromTheme";
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
  return {
    connectorConfig: connectorConfig as AppProviderProps["connectorConfig"],
    mobile: mobile as AppProviderProps["mobile"],
  };
}

function SolanaAutoConnect() {
  const attemptedReconnect = useRef(false);
  const connectRef = useRef<ReturnType<typeof useSolanaConnectWallet>["connect"] | null>(null);
  const wallet = useSolanaWallet();
  const connectors = useSolanaWalletConnectors();
  const { connect } = useSolanaConnectWallet();

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

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
      addLatestSolanaWalletId(walletId);
      void connectRef
        .current?.(walletId, {
          allowInteractiveFallback: false,
          silent: true,
        })
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

  if (typeof theme === "function") {
    throw new Error(
      'A theme function was provided to the "theme" prop instead of a theme object. You must execute this function to get the resulting theme object.',
    );
  }

  const selector = createThemeRootSelector(id);
  const appContext = {
    ...defaultAppInfo,
    learnMoreUrl: solanaDefaultLearnMoreUrl,
    ...appInfo,
  };
  const avatarContext: AvatarComponent = avatar ?? defaultAvatar;
  const themeCss = theme
    ? [
        `${selector}{${cssStringFromTheme("lightMode" in theme ? theme.lightMode : theme)}}`,
        "darkMode" in theme
          ? `@media(prefers-color-scheme:dark){${selector}{${cssStringFromTheme(theme.darkMode, {
              extends: theme.lightMode,
            })}}}`
          : null,
      ].join("")
    : null;
  const { connectorConfig, mobile } = splitConnectorKitConfig(config);

  return (
    <AppProvider
      connectorConfig={connectorConfig}
      mobile={mobile}
    >
      <SolanaAutoConnect />
      <ModalSizeProvider modalSize={modalSize}>
        <AvatarContext.Provider value={avatarContext}>
          <AppContext.Provider value={appContext}>
            <ThemeIdProvider id={id}>
              <ShowBalanceProvider>
                <SolanaModalProvider>
                  {theme ? (
                    <div {...createThemeRootProps(id)}>
                      <style>{themeCss}</style>
                      {children}
                    </div>
                  ) : (
                    children
                  )}
                </SolanaModalProvider>
              </ShowBalanceProvider>
            </ThemeIdProvider>
          </AppContext.Provider>
        </AvatarContext.Provider>
      </ModalSizeProvider>
    </AppProvider>
  );
}
