import React, { useEffect, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import type { AsyncImageSrc } from "../AsyncImage/useAsyncImage";

import { reset } from "../../css/reset";
import { colors, motion, radii } from "../../css/vars.stylex";
import { isMobile } from "../../utils/isMobile";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { Dialog } from "../Dialog/Dialog";
import { DialogContent } from "../Dialog/DialogContent";
import { DialogHeader } from "../Dialog/DialogHeader";
import { DisconnectSqIcon } from "../Icons/DisconnectSq";
import { MenuButton } from "../MenuButton/MenuButton";
import { Text } from "../Text/Text";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
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
    fontFamily: "inherit",
    fontSize: 16,
    height: 44,
    margin: 0,
    outlineStyle: "none",
    paddingInline: 14,
    transitionDuration: motion.fast,
    transitionProperty: "border-color",
    transitionTimingFunction: "ease-out",
    width: "100%",
    "::placeholder": {
      color: colors.modalTextSecondary,
      opacity: 1,
    },
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    marginInline: -4,
    maxHeight: 456,
    overflowX: "hidden",
    overflowY: "auto",
  },
  listMobile: {
    scrollbarWidth: "none",
    "::-webkit-scrollbar": {
      display: "none",
    },
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
  pending: {
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
  const mobile = isMobile();
  const chainIconSize = mobile ? 32 : 28;
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
            title="Switch Network"
            titleId={titleId}
          />
          {isConnectedToUnsupportedNetwork && (
            <Text
              align="center"
              color="modalTextSecondary"
              size="14"
              weight="medium"
            >
              Wrong network detected, switch or disconnect to continue.
            </Text>
          )}
          {shouldShowSearch && (
            <input
              {...stylex.props(styles.search)}
              aria-label="Search networks"
              autoComplete="off"
              inputMode="search"
              name="network-search"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              type="search"
              value={searchQuery}
            />
          )}
          <div {...stylex.props(styles.list, mobile ? styles.listMobile : reset.scrollbar)}>
            {filteredNetworks.map(({ iconBackground, iconUrl, id, name }) => {
              const isCurrentNetwork = currentNetworkId === id;

              return (
                <MenuButton
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
                  {isCurrentNetwork && <span {...stylex.props(styles.status, styles.connected)}>Connected</span>}
                  {pendingNetworkId === id && (
                    <span {...stylex.props(styles.status, styles.pending)}>
                      Confirm in wallet
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
                No networks match your search.
              </Text>
            )}
            {isConnectedToUnsupportedNetwork && onDisconnectUnsupported && (
              <MenuButton
                danger
                onClick={onDisconnectUnsupported}
                testId="chain-option-disconnect"
              >
                <span {...stylex.props(styles.disconnectIcon)}>
                  <DisconnectSqIcon size={chainIconSize} />
                </span>
                Disconnect
              </MenuButton>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
