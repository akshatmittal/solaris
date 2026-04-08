import { describe, expect, it } from "vitest";

import { metaMaskWallet } from "./metaMaskWallet";

describe("metaMaskWallet", () => {
  it("uses the walletconnect-only MetaMask Mobile flow", () => {
    const wallet = metaMaskWallet({ projectId: "test-id" });

    expect(wallet.id).toBe("metaMask");
    expect(wallet.name).toBe("MetaMask Mobile");
    expect(wallet.mobile?.getUri?.("wc:test")).toContain("metamask.app.link/wc?uri=");
  });
});
