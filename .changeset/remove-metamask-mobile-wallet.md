---
"solariskit": minor
---

Remove the MetaMask Mobile wallet (`metaMaskWallet`). It was a WalletConnect connector with a MetaMask icon and deep link, so it gave the same result as the WalletConnect wallet. The default wallet list is now Safe, injected browser wallets, Base, and WalletConnect. The MetaMask extension still shows in the "Installed" group, and MetaMask Mobile still connects through WalletConnect.

Breaking: `solariskit/wallets` no longer exports `metaMaskWallet` or `MetaMaskWalletOptions`, and `<WalletButton wallet="metaMask" />` no longer finds a wallet. Remove `metaMaskWallet` from custom wallet lists.
