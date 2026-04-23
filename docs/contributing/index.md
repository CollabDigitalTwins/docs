---
title: Contributing
description: How to contribute to CDT — reporting bugs, suggesting features, writing code, and improving documentation.
sidebar_position: 1
---

# Contributing

Thanks for taking the time to contribute to Collab Digital Twins. All types of contributions are encouraged and valued — code, documentation, bug reports, and feature suggestions.

If you like the project but don't have time to contribute right now, other ways to help include starring the repo, mentioning CDT at meetups, or referring it in your own project's readme.

## I Have a Question

Before opening an issue, search [existing issues](https://github.com/canada-digital-twin/cdt/issues) — someone may have already asked. If you still need clarification after searching:

- Open a [new issue](https://github.com/canada-digital-twin/cdt/issues/new).
- Provide as much context as you can about what you're running into.
- Include relevant versions (Node.js, npm/yarn, OS, etc.).

## Reporting Bugs

### Before submitting

- Confirm you are on the latest version.
- **Check whether the bug belongs to a dependency.** CDT is built on Next.js, Prisma, MapLibre, MinIO, PostGIS, and NextAuth.js, among others. If the issue is reproducible without CDT-specific code, it likely belongs to that project's own issue tracker — report it there instead. Only open a CDT issue if the bug is specific to how CDT integrates or uses that dependency.
- Check the [issue tracker](https://github.com/canada-digital-twin/cdt/issues?q=label%3Abug) to see if the bug has already been reported.
- Collect the following before filing:
  - Stack trace or error output
  - OS, platform, and version
  - Node.js, package manager, and runtime versions
  - Steps to reliably reproduce the issue

### How to file a bug report

- Open a [new issue](https://github.com/canada-digital-twin/cdt/issues/new). Do not label it as a bug yet — the team will triage it.
- Describe the **expected** behaviour and the **actual** behaviour.
- Include reproduction steps someone else can follow from scratch.
- Attach relevant code, logs, or a reduced test case.

Once filed, the team will label and attempt to reproduce the issue. Issues that cannot be reproduced will be tagged `needs-repro` and held until reproduction steps are provided.

> **Security vulnerabilities** must not be reported in public issues. Send security-related bugs directly to the team by email instead.

## Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/canada-digital-twin/cdt/issues).

### Before submitting

- Confirm you are on the latest version and the feature doesn't already exist.
- Search issues to see if it has already been suggested — add a comment to an existing issue rather than opening a new one.
- Consider whether the feature is useful to the majority of users. Narrow use cases are better suited to a plugin.

### How to write a good enhancement suggestion

- Use a clear, descriptive title.
- Describe the current behaviour and what you'd expect instead, and why.
- List any alternatives you've already considered.
- Include screenshots or screen recordings if the change is visual ([LICEcap](https://www.cockos.com/licecap/) for GIFs on macOS/Windows).

## Your First Code Contribution

1. Set up your local environment — see [Dev Environment Setup](./dev-environment.md).
2. Fork and clone the repo — see [Git Workflow](./git-workflow.md).
3. Create a branch from `dev` named after your feature or issue.
4. Make your changes, following the [commit message convention](./git-workflow.md#commit-message-convention).
5. Open a pull request against `dev` with a clear description of what changed and why.

> When contributing, you confirm that you have authored 100% of the content, hold the necessary rights, and agree it may be provided under the project licence.

## Improving the Documentation

Documentation lives in `https://github.com/collabdt/`. To propose a change:

1. Edit or add the relevant `.md` file.
2. Follow the templates in `https://github.com/collabdt/docs/tree/main/docs/templates` for new pages.
3. Open a pull request against `dev` with a brief description of what you changed and why.

## Commit Messages

CDT follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. See [Git Workflow → Commit Message Convention](./git-workflow.md#commit-message-convention) for the full reference and version bump table.

## Join the Project Team

Interested in becoming a regular contributor or maintainer? Reach out via [collabdt.org](https://collabdt.org/home#contact) or introduce yourself in an issue.

## Related

- [Dev Environment Setup](./dev-environment.md)
- [Git Workflow](./git-workflow.md)
- [Plugin System](./plugin-system.md)
- [Creating a Plugin](./creating-a-plugin.md)
