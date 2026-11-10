import React, { useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { t } from "../../translations";
import { DialogHeader } from "../Dialog/DialogHeader";
import { WalletButtonContext } from "../RainbowKitProvider/WalletButtonContext";
import { Text } from "../Text/Text";
import { WalletButton } from "./MobileOptions";

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
});

export const MobileStatus = ({ onClose }: { onClose: () => void }) => {
  const { connector } = useContext(WalletButtonContext);
  const connectorName = connector?.name || "";

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <DialogHeader onClose={onClose} />
      </div>
      <WalletButton
        connecting
        onClose={onClose}
        wallet={connector!}
      />
      <div {...stylex.props(styles.text)}>
        <Text
          align="center"
          color="modalText"
          size="18"
          weight="semibold"
        >
          {t("connect.status.connect_mobile", {
            wallet: connectorName,
          })}
        </Text>
        <Text
          align="center"
          color="modalTextSecondary"
          size="15"
          weight="regular"
        >
          {t("connect.status.confirm_mobile", {
            wallet: connectorName,
          })}
        </Text>
      </div>
    </div>
  );
};
