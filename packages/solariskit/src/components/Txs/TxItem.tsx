import React from "react";

import * as stylex from "@stylexjs/stylex";
import { useConnection } from "wagmi";

import type { Transaction } from "../../transactions/transactionStore";

import { colors, motion, radii } from "../../css/vars.stylex";
import { chainToExplorerUrl } from "../../utils/chainToExplorerUrl";
import { CancelIcon } from "../Icons/Cancel";
import { ExternalLinkIcon } from "../Icons/ExternalLink";
import { SpinnerIcon } from "../Icons/Spinner";
import { SuccessIcon } from "../Icons/Success";
import { Text } from "../Text/Text";

const styles = stylex.create({
  row: {
    alignItems: "center",
    borderRadius: radii.menuButton,
    color: colors.modalText,
    display: "flex",
    gap: 12,
    paddingBlock: 8,
    paddingInline: 12,
    textDecoration: "none",
  },
  link: {
    backgroundColor: { default: "transparent", ":hover": colors.menuItemBackground },
    transitionDuration: motion.fast,
    transitionProperty: "background-color",
    transitionTimingFunction: "ease-out",
  },
  icon: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    height: 20,
    justifyContent: "center",
    width: 20,
  },
  pending: { color: colors.accentColor },
  confirmed: { color: colors.success },
  failed: { color: colors.error },
  text: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minWidth: 0,
  },
  trailingIcon: {
    color: colors.modalTextSecondary,
    display: "flex",
    marginRight: -3,
  },
});

const statusIcons = {
  confirmed: SuccessIcon,
  failed: CancelIcon,
  pending: SpinnerIcon,
} as const;

const statusLabels = {
  confirmed: "Confirmed",
  failed: "Failed",
  pending: "Pending",
} as const;

export function TxItem({ tx }: { tx: Transaction }) {
  const Icon = statusIcons[tx.status];
  const { chain: activeChain } = useConnection();
  const explorerLink = chainToExplorerUrl(activeChain);

  const content = (
    <>
      <span {...stylex.props(styles.icon, styles[tx.status])}>
        <Icon />
      </span>
      <span {...stylex.props(styles.text)}>
        <Text
          color="modalText"
          size="14"
          weight="medium"
        >
          {tx.description}
        </Text>
        <Text
          color={tx.status === "failed" ? "error" : "modalTextSecondary"}
          size="13"
          weight="regular"
        >
          {statusLabels[tx.status]}
        </Text>
      </span>
    </>
  );

  return explorerLink ? (
    <a
      {...stylex.props(styles.row, styles.link)}
      href={`${explorerLink}/tx/${tx.hash}`}
      rel="noreferrer noopener"
      target="_blank"
    >
      {content}
      <span {...stylex.props(styles.trailingIcon)}>
        <ExternalLinkIcon />
      </span>
    </a>
  ) : (
    <div {...stylex.props(styles.row)}>{content}</div>
  );
}
