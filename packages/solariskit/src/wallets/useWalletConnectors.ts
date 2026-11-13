import { type Connector, useChainId as useWagmiChainId, useConnect, useConnectors, useSwitchChain } from "wagmi";

import type { WagmiConnectorInstance, WalletInstance } from "./Wallet";

import { useWalletConnectOpenState } from "../components/SolarisEthereumProvider/ModalContext";
import { isChainIdSupported } from "../utils/isChainIdSupported";
import { isNotNullish } from "../utils/isNotNullish";
import { useInitialChainId, useSolarisChains } from "./../components/SolarisEthereumProvider/SolarisChainContext";
import { connectorsWithRecentWallets, isEIP6963Connector, isSolarisConnector, isRecentWallet } from "./groupedWallets";
import { requestWalletSdk } from "./lazyConnector";
import { addRecentWalletId, getRecentWalletIds } from "./recentWalletIds";

export interface WalletConnector extends WalletInstance {
  ready?: boolean;
  connect: WalletInstance["connect"];
  // onOpen runs when the WalletConnect modal opens, so the caller can close its own modal then.
  showWalletConnectModal?: (onOpen: () => void) => Promise<void>;
  recent: boolean;
  getDesktopUri?: () => Promise<string>;
  // Calls onUri with each new QR code URI until the returned function is called.
  watchQrCodeUri?: (onUri: (uri: string) => void) => () => void;
  getMobileUri?: () => Promise<string>;
}

export function useWalletConnectors(mergeEIP6963WithSolarisConnectors = false): WalletConnector[] {
  const solarisChains = useSolarisChains();
  const initialChainId = useInitialChainId();
  const selectedChainId = useWagmiChainId();
  const { mutateAsync: connect } = useConnect();
  const { mutateAsync: switchChain } = useSwitchChain();
  const defaultConnectors_untyped = useConnectors();
  const defaultCreatedConnectors = defaultConnectors_untyped as WagmiConnectorInstance[];

  const { setIsWalletConnectModalOpen } = useWalletConnectOpenState();

  const defaultConnectors = defaultCreatedConnectors.map((connector) => ({
    ...connector,
    // solarisDetails is optional it does not exist in eip6963 connectors.
    // We only inject `solarisDetails` in `connectorsForWallets` when we
    // want to have additional information in the connector.
    ...connector.solarisDetails,
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
      (isChainIdSupported(solarisChains, walletChainId) ? walletChainId : undefined) ??
      // Finally, fall back to the first chain provided to SolarisEthereumProvider.
      solarisChains[0]?.id;

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

  async function connectToWalletConnectModal(
    connector: Connector,
    openWalletConnectModal: NonNullable<WalletInstance["openWalletConnectModal"]>,
    onOpen: () => void,
  ) {
    setIsWalletConnectModalOpen(true);
    try {
      requestWalletSdk(connector);
      const modal = await openWalletConnectModal();
      let pending = true;
      modal.shown.then(() => {
        if (pending) {
          onOpen();
        }
      });
      try {
        await connectWallet(connector);
      } finally {
        pending = false;
        modal.close();
      }
    } catch (err) {
      // Closing the modal aborts the pairing, which rejects the connect.
      const isUserRejection =
        err instanceof Error && (err.name === "UserRejectedRequestError" || /abort/i.test(err.message));
      if (!isUserRejection) {
        throw err;
      }
    } finally {
      setIsWalletConnectModalOpen(false);
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

  const eip6963Connectors = defaultConnectors.filter(isEIP6963Connector).map((connector) => {
    return {
      ...connector,
      groupIndex: 0,
    };
  });

  const solarisConnectors = defaultConnectors.filter(isSolarisConnector).filter((wallet) => {
    if (!mergeEIP6963WithSolarisConnectors) return true;

    const existsInEIP6963Connectors = eip6963Connectors.some((eip6963) => eip6963.id === wallet.rdns);

    return !existsInEIP6963Connectors;
  });

  const combinedConnectors = [...eip6963Connectors, ...solarisConnectors];

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

    const { openWalletConnectModal } = wallet;
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
      showWalletConnectModal: openWalletConnectModal
        ? (onOpen) => connectToWalletConnectModal(wallet, openWalletConnectModal, onOpen)
        : undefined,
    });
  }
  return walletConnectors;
}
