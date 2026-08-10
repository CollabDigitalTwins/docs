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

1. **The code has to be present.** Today that means the plugin is compiled into `@collabdt/core`.
2. **Someone has to switch it on.** An administrator makes it available to their organization, and each person then chooses whether it runs for them. See [Installing and enabling plugins](./installing-and-enabling.md).

:::note What is supported today
Plugins are compiled into core and listed in `installed.ts`. **Loading a plugin at runtime — dropping a folder next to a running CDT — is not supported yet.** It is the next major piece of work; until it ships, the way to get a plugin into CDT is to contribute it into core.

Enablement, on the other hand, is fully working: which plugins run, for which organization, for which person, all comes from the database.
:::

## In this section

1. [Create your first plugin](./create-your-first-plugin.md) — a walkthrough
2. [PluginContext API](./plugin-context-api.md) — `pluginId`, `config`, `register`
3. [Capabilities](./all-capabilities.md) — what a plugin can contribute
4. [Installing and enabling plugins](./installing-and-enabling.md) — the extensions page
5. [Error handling and safety](./error-handling-and-safety.md) — isolation, guards, cleanup
6. [Real example: hello-bim](./hello-bim-example.md) — annotated, and shipped in core

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
