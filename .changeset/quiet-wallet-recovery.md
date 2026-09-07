---
"solariskit": patch
---

Keep wallet providers and recent transactions working when browser storage is unavailable, use the browser wallet as the default WalletButton, respect disabled authentication, allow retrying a failed sign-in nonce request, enable the Solana wallet-picker fallback, and display Solana connection errors on mobile.

On storage recovery, replay unsaved local transaction mutations against the latest stored data to preserve other tabs' unrelated transactions. Local mutations take precedence for the same hash, and local clears apply to their account and chain. Keep storage reads guarded without runtime validation of the stored transaction schema. Simplify fingerprint and transaction persistence wrappers and rely on shared storage guards for ENS caching.
