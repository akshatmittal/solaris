declare module "@solana/web3.js" {
  export interface SendOptions {
    maxRetries?: number;
    minContextSlot?: number;
    preflightCommitment?: string;
    skipPreflight?: boolean;
  }

  export class Connection {
    rpcEndpoint: string;
    constructor(endpoint: string);
    getLatestBlockhash(commitment?: string): Promise<{
      blockhash: string;
      lastValidBlockHeight: number;
    }>;
    sendRawTransaction(bytes: Uint8Array, options?: SendOptions): Promise<string>;
  }

  export class Transaction {
    serialize(): Uint8Array;
    static from(bytes: Uint8Array): Transaction;
  }

  export class VersionedTransaction {
    serialize(): Uint8Array;
    static deserialize(bytes: Uint8Array): VersionedTransaction;
  }
}
