import React, { useMemo } from "react";

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
import { SolanaModalProvider } from "./SolanaModalContext";

export type { SolanaKitProviderProps } from "../../types";

const defaultTheme = lightTheme();
const solanaDefaultLearnMoreUrl = "https://solana.com/solana-wallets";

function splitConnectorKitConfig(config: SolanaKitProviderProps["config"]): {
  connectorConfig?: AppProviderProps["connectorConfig"];
  mobile?: AppProviderProps["mobile"];
} {
  if (!config) {
    return { connectorConfig: { autoConnect: true } };
  }

  const { autoConnect = true, mobile, ...connectorConfig } = config;
  return { connectorConfig: { ...connectorConfig, autoConnect }, mobile };
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
