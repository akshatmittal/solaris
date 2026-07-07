"use client";

import { useEffect, useState } from "react";

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
      <p className="card-copy">ConnectorKit vNext runs in its own provider with Solana Kit-compatible hooks.</p>
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
          <p className="eyebrow">Solaris Example</p>
          <h1>Next.js with SolarisKit</h1>
        </section>

        <div className="network-grid">
          <EthereumProviders>
            <EthereumCard />
          </EthereumProviders>
          <SolanaProviders>
            <SolanaCard />
          </SolanaProviders>
        </div>
      </div>
    </main>
  );
}
