import React, { useContext } from "react";

import * as stylex from "@stylexjs/stylex";
import { useConnection } from "wagmi";

import { reset } from "../../css/reset";
import { colors, motion } from "../../css/vars.stylex";
import { useClearRecentTransactions } from "../../transactions/useClearRecentTransactions";
import { useRecentTransactions } from "../../transactions/useRecentTransactions";
import { chainToExplorerUrl } from "../../utils/chainToExplorerUrl";
import { ExternalLinkIcon } from "../Icons/ExternalLink";
import { AppContext } from "../RainbowKitProvider/AppContext";
import { Text } from "../Text/Text";
import { TextLink } from "../TextLink/TextLink";
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
    opacity: { default: 1, ":hover": 0.75 },
    fontSize: 13,
    fontWeight: 500,
    lineHeight: "18px",
    marginBlock: -8,
    paddingBlock: 8,
    transitionDuration: motion.fast,
    transitionProperty: "opacity",
    transitionTimingFunction: "ease-out",
  },
  empty: {
    paddingBlock: 8,
    paddingInline: 12,
  },
  footer: {
    borderTopColor: colors.generalBorder,
    borderTopStyle: "solid",
    borderTopWidth: 1,
    display: "flex",
    justifyContent: "center",
    paddingBlock: 4,
  },
});

interface TxListProps {
  address: ReturnType<typeof useConnection>["address"];
}

export function TxList({ address }: TxListProps) {
  const recentTransactions = useRecentTransactions();
  const clearRecentTransactions = useClearRecentTransactions();
  const { chain: activeChain } = useConnection();
  const explorerLink = chainToExplorerUrl(activeChain);
  const visibleTxs = recentTransactions.slice(0, NUMBER_OF_VISIBLE_TXS);
  const { appName } = useContext(AppContext);

  return (
    <>
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.header)}>
          <Text
            color="modalTextSecondary"
            size="13"
            weight="medium"
          >
            Recent Transactions
          </Text>
          {visibleTxs.length > 0 && (
            <button
              {...stylex.props(reset.button, styles.clear)}
              onClick={clearRecentTransactions}
              type="button"
            >
              Clear All
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
              {appName ? `${appName} transactions will appear here.` : "Your transactions will appear here."}
            </Text>
          </div>
        )}
      </div>
      {explorerLink && (
        <div {...stylex.props(styles.footer)}>
          <TextLink
            href={`${explorerLink}/address/${address}`}
            tall
          >
            View on Explorer
            <ExternalLinkIcon />
          </TextLink>
        </div>
      )}
    </>
  );
}
