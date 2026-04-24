---
title: Creating a Plugin
description: Step-by-step guide to building and registering a CDT plugin.
sidebar_position: 3
---

import PluginLifecycle from '@site/src/components/PluginLifecycle';

# Creating a Plugin

This guide walks through building a plugin from scratch. By the end you will have a plugin that contributes a tool to the map toolbar.

## What happens at startup

Before writing any code it helps to see the full startup sequence — this is the chain your plugin slots into at steps 6 and 7:

<PluginLifecycle />

## Prerequisites

- Familiarity with TypeScript and React
- The CDT monorepo cloned locally and dependencies installed
- Read [Plugin System](./plugin-system.md) to understand the four moving parts

---

## Step 1 — Create the plugin folder

Plugins live under `packages/plugins/`. Create a folder for yours:

```
packages/plugins/my-plugin/
  index.ts
  manifest.ts
```

---

## Step 2 — Write the manifest

The manifest is the contract between your plugin and the host. Declare every contribution point you intend to use in `capabilities`.

```ts
// packages/plugins/my-plugin/manifest.ts
import type { PluginManifest } from '@cdt/sdk';

export const manifest: PluginManifest = {
  slug: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  capabilities: ['map.tools'],
};
```

If you try to register a key not listed here, the host will reject it at load time.

---

## Step 3 — Implement `activate` and `deactivate`

The entry file exports two functions. `activate` receives a `PluginContext` and uses it to register contributions. `deactivate` is called on unload — cleanup is handled automatically by the registry, but cancel any timers or subscriptions here.

```ts
// packages/plugins/my-plugin/index.ts
import type { PluginEntry } from '@cdt/sdk';
import MyTool from './MyTool';

export const entry: PluginEntry = {
  activate(ctx) {
    ctx.register('map.tools', {
      id: 'my-plugin.my-tool',
      label: 'My Tool',
      icon: '🔧',
      component: MyTool,
    });
  },

  deactivate() {
    // cancel subscriptions here if needed
  },
};
```

---

## Step 4 — Build the contribution component

The shape of each item you register must match the type declared in `CapabilityRegistry` for that key. For `map.tools` that is `MapToolRegistration`:

```ts
// sdk/types.ts — for reference
export interface MapToolRegistration {
  id: string;
  label: string;
  icon?: string;
  component: React.ComponentType;
}
```

Create your component:

```tsx
// packages/plugins/my-plugin/MyTool.tsx
export default function MyTool() {
  return <button>My Tool</button>;
}
```

---

## Step 5 — Register the plugin with the host

In the application's plugin loader, add your manifest and entry:

```ts
import { manifest } from '@cdt/plugins/my-plugin/manifest';
import { entry }    from '@cdt/plugins/my-plugin';

await pluginHost.loadPlugin(manifest, entry, config);
```

---

## Step 6 — Verify it renders

The `Toolbar` component already calls `registry.getAll('map.tools')` and renders every registered item. Start the dev server and open the map view — your tool should appear in the toolbar.

```bash
npm run dev
```

---

## Adding a new contribution point

If the contribution point you need does not exist yet, the process is three small steps — no host or context changes required:

**1 — Add one line to `CapabilityRegistry`:**

```ts
// sdk/types.ts
export interface CapabilityRegistry {
  'map.tools': MapToolRegistration;
  'sidebar.items': SidebarRegistration;
  'inspector.panels': InspectorPanelRegistration; // ← new
}
```

**2 — Define the registration type:**

```ts
export interface InspectorPanelRegistration {
  id: string;
  label: string;
  component: React.ComponentType<{ featureId: string }>;
}
```

**3 — Add consumer code** in the component that should render contributions:

```tsx
const panels = registry.getAll('inspector.panels');
return <>{panels.map(p => <p.component key={p.id} featureId={selectedId} />)}</>;
```

That PR is small, reviewable, and touches nothing in the host or context. Any plugin can then declare `'inspector.panels'` in its capabilities and start contributing.
