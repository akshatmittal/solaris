---
"solariskit": minor
---

Make the bundle smaller. An app with the provider, `ConnectButton`, and `getDefaultConfig` now adds about 104 kB minified (38 kB gzip) instead of 115 kB (40 kB gzip).

- Ship the library as one file per module instead of one bundle per entry, so bundlers drop the code that the app does not import. An import of the themes only now adds about 3 kB instead of 14 kB.
- Remove the theme variables that no component uses: the colors `actionButtonBorder`, `actionButtonBorderMobile`, `connectButtonInnerBackground`, `downloadBottomCardBackground`, `downloadTopCardBackground`, `generalBorderDim`, and `selectedOptionBorder`, and the shadows `profileDetailsAction`, `selectedOption`, `selectedWallet`, and `walletLogo`. Remove these keys from custom themes that set them.
- Minify `styles.css`.
- Optimize the wallet icons and the inline icon paths.
