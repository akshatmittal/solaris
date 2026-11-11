"use client";

import { Suspense, useEffect, useState } from "react";

import { getTransferSolInstruction } from "@solana-program/system";
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  getSignatureFromTransaction,
  lamports,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import { ChainSelectButton, ConnectButton } from "solariskit";
import {
  SolanaChainSelectButton,
  SolanaConnectButton,
  useSolanaBalance,
  useSolanaCluster,
  useSolanaClient,
  useSolanaKitTransactionSigner,
  useSolanaWallet,
} from "solariskit/solana";
import { useChainId, useConnection, useSendTransaction } from "wagmi";

import { EthereumProviders, SolanaProviders } from "../components/providers";
import { SettingsControls } from "../components/settings-controls";

function EthereumCard() {
  const { address, isConnected } = useConnection();
  const chainId = useChainId();
  const { data: transactionHash, error, isPending, sendTransaction } = useSendTransaction();

  useEffect(() => {
    console.log("Ethereum chain:", chainId);
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
    <section
      aria-labelledby="ethereum-heading"
      className="network-card"
    >
      <p className="eyebrow">Ethereum</p>
      <h2 id="ethereum-heading">EVM wallets</h2>
      <p className="card-copy">
        Uses <code>solariskit</code> with Wagmi. Set <code>NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID</code> to test
        WalletConnect flows.
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
  );
}

function SolanaCard() {
  const wallet = useSolanaWallet();
  const { client, ready: clientReady } = useSolanaClient();
  const { cluster } = useSolanaCluster();
  const { formattedSol } = useSolanaBalance({ enabled: wallet.isConnected });
  const { ready: signerReady, signer } = useSolanaKitTransactionSigner();
  const [isSending, setIsSending] = useState(false);
  const [transactionError, setTransactionError] = useState<string | null>(null);
  const [transactionSignature, setTransactionSignature] = useState<string | null>(null);

  useEffect(() => {
    console.log("Solana cluster:", cluster?.id);
  }, [cluster?.id]);

  const sendDummyTransaction = async () => {
    if (!client || !signer) {
      return;
    }

    setIsSending(true);
    setTransactionError(null);
    setTransactionSignature(null);

    try {
      const latestBlockhash = await client.rpc.getLatestBlockhash().send();
      const transactionMessage = pipe(
        createTransactionMessage({ version: 0 }),
        (transaction) => setTransactionMessageFeePayerSigner(signer, transaction),
        (transaction) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash.value, transaction),
        (transaction) =>
          appendTransactionMessageInstructions(
            [
              getTransferSolInstruction({
                amount: lamports(0n),
                destination: signer.address,
                source: signer,
              }),
            ],
            transaction,
          ),
      );
      const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);
      const signature = getSignatureFromTransaction(signedTransaction);
      const wireTransaction = getBase64EncodedWireTransaction(signedTransaction);

      await client.rpc
        .sendTransaction(wireTransaction, {
          encoding: "base64",
        })
        .send();
      setTransactionSignature(signature);
    } catch (error) {
      setTransactionError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSending(false);
    }
  };

  const canSendTransaction = wallet.isConnected && clientReady && signerReady && !!client && !!signer && !isSending;

  return (
    <section
      aria-labelledby="solana-heading"
      className="network-card solana-card"
    >
      <p className="eyebrow">Solana</p>
      <h2 id="solana-heading">Solana wallets</h2>
      <p className="card-copy">
        Uses <code>solariskit/solana</code>, built on ConnectorKit, with Solana Kit-compatible hooks.
      </p>
      <div className="actions">
        <div className="wallet-actions">
          <SolanaChainSelectButton />
          <SolanaConnectButton />
        </div>
        <button
          className="send-transaction-button"
          disabled={!canSendTransaction}
          onClick={sendDummyTransaction}
          type="button"
        >
          {isSending ? "Sending..." : "Send dummy transaction"}
        </button>
      </div>
      {transactionSignature ? <p className="transaction-status">Sent {transactionSignature}</p> : null}
      {transactionError ? <p className="transaction-status error">{transactionError}</p> : null}
      <dl className="wallet-state">
        <div>
          <dt>Cluster</dt>
          <dd>{cluster?.label ?? "Not configured"}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{wallet.status}</dd>
        </div>
        {wallet.account ? (
          <div>
            <dt>Balance</dt>
            <dd>{formattedSol}</dd>
          </div>
        ) : null}
      </dl>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-stack">
        <section className="hero">
          <p className="eyebrow">SolarisKit</p>
          <h1>Wallet connection for EVM and Solana</h1>
          <p className="hero-copy">One React UI kit for both ecosystems. Try each flow below.</p>
          <nav className="hero-links">
            <a href="https://github.com/akshatmittal/solaris">GitHub</a>
            <a href="https://www.npmjs.com/package/solariskit">npm</a>
            <a href="https://github.com/akshatmittal/solaris/tree/main/packages/solariskit#readme">Docs</a>
          </nav>
        </section>

        {/* The settings live in the URL, which a static export only knows in the browser. */}
        <Suspense>
          <SettingsControls />
          <div className="network-grid">
            <EthereumProviders>
              <EthereumCard />
            </EthereumProviders>
            <SolanaProviders>
              <SolanaCard />
            </SolanaProviders>
          </div>
        </Suspense>

        <footer className="credits">
          SolarisKit started as a fork of <a href="https://github.com/rainbow-me/rainbowkit">RainbowKit</a>.
        </footer>
      </div>
    </main>
  );
}
