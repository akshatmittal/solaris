---
"solariskit": minor
---

The account modal has a "View on <explorer>" button below Copy Address and Disconnect. It opens the address on the default block explorer of the connected chain (`chain.blockExplorers.default`), for example "View on Etherscan". It does not show when the chain has no block explorer, or on Solana. The "View on Explorer" link at the bottom of the recent transactions list is removed, because this button replaces it.
