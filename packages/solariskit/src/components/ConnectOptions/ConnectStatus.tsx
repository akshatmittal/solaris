import React from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { t } from "../../translations";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { ActionButton } from "../Button/ActionButton";
import { SpinnerIcon } from "../Icons/Spinner";
import { Text } from "../Text/Text";
import { type WalletListViewItem } from "./WalletListView";

export type ConnectionError = "declined" | "qr_timeout";

const styles = stylex.create({
  status: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    gap: 12,
    justifyContent: "center",
    textAlign: "center",
  },
  // Matches the header above, so the icon, text, and spinner or Retry are centered in the card.
  balanced: {
    paddingBottom: 52,
  },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  // Holds the spinner while connecting and Retry after a decline, so the layout does not move.
  action: {
    alignItems: "center",
    color: colors.accentColor,
    display: "flex",
    justifyContent: "center",
    minHeight: 44,
  },
});

export function ConnectStatus({
  connectionError,
  onRetry,
  titleId,
  wallet,
}: {
  connectionError: ConnectionError | null;
  onRetry: () => void;
  // Names the dialog while the wallet list and its heading are hidden.
  titleId: string;
  wallet: Omit<WalletListViewItem, "loading">;
}) {
  return (
    <div {...stylex.props(styles.status, wallet.ready && styles.balanced)}>
      <AsyncImage
        background={wallet.iconBackground}
        radius={16}
        size={64}
        src={wallet.iconUrl}
        useAsImage={!wallet.isRainbowKitConnector}
      />
      <div
        {...stylex.props(styles.text)}
        role="status"
      >
        <Text
          as="h1"
          color="modalText"
          id={titleId}
          size="18"
          weight="semibold"
        >
          {connectionError
            ? t(`connect.status.${connectionError}`)
            : t("connect.status.opening", { wallet: wallet.name })}
        </Text>
        {wallet.ready && (
          <Text
            color="modalTextSecondary"
            size="14"
            weight="regular"
          >
            {connectionError ? t(`connect.status.${connectionError}_description`) : t("connect.status.confirm")}
          </Text>
        )}
      </div>
      {wallet.ready && (
        <div {...stylex.props(styles.action)}>
          {connectionError ? (
            <ActionButton
              label={t("connect.secondary_action.retry.label")}
              onClick={onRetry}
            />
          ) : (
            <SpinnerIcon
              height={24}
              width={24}
            />
          )}
        </div>
      )}
    </div>
  );
}
