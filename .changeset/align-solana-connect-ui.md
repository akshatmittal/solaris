---
"solariskit": patch
---

Align the Solana and EVM connect flows.

- The Solana connect modal now uses the EVM status view on desktop. Picking a wallet shows "Opening <wallet>…" with a spinner and a back button, and a declined connection shows "Connection declined" with Retry.
- The Solana connect modal no longer closes when the wallet declines the connection, and it no longer shows the raw wallet error when it opens again.
- On mobile, EVM wallet tiles now show a spinner while connecting, and both EVM and Solana sheets show "Connection declined" when the wallet declines.
- On desktop, an EVM wallet that declines at once (within 50ms) now shows Retry instead of a spinner that never stops.
