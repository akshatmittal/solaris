# Polycons

[![npm version](https://img.shields.io/npm/v/@akshatmittal/polycons?style=flat-square&color=007AFF&label=%40akshatmittal%2Fpolycons)](https://www.npmjs.com/package/@akshatmittal/polycons)
[![License: MIT](https://img.shields.io/github/license/akshatmittal/solaris?style=flat-square&color=007AFF)](https://github.com/akshatmittal/solaris/blob/main/LICENSE)

Deterministic geometric avatars for wallet addresses. Pass in an address, get an SVG `data:` URI back. No dependencies, no canvas, no network request.

<img alt="Sixteen polycon avatars for different addresses" src="https://raw.githubusercontent.com/akshatmittal/solaris/main/.github/assets/polycons.svg" width="652" />

[npm](https://www.npmjs.com/package/@akshatmittal/polycons) · [Source](https://github.com/akshatmittal/solaris/tree/main/packages/polycons) · [Used by SolarisKit](https://github.com/akshatmittal/solaris)

## Install

```bash
npm install @akshatmittal/polycons
```

## Usage

```ts
import { polyconDataUri } from "@akshatmittal/polycons";

const src = polyconDataUri("0x8eccbf5e44264b782a416f8fc9961c949813fcfa", 64);
// "data:image/svg+xml,%3Csvg%20width%3D%2264%22..."
```

The result is a plain string, so it works anywhere an image URL does: an `<img>` source, a CSS `background-image`, or a server-rendered page.

### React

```tsx
import { polyconDataUri } from "@akshatmittal/polycons";

export function Avatar({ address, size }: { address: string; size: number }) {
  return (
    <img
      src={polyconDataUri(address, size)}
      width={size}
      height={size}
      alt=""
      style={{ borderRadius: "50%" }}
    />
  );
}
```

The SVG is square. Round it with CSS if you want a circle, as SolarisKit does.

## API

### `polyconDataUri(address, size)`

| Parameter | Type     | Description                                                                |
| --------- | -------- | -------------------------------------------------------------------------- |
| `address` | `string` | A `0x`-prefixed hex address. Uppercase and lowercase give the same result. |
| `size`    | `number` | Width and height of the SVG, in pixels.                                    |

Returns a `data:image/svg+xml` URI. Each address and size pair is generated once and then served from an in-memory cache.

## How it works

The first 8 hex digits after `0x` seed the polycon. The seed picks one of 50 color pairs, from neutral, tonal, and complementary palettes, and fills a 2×2 grid with triangles and squares inside a 25% margin. The same address always gives the same polycon, on every device and in every render.

Polycons are made for EVM hex addresses. There are at most 31,250 different polycons (625 shapes × 50 color pairs), so two addresses can share one, and two addresses that share their first 8 hex digits always do. Other address formats, such as Solana base58 addresses, often share one. Use a polycon as a visual hint, not as proof of an address.

## Requirements

ESM only, with TypeScript declarations. Node.js 24 or newer, or any modern browser.

## License

[MIT](https://github.com/akshatmittal/solaris/blob/main/LICENSE)
