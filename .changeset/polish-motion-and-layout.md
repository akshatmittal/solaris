---
"solariskit": minor
---

Polish the modal layout, motion, and touch behavior.

- Screen width now chooses the layout, not the user agent. Screens narrower than 768px get the bottom sheet; wider screens get the dialog. An iPad now gets a 360px dialog instead of a full-width sheet, and a narrow desktop window gets the sheet.
- On wider screens the dialog has a fixed top edge instead of being centered, so it does not move when its height changes, for example while you filter the network list.
- Dialog exits use a strong ease-out curve instead of `ease-in`. The mobile sheet uses an iOS-style sheet curve.
- Buttons, triggers, wallet tiles, and links scale to 0.97 while pressed; network and wallet rows darken. With reduced motion turned on, nothing scales.
- Hover styles apply only to devices with a mouse or trackpad, so they no longer stick after a tap on touch screens.
- Controls fire taps without the double-tap delay, and a long press no longer selects their label.
- The sheet keeps every view above the iPhone home indicator. Before, only the mobile wallet list did this.
- The wallet list and the wallet pane fade in when they replace each other, and the Copy Address icon crossfades to the Copied icon.
- The spinner turns faster (750ms per turn).
- The network search gets focus when the network modal opens on desktop, and the native search clear button is hidden.
- Long network names in `ChainSelectButton` truncate at 160px and show the full name on hover.
- The Verify Account and mobile connecting views give the dialog its accessible name.
- Balances below 0.001 show as 0 instead of an exponent such as `1e-7`. Large balances use the locale's compact format (`1.2M` instead of `1.2m`), and decimals follow the locale.
- Truncated ENS names end with an ellipsis character (`…`) instead of three periods.
- The transaction statuses, the "Back", "Close", and "Chain Selector" labels, and "(unsupported)" are now translation strings.
