import React, { type ReactNode } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { t } from "../../translations";
import { Avatar } from "../Avatar/Avatar";
import { CopyStatusIcon, CopyStatusMessage } from "../CopyStatus/CopyStatus";
import { DialogHeader } from "../Dialog/DialogHeader";
import { DisconnectIcon } from "../Icons/Disconnect";
import { ExternalLinkIcon } from "../Icons/ExternalLink";
import { Text } from "../Text/Text";
import { ProfileDetailsAction } from "./ProfileDetailsAction";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  profile: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    padding: 16,
    paddingBottom: 20,
  },
  identity: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: -44,
    // The identity block overlaps the header row; let clicks reach the close button.
    pointerEvents: "none",
    textAlign: "center",
  },
  names: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginInline: 8,
  },
  actionRow: {
    display: "flex",
    gap: 8,
  },
  transactions: {
    borderTopColor: colors.generalBorder,
    borderTopStyle: "solid",
    borderTopWidth: 1,
  },
});

export interface ProfileDetailsViewProps {
  accountName: string;
  address: string;
  avatarImageUrl?: string;
  balanceLabel?: string;
  explorer?: { name: string; url: string };
  onClose: () => void;
  onDisconnect: () => void;
  /** Heading id the surrounding Dialog's aria-labelledby points at. */
  titleId: string;
  transactions?: ReactNode;
}

export function ProfileDetailsView({
  accountName,
  address,
  avatarImageUrl,
  balanceLabel,
  explorer,
  onClose,
  onDisconnect,
  titleId,
  transactions,
}: ProfileDetailsViewProps) {
  const { copy: copyAddress, result: copyResult } = useCopyToClipboard(address);

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.profile)}>
        <DialogHeader onClose={onClose} />
        <div {...stylex.props(styles.identity)}>
          <Avatar
            address={address}
            imageUrl={avatarImageUrl}
            size={64}
          />
          <div {...stylex.props(styles.names)}>
            <Text
              as="h1"
              color="modalText"
              id={titleId}
              size="20"
              weight="semibold"
            >
              {accountName}
            </Text>
            {balanceLabel && (
              <Text
                color="modalTextSecondary"
                size="14"
                weight="regular"
              >
                {balanceLabel}
              </Text>
            )}
          </div>
        </div>
        <div {...stylex.props(styles.actions)}>
          <div {...stylex.props(styles.actionRow)}>
            <ProfileDetailsAction
              action={copyAddress}
              icon={<CopyStatusIcon result={copyResult} />}
              label={t("profile.copy_address.label")}
            />
            <ProfileDetailsAction
              action={onDisconnect}
              icon={<DisconnectIcon />}
              label={t("profile.disconnect.label")}
            />
            <CopyStatusMessage result={copyResult} />
          </div>
          {explorer && (
            <div {...stylex.props(styles.actionRow)}>
              <ProfileDetailsAction
                href={explorer.url}
                icon={<ExternalLinkIcon />}
                label={t("profile.explorer.label", { explorer: explorer.name })}
              />
            </div>
          )}
        </div>
      </div>
      {transactions ? <div {...stylex.props(styles.transactions)}>{transactions}</div> : null}
    </div>
  );
}
