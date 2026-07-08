import React, { type JSX, type ReactNode } from "react";

import { WalletButtonRenderer, type WalletButtonRendererProps } from "./WalletButtonRenderer";
import { WalletButtonView } from "./WalletButtonView";

export type { WalletButtonRendererProps } from "./WalletButtonRenderer";

export interface WalletButtonProps {
  wallet?: string;
}

export const WalletButton: {
  (props: WalletButtonProps): JSX.Element | undefined;
  Custom: (props: WalletButtonRendererProps) => ReactNode;
} = ({ wallet }) => {
  return (
    <WalletButtonRenderer wallet={wallet}>
      {({ ready, connect, connected, mounted, connector, loading }) => {
        return (
          <WalletButtonView
            connected={connected}
            connector={connector}
            loading={loading}
            mounted={mounted}
            onConnect={connect}
            ready={ready}
          />
        );
      }}
    </WalletButtonRenderer>
  );
};

WalletButton.Custom = WalletButtonRenderer;
