# Solaris

Solaris is a React wallet connection kit for EVM chains and Solana. It gives you connect, account, and network modals, wallet buttons, and themes that work the same way for both ecosystems.

[Live example](https://gh.akshatmittal.com/solaris/) · [npm](https://www.npmjs.com/package/solariskit) · [Documentation](./packages/solariskit/README.md) · [Changelog](./packages/solariskit/CHANGELOG.md)

## Packages

| Path                  | Package                                         | Description                                      |
| --------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `packages/solariskit` | [`solariskit`](./packages/solariskit/README.md) | The wallet connection UI and hooks               |
| `packages/polycons`   | `@akshatmittal/polycons`                        | Deterministic avatar generation for addresses    |
| `apps/example`        | —                                               | Next.js example with EVM and Solana side by side |

## Development

```bash
pnpm install
pnpm build
pnpm format:check
pnpm typecheck
pnpm lint
```

Add a changeset for each change with `pnpm changeset`.

## License

MIT. See [LICENSE](./LICENSE).

Solaris started as a fork of [RainbowKit](https://github.com/rainbow-me/rainbowkit) by Rainbow.
