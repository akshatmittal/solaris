function createUnsupportedWeb3Error() {
  return new Error(
    "The SolarisKit Solana example does not install @solana/web3.js. Use Solana Kit transaction types instead of ConnectorKit legacy web3.js compatibility paths.",
  );
}

export class Transaction {
  static from(): never {
    throw createUnsupportedWeb3Error();
  }
}

export class VersionedTransaction {
  static deserialize(): never {
    throw createUnsupportedWeb3Error();
  }
}
