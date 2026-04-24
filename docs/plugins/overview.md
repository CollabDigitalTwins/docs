---
title: Overview
description: What the CDT plugin framework is, how contributions flow through the registry, and Phase 1 scope.
sidebar_position: 1
category: plugins
status: draft
last_updated: 2026-04-24
---

import PluginArchitecture from '@site/src/components/PluginArchitecture';
import PluginLifecycle from '@site/src/components/PluginLifecycle';
import PluginZones from '@site/src/components/PluginZones';

# Overview

The plugin framework lets you add tools, panels, and data sources to the CDT app without modifying any core files. Plugins register their contributions into a central registry at startup; the toolbar, sidebar, and viewer read from that registry at render time. Core app code never changes — only the registry does.

:::note Phase 1 scope
Plugins are bundled with the app at build time by listing them in `installed.ts`. Runtime dynamic loading (adding plugins without rebuilding) is not supported in this version.
:::

## Contents

1. [Create your first plugin](./create-your-first-plugin.md) — five-step walkthrough
2. [PluginContext API](./plugin-context-api.md) — `pluginId`, `config`, `register`
3. [All 11 capabilities](./all-capabilities.md) — full capability table
4. [Error handling & safety](./error-handling-and-safety.md) — isolation, guards, cleanup
5. [Real example: daynight-cycle](./daynight-cycle-example.md) — annotated canonical plugin


### Startup lifecycle — what happens when the app loads

<PluginLifecycle />

### System structure — how the three zones relate

<PluginZones />
