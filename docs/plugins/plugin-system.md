---
title: Plugin System
description: How the CDT plugin system works — manifest, host, registry, and consumers.
sidebar_position: 2
---

import PluginArchitecture from '@site/src/components/PluginArchitecture';
import PluginLifecycle from '@site/src/components/PluginLifecycle';
import PluginZones from '@site/src/components/PluginZones';

# Plugin System

CDT uses a minimal, VSCode-style plugin architecture. The core idea: **the host knows nothing about what contribution points mean** — it only enforces that plugins declare capabilities before using them. Everything else is data stored in a generic registry and consumed by whichever UI component knows how to render it.

## Startup lifecycle

<PluginLifecycle />

## How the three zones relate

<PluginZones />

The flow is one-way: your plugin **writes** contributions into the registry through the framework; core UI components **read** from that registry at render time. Neither side knows about the other — the registry is the only shared state.

## What the framework is made of

<PluginArchitecture bare />

## Four moving parts

### 1 · Plugin Manifest

Every plugin ships one manifest — a small object declaring its identity and the contribution points it intends to use.

```ts
{
  slug: 'my-plugin',
  name: 'My Plugin',
  version: '1.0.0',
  capabilities: ['map.tools'],
  configSchema: { ... },         // optional — supports future config UI
  requiredPermissions: ['map'],  // optional — install-time checks
}
```

The `capabilities` array is the contract. The host validates it at register time: if a plugin tries to contribute to a key it didn't declare, it is rejected.

### 2 · PluginHost

The host manages the plugin lifecycle. Its job is narrow:

```ts
loadPlugin(manifest, entry, config)
  → creates PluginContext
  → calls entry.activate(ctx)
  → plugin calls ctx.register('map.tools', item)

unloadPlugin(slug)
  → calls entry.deactivate()
  → registry.deregisterAll(slug)
```

The host does **not** know what `'map.tools'` means. That ignorance is intentional — it is what makes the system extensible without host changes.

### 3 · PluginRegistry

A generic key→items store. The only typed map is `CapabilityRegistry` in the SDK, which is where all contribution points are declared:

```ts
// sdk/types.ts
export interface CapabilityRegistry {
  'map.tools': MapToolRegistration;
  'sidebar.items': SidebarRegistration;
  // Adding a new point = one line here
}
```

The registry itself has no opinion about what any key means:

```ts
register(key, item)          // called by the host on behalf of the plugin
getAll(key): Item[]          // called by consumer components
deregisterAll(pluginId)      // called by the host on unload
```

### 4 · Consumer components

Each UI component that renders contributions knows exactly one key. It reads from the registry and renders whatever it finds:

```tsx
// Toolbar.tsx
const tools = registry.getAll('map.tools');
return <>{tools.map(t => <t.component key={t.id} />)}</>;
```

No knowledge of which plugin contributed what. No host changes needed when a new plugin adds tools.

---

Ready to build a plugin? See [Creating a Plugin](./creating-a-plugin.md).
