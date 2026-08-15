---
title: Git Workflow
description: Branching strategy, commit conventions, and semantic versioning for CDT contributors.
sidebar_position: 3
---

# Git Workflow

CDT uses a feature-branch workflow on top of two long-lived branches: `dev` (integration) and `main` (production).

## Branch strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production. Protected — only maintainers merge here, which triggers a CI release (`semantic-release`) and deploy. |
| `dev` | Development integration. Feature branches merge here first via reviewed PRs. |
| `feature/*` | Your work. Branch off `dev`, then open a PR back into `dev`. |

> **Branch protection.** `main` and `dev` are protected. Contributions go through **pull requests** — direct pushes to `main` and `dev` are restricted to maintainers. PRs into `dev` require maintainer review and approval, and only maintainers promote `dev` to `main`.

### Creating a feature branch from a GitHub issue

GitHub lets you create a branch directly from an issue. Once the branch exists, check it out locally:

```bash
git fetch origin
git checkout 718-creating-new-api-endpoint
```

### Keeping your feature branch up to date

Before opening a PR, pull the latest `dev` into your branch to reduce merge conflicts:

```bash
git fetch origin
git merge origin/dev
```

## Commit message convention

CDT follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification, which `semantic-release` uses to determine version bumps automatically.

### Format

```
<type>(<scope>): <short description>
```

### Types and their version impact

| Type | Bump | Example |
|------|------|---------|
| `fix` | patch | `fix(api): handle null responses from user endpoint` |
| `feat` | minor | `feat(map): add layer opacity control` |
| `perf` | patch | `perf(viewer): reduce re-renders on tile load` |
| `build`, `ci`, `docs`, `refactor`, `test` | no release | `docs(readme): update setup instructions` |
| `BREAKING CHANGE:` in footer | major | `feat!: migrate auth to Auth.js` |

### References

- [Conventional Commits spec](https://www.conventionalcommits.org/en/v1.0.0/)
- [Angular commit message guidelines](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md)
- [First Contributions practice repo](https://github.com/firstcontributions/first-contributions)

## Authorship

Commits credit the people who wrote them. Do not add an AI assistant as an author or co-author — no `Co-authored-by:` trailer naming an assistant, and no generated-by footer. You are welcome to use an assistant; describe how in the pull request, where it is useful context for reviewers rather than a permanent claim on the contributor record.

`yarn hooks:install` rejects such a trailer before the commit is written, and the **AI attribution** check enforces the same rule on every pull request. To check a branch yourself:

```bash
node scripts/check-ai-attribution.mjs --range dev..HEAD
```

## Semantic versioning

CDT uses `semantic-release` to automate versioning based on commit messages. It runs in CI when commits land on `main` or `beta`.

**Version format: `MAJOR.MINOR.PATCH`**

| Version change | When |
|----------------|------|
| `PATCH` (for example, `1.0.1`) | Bug fixes and performance improvements |
| `MINOR` (for example, `1.2.0`) | New backwards-compatible features |
| `MAJOR` (for example, `2.0.0`) | Breaking API changes |

### How it works

1. A maintainer merges a reviewed PR into `main` with conventional commit messages.
2. `semantic-release` runs in CI, determines the version bump from commit types.
3. A GitHub release is created automatically with a changelog.

See the [semantic-release docs](https://semantic-release.gitbook.io/semantic-release) for configuration details.

## Forking the repository

Contributions target [`@collabdt/core`](https://github.com/CollabDigitalTwins/core) — the open-source library. To contribute:

1. Fork [CollabDigitalTwins/core](https://github.com/CollabDigitalTwins/core) on GitHub.
2. Clone your fork and install dependencies:

```bash
git clone https://github.com/<your-username>/core.git
cd core
yarn install
```

3. Branch off `dev`, make your change, and validate it:

```bash
yarn build
yarn test:unit
yarn lint
```

4. Push to your fork and open a pull request against `dev`. You'll be asked to
   sign the Contributor License Agreement on your first PR.

No environment files or services are needed — core is a library. See
[Dev Environment Setup](./dev-environment.md) for the full guide.

## Related

- [Dev Environment Setup](./dev-environment.md)
- [Contributing](./index.md)
