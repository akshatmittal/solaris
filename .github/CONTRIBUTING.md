# Contributing to Solaris

Thanks for helping. This guide covers the setup, the checks, and what a good pull request looks like.

## Setup

You need Node 26 and pnpm 12. The root `package.json` pins both, and pnpm downloads the right Node for you.

```bash
pnpm install
pnpm dev
```

`pnpm dev` watches `solariskit` and `@akshatmittal/polycons` and runs the example app at `http://localhost:3000`. To test WalletConnect, copy `apps/example/.env.example` to `apps/example/.env.local` and set a project ID from the [Reown Dashboard](https://dashboard.reown.com/).

## Checks

CI runs these on every pull request. Run them before you push:

```bash
pnpm format:check
pnpm lint
pnpm build:lib
pnpm typecheck
```

Use `pnpm format` and `pnpm lint:fix` to fix most issues.

## Guidelines

- Keep TypeScript strict. Do not add `any` or `@ts-ignore`, and avoid type casts.
- Check UI changes in the example app in the light and dark themes, for both EVM and Solana where it applies. Add screenshots to the pull request.
- Keep changes small and focused. Open an issue first for large features or API changes.

## Changesets

Every change to a published package (`solariskit` or `@akshatmittal/polycons`) needs a changeset:

```bash
pnpm changeset
```

Write the summary for users of the package: say what changed and what they must do. Mark breaking changes as `major`. The release workflow opens a "Version Packages" pull request and publishes to npm when it merges.

## Commits and pull requests

Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages and pull request titles. Scope a change to one package with its name, for example `fix(solariskit): keep focus on the Open button`. Leave the scope out for changes across the repository, for example `docs: update the contributing guide`.
