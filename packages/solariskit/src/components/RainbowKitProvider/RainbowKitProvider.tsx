import React, { type ReactNode, useMemo } from "react";

import type { Chain } from "wagmi/chains";

import { useConnectionEffect } from "wagmi";

import type { ThemeVars } from "../../css/sprinkles.css";

import { lightTheme } from "../../themes/lightTheme";
import { TransactionStoreProvider } from "../../transactions/TransactionStoreContext";
import { AppContext, type DisclaimerComponent, defaultAppInfo } from "./AppContext";
import { type AvatarComponent, AvatarContext, defaultAvatar } from "./AvatarContext";
import { ModalProvider } from "./ModalContext";
import { ModalSizeOptions, ModalSizeProvider, type ModalSizes } from "./ModalSizeContext";
import { RainbowKitChainProvider } from "./RainbowKitChainContext";
import { ShowBalanceProvider } from "./ShowBalanceContext";
import { ShowRecentTransactionsContext } from "./ShowRecentTransactionsContext";
import { ThemeIdProvider, ThemeRootStyle, useThemeRoot } from "./ThemeRootContext";
import { useFingerprint } from "./useFingerprint";
import { usePreloadImages } from "./usePreloadImages";
import { WalletButtonProvider } from "./WalletButtonContext";
import { clearWalletConnectDeepLink } from "./walletConnectDeepLink";

export type Theme =
  | ThemeVars
  | {
      lightMode: ThemeVars;
      darkMode: ThemeVars;
    };

export interface RainbowKitProviderProps {
  initialChain?: Chain | number;
  chainSearchThreshold?: number;
  id?: string;
  children: ReactNode;
  theme?: Theme | null;
  showRecentTransactions?: boolean;
  appInfo?: {
    appName?: string;
    learnMoreUrl?: string;
    disclaimer?: DisclaimerComponent;
  };
  avatar?: AvatarComponent;
  modalSize?: ModalSizes;
}

const defaultTheme = lightTheme();

export function RainbowKitProvider({
  appInfo,
  avatar,
  chainSearchThreshold,
  children,
  id,
  initialChain,
  modalSize = ModalSizeOptions.WIDE,
  showRecentTransactions = false,
  theme = defaultTheme,
}: RainbowKitProviderProps) {
  usePreloadImages();
  useFingerprint();

  useConnectionEffect({ onDisconnect: clearWalletConnectDeepLink });

  const { themeCss, themeId } = useThemeRoot(id, theme);

  const appContext = useMemo(
    () => ({
      ...defaultAppInfo,
      ...appInfo,
    }),
    [appInfo],
  );

  const avatarContext = avatar ?? defaultAvatar;

  return (
    <RainbowKitChainProvider
      chainSearchThreshold={chainSearchThreshold}
      initialChain={initialChain}
    >
      <WalletButtonProvider>
        <ModalSizeProvider modalSize={modalSize}>
          <ShowRecentTransactionsContext.Provider value={showRecentTransactions}>
            <TransactionStoreProvider>
              <AvatarContext.Provider value={avatarContext}>
                <AppContext.Provider value={appContext}>
                  <ThemeIdProvider id={themeId}>
                    <ShowBalanceProvider>
                      <ModalProvider>
                        <ThemeRootStyle
                          themeCss={themeCss}
                          themeId={themeId}
                        >
                          {children}
                        </ThemeRootStyle>
                      </ModalProvider>
                    </ShowBalanceProvider>
                  </ThemeIdProvider>
                </AppContext.Provider>
              </AvatarContext.Provider>
            </TransactionStoreProvider>
          </ShowRecentTransactionsContext.Provider>
        </ModalSizeProvider>
      </WalletButtonProvider>
    </RainbowKitChainProvider>
  );
}
