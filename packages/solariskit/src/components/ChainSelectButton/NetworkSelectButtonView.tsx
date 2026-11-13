import React from "react";

import * as stylex from "@stylexjs/stylex";

import type { ChainStatus } from "./ChainSelectButton";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { type ResponsiveValue, responsiveDisplay } from "../../css/responsive";
import { colors, media } from "../../css/vars.stylex";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { triggerStyles } from "../ConnectButton/ConnectButtonView";
import { DropdownIcon } from "../Icons/Dropdown";

const styles = stylex.create({
  button: {
    backgroundColor: {
      default: colors.connectButtonBackground,
      ":hover": { default: null, [media.hover]: colors.connectButtonHover },
    },
    color: colors.connectButtonText,
    gap: 8,
    paddingInline: 12,
  },
  unsupported: {
    backgroundColor: {
      default: colors.connectButtonBackgroundError,
      ":hover": { default: null, [media.hover]: colors.connectButtonErrorHover },
    },
    color: colors.connectButtonTextError,
  },
  disabled: {
    pointerEvents: "none",
  },
  // Only the x axis clips, so descenders stay visible.
  name: {
    maxWidth: 160,
    overflowX: "clip",
    textOverflow: "ellipsis",
  },
});

export interface NetworkSelectButtonNetwork {
  hasIcon: boolean;
  iconBackground?: string;
  iconUrl?: string;
  id: number | string;
  name?: string;
  unsupported?: boolean;
}

export interface NetworkSelectButtonViewProps {
  buttonReady: boolean;
  chainStatus: ResponsiveValue<ChainStatus>;
  network?: NetworkSelectButtonNetwork;
  networkCount: number;
  onOpenNetworkModal?: () => void;
}

export const defaultNetworkSelectChainStatus = { largeScreen: "full", smallScreen: "icon" } as const;

export function NetworkSelectButtonView({
  buttonReady,
  chainStatus,
  network,
  networkCount,
  onOpenNetworkModal,
}: NetworkSelectButtonViewProps) {
  const unsupportedNetwork = network?.unsupported ?? false;

  if (!network || (networkCount <= 1 && !unsupportedNetwork)) {
    return null;
  }

  return (
    <button
      {...stylex.props(
        reset.button,
        triggerStyles.button,
        styles.button,
        unsupportedNetwork && styles.unsupported,
        responsiveDisplay(chainStatus, (value) => value !== "none", "flex"),
        !buttonReady && triggerStyles.hidden,
        !onOpenNetworkModal && styles.disabled,
        press.scale,
      )}
      aria-hidden={!buttonReady || undefined}
      aria-label={t("chains.selector")}
      disabled={!buttonReady || !onOpenNetworkModal}
      key={unsupportedNetwork ? "unsupported" : "supported"}
      onClick={buttonReady ? onOpenNetworkModal : undefined}
      type="button"
    >
      {unsupportedNetwork ? (
        t("connect_wallet.wrong_network.label")
      ) : (
        <>
          {network.hasIcon ? (
            <span
              {...stylex.props(
                responsiveDisplay(chainStatus, (value) => value === "full" || value === "icon", "block"),
              )}
            >
              <AsyncImage
                alt={network.name ?? "Chain icon"}
                background={network.iconBackground}
                radius="full"
                size={24}
                src={network.iconUrl}
              />
            </span>
          ) : null}
          <span
            {...stylex.props(
              triggerStyles.label,
              styles.name,
              responsiveDisplay(
                chainStatus,
                (value) => value === "full" || value === "name" || (value === "icon" && !network.iconUrl),
                "block",
              ),
            )}
            title={network.name}
          >
            {network.name ?? network.id}
          </span>
        </>
      )}
      <DropdownIcon />
    </button>
  );
}
