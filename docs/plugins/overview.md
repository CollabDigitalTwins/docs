---
title: Overview
description: What the CDT plugin framework is, how contributions reach the UI, and what is supported today.
sidebar_position: 1
category: plugins
status: draft
last_updated: 2026-08-06
---

import PluginLifecycle from '@site/src/components/PluginLifecycle';
import PluginZones from '@site/src/components/PluginZones';

# Overview

The plugin framework lets you add tools, panels and legends to CDT without modifying core files. A plugin registers its contributions into a central registry when it activates; the toolbars, sidebar and viewers read from that registry as they render. Core code never changes — only the registry does.

Two things have to be true before a plugin appears on screen, and they are independent:

1. **The code has to be present.** Either compiled into `@collabdt/core`, or [mounted from a folder](./mounting-a-plugin.md) next to a running CDT platform.
2. **Someone has to switch it on.** An administrator makes it available to their organization, and each person then chooses whether it runs for them. See [Installing and enabling plugins](./installing-and-enabling.md).

:::note Two ways in, and when to use which
**Compiled in** — the plugin lives in `@collabdt/core/plugins/<slug>/` and is listed in `installed.ts`. It then exists in every CDT installation. Getting a plugin there means opening a pull request against core and waiting for a release. Once you have tested your plugin locally, you can suggest it to the CDT team via pull request so it becomes part of the core.

**Mounted** — you build the plugin yourself or get it from someone else and drop the folder next to your deployment. The CDT platform finds it at startup and it appears on the plugins page. No pull request, no release, no rebuilding CDT. This is for people running their own self-hosted CDT, and it is off unless you switch it on.

Mounted plugins are **not** available on the CDT-hosted platform. There, a plugin becomes available by being reviewed and included in a release.
:::

## In this section

1. [Create your first plugin](./create-your-first-plugin.md) — a walkthrough
2. [PluginContext API](./plugin-context-api.md) — `pluginId`, `config`, `register`
3. [Capabilities](./all-capabilities.md) — what a plugin can contribute
4. [Mounting a plugin](./mounting-a-plugin.md) — loading one without rebuilding CDT
5. [Installing and enabling plugins](./installing-and-enabling.md) — the plugins page
6. [Error handling and safety](./error-handling-and-safety.md) — isolation, guards, cleanup
7. [Real example: hello-bim](./hello-bim-example.md) — annotated, and shipped in core

## What a plugin can reach

A plugin imports from `@collabdt/core/plugins-sdk` and nothing else. That boundary is enforced by a lint rule, not just documented: reaching into core fails the build.

Through the SDK a plugin gets:

- **Data** — buildings, sites, sensors, comments, files, through the same hooks core uses, so it inherits authentication and organization scoping automatically.
- **The viewers** — the MapLibre map handle; for BIM, the loaded models, the live selection, element queries by IFC class, property reads, visibility and camera framing.
- **Its own settings and translations**, and the signed-in user's permissions so it can hide what they may not do.

## Security

A plugin runs with the same access as CDT itself. There is no sandbox in this version. This is a deliberate, documented trade-off rather than an oversight — see [Error handling and safety](./error-handling-and-safety.md).

### Startup lifecycle — what happens when the app loads

<PluginLifecycle />

### System structure — how the three zones relate

<PluginZones />
