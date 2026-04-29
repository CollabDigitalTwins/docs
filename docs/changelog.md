---
sidebar_position: 99
title: Changelog
description: Version history for the CDT platform — breaking changes, new features, and migration notes.
---

# Changelog

CDT follows [Semantic Versioning](https://semver.org). Versions are produced automatically by `semantic-release` from commit messages on `main`. This page mirrors the GitHub release notes with extra context for breaking changes and migration steps.

For the canonical, machine-generated list, see [GitHub Releases](https://github.com/collabdt/core/releases).

## Versioning policy

| Bump | Trigger | What it means for you |
|------|---------|------------------------|
| **Patch** (`x.y.Z`) | Bug fixes, refactors, docs | Always safe to upgrade. |
| **Minor** (`x.Y.0`) | New features, additive API changes | Safe to upgrade. New env vars, if any, are listed in the release notes. |
| **Major** (`X.0.0`) | Breaking changes | Read the migration notes below before upgrading. |

## Unreleased

Changes merged to `main` since the most recent tag appear here. The next release will move them into a versioned section below.

- _No changes since the last release._

## How to upgrade

```bash
git pull
docker compose pull
docker compose build cdt
docker compose run --rm migrate
docker compose up -d
```

Always run migrations before bringing up the new application version. For details and rollback, see [Production Deployment → Updates and migrations](./deployment/production.md#updates-and-migrations).

## Past releases

Past releases and full release notes are published on [GitHub](https://github.com/collabdt/core/releases). Migration notes for any release tagged with `BREAKING CHANGE` are mirrored here once that release ships.

## Reporting regressions

If an upgrade introduces a regression, file an issue with the previous and current version numbers, the symptom, and the relevant logs. See the [Contributing guide](./contributing/index.md#reporting-bugs) for details.

## Related

- [Production Deployment](./deployment/production.md)
- [Git Workflow → Semantic versioning](./contributing/git-workflow.md#semantic-versioning)
