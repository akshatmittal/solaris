"use client";

import { useEffect } from "react";

import { ChainSelectButton, ConnectButton } from "solariskit";
import { useChainId, useConnection, useSendTransaction } from "wagmi";

export default function HomePage() {
  const { address, isConnected } = useConnection();
  const chainId = useChainId();
  const { data: transactionHash, error, isPending, sendTransaction } = useSendTransaction();

  useEffect(() => {
    console.log("Chain:", chainId);
  }, [chainId]);

  const sendDummyTransaction = () => {
    if (!address) {
      return;
    }

    sendTransaction({
      chainId,
      to: address,
      value: 0n,
    });
  };

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Solaris Example</p>
        <h1>Next 💖 SolarisKit</h1>
        <p className="lede">
          Set <code>NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID</code> to test WalletConnect flows.
        </p>
        <div className="actions">
          <div className="wallet-actions">
            <ChainSelectButton />
            <ConnectButton />
          </div>
          <button
            className="send-transaction-button"
            disabled={!isConnected || isPending}
            onClick={sendDummyTransaction}
            type="button"
          >
            {isPending ? "Sending..." : "Send dummy transaction"}
          </button>
        </div>
        {transactionHash ? <p className="transaction-status">Sent {transactionHash}</p> : null}
        {error ? <p className="transaction-status error">{error.message}</p> : null}
      </section>
    </main>
  );
}
