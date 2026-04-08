import React, { Fragment } from "react";

import user from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useConnect } from "wagmi";
import { type Chain, arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";

import { renderWithProviders } from "../../../test/";
import type { RainbowKitProviderProps } from "../RainbowKitProvider/RainbowKitProvider";
import { ChainModal } from "./ChainModal";

const ChainModalWithConnectButton = ({ onClose }: { onClose?: () => void }) => {
  const { connect, connectors } = useConnect();

  return (
    <Fragment>
      <ChainModal
        onClose={() => {
          if (onClose) onClose();
        }}
        open
      />
      <button
        onClick={() => connect({ connector: connectors[0] })}
        data-testid="rk-connect-btn"
      >
        connect
      </button>
    </Fragment>
  );
};

describe("<ChainModal />", () => {
  const searchableChains = [mainnet, arbitrum, optimism, base, polygon, sepolia] as const;

  const renderChainModalWithConnectedWallet = async (
    chains?: readonly [Chain, ...Chain[]],
    onClose?: () => void,
    props?: Omit<RainbowKitProviderProps, "children">,
  ) => {
    const modal = renderWithProviders(<ChainModalWithConnectButton onClose={onClose} />, {
      chains,
      props,
    });

    const connectButtonOption = await modal.findByTestId("rk-connect-btn");

    await user.click(connectButtonOption);

    return modal;
  };

  it("Show current connected chain indicator", async () => {
    const modal = await renderChainModalWithConnectedWallet();

    const mainnetOption = await modal.findByTestId(`rk-chain-option-${mainnet.id}`);

    expect(mainnetOption).toHaveTextContent("Connected");
    expect(mainnetOption).toBeDisabled();
  });

  it("List chains from <RainbowKitProvider />", async () => {
    const modal = await renderChainModalWithConnectedWallet([mainnet, arbitrum, optimism]);

    const mainnetOption = await modal.findByTestId(`rk-chain-option-${mainnet.id}`);
    const arbitrumOption = await modal.findByTestId(`rk-chain-option-${arbitrum.id}`);
    const optimismOption = await modal.findByTestId(`rk-chain-option-${optimism.id}`);

    expect(mainnetOption).toBeInTheDocument();
    expect(arbitrumOption).toBeInTheDocument();
    expect(optimismOption).toBeInTheDocument();
  });

  it("Hides search when there are 5 or fewer chains", async () => {
    const modal = await renderChainModalWithConnectedWallet([mainnet, arbitrum, optimism, base, polygon]);

    expect(modal.queryByRole("searchbox", { name: "Search networks" })).not.toBeInTheDocument();
  });

  it("Shows search when chain count exceeds the configured threshold", async () => {
    const modal = await renderChainModalWithConnectedWallet([mainnet, arbitrum, optimism], undefined, {
      chainSearchThreshold: 2,
    });

    expect(modal.getByRole("searchbox", { name: "Search networks" })).toBeInTheDocument();
  });

  it("Hides search when the configured threshold is Infinity", async () => {
    const modal = await renderChainModalWithConnectedWallet(searchableChains, undefined, {
      chainSearchThreshold: Infinity,
    });

    expect(modal.queryByRole("searchbox", { name: "Search networks" })).not.toBeInTheDocument();
  });

  it("Filters chains by name", async () => {
    const modal = await renderChainModalWithConnectedWallet(searchableChains);

    const searchInput = await modal.findByRole("searchbox", { name: "Search networks" });

    await user.type(searchInput, "arb");

    expect(modal.getByTestId(`rk-chain-option-${arbitrum.id}`)).toBeInTheDocument();
    expect(modal.queryByTestId(`rk-chain-option-${mainnet.id}`)).not.toBeInTheDocument();
    expect(modal.queryByTestId(`rk-chain-option-${optimism.id}`)).not.toBeInTheDocument();
  });

  it("Filters chains by id", async () => {
    const modal = await renderChainModalWithConnectedWallet(searchableChains);

    const searchInput = await modal.findByRole("searchbox", { name: "Search networks" });

    await user.type(searchInput, String(optimism.id));

    expect(modal.getByTestId(`rk-chain-option-${optimism.id}`)).toBeInTheDocument();
    expect(modal.queryByTestId(`rk-chain-option-${mainnet.id}`)).not.toBeInTheDocument();
    expect(modal.queryByTestId(`rk-chain-option-${arbitrum.id}`)).not.toBeInTheDocument();
  });

  it("Can switch chains", async () => {
    let onCloseGotCalled = false;

    const modal = await renderChainModalWithConnectedWallet([mainnet, arbitrum], () => {
      onCloseGotCalled = true;
    });

    const mainnetOption = await modal.findByTestId(`rk-chain-option-${mainnet.id}`);
    const arbitrumOption = await modal.findByTestId(`rk-chain-option-${arbitrum.id}`);

    expect(mainnetOption).toHaveTextContent("Connected");
    expect(arbitrumOption).not.toHaveTextContent("Connected");

    await user.click(arbitrumOption);

    expect(mainnetOption).not.toHaveTextContent("Connected");
    expect(arbitrumOption).toHaveTextContent("Connected");

    expect(onCloseGotCalled).toBe(true);
  });

  it("Closes on close button press", async () => {
    let onCloseGotCalled = false;

    const modal = await renderChainModalWithConnectedWallet([mainnet], () => {
      onCloseGotCalled = true;
    });

    const closeButton = await modal.findByLabelText("Close");

    await user.click(closeButton);

    expect(onCloseGotCalled).toBe(true);
  });

  it("Chain metadata passed from <RainbowKitProvider>", async () => {
    const modal = await renderChainModalWithConnectedWallet([mainnet]);

    const mainnetOption = await modal.findByTestId(`rk-chain-option-${mainnet.id}`);

    expect(mainnetOption).toHaveTextContent("Ethereum");

    const mainnetOptionIcon = await modal.findByTestId(`rk-chain-option-${mainnet.id}-icon`);

    expect(mainnetOptionIcon).toBeInTheDocument();
    expect(mainnetOptionIcon).toHaveAttribute("aria-label", "Ethereum");
  });
});
