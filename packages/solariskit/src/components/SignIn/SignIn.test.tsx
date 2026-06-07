import React from "react";

import type { Address } from "viem";

import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
} from "../RainbowKitProvider/AuthenticationContext";
import { SignIn } from "./SignIn";

const wagmiMocks = vi.hoisted(() => ({
  signMessage: vi.fn(),
  useConnection: vi.fn(),
  useConnectionEffect: vi.fn(),
}));

vi.mock("wagmi", () => ({
  useConnection: wagmiMocks.useConnection,
  useConnectionEffect: wagmiMocks.useConnectionEffect,
  useSignMessage: () => ({
    mutateAsync: wagmiMocks.signMessage,
  }),
}));

const address = "0x0000000000000000000000000000000000000001" as Address;

function renderSignIn({
  createMessage,
}: {
  createMessage: (args: { nonce: string; address: Address; chainId: number }) => Promise<string> | string;
}) {
  const adapter = createAuthenticationAdapter<string>({
    createMessage,
    getNonce: async () => "nonce",
    signOut: async () => {},
    verify: async () => true,
  });

  return render(
    <RainbowKitAuthenticationProvider
      adapter={adapter}
      status="unauthenticated"
    >
      <SignIn
        onClose={() => {}}
        onCloseModal={() => {}}
      />
    </RainbowKitAuthenticationProvider>,
  );
}

describe("SignIn", () => {
  beforeEach(() => {
    wagmiMocks.signMessage.mockReset();
    wagmiMocks.useConnection.mockReturnValue({
      address,
      chain: { id: 1 },
    });
    wagmiMocks.useConnectionEffect.mockReset();
  });

  it("skips message preparation state when message creation is synchronous", async () => {
    const createMessage = vi.fn(() => "message");
    wagmiMocks.signMessage.mockReturnValue(new Promise(() => {}));

    renderSignIn({ createMessage });

    const button = await screen.findByTestId("rk-auth-message-button");
    await waitFor(() => expect(button).toHaveTextContent("Sign message"));

    fireEvent.click(button);

    expect(createMessage).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(wagmiMocks.signMessage).toHaveBeenCalledWith({
        message: "message",
      }),
    );
    expect(button).toHaveTextContent("Waiting for signature...");
  });

  it("shows message preparation state while async message creation is pending", async () => {
    let resolveMessage: (message: string) => void = () => {};
    const messagePromise = new Promise<string>((resolve) => {
      resolveMessage = resolve;
    });
    const createMessage = vi.fn(() => messagePromise);
    wagmiMocks.signMessage.mockReturnValue(new Promise(() => {}));

    renderSignIn({ createMessage });

    const button = await screen.findByTestId("rk-auth-message-button");
    await waitFor(() => expect(button).toHaveTextContent("Sign message"));

    fireEvent.click(button);

    expect(createMessage).toHaveBeenCalledOnce();
    expect(wagmiMocks.signMessage).not.toHaveBeenCalled();
    expect(button).toHaveTextContent("Preparing message...");

    await act(async () => {
      resolveMessage("message");
      await messagePromise;
    });

    await waitFor(() =>
      expect(wagmiMocks.signMessage).toHaveBeenCalledWith({
        message: "message",
      }),
    );
    expect(button).toHaveTextContent("Waiting for signature...");
  });

  it("preserves the nonce so users can retry after message creation fails", async () => {
    const createMessage = vi
      .fn()
      .mockRejectedValueOnce(new Error("network error"))
      .mockReturnValue(new Promise(() => {}));

    renderSignIn({ createMessage });

    const button = await screen.findByTestId("rk-auth-message-button");
    await waitFor(() => expect(button).toHaveTextContent("Sign message"));

    fireEvent.click(button);

    await waitFor(() => expect(screen.getByText("Error preparing message, please retry!")).toBeInTheDocument());
    expect(button).toHaveTextContent("Sign message");

    fireEvent.click(button);

    expect(createMessage).toHaveBeenCalledTimes(2);
  });
});
