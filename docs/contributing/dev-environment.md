---
title: Dev Environment Setup
description: Set up a local development environment for contributing to @collabdt/core — the open-source heart of CDT.
sidebar_position: 2
---

# Dev Environment Setup

This page covers what you need on your machine to contribute to
[**`@collabdt/core`**](https://github.com/CollabDigitalTwins/core) — the
open-source library that powers CDT's viewers, UI components, hooks, and plugin
SDK. If you only want to *use* CDT or self-host it, see the
[Installation](../getting-started/installation.mdx) and
[Self-hosting](../deployment/self-hosting.md) guides instead.

:::info How CDT is structured
The **CDT platform** (the deployed application) is maintained by the CDT team
and distributed as a Docker image for self-hosting. The open-source surface you
contribute to is **`@collabdt/core`**: the viewers, components, and plugin
system the platform is built from. Your merged core contributions ship to every
CDT deployment with the next platform release.
:::

## Toolchain

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | 22.2.0 | the repo ships an `.nvmrc` — `nvm use` picks it up |
| **Yarn** | 1.x classic | the repo's lockfile is `yarn.lock` |
| **Git** | any recent | required to clone and push branches |
| **VS Code** | latest | recommended editor |

No database or Docker setup is needed to develop core — it's a library.

## Initial setup

```bash
git clone https://github.com/<your-fork>/core.git
cd core
yarn install     # installs tsup + build deps (takes a few minutes the first time)
```

## Build, test, lint

| Command | What it does |
|---------|--------------|
| `yarn build` | full library build — tsup (per-file ESM), CSS copy, type declarations |
| `yarn dev` | watch mode: rebuilds `dist/` on every change |
| `yarn test:unit` | Vitest unit tests (watch mode: `yarn test:unit:watch`) |
| `yarn lint` | ESLint over `src/` |

Run all three (`build`, `test:unit`, `lint`) before opening a PR — CI checks the same.

## Seeing your changes running

`@collabdt/core` is a library, so day-to-day you validate changes with the unit
test suite (Vitest covers the viewers, plugin host, and UI logic — see
[TESTING.md](https://github.com/CollabDigitalTwins/core/blob/dev/TESTING.md)).

To see a change running inside the full platform:

- **During review** — maintainers exercise every core PR inside the platform
  before merging, and will share screenshots/feedback on visual changes.
- **Self-hosters** — platform releases pick up the new core version; watch the
  [changelog](../changelog.md) for the release that includes your change.
- A standalone **dev harness** (a runnable sandbox app inside the core repo) is
  on the roadmap to close this gap — track progress in the repo's issues.

## Contribution flow

1. Fork [CollabDigitalTwins/core](https://github.com/CollabDigitalTwins/core) and clone your fork.
2. Branch off **`dev`** (the integration branch).
3. Make your change; run `yarn lint` and `yarn test:unit`.
4. Commit using [Conventional Commits](./git-workflow.md#commit-message-convention) and open a PR **against `dev`**.
5. On your first PR you'll be asked to accept the Contributor License Agreement (CLA).

Full details: [Git Workflow](./git-workflow.md) and the repo's
[CONTRIBUTING.md](https://github.com/CollabDigitalTwins/core/blob/dev/CONTRIBUTING.md).

## Building a plugin instead?

If your goal is to *extend* CDT rather than change its internals, start with the
[Plugins overview](../plugins/overview.md) — plugins build against the plugin
SDK and don't require platform internals knowledge.

## Related

- [Git Workflow](./git-workflow.md)
- [Plugins overview](../plugins/overview.md)
- [Self-hosting](../deployment/self-hosting.md)
- [Architecture Overview](../architecture/overview.mdx)
