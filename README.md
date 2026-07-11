# Solaris

Solaris is a pared-down RainbowKit fork focused on the core
`solariskit` package.

This repo intentionally keeps a lean monorepo around the core
`solariskit` package, with shared workspace tooling for builds,
linting, formatting, and releases.

## Development

```bash
pnpm install
pnpm build
pnpm format:check
pnpm typecheck
pnpm lint
```

## Package

The library source lives in `packages/solariskit`.

## License

MIT. See [LICENSE](./LICENSE).
