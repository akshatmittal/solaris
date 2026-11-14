---
"solariskit": minor
---

The QR step now has a "Copy Link" button under the QR code. It copies the link that the QR code shows. While the WalletConnect modal loads, the "Open" button now shows a spinner instead of "Opening…", and keeps its width, name and keyboard focus.

Copy Link and Copy Address now behave the same: the label stays the same, and for 1.5 seconds the icon changes to a green check, or to a red cross if the copy fails. Screen readers announce "Copied" or "Couldn’t copy". Copy Address no longer changes its label to "Copied" or tints its background green.
