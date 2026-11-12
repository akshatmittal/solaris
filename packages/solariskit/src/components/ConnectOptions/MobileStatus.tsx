import React, { useEffect, useRef } from "react";

import * as stylex from "@stylexjs/stylex";

import { colors } from "../../css/vars.stylex";
import { t } from "../../translations";
import { type WalletConnector } from "../../wallets/useWalletConnectors";
import { AsyncImage } from "../AsyncImage/AsyncImage";
import { DialogHeader } from "../Dialog/DialogHeader";
import { SpinnerIcon } from "../Icons/Spinner";
import { Text } from "../Text/Text";
import { useMobileConnect } from "./MobileOptions";

const styles = stylex.create({
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    paddingBottom: 32,
  },
  header: {
    alignSelf: "stretch",
    padding: 16,
  },
  text: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 20,
    paddingInline: 24,
  },
  spinner: {
    color: colors.accentColor,
    display: "flex",
    marginTop: 24,
  },
});

export function MobileStatus({
  onClose,
  titleId,
  wallet,
}: {
  onClose: () => void;
  // Names the dialog; this step has no other heading.
  titleId: string;
  wallet: WalletConnector;
}) {
  const onConnect = useMobileConnect(wallet, onClose);
  const started = useRef(false);

  useEffect(() => {
    // StrictMode runs effects twice in development; connect only once.
    if (!started.current) {
      started.current = true;
      onConnect().catch(() => {
        // This view has no Retry; the user closes it and picks a wallet again.
      });
    }
  }, [onConnect]);

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <DialogHeader onClose={onClose} />
      </div>
      <AsyncImage
        background={wallet.iconBackground}
        radius={16}
        size={64}
        src={wallet.iconUrl}
      />
      <div {...stylex.props(styles.text)}>
        <Text
          align="center"
          as="h1"
          color="modalText"
          id={titleId}
          size="18"
          weight="semibold"
        >
          {t("connect.status.connect_mobile", {
            wallet: wallet.name,
          })}
        </Text>
        <Text
          align="center"
          color="modalTextSecondary"
          size="15"
          weight="regular"
        >
          {t("connect.status.confirm_mobile", {
            wallet: wallet.name,
          })}
        </Text>
      </div>
      <span {...stylex.props(styles.spinner)}>
        <SpinnerIcon
          height={24}
          width={24}
        />
      </span>
    </div>
  );
}
