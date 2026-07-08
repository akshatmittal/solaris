import React from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "../../../test";
import { ConnectButtonView } from "./ConnectButtonView";

describe("<ConnectButtonView />", () => {
  it("renders the disconnected call to action", () => {
    renderWithProviders(
      <ConnectButtonView
        accountStatus="full"
        buttonReady
        isConnected={false}
        label="Connect Wallet"
        mounted
        onOpenAccountModal={() => {}}
        onOpenConnectModal={() => {}}
        showBalance={false}
      />,
    );

    expect(screen.getByTestId("rk-connect-button")).toHaveTextContent("Connect Wallet");
  });
});
