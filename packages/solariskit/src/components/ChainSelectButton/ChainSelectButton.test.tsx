import React from "react";

import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { mainnet, polygon } from "wagmi/chains";

import { renderWithProviders } from "../../../test";
import { ChainSelectButton } from "./ChainSelectButton";

describe("<ChainSelectButton />", () => {
  it("renders the selected chain independently", async () => {
    renderWithProviders(<ChainSelectButton />, {
      chains: [mainnet, polygon],
    });

    const button = await screen.findByTestId("rk-chain-button");

    expect(button).toHaveTextContent("Ethereum");
    expect(screen.queryByTestId("rk-connect-button")).not.toBeInTheDocument();
  });

  it("opens the chain modal independently", async () => {
    renderWithProviders(<ChainSelectButton />, {
      chains: [mainnet, polygon],
    });

    const button = await screen.findByTestId("rk-chain-button");
    await user.click(button);

    expect(await screen.findByRole("heading", { name: "Switch Networks" })).toBeInTheDocument();
  });

  it("does not render when only one chain is available", () => {
    renderWithProviders(<ChainSelectButton />, {
      chains: [mainnet],
    });

    expect(screen.queryByTestId("rk-chain-button")).not.toBeInTheDocument();
  });
});
