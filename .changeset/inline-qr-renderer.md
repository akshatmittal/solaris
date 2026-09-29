---
"solariskit": patch
---

Upgrade `qr` to 0.7.2 and replace the `cuer` dependency with a built-in QR code renderer adapted from `cuer@0.0.3`. `cuer@0.0.3` requests a zero-width quiet zone, which `qr` 0.6 and later reject, so it cannot render QR codes with current `qr` releases. The built-in renderer produces the same QR code markup as before.
