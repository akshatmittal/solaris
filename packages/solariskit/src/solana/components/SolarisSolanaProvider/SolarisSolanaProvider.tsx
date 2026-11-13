import React, { useMemo } from "react";

import type { AppProviderProps } from "@solana/connector/react";

import { AppProvider } from "@solana/connector/react";

import type { SolarisSolanaProviderProps } from "../../types";

import { AppContext, defaultAppInfo } from "../../../components/SolarisEthereumProvider/AppContext";
import {
  type AvatarComponent,
  AvatarContext,
  defaultAvatar,
} from "../../../components/SolarisEthereumProvider/AvatarContext";
import { ShowBalanceProvider } from "../../../components/SolarisEthereumProvider/ShowBalanceContext";
import {
  ThemeIdProvider,
  ThemeRootStyle,
  useThemeRoot,
} from "../../../components/SolarisEthereumProvider/ThemeRootContext";
import { lightTheme } from "../../../themes/lightTheme";
import { SolanaModalProvider } from "./SolanaModalContext";

export type { SolarisSolanaProviderProps } from "../../types";

const defaultTheme = lightTheme();
const solanaDefaultLearnMoreUrl = "https://solana.com/solana-wallets";

function splitConnectorKitConfig(config: SolarisSolanaProviderProps["config"]): {
  connectorConfig?: AppProviderProps["connectorConfig"];
  mobile?: AppProviderProps["mobile"];
} {
  if (!config) {
    return { connectorConfig: { autoConnect: true } };
  }

  const { autoConnect = true, mobile, ...connectorConfig } = config;
  return { connectorConfig: { ...connectorConfig, autoConnect }, mobile };
}

export function SolarisSolanaProvider({
  appInfo,
  avatar,
  children,
  config,
  id,
  theme = defaultTheme,
}: SolarisSolanaProviderProps) {
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
    </AppProvider>
  );
}
