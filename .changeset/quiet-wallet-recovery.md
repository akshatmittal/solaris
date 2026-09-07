---
"solariskit": patch
---

Keep wallet providers and recent transactions working when browser storage is unavailable, use the browser wallet as the default WalletButton, respect disabled authentication, allow retrying a failed sign-in nonce request, enable the Solana wallet-picker fallback, and display Solana connection errors on mobile.

On storage recovery, merge retained unsaved transaction snapshots with the latest stored data to preserve other tabs' unrelated transactions without retaining an ever-growing mutation queue. Local hashes take precedence, and local clears apply to their account and chain. Keep storage reads guarded without runtime validation of the stored transaction schema. Simplify fingerprint and transaction persistence wrappers and rely on shared storage guards for ENS caching.

Continue observing wallet changes while authentication is disabled, and defer sign-out until authentication is re-enabled if the wallet changed.

Retain at most 10 completed transactions per account and chain without limiting pending transactions.
