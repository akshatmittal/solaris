import { type Connector, useChainId as useWagmiChainId, useConnect, useConnectors, useSwitchChain } from "wagmi";

import type { WagmiConnectorInstance, WalletInstance } from "./Wallet";

import { useWalletConnectOpenState } from "../components/RainbowKitProvider/ModalContext";
import { isChainIdSupported } from "../utils/isChainIdSupported";
import { isNotNullish } from "../utils/isNotNullish";
import { useInitialChainId, useRainbowKitChains } from "./../components/RainbowKitProvider/RainbowKitChainContext";
import {
  connectorsWithRecentWallets,
  isEIP6963Connector,
  isRainbowKitConnector,
  isRecentWallet,
  rainbowKitConnectorWithWalletConnect,
} from "./groupedWallets";
import { requestWalletSdk } from "./lazyConnector";
import { addRecentWalletId, getRecentWalletIds } from "./recentWalletIds";

export interface WalletConnector extends WalletInstance {
  ready?: boolean;
  connect: WalletInstance["connect"];
  showWalletConnectModal?: () => void;
  recent: boolean;
  getDesktopUri?: () => Promise<string>;
  // Calls onUri with each new QR code URI until the returned function is called.
  watchQrCodeUri?: (onUri: (uri: string) => void) => () => void;
  getMobileUri?: () => Promise<string>;
}

export function useWalletConnectors(mergeEIP6963WithRkConnectors = false): WalletConnector[] {
  const rainbowKitChains = useRainbowKitChains();
  const initialChainId = useInitialChainId();
  const selectedChainId = useWagmiChainId();
  const { mutateAsync: connect } = useConnect();
  const { mutateAsync: switchChain } = useSwitchChain();
  const defaultConnectors_untyped = useConnectors();
  const defaultCreatedConnectors = defaultConnectors_untyped as WagmiConnectorInstance[];

  const { setIsWalletConnectModalOpen } = useWalletConnectOpenState();

  const defaultConnectors = defaultCreatedConnectors.map((connector) => ({
    ...connector,
    // rkDetails is optional it does not exist in eip6963 connectors.
    // We only inject `rkDetails` in `connectorsForWallets` when we
    // want to have additional information in the connector.
    ...connector.rkDetails,
  })) as WalletInstance[];

  async function connectWallet(
    connector: Connector,
    parameters?: Parameters<WalletInstance["connect"]>[0],
  ): ReturnType<WalletInstance["connect"]> {
    const walletChainId = await connector.getChainId();
    const targetChainId =
      parameters?.chainId ??
      // Use the currently selected wagmi target chain. This is updated by the
      // disconnected chain picker via `switchChain`.
      selectedChainId ??
      // `initialChain` is also applied to wagmi config, but keep this fallback
      // for callers rendered before that effect runs.
      initialChainId ??
      // Otherwise, if the wallet is already on a supported chain, use that to avoid a chain switch prompt.
      (isChainIdSupported(rainbowKitChains, walletChainId) ? walletChainId : undefined) ??
      // Finally, fall back to the first chain provided to RainbowKitProvider.
      rainbowKitChains[0]?.id;

    let result = await connect({
      ...parameters,
      chainId: targetChainId,
      connector,
    });

    if (targetChainId && connector.switchChain) {
      const connectedChainId = await connector.getChainId();

      if (connectedChainId !== targetChainId) {
        const chain = await switchChain({ chainId: targetChainId, connector });

        result = {
          ...result,
          chainId: chain.id,
        };
      }
    }

    if (result) {
      addRecentWalletId(connector.id);
    }

    return result as Awaited<ReturnType<WalletInstance["connect"]>>;
  }

  async function connectToWalletConnectModal(walletConnectModalConnector: Connector) {
    try {
      setIsWalletConnectModalOpen(true);
      // The modal connector is not in the wallet list, so no connect UI requested its SDK.
      requestWalletSdk(walletConnectModalConnector);
      await connectWallet(walletConnectModalConnector);
      setIsWalletConnectModalOpen(false);
    } catch (err) {
      const isUserRejection =
        // @ts-expect-error - Web3Modal v1 error name
        err.name === "UserRejectedRequestError" ||
        // @ts-expect-error - Web3Modal v2 error message on desktop
        err.message === "Connection request reset. Please try again.";

      setIsWalletConnectModalOpen(false);

      if (!isUserRejection) {
        throw err;
      }
    }
  }

  // WalletConnect wallets share one provider, and it reports each new URI only to the
  // connector that connected first. Listen on all of them, so a second wallet still gets its URI.
  const watchWalletConnectUri = (
    connector: Connector,
    uriConverter: (uri: string) => string,
    onUri: (uri: string) => void,
  ) => {
    const emitters =
      connector.type === "walletConnect"
        ? defaultConnectors
            .filter((walletConnector) => walletConnector.type === "walletConnect")
            .filter((walletConnector) => !walletConnector.isWalletConnectModalConnector)
            .map((walletConnector) => walletConnector.emitter)
        : [connector.emitter];

    const onMessage = ({ data, type }: { data?: unknown; type: string }) => {
      if (type === "display_uri" && typeof data === "string") {
        onUri(uriConverter(data));
      }
    };

    for (const emitter of emitters) {
      emitter.on("message", onMessage);
    }
    return () => {
      for (const emitter of emitters) {
        emitter.off("message", onMessage);
      }
    };
  };

  const getWalletConnectUri = (connector: Connector, uriConverter: (uri: string) => string) =>
    new Promise<string>((resolve) => {
      const stop = watchWalletConnectUri(connector, uriConverter, (uri) => {
        stop();
        resolve(uri);
      });
    });

  const walletConnectModalConnector = defaultConnectors.find(
    (connector) => connector.id === "walletConnect" && connector.isWalletConnectModalConnector,
  );

  const eip6963Connectors = defaultConnectors.filter(isEIP6963Connector).map((connector) => {
    return {
      ...connector,
      groupIndex: 0,
    };
  });

  const rainbowKitConnectors = defaultConnectors
    .filter(isRainbowKitConnector)
    .filter((wallet) => !wallet.isWalletConnectModalConnector)
    .filter((wallet) => {
      if (!mergeEIP6963WithRkConnectors) return true;

      const existsInEIP6963Connectors = eip6963Connectors.some((eip6963) => eip6963.id === wallet.rdns);

      return !existsInEIP6963Connectors;
    })
    .map((wallet) => rainbowKitConnectorWithWalletConnect(wallet, walletConnectModalConnector!));

  const combinedConnectors = [...eip6963Connectors, ...rainbowKitConnectors];

  const walletInstanceById = new Map(combinedConnectors.map((walletInstance) => [walletInstance.id, walletInstance]));

  const MAX_RECENT_WALLETS = 3;

  const recentWallets: WalletInstance[] = getRecentWalletIds()
    .map((walletId) => walletInstanceById.get(walletId))
    .filter(isNotNullish)
    .slice(0, MAX_RECENT_WALLETS);

  const walletConnectors: WalletConnector[] = [];

  const combinedConnectorsWithRecentWallets = connectorsWithRecentWallets({
    wallets: combinedConnectors,
    recentWallets: recentWallets,
  });

  for (const wallet of combinedConnectorsWithRecentWallets) {
    if (!wallet) continue;

    const eip6963 = isEIP6963Connector(wallet);

    const recent = isRecentWallet(recentWallets, wallet.id);

    if (eip6963) {
      walletConnectors.push({
        ...wallet,
        iconUrl: wallet.icon!,
        ready: true,
        connect: connectWallet.bind(null, wallet) as WalletInstance["connect"],
        groupName: "Installed",
        recent,
      });

      continue;
    }

    walletConnectors.push({
      ...wallet,
      ready: wallet.installed ?? true,
      connect: connectWallet.bind(null, wallet) as WalletInstance["connect"],
      groupName: wallet.groupName,
      watchQrCodeUri: wallet.qrCode?.getUri
        ? (onUri) => watchWalletConnectUri(wallet, wallet.qrCode!.getUri, onUri)
        : undefined,
      getDesktopUri: wallet.desktop?.getUri ? () => getWalletConnectUri(wallet, wallet.desktop!.getUri!) : undefined,
      getMobileUri: wallet.mobile?.getUri ? () => getWalletConnectUri(wallet, wallet.mobile!.getUri!) : undefined,
      recent,
      showWalletConnectModal: wallet.walletConnectModalConnector
        ? () => connectToWalletConnectModal(wallet.walletConnectModalConnector!)
        : undefined,
    });
  }
  return walletConnectors;
}
