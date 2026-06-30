---
"solariskit": minor
---

Split the chain selector out of `ConnectButton`.

`ConnectButton` now only renders the wallet connect/account button. Use the new `ChainSelectButton` export when you need the chain selector or wrong-network button independently.
