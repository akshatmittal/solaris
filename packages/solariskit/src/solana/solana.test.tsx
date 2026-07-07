import React from "react";

import { screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const solanaMock = vi.hoisted(() => ({
  balance: {
    abort: vi.fn(),
    error: null as Error | null,
    // ConnectorKit formats with 4 decimals; the kit re-formats solBalance with
    // the shared abbreviateETHBalance (3 decimals below 1) for EVM parity.
    formattedSol: "0.1234 SOL",
    isLoading: false,
    lamports: 123456000n,
    // A successful fetch always stamps lastUpdated; the connect button hides
    // the balance until then to avoid rendering the hook's 0n default.
    lastUpdated: new Date(0) as Date | null,
    refetch: vi.fn(),
    solBalance: 0.123456,
    tokens: [],
  },
  appProviderProps: [] as {
    connectorConfig?: unknown;
    mobile?: unknown;
  }[],
  cluster: {
    id: "solana:mainnet",
    label: "Mainnet",
    url: "https://api.mainnet-beta.solana.com",
  },
  clusters: [
    {
      id: "solana:mainnet",
      label: "Mainnet",
      url: "https://api.mainnet-beta.solana.com",
    },
  ],
  connect: vi.fn(),
  connectError: null as Error | null,
  connectors: [
    {
      chains: ["solana:mainnet"],
      features: ["standard:connect"],
      icon: "",
      id: "wallet-standard:phantom",
      name: "Phantom",
      ready: true,
    },
  ],
  disconnect: vi.fn(),
  resetError: vi.fn(),
  setCluster: vi.fn(),
  wallet: {
    account: null as string | null,
    accounts: [] as { address: string; label?: string }[],
    connectorId: null as string | null,
    error: null as Error | null,
    isConnected: false,
    isConnecting: false,
    isError: false,
    status: "disconnected" as "disconnected" | "connecting" | "connected" | "error",
  },
}));
const solanaIconUrl = "https://static.createmytoken.com/images/chains/solana.png";

vi.mock("@solana/connector/react", () => ({
  AppProvider: ({
    children,
    connectorConfig,
    mobile,
  }: {
    children: React.ReactNode;
    connectorConfig?: unknown;
    mobile?: unknown;
  }) => {
    solanaMock.appProviderProps.push({ connectorConfig, mobile });
    return children;
  },
  getDefaultConfig: vi.fn((options: unknown) => ({ options })),
  getDefaultMobileConfig: vi.fn((options: unknown) => ({ options })),
  useBalance: vi.fn(() => solanaMock.balance),
  useCluster: vi.fn(() => ({
    cluster: solanaMock.cluster,
    clusters: solanaMock.clusters,
    explorerUrl: "https://explorer.solana.com",
    isDevnet: solanaMock.cluster.id === "solana:devnet",
    isLocal: false,
    isMainnet: solanaMock.cluster.id === "solana:mainnet",
    isTestnet: false,
    setCluster: solanaMock.setCluster,
    type: solanaMock.cluster.id === "solana:devnet" ? "devnet" : "mainnet",
  })),
  useConnectWallet: vi.fn(() => ({
    connect: solanaMock.connect,
    error: solanaMock.connectError,
    isConnecting: false,
    resetError: solanaMock.resetError,
  })),
  useDisconnectWallet: vi.fn(() => ({
    disconnect: solanaMock.disconnect,
    isDisconnecting: false,
  })),
  useKitTransactionSigner: vi.fn(() => ({
    ready: false,
    signer: null,
  })),
  useSolanaClient: vi.fn(() => ({
    client: null,
    clusterType: null,
    ready: false,
  })),
  useWallet: vi.fn(() => solanaMock.wallet),
  useWalletConnectors: vi.fn(() => solanaMock.connectors),
}));

import { SolanaAccountModal } from "./components/SolanaAccountModal/SolanaAccountModal";
import { SolanaChainSelectButton } from "./components/SolanaChainSelectButton/SolanaChainSelectButton";
import { SolanaConnectButton } from "./components/SolanaConnectButton/SolanaConnectButton";
import { SolanaConnectModal } from "./components/SolanaConnectModal/SolanaConnectModal";
import { SolanaKitProvider } from "./components/SolanaKitProvider/SolanaKitProvider";
import { SolanaWalletButton } from "./components/SolanaWalletButton/SolanaWalletButton";
import { getDefaultSolanaConfig } from "./config/getDefaultSolanaConfig";

function renderWithSolanaProvider(component: React.ReactElement) {
  return renderWithTestingLibrary(<SolanaKitProvider>{component}</SolanaKitProvider>);
}

async function clickChainButton() {
  const button = await screen.findByTestId("rk-chain-button");
  await user.click(button);
}

async function expectSolanaIcon(label: string) {
  const imageRoot = await screen.findByRole("img", { name: label });
  expect(imageRoot.querySelector("img")).toHaveAttribute("src", solanaIconUrl);
}

// Keep this wrapper local so the mock is installed before importing the Solana components.
async function renderWithTestingLibrary(component: React.ReactElement) {
  const { render } = await import("@testing-library/react");
  return render(component);
}

describe("Solana entrypoint", () => {
  beforeEach(() => {
    localStorage.clear();
    solanaMock.appProviderProps = [];
    solanaMock.connect.mockReset().mockResolvedValue(undefined);
    solanaMock.disconnect.mockReset().mockResolvedValue(undefined);
    solanaMock.resetError.mockReset();
    solanaMock.setCluster.mockReset().mockResolvedValue(undefined);
    solanaMock.connectError = null;
    solanaMock.cluster = {
      id: "solana:mainnet",
      label: "Mainnet",
      url: "https://api.mainnet-beta.solana.com",
    };
    solanaMock.clusters = [solanaMock.cluster];
    solanaMock.connectors = [
      {
        chains: ["solana:mainnet"],
        features: ["standard:connect"],
        icon: "",
        id: "wallet-standard:phantom",
        name: "Phantom",
        ready: true,
      },
    ];
    solanaMock.wallet = {
      account: null,
      accounts: [],
      connectorId: null,
      error: null,
      isConnected: false,
      isConnecting: false,
      isError: false,
      status: "disconnected",
    };
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it("renders the disconnected Solana connect button", async () => {
    await renderWithSolanaProvider(<SolanaConnectButton />);

    expect(await screen.findByTestId("rk-connect-button")).toHaveTextContent("Connect Wallet");
  });

  it("splits a merged Solana config before passing it to ConnectorKit", async () => {
    const mobile = {
      appIdentity: {
        name: "Solaris",
      },
      cluster: "devnet",
    };

    await renderWithTestingLibrary(
      <SolanaKitProvider
        config={{
          autoConnect: true,
          mobile,
          network: "devnet",
        }}
      >
        <SolanaConnectButton />
      </SolanaKitProvider>,
    );

    expect(solanaMock.appProviderProps.at(-1)).toEqual({
      connectorConfig: {
        autoConnect: true,
        network: "devnet",
      },
      mobile,
    });
  });

  it("returns a merged default Solana config with mobile configuration", () => {
    const config = getDefaultSolanaConfig({
      appName: "Solaris",
      appUrl: "https://example.com",
      network: "devnet",
    }) as unknown as {
      mobile?: {
        options?: Record<string, unknown>;
      };
      options?: Record<string, unknown>;
    };

    expect(config.options).toMatchObject({
      appName: "Solaris",
      appUrl: "https://example.com",
      network: "devnet",
    });
    expect(config.options).not.toHaveProperty("walletConnect");
    expect(config.mobile?.options).toEqual({
      appName: "Solaris",
      appUrl: "https://example.com",
      network: "devnet",
    });
  });

  it("connects to a ready wallet from the Solana connect modal and records it as recent", async () => {
    await renderWithTestingLibrary(
      <SolanaConnectModal
        onClose={() => {}}
        open
      />,
    );

    await user.click(await screen.findByText("Phantom"));

    expect(solanaMock.connect).toHaveBeenCalledWith("wallet-standard:phantom", undefined);
    expect(JSON.parse(localStorage.getItem("rk-solana-recent") ?? "[]")).toEqual(["wallet-standard:phantom"]);
    expect(localStorage.getItem("rk-solana-latest-id")).toBe("wallet-standard:phantom");
  });

  it("renders the connected Solana account and SOL balance", async () => {
    solanaMock.wallet = {
      account: "5Gv8wL9fKJrR9w4yYzqZ3vR8wL9fKJrR9w4yYzqZ3vR8",
      accounts: [{ address: "5Gv8wL9fKJrR9w4yYzqZ3vR8wL9fKJrR9w4yYzqZ3vR8" }],
      connectorId: "wallet-standard:phantom",
      error: null,
      isConnected: true,
      isConnecting: false,
      isError: false,
      status: "connected",
    };

    await renderWithSolanaProvider(<SolanaConnectButton />);

    expect(await screen.findByTestId("rk-account-button")).toHaveTextContent("5Gv8…3vR8");
    expect(screen.getByTestId("rk-account-button")).toHaveTextContent("0.123 SOL");
  });

  it("copies and disconnects from the Solana account modal", async () => {
    solanaMock.wallet = {
      account: "5Gv8wL9fKJrR9w4yYzqZ3vR8wL9fKJrR9w4yYzqZ3vR8",
      accounts: [{ address: "5Gv8wL9fKJrR9w4yYzqZ3vR8wL9fKJrR9w4yYzqZ3vR8" }],
      connectorId: "wallet-standard:phantom",
      error: null,
      isConnected: true,
      isConnecting: false,
      isError: false,
      status: "connected",
    };

    localStorage.setItem("rk-latest-id", "rainbow");
    localStorage.setItem("rk-solana-latest-id", "wallet-standard:phantom");

    await renderWithTestingLibrary(
      <SolanaAccountModal
        onClose={() => {}}
        open
      />,
    );

    await user.click(screen.getByText("Copy Address"));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("5Gv8wL9fKJrR9w4yYzqZ3vR8wL9fKJrR9w4yYzqZ3vR8");

    await user.click(screen.getByTestId("rk-disconnect-button"));
    expect(solanaMock.disconnect).toHaveBeenCalled();
    expect(localStorage.getItem("rk-solana-latest-id")).toBeNull();
    expect(localStorage.getItem("rk-solana-reconnect-disabled")).toBe("true");
    expect(localStorage.getItem("rk-latest-id")).toBe("rainbow");
  });

  it("hides the Solana cluster selector when only one cluster is available", async () => {
    await renderWithSolanaProvider(<SolanaChainSelectButton />);

    expect(screen.queryByTestId("rk-chain-button")).not.toBeInTheDocument();
  });

  it("opens the Solana cluster modal and switches clusters", async () => {
    solanaMock.clusters = [
      solanaMock.cluster,
      {
        id: "solana:devnet",
        label: "Devnet",
        url: "https://api.devnet.solana.com",
      },
      {
        id: "solana:testnet",
        label: "Testnet",
        url: "https://api.testnet.solana.com",
      },
    ];

    await renderWithSolanaProvider(<SolanaChainSelectButton />);

    await expectSolanaIcon("Mainnet");

    await clickChainButton();

    await expectSolanaIcon("Devnet");
    await expectSolanaIcon("Testnet");

    await user.click(await screen.findByText("Devnet"));

    await waitFor(() => expect(solanaMock.setCluster).toHaveBeenCalledWith("solana:devnet"));
  });

  it("connects with SolanaWalletButton and records the latest Solana wallet", async () => {
    localStorage.setItem("rk-solana-reconnect-disabled", "true");

    await renderWithSolanaProvider(<SolanaWalletButton connectorId="wallet-standard:phantom" />);

    await user.click(await screen.findByTestId("rk-wallet-button-wallet-standard:phantom"));

    expect(solanaMock.connect).toHaveBeenCalledWith("wallet-standard:phantom", undefined);
    expect(localStorage.getItem("rk-solana-latest-id")).toBe("wallet-standard:phantom");
    expect(JSON.parse(localStorage.getItem("rk-solana-recent") ?? "[]")).toEqual(["wallet-standard:phantom"]);
    expect(localStorage.getItem("rk-solana-reconnect-disabled")).toBeNull();
  });

  it("reconnects the latest Solana wallet from Solana-specific storage", async () => {
    localStorage.setItem("rk-latest-id", "rainbow");
    localStorage.setItem("rk-solana-latest-id", "wallet-standard:phantom");

    await renderWithSolanaProvider(<SolanaConnectButton />);

    await waitFor(() =>
      expect(solanaMock.connect).toHaveBeenCalledWith("wallet-standard:phantom", {
        allowInteractiveFallback: false,
        silent: true,
      }),
    );
    expect(localStorage.getItem("rk-latest-id")).toBe("rainbow");
  });

  it("reconnects from the recent Solana wallet when latest storage is missing", async () => {
    localStorage.setItem("rk-latest-id", "rainbow");
    localStorage.setItem("rk-solana-recent", JSON.stringify(["wallet-standard:phantom"]));

    await renderWithSolanaProvider(<SolanaConnectButton />);

    await waitFor(() =>
      expect(solanaMock.connect).toHaveBeenCalledWith("wallet-standard:phantom", {
        allowInteractiveFallback: false,
        silent: true,
      }),
    );
    expect(localStorage.getItem("rk-solana-latest-id")).toBe("wallet-standard:phantom");
    expect(localStorage.getItem("rk-latest-id")).toBe("rainbow");
  });

  it("keeps the latest Solana wallet when a refresh reconnect attempt fails", async () => {
    solanaMock.connect.mockRejectedValue(new Error("not authorized"));
    localStorage.setItem("rk-solana-latest-id", "wallet-standard:phantom");

    await renderWithSolanaProvider(<SolanaConnectButton />);

    await waitFor(() => expect(solanaMock.connect).toHaveBeenCalled());
    expect(localStorage.getItem("rk-solana-latest-id")).toBe("wallet-standard:phantom");
  });

  it("does not reconnect from recent storage after an explicit Solana disconnect", async () => {
    localStorage.setItem("rk-solana-recent", JSON.stringify(["wallet-standard:phantom"]));
    localStorage.setItem("rk-solana-reconnect-disabled", "true");

    await renderWithSolanaProvider(<SolanaConnectButton />);
    await new Promise((resolve) => window.setTimeout(resolve, 350));

    expect(solanaMock.connect).not.toHaveBeenCalled();
  });
});
