---
title: Contributing
description: How to contribute to CDT — reporting bugs, suggesting features, writing code, and improving documentation.
sidebar_position: 1
---

# Contributing

Thanks for taking the time to contribute to Collab Digital Twins. All types of contributions are encouraged and valued — code, documentation, bug reports, and feature suggestions.

If you like the project but do not have time to contribute right now, other ways to help include starring the repository, mentioning CDT at meetups, or referencing it from your own project's readme.

## I have a question

Before opening an issue, search [existing issues](https://github.com/CollabDigitalTwins/core/issues) — someone may have already asked. If you still need clarification:

- Open a [new issue](https://github.com/CollabDigitalTwins/core/issues/new).
- Provide as much context as you can about what you are running into.
- Include relevant versions (Node.js, npm/yarn, OS).

## Reporting bugs

### Before submitting

- Confirm you are on the latest version.
- **Check whether the bug belongs to a dependency.** CDT is built on Next.js, Prisma, MapLibre, MinIO, PostGIS, and NextAuth.js, among others. If the issue reproduces without CDT-specific code, it likely belongs to that project's own issue tracker — report it there instead. Open a CDT issue only if the bug is specific to how CDT integrates with that dependency.
- Check the [issue tracker](https://github.com/CollabDigitalTwins/core/issues?q=label%3Abug) to see if the bug has already been reported.
- Collect the following before filing:
  - Stack trace or error output
  - OS, platform, and version
  - Node.js, package manager, and runtime versions
  - Steps to reliably reproduce the issue

### How to file a bug report

- Open a [new issue](https://github.com/CollabDigitalTwins/core/issues/new). Do not label it as a bug yet — the team triages it.
- Describe the **expected** behaviour and the **actual** behaviour.
- Include reproduction steps someone else can follow from scratch.
- Attach relevant code, logs, or a reduced test case.

Once filed, the team labels and attempts to reproduce the issue. Issues that cannot be reproduced are tagged `needs-repro` and held until reproduction steps are provided.

> **Security vulnerabilities** must not be reported in public issues. Email **info@collabdt.org** instead, following the [Security Policy](https://github.com/CollabDigitalTwins/core/blob/main/SECURITY.md).

## Suggesting enhancements

Enhancement suggestions are tracked as [GitHub issues](https://github.com/CollabDigitalTwins/core/issues).

### Before submitting

- Confirm you are on the latest version and the feature does not already exist.
- Search issues to see if it has already been suggested — comment on an existing issue rather than opening a new one.
- Consider whether the feature is useful to the majority of users. Narrow use cases are better suited to a [plugin](../plugins/overview.md).

### How to write a good enhancement suggestion

- Use a clear, descriptive title.
- Describe the current behaviour and what you would expect instead, and why.
- List any alternatives you have already considered.
- Include screenshots or screen recordings if the change is visual ([LICEcap](https://www.cockos.com/licecap/) for GIFs on macOS/Windows).

## Your first code contribution

1. Set up your local environment — see [Dev Environment Setup](./dev-environment.md).
2. Fork and clone the repo — see [Git Workflow](./git-workflow.md).
3. Create a branch from `dev` named after your feature or issue.
4. Make your changes, following the [commit message convention](./git-workflow.md#commit-message-convention).
5. Open a pull request against `dev` with a clear description of what changed and why.
6. Sign the Contributor License Agreement when prompted on your first pull request — see [below](#contributor-license-agreement-cla).

## Contributor License Agreement (CLA)

CDT is released under the **AGPL-3.0** licence and is also offered to organizations under a separate **Commercial License Agreement** — a standard dual-licensing model. To keep both editions legally consistent, every contributor must agree to the **[Contributor License Agreement](https://github.com/CollabDigitalTwins/core/blob/main/CLA.md)** before their contribution can be merged.

Under the CLA you **keep the copyright** in your contribution and grant Collab Digital Twins the right to distribute it under both the AGPL-3.0 and the commercial terms — the same approach used by projects such as MongoDB, GitLab, and Grafana. A CLA bot prompts you to sign on your first pull request, and merging is blocked until it is signed.

- **Individuals** sign Part A; **organizations** whose employees contribute have an authorized signatory complete Part B.
- The agreement does not transfer ownership and does not limit your right to use your own contribution elsewhere.

> By contributing, you also confirm that you authored 100 percent of the content, hold the necessary rights, and agree it may be provided under the project's licensing terms.

## Improving the documentation

Documentation lives at [github.com/CollabDigitalTwins/docs](https://github.com/CollabDigitalTwins/docs). To propose a change:

1. Edit or add the relevant `.md` file under `docs/`.
2. Follow the templates in [docs/templates](https://github.com/CollabDigitalTwins/docs/tree/main/docs/templates) for new pages.
3. Open a pull request against `main` with a brief description of what you changed and why.

## Commit messages

CDT follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification. See [Git Workflow → Commit message convention](./git-workflow.md#commit-message-convention) for the full reference and version-bump table.

## Join the project team

Interested in becoming a regular contributor or maintainer? Reach out via [collabdt.org](https://collabdt.org/home#contact) or introduce yourself in an issue.

## Related

- [Dev Environment Setup](./dev-environment.md)
- [Git Workflow](./git-workflow.md)
- [Plugins overview](../plugins/overview.md)
- [Create your first plugin](../plugins/create-your-first-plugin.md)
