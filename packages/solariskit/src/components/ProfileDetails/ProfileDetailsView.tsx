import React, { type ReactNode, useCallback, useEffect, useState } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { Avatar } from "../Avatar/Avatar";
import { DialogHeader } from "../Dialog/DialogHeader";
import { CopiedIcon } from "../Icons/Copied";
import { CopyIcon } from "../Icons/Copy";
import { DisconnectIcon } from "../Icons/Disconnect";
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
    gap: 8,
    marginInline: 8,
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
  onClose,
  onDisconnect,
  titleId,
  transactions,
}: ProfileDetailsViewProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const copyAddressAction = useCallback(() => {
    try {
      void navigator.clipboard.writeText(address).then(
        () => setCopiedAddress(true),
        () => setCopiedAddress(false),
      );
    } catch {
      setCopiedAddress(false);
    }
  }, [address]);

  useEffect(() => {
    if (copiedAddress) {
      const timer = setTimeout(() => {
        setCopiedAddress(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [copiedAddress]);

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
          <ProfileDetailsAction
            action={copyAddressAction}
            icon={copiedAddress ? <CopiedIcon /> : <CopyIcon />}
            success={copiedAddress}
            label={copiedAddress ? "Copied" : "Copy Address"}
          />
          <ProfileDetailsAction
            action={onDisconnect}
            icon={<DisconnectIcon />}
            label="Disconnect"
            testId="disconnect-button"
          />
        </div>
      </div>
      {transactions ? <div {...stylex.props(styles.transactions)}>{transactions}</div> : null}
    </div>
  );
}
