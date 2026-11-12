---
"solariskit": minor
---

Polish the modal layout, motion, and touch behavior.

- The Verify Account step always shows a full-width Cancel button. Its buttons are 48px tall below 768px and 44px from 768px.
- The network modal uses larger icons, hides the scrollbar, and does not focus the search on touch screens (`pointer: coarse`) instead of on mobile user agents.
- Fix: the connect button fetches the balance whenever `showBalance` shows it at any screen size, and CSS shows or hides it by width. Before, an iPad or a wide phone in landscape left the balance empty, because the fetch followed the user agent.
- Screen width now chooses the layout, not the user agent. Screens narrower than 768px get the bottom sheet; wider screens get the dialog. An iPad now gets a 360px dialog instead of a full-width sheet, and a narrow desktop window gets the sheet.
- On wider screens the dialog has a fixed top edge instead of being centered, so it does not move when its height changes, for example while you filter the network list.
- Fix: modals fit short screens, such as a phone in landscape. Content taller than the screen scrolls with a thin scrollbar, and a new view starts at the top. The network list and the desktop wallet list shrink so the title, search, and footer stay visible. Before, content outside the screen could not be reached.
- Dialog exits use a strong ease-out curve instead of `ease-in`. The mobile sheet uses an iOS-style sheet curve.
- Buttons, triggers, wallet tiles, and links scale to 0.97 while pressed; network, transaction, and wallet rows darken past their hover color. Disabled controls do not react to a press. With reduced motion turned on, nothing scales.
- Hover styles apply only to devices with a mouse or trackpad, so they no longer stick after a tap on touch screens.
- Controls fire taps without the double-tap delay, and a long press no longer selects their label.
- The sheet keeps every view above the iPhone home indicator. Before, only the mobile wallet list did this.
- The wallet list and the wallet pane fade in when they replace each other, and the Copy Address icon crossfades to the Copied icon. Icons do not animate when the account modal opens.
- The spinner turns faster (750ms per turn).
- The network search gets focus when the network modal opens on desktop, and the native search clear button is hidden.
- Long network names in `ChainSelectButton` truncate at 160px and show the full name on hover.
- The Verify Account and mobile connecting views give the dialog its accessible name.
- Balances below 0.001 show as 0 instead of an exponent such as `1e-7`. Large balances use the en-US compact format (`12.3K` instead of `12.3k`, `1.2M` instead of `1.2m`).
- Truncated ENS names end with an ellipsis character (`…`) instead of three periods.
- The transaction statuses, the "Back", "Close", and "Chain Selector" labels, and "(unsupported)" are now translation strings.
