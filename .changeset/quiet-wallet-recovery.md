---
"solariskit": patch
---

Keep wallet providers and recent transactions working when browser storage is unavailable, use the browser wallet as the default WalletButton, respect disabled authentication, allow retrying a failed sign-in nonce request, enable the Solana wallet-picker fallback, and display Solana connection errors on mobile.

On storage recovery, replay unsaved local transaction mutations against the latest stored data to preserve other tabs' unrelated transactions. Local mutations take precedence for the same hash, and local clears apply to their account and chain. Reject malformed stored transaction data and retain the last valid in-memory state.
