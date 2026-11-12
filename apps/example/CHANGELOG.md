# example

## 0.0.10

### Patch Changes

- 3967211: Allow `*.onamp.dev` in `allowedDevOrigins`, so the example dev server works through an Amp portal URL.
- f62dbf0: Use Inter through `next/font` for the example page, the same as CreateMyToken. The Solaris modals and buttons inherit it.
- 7b282ca: Use a light page background and white cards in the example, matching CreateMyToken.
- 97da3d4: Add Arbitrum, OP, Avalanche, and Unichain to the EVM example. With 8 networks, the network modal shows its search field.
- 21999ee: Add a Light/Dark toggle to the example. It switches the SolarisKit theme for both cards. The page itself stays light. The choice is kept in the URL (`?theme=dark`) with `nuqs`, so a link opens the same preview.
- 8d7c391: Add Sign-In with Ethereum to the EVM card so the sign-in modal can be previewed. The example creates the SIWE message with `viem/siwe` and verifies the signature in the browser, so it needs no backend.
- 88f6ae2: Present Solaris as a standalone project. The READMEs, package metadata, and example app describe SolarisKit on its own, with a short note that it started as a fork of RainbowKit. The LICENSE keeps the original RainbowKit copyright notice.
- Updated dependencies [39fff32]
- Updated dependencies [aa507aa]
- Updated dependencies [7868da3]
- Updated dependencies [7868da3]
- Updated dependencies [e5bb98f]
- Updated dependencies [7fba85b]
- Updated dependencies [3967211]
- Updated dependencies [88f6ae2]
- Updated dependencies [87ee57a]
  - solariskit@1.8.0

## 0.0.9

### Patch Changes

- Updated dependencies [ee57b45]
- Updated dependencies [51a99d4]
  - solariskit@1.7.0

## 0.0.8

### Patch Changes

- Updated dependencies [17e309b]
- Updated dependencies [ba6596b]
  - solariskit@1.6.2

## 0.0.7

### Patch Changes

- Updated dependencies [215fd43]
- Updated dependencies [2a09694]
  - solariskit@1.6.1

## 0.0.6

### Patch Changes

- Updated dependencies [8d873c1]
- Updated dependencies [8d873c1]
  - solariskit@1.6.0

## 0.0.5

### Patch Changes

- Updated dependencies [b14414e]
- Updated dependencies [0321bdf]
  - solariskit@1.5.0

## 0.0.4

### Patch Changes

- Updated dependencies [7dd56c5]
- Updated dependencies [aea20f8]
  - solariskit@1.4.0

## 0.0.3

### Patch Changes

- Updated dependencies [0a6b1ec]
  - solariskit@1.3.0

## 0.0.2

### Patch Changes

- Updated dependencies [dc13687]
- Updated dependencies [2f01f2f]
  - solariskit@1.2.0

## 0.0.1

### Patch Changes

- Updated dependencies [6d17a66]
  - solariskit@1.1.0
