import React, { type ReactNode } from "react";

import type { Chain } from "wagmi/chains";

import { useConnectionEffect } from "wagmi";

import type { ThemeVars } from "../../css/sprinkles.css";

import { cssStringFromTheme } from "../../css/cssStringFromTheme";
import { lightTheme } from "../../themes/lightTheme";
import { TransactionStoreProvider } from "../../transactions/TransactionStoreContext";
import { AppContext, type DisclaimerComponent, defaultAppInfo } from "./AppContext";
import { type AvatarComponent, AvatarContext, defaultAvatar } from "./AvatarContext";
import { ModalProvider } from "./ModalContext";
import { ModalSizeOptions, ModalSizeProvider, type ModalSizes } from "./ModalSizeContext";
import { RainbowKitChainProvider } from "./RainbowKitChainContext";
import { ShowBalanceProvider } from "./ShowBalanceContext";
import { ShowRecentTransactionsContext } from "./ShowRecentTransactionsContext";
import { ThemeIdProvider, createThemeRootProps, createThemeRootSelector } from "./ThemeRootContext";
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

  if (typeof theme === "function") {
    throw new Error(
      'A theme function was provided to the "theme" prop instead of a theme object. You must execute this function to get the resulting theme object.',
    );
  }

  const selector = createThemeRootSelector(id);

  const appContext = {
    ...defaultAppInfo,
    ...appInfo,
  };

  const avatarContext = avatar ?? defaultAvatar;
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
                  <ThemeIdProvider id={id}>
                    <ShowBalanceProvider>
                      <ModalProvider>
                        {theme ? (
                          <div {...createThemeRootProps(id)}>
                            <style>{themeCss}</style>
                            {children}
                          </div>
                        ) : (
                          children
                        )}
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
