# Solaris

Solaris is a pared-down RainbowKit fork focused on the core
`@rainbow-me/rainbowkit` package.

This repo intentionally keeps a lean monorepo around the core
`@rainbow-me/rainbowkit` package, with shared workspace tooling for builds,
linting, formatting, and releases.

## Development

```bash
pnpm install
pnpm build
pnpm format:check
pnpm typecheck
pnpm test
pnpm lint
```

## Package

The library source lives in `packages/rainbowkit`.

## License

MIT. See [LICENSE](./LICENSE).
