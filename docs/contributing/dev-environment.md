---
title: Dev Environment Setup
description: Set up a local development environment for contributing to CDT — toolchain, services, and editor configuration.
sidebar_position: 2
---

# Dev Environment Setup

This page covers what you need on your machine to develop CDT itself. If you only want to *use* CDT or self-host it, see the user [Installation](../getting-started/installation.mdx) guide instead.

## Toolchain

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | 18.0+ (LTS) | Use `nvm` for easy version management |
| **Yarn** | 1.x classic | The repo's lockfile is `yarn.lock` |
| **Git** | any recent | Required to clone and push branches |
| **Docker Desktop** or **Engine + Compose** | 24.0+ | Runs PostgreSQL, MinIO, Martin |
| **VS Code** | latest | Recommended editor — repo has shared settings |

For the full prerequisite versions and platform notes, see [Installation](../getting-started/installation.mdx#prerequisites).

## Initial setup

```bash
git clone https://github.com/CollabDigitalTwins/core.git
cd core
yarn install
cp .env.example .env
```

Open `.env` and fill in at least the required keys — see the [Environment variables reference](../getting-started/environment-variables.mdx).

## Local services

The fastest path is to run PostgreSQL, MinIO, and Martin with Docker Compose:

```bash
docker compose up -d postgres minio martin
npx prisma migrate dev   # apply schema to a fresh database
yarn dev
```

The application is available at `http://localhost:3000`.

## Recommended VS Code extensions

The repository ships a `.vscode/extensions.json` with the extensions the team relies on:

- **ESLint** — surfaces lint errors as you type
- **Prettier** — autoformat on save
- **Prisma** — schema syntax and autocomplete
- **Tailwind CSS IntelliSense** — class name completion
- **GitLens** — inline blame and history

Open the Command Palette → *Show Recommended Extensions* to install them in one click.

## Editor configuration

The repo includes `.editorconfig`, `.prettierrc`, and `eslint.config.mjs`. Enable **format on save** so your changes always match the project style. If you need to format from the command line:

```bash
yarn lint        # ESLint
yarn format      # Prettier
```

## Useful commands

| Command | What it does |
|---------|--------------|
| `yarn dev` | Run the dev server with Turbopack (hot reload) |
| `yarn build` | Production build — useful before opening a PR |
| `yarn lint` | Run ESLint over the codebase |
| `yarn test` | Run the unit and integration test suites |
| `npx prisma studio` | Browse and edit database records in a local UI |
| `npx prisma migrate dev` | Apply pending migrations to your local database |
| `docker compose logs -f cdt` | Tail logs from the application container |

## Running the test suite

CDT uses Vitest for unit tests and Playwright for end-to-end. Both run via:

```bash
yarn test          # all tests
yarn test:unit     # unit only
yarn test:e2e      # Playwright
```

Playwright requires browsers to be installed once with `npx playwright install`.

## Troubleshooting setup

For common installation failures (port conflicts, Prisma errors, missing modules), see the [Troubleshooting page](../getting-started/troubleshooting.mdx).

## Related

- [Git Workflow](./git-workflow.md)
- [Installation](../getting-started/installation.mdx)
- [Environment variables](../getting-started/environment-variables.mdx)
- [Architecture Overview](../architecture/overview.mdx)
