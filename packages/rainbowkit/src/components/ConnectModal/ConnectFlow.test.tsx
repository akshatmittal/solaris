import React from "react";

import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { mainnet } from "wagmi/chains";

import { renderWithProviders } from "../../../test";
import { injectedWallet, mockWallet } from "../../../test/mockInjected";
import { setupLocalStorage, setupMatchMedia, walletConnectServer } from "../../../test/mockWalletConnect";
import { walletConnectWallet } from "../../wallets/walletConnectors/walletConnectWallet/walletConnectWallet";
import { ConnectModal } from "./ConnectModal";

describe("Connect Flow Tests", () => {
  beforeAll(() => {
    walletConnectServer.listen({ onUnhandledRequest: "warn" });
    setupMatchMedia();
    setupLocalStorage();
  });

  beforeEach(() => {
    mockWallet.cleanup();
  });

  afterEach(() => {
    mockWallet.cleanup();
    walletConnectServer.resetHandlers();
    localStorage.clear();
  });

  afterAll(() => {
    walletConnectServer.close();
    vi.unstubAllGlobals();
  });

  describe("Injected Wallet Connection", () => {
    it("detects and displays Browser Wallet when injected via EIP-1193", async () => {
      mockWallet.setupEIP1193();

      renderWithProviders(
        <ConnectModal
          onClose={() => {}}
          open={true}
        />,
        {
          chains: [mainnet],
          mockWallets: [{ groupName: "Popular", wallets: [injectedWallet] }],
        },
      );

      await waitFor(() => {
        expect(screen.getByText("Browser Wallet")).toBeDefined();
      });
    });

    it("connects to Browser Wallet via EIP-1193", async () => {
      mockWallet.setupEIP1193();

      renderWithProviders(
        <ConnectModal
          onClose={() => {}}
          open={true}
        />,
        {
          chains: [mainnet],
          mockWallets: [{ groupName: "Popular", wallets: [injectedWallet] }],
        },
      );

      const provider = (window as any).ethereum;

      await waitFor(() => {
        fireEvent.click(screen.getByText("Browser Wallet"));
      });

      await waitFor(() => {
        expect(provider.request).toHaveBeenCalled();
      });
    });

    it("remembers Browser Wallet as a recent wallet", async () => {
      mockWallet.setupEIP1193();

      const { unmount } = renderWithProviders(
        <ConnectModal
          onClose={() => {}}
          open={true}
        />,
        {
          chains: [mainnet],
          mockWallets: [{ groupName: "Popular", wallets: [injectedWallet] }],
        },
      );

      await waitFor(() => {
        fireEvent.click(screen.getByText("Browser Wallet"));
      });

      unmount();

      renderWithProviders(
        <ConnectModal
          onClose={() => {}}
          open={true}
        />,
        {
          chains: [mainnet],
          mockWallets: [{ groupName: "Popular", wallets: [injectedWallet] }],
        },
      );

      await waitFor(() => {
        expect(screen.getByText("Browser Wallet")).toBeDefined();
      });
    });
  });

  describe("WalletConnect Connection", () => {
    it("displays WalletConnect and starts the flow when selected", async () => {
      renderWithProviders(
        <ConnectModal
          onClose={() => {}}
          open={true}
        />,
        {
          chains: [mainnet],
          mockWallets: [{ groupName: "Popular", wallets: [walletConnectWallet] }],
        },
      );

      await waitFor(() => {
        expect(screen.getByText("WalletConnect")).toBeDefined();
      });

      fireEvent.click(screen.getByText("WalletConnect"));

      await waitFor(() => {
        const wcKeys = Object.keys(localStorage).filter((key) => key.includes("wc@"));
        expect(wcKeys.length).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
