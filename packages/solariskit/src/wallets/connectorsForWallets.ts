import type { CreateConnectorFn } from "wagmi";

import type { Wallet, WalletList } from "./Wallet";

import { isHexString } from "../utils/colors";
import { omitUndefinedValues } from "../utils/omitUndefinedValues";
import { computeWalletConnectMetaData } from "./computeWalletConnectMetaData";
import { lazyConnector } from "./lazyConnector";

interface WalletListItem extends Wallet {
  index: number;
  groupIndex: number;
  groupName: string;
}

export interface ConnectorsForWalletsParameters {
  projectId: string;
  appName: string;
  appDescription?: string;
  appUrl?: string;
  appIcon?: string;
}

export const connectorsForWallets = (
  walletList: WalletList,
  { projectId, appName, appDescription, appUrl, appIcon }: ConnectorsForWalletsParameters,
): CreateConnectorFn[] => {
  if (!walletList.length) {
    throw new Error("No wallet list was provided");
  }

  for (const { wallets, groupName } of walletList) {
    if (!wallets.length) {
      throw new Error(`No wallets provided for group: ${groupName}`);
    }
  }

  let index = -1;

  const connectors: CreateConnectorFn[] = [];
  const visibleWallets: WalletListItem[] = [];
  const potentiallyHiddenWallets: WalletListItem[] = [];

  const metadata = computeWalletConnectMetaData({
    appName,
    appDescription,
    appUrl,
    appIcon,
  });

  for (const [groupIndex, { groupName, wallets }] of walletList.entries()) {
    for (const createWallet of wallets) {
      index++;

      const wallet = createWallet({ projectId, metadata, appName, appIcon });

      // guard against non-hex values for `iconAccent`
      if (wallet?.iconAccent && !isHexString(wallet?.iconAccent)) {
        throw new Error(`Property \`iconAccent\` is not a hex value for wallet: ${wallet.name}`);
      }

      const walletListItem = {
        ...wallet,
        groupIndex: groupIndex + 1,
        groupName,
        index,
      };

      if (typeof wallet.hidden === "function") {
        potentiallyHiddenWallets.push(walletListItem);
      } else {
        visibleWallets.push(walletListItem);
      }
    }
  }

  // Filtering out duplicated wallets in case there is any.
  // We process the known visible wallets first so that the potentially
  // hidden wallets have access to the complete list of resolved wallets
  const allWallets = [...visibleWallets, ...potentiallyHiddenWallets];
  const walletListItems: WalletListItem[] = allWallets.filter(
    (wallet, index) => allWallets.findIndex(({ id }) => id === wallet.id) === index,
  );

  for (const { createConnector, groupIndex, groupName, hidden, ...walletMeta } of walletListItems) {
    if (typeof hidden === "function") {
      // Run the function to check if the wallet needs to be hidden
      const isHidden = hidden();

      // If wallet is hidden, bail out and proceed to the next list item
      if (isHidden) {
        continue;
      }
    }

    const walletMetaData = {
      solarisDetails: omitUndefinedValues({
        ...walletMeta,
        groupIndex,
        groupName,
        isSolarisConnector: true,
      }),
    };

    connectors.push(lazyConnector(createConnector(walletMetaData)));
  }

  return connectors;
};
