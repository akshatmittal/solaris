import React, { useContext } from "react";

import * as stylex from "@stylexjs/stylex";

import { press } from "../../css/press";
import { reset } from "../../css/reset";
import { colors, media } from "../../css/vars.stylex";
import { useClearRecentTransactions } from "../../transactions/useClearRecentTransactions";
import { useRecentTransactions } from "../../transactions/useRecentTransactions";
import { t } from "../../translations";
import { AppContext } from "../SolarisEthereumProvider/AppContext";
import { Text } from "../Text/Text";
import { TxItem } from "./TxItem";

const NUMBER_OF_VISIBLE_TXS = 3;

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    paddingBottom: 8,
    paddingInline: 12,
    paddingTop: 12,
  },
  header: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    paddingBottom: 4,
    paddingInline: 12,
  },
  clear: {
    color: colors.accentColor,
    opacity: { default: 1, ":hover": { default: null, [media.hover]: 0.75 } },
    fontSize: 13,
    fontWeight: 500,
    lineHeight: "18px",
    marginBlock: -8,
    paddingBlock: 8,
  },
  empty: {
    paddingBlock: 8,
    paddingInline: 12,
  },
});

export function TxList() {
  const recentTransactions = useRecentTransactions();
  const clearRecentTransactions = useClearRecentTransactions();
  const visibleTxs = recentTransactions.slice(0, NUMBER_OF_VISIBLE_TXS);
  const { appName } = useContext(AppContext);

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.header)}>
        <Text
          color="modalTextSecondary"
          size="13"
          weight="medium"
        >
          {t("profile.transactions.recent.title")}
        </Text>
        {visibleTxs.length > 0 && (
          <button
            {...stylex.props(reset.button, styles.clear, press.scale)}
            onClick={clearRecentTransactions}
            type="button"
          >
            {t("profile.transactions.clear.label")}
          </button>
        )}
      </div>
      {visibleTxs.length > 0 ? (
        visibleTxs.map((tx) => (
          <TxItem
            key={tx.hash}
            tx={tx}
          />
        ))
      ) : (
        <div {...stylex.props(styles.empty)}>
          <Text
            color="modalTextSecondary"
            size="14"
            weight="regular"
          >
            {appName
              ? t("profile.transactions.description", {
                  appName,
                })
              : t("profile.transactions.description_fallback")}
          </Text>
        </div>
      )}
    </div>
  );
}
