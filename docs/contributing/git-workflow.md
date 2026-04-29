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
| `main` | Production. Pushing here triggers a Vercel build and a new release. |
| `dev` | Development integration. All feature branches merge here first. |
| `feature/*` | Your work. Branch off `dev`, merge back to `dev` when done. |

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
| `build`, `ci`, `docs`, `refactor`, `test` | patch | `docs(readme): update setup instructions` |
| `BREAKING CHANGE:` in footer | major | `feat!: migrate auth to Auth.js` |

### References

- [Conventional Commits spec](https://www.conventionalcommits.org/en/v1.0.0/)
- [Angular commit message guidelines](https://github.com/angular/angular/blob/main/contributing-docs/commit-message-guidelines.md)
- [First Contributions practice repo](https://github.com/firstcontributions/first-contributions)

## Semantic versioning

CDT uses `semantic-release` to automate versioning based on commit messages. It runs in CI on every push to `main` or `beta`.

**Version format: `MAJOR.MINOR.PATCH`**

| Version change | When |
|----------------|------|
| `PATCH` (for example, `1.0.1`) | Bug fixes, docs, refactors |
| `MINOR` (for example, `1.2.0`) | New backwards-compatible features |
| `MAJOR` (for example, `2.0.0`) | Breaking API changes |

### How it works

1. Push commits to `main` with conventional commit messages.
2. `semantic-release` runs in CI, determines the version bump from commit types.
3. A GitHub release is created automatically with a changelog.

See the [semantic-release docs](https://semantic-release.gitbook.io/semantic-release) for configuration details.

## Forking the repository

The CDT repository is private during the pre-release period. To contribute:

1. Ask a team lead to invite you as a collaborator ([GitHub docs](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository)).
2. Accept the email invitation.
3. Fork the repo, naming your fork `cdt-{initials}` (for example, `cdt-dp`).
4. Clone your fork:

```bash
git clone https://github.com/<your-username>/cdt-<initials>.git
cd cdt-<initials>
```

5. Copy the `.env` file from your team lead into the project root.
6. Install dependencies and start the dev server:

```bash
yarn        # or: npm install
yarn dev    # or: npm run dev
```

## Related

- [Dev Environment Setup](./dev-environment.md)
- [Contributing](./index.md)
