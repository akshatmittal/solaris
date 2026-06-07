import React from "react";

import { screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { createConnector, useChainId, useConnection, useSwitchChain } from "wagmi";
import { base, mainnet } from "wagmi/chains";

import type { CreateWalletFn } from "./Wallet";

import { renderWithProviders } from "../../test";
import { useWalletConnectors } from "./useWalletConnectors";

const account = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as const;

function ConnectorSyncProbe() {
  const chainId = useChainId();
  const { chainId: connectionChainId } = useConnection();
  const { switchChainAsync } = useSwitchChain();
  const [wallet] = useWalletConnectors();

  return (
    <>
      <output data-testid="target-chain">{chainId}</output>
      <output data-testid="connection-chain">{connectionChainId ?? "disconnected"}</output>
      <button
        data-testid="select-base"
        onClick={() => switchChainAsync({ chainId: base.id })}
        type="button"
      >
        Select Base
      </button>
      <button
        data-testid="connect-wallet"
        onClick={() => wallet?.connect()}
        type="button"
      >
        Connect
      </button>
    </>
  );
}

describe("useWalletConnectors", () => {
  it("syncs the connector chain after connect when the connector provider is still on another chain", async () => {
    const connectorState = {
      currentChainId: mainnet.id,
      switchCalls: [] as number[],
    };

    const outOfSyncWallet: CreateWalletFn = () => ({
      createConnector: (walletDetails) =>
        createConnector((config) => ({
          ...walletDetails,
          id: "out-of-sync",
          name: "Out of Sync",
          type: "out-of-sync",
          async connect({ chainId } = {}) {
            return {
              accounts: [account],
              chainId: chainId ?? connectorState.currentChainId,
            };
          },
          async disconnect() {},
          async getAccounts() {
            return [account];
          },
          async getChainId() {
            return connectorState.currentChainId;
          },
          async getProvider() {
            return {
              request: async () => undefined,
            };
          },
          async isAuthorized() {
            return false;
          },
          async switchChain({ chainId }) {
            const chain = config.chains.find((chain) => chain.id === chainId);

            if (!chain) {
              throw new Error(`Unsupported chain: ${chainId}`);
            }

            connectorState.currentChainId = chainId;
            connectorState.switchCalls.push(chainId);
            config.emitter.emit("change", { chainId });

            return chain;
          },
          onAccountsChanged() {},
          onChainChanged() {},
          onDisconnect() {},
        })),
      iconBackground: "#fff",
      iconUrl: "",
      id: "out-of-sync",
      installed: true,
      name: "Out of Sync",
    });

    renderWithProviders(<ConnectorSyncProbe />, {
      chains: [mainnet, base],
      mockWallets: [{ groupName: "Test", wallets: [outOfSyncWallet] }],
    });

    await user.click(screen.getByTestId("select-base"));

    await waitFor(() => {
      expect(screen.getByTestId("target-chain")).toHaveTextContent(String(base.id));
    });

    await user.click(screen.getByTestId("connect-wallet"));

    await waitFor(() => {
      expect(connectorState.currentChainId).toBe(base.id);
    });
    expect(connectorState.switchCalls).toEqual([base.id]);
  });
});
