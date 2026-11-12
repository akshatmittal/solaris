import React, { useEffect, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import type { AsyncImageSrc } from "../AsyncImage/useAsyncImage";

import { reset } from "../../css/reset";
import { colors, motion, radii } from "../../css/vars.stylex";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { Dialog } from "../Dialog/Dialog";
import { DialogContent } from "../Dialog/DialogContent";
import { DialogHeader } from "../Dialog/DialogHeader";
import { DisconnectSqIcon } from "../Icons/DisconnectSq";
import { MenuButton } from "../MenuButton/MenuButton";
import { Text } from "../Text/Text";

const appear = stylex.keyframes({
  from: { opacity: 0, visibility: "hidden" },
  to: { opacity: 1, visibility: "visible" },
});

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    // Lets the list shrink and scroll on short screens, so the title and search stay visible.
    minHeight: 0,
    padding: 16,
    paddingBottom: 12,
  },
  search: {
    appearance: "none",
    backgroundColor: colors.profileForeground,
    borderColor: { default: colors.generalBorder, ":focus": colors.accentColor },
    borderRadius: radii.menuButton,
    borderStyle: "solid",
    borderWidth: 1,
    boxSizing: "border-box",
    color: colors.modalText,
    flexShrink: 0,
    fontFamily: "inherit",
    fontSize: 16,
    height: 44,
    margin: 0,
    outlineStyle: "none",
    paddingInline: 14,
    transitionDuration: motion.fast,
    transitionProperty: "border-color",
    transitionTimingFunction: motion.easeOut,
    width: "100%",
    "::placeholder": {
      color: colors.modalTextSecondary,
      opacity: 1,
    },
    // The native clear button ignores the theme.
    "::-webkit-search-cancel-button": {
      display: "none",
    },
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginInline: -4,
    maxHeight: 456,
    // Two rows stay visible; below that the dialog scrolls instead.
    minHeight: 96,
    overflowX: "hidden",
    overflowY: "auto",
  },
  name: {
    flexGrow: 1,
    overflow: "hidden",
    textAlign: "left",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  status: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    fontSize: 14,
    fontWeight: 500,
    gap: 6,
  },
  connected: {
    color: colors.accentColor,
  },
  // The delay hides the label when the wallet switches without a confirmation.
  pending: {
    animationDelay: "300ms",
    animationDuration: motion.fast,
    animationFillMode: "backwards",
    animationName: appear,
    animationTimingFunction: motion.easeOut,
    color: colors.modalTextSecondary,
  },
  pendingDot: {
    backgroundColor: colors.standby,
    borderRadius: 9999,
    height: 8,
    width: 8,
  },
  disconnectIcon: {
    display: "flex",
    flexShrink: 0,
  },
});

export type NetworkModalId = number | string;

export interface NetworkModalItem {
  iconBackground?: string;
  iconUrl?: string | AsyncImageSrc | null;
  id: NetworkModalId;
  name?: string;
}

export interface NetworkModalViewProps {
  currentNetworkId?: NetworkModalId;
  isConnectedToUnsupportedNetwork?: boolean;
  networks: NetworkModalItem[];
  onClose: () => void;
  onDisconnectUnsupported?: () => void;
  onSelectNetwork: (networkId: NetworkModalId) => void;
  open: boolean;
  pendingNetworkId?: NetworkModalId | null;
  searchThreshold: number;
}

export function NetworkModalView({
  currentNetworkId,
  isConnectedToUnsupportedNetwork = false,
  networks,
  onClose,
  onDisconnectUnsupported,
  onSelectNetwork,
  open,
  pendingNetworkId,
  searchThreshold,
}: NetworkModalViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // useId keeps the heading id unique when several ecosystems (EVM + Solana)
  // mount their network modals on the same page.
  const titleId = `rk_chain_modal_title_${React.useId()}`;
  // Touch screens get larger icons, and the search does not take focus there because focus opens the keyboard over the list.
  const coarsePointer = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const chainIconSize = coarsePointer ? 32 : 28;
  const shouldShowSearch = networks.length > searchThreshold;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredNetworks = networks.filter(({ id, name }) => {
    if (!shouldShowSearch || !normalizedSearchQuery) {
      return true;
    }

    return (
      name?.toLowerCase().includes(normalizedSearchQuery) === true ||
      String(id).toLowerCase().includes(normalizedSearchQuery)
    );
  });

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      titleId={titleId}
    >
      <DialogContent>
        <div {...stylex.props(styles.container)}>
          <DialogHeader
            onClose={onClose}
            title={t("chains.title")}
            titleId={titleId}
          />
          {isConnectedToUnsupportedNetwork && (
            <Text
              align="center"
              color="modalTextSecondary"
              size="14"
              weight="medium"
            >
              {t("chains.wrong_network")}
            </Text>
          )}
          {shouldShowSearch && (
            <input
              {...stylex.props(styles.search)}
              aria-label={t("chains.search.label")}
              autoComplete="off"
              data-auto-focus={!coarsePointer || undefined}
              inputMode="search"
              name="network-search"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={t("chains.search.placeholder")}
              type="search"
              value={searchQuery}
            />
          )}
          <div {...stylex.props(styles.list, reset.scrollbar)}>
            {filteredNetworks.map(({ iconBackground, iconUrl, id, name }) => {
              const isCurrentNetwork = currentNetworkId === id;

              return (
                <MenuButton
                  loading={false}
                  currentlySelected={isCurrentNetwork}
                  key={String(id)}
                  onClick={isCurrentNetwork ? undefined : () => onSelectNetwork(id)}
                  testId={`chain-option-${String(id)}`}
                >
                  {iconUrl && (
                    <AsyncImage
                      alt={name}
                      background={iconBackground}
                      radius="full"
                      size={chainIconSize}
                      src={iconUrl}
                      testId={`chain-option-${String(id)}-icon`}
                    />
                  )}
                  <span {...stylex.props(styles.name)}>{name ?? id}</span>
                  {isCurrentNetwork && (
                    <span {...stylex.props(styles.status, styles.connected)}>{t("chains.connected")}</span>
                  )}
                  {pendingNetworkId === id && !isCurrentNetwork && (
                    <span {...stylex.props(styles.status, styles.pending)}>
                      {t("chains.confirm")}
                      <span {...stylex.props(styles.pendingDot)} />
                    </span>
                  )}
                </MenuButton>
              );
            })}
            {filteredNetworks.length === 0 && (
              <Text
                align="center"
                color="modalTextSecondary"
                size="14"
                weight="medium"
              >
                {t("chains.search.no_results")}
              </Text>
            )}
            {isConnectedToUnsupportedNetwork && onDisconnectUnsupported && (
              <MenuButton
                loading={false}
                danger
                onClick={onDisconnectUnsupported}
                testId="chain-option-disconnect"
              >
                <span {...stylex.props(styles.disconnectIcon)}>
                  <DisconnectSqIcon size={chainIconSize} />
                </span>
                {t("chains.disconnect")}
              </MenuButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
