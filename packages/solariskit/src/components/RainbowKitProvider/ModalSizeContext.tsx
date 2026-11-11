import React, { type ReactNode, createContext, useContext, useSyncExternalStore } from "react";

import { largeScreenMinWidth } from "../../css/responsive";
import { WalletButtonContext } from "./WalletButtonContext";

export const ModalSizeOptions = {
  COMPACT: "compact",
  WIDE: "wide",
} as const;

export type ModalSizes = (typeof ModalSizeOptions)[keyof typeof ModalSizeOptions];

const largeScreenQuery = `(min-width: ${largeScreenMinWidth}px)`;

const subscribeToScreenSize = (onChange: () => void) => {
  const query = window.matchMedia(largeScreenQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

export const ModalSizeContext = createContext<ModalSizes>(ModalSizeOptions.WIDE);

interface ModalSizeProviderProps {
  children: ReactNode;
  modalSize: ModalSizes;
}

export function ModalSizeProvider({ children, modalSize }: ModalSizeProviderProps) {
  const isSmallScreen = useSyncExternalStore(
    subscribeToScreenSize,
    () => !window.matchMedia(largeScreenQuery).matches,
    () => false,
  );
  const { connector } = useContext(WalletButtonContext);

  return (
    <ModalSizeContext.Provider value={isSmallScreen || connector ? ModalSizeOptions.COMPACT : modalSize}>
      {children}
    </ModalSizeContext.Provider>
  );
}
