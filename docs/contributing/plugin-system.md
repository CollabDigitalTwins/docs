---
title: Plugin System
description: How the CDT plugin system works — manifest, host, registry, and consumers.
sidebar_position: 2
---

import PluginArchitecture from '@site/src/components/PluginArchitecture';

# Plugin System

CDT uses a minimal, VSCode-style plugin architecture. The core idea: **the host knows nothing about what contribution points mean** — it only enforces that plugins declare capabilities before using them. Everything else is data stored in a generic registry and consumed by whichever UI component knows how to render it.

<PluginArchitecture />

## Four moving parts

### 1 · Plugin Manifest

Every plugin ships one manifest — a small object declaring its identity and the contribution points it intends to use.

```ts
{
  slug: 'daynight',
  name: 'Day/Night Plugin',
  version: '1.0.0',
  capabilities: ['map.tools'],
  configSchema: { ... },        // optional — supports future config UI
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

A generic, load-bearing primitive. Maps string keys to lists of items:

```ts
register(key: string, item: unknown): void
getAll<K extends keyof CapabilityRegistry>(key: K): CapabilityRegistry[K][]
deregisterAll(pluginId: string): void
```

`CapabilityRegistry` in the SDK is the only typed map — it is where contribution points are declared:

```ts
// sdk/types.ts
export interface CapabilityRegistry {
  'map.tools': MapToolRegistration;
  'sidebar.items': SidebarRegistration;
  // Adding a new point = one line here
}
```

### 4 · Consumer components

Each UI component that renders contributions knows exactly one key. It reads from the registry and renders whatever it finds:

```tsx
// Toolbar.tsx
const tools = registry.getAll('map.tools');
return <>{tools.map(t => <t.component key={t.id} />)}</>;
```

No knowledge of which plugin contributed what. No host changes needed.

---

## Adding a new contribution point

This is the key extensibility story. To add a brand-new extension point — say, a custom inspector panel:

**Step 1 — Declare the key** in `CapabilityRegistry`:

```ts
'inspector.panels': InspectorPanelRegistration;
```

**Step 2 — Define the shape:**

```ts
export interface InspectorPanelRegistration {
  id: string;
  label: string;
  component: React.ComponentType<{ featureId: string }>;
}
```

**Step 3 — Add consumer code** in the component that should render it:

```tsx
const panels = registry.getAll('inspector.panels');
return <>{panels.map(p => <p.component key={p.id} featureId={selectedId} />)}</>;
```

That is the entire change. **Zero host changes. Zero context changes.** The PR is small, reviewable, and additive.

---

## What was simplified

The current implementation collapses an earlier design that had 10 typed API interfaces and 10 factory functions in `context.ts`. The table below tracks what stayed and what went:

| Component | Decision | Rationale |
|---|---|---|
| `PluginRegistry` | Keep as-is | Load-bearing primitive, already generic |
| `PluginHost` | Keep, minor trim | Lifecycle is essential |
| `PluginManifest` + `validateManifest` | Keep | Manifest is the contract |
| `configSchema` on manifest | Keep | Supports future config UI |
| `requiredPermissions` on manifest | Keep | Install-time permission checks |
| `capabilities: string[]` on manifest | Keep | Forward-compatible free-form strings |
| `CapabilityRegistry` type map in SDK | **Add** | One-line extensibility mechanism |
| 10 typed `PluginXxxAPI` interfaces | Collapse → `register<K>` | ~200 → ~60 lines in `types.ts` |
| 10 `createXxxAPI` factories | Collapse → context | ~210 → ~30 lines in `context.ts` |
| `Plugin` + `PluginInstallation` tables | Keep | Per-org install is essential |
| `PluginData` table | Delete for now | No consumer; revisit Memento-style later |
| `sdk/hooks.ts` | Delete | Bypasses the adapter pattern |
| `PluginLogger` | Delete | `console.*` is sufficient |
| `plugins.getAPI` cross-plugin bridge | Delete | Speculative; add when two plugins actually talk |
| Catch-all `[slug]/[...path]` route | Delete | No VSCode analog; revisit when needed |

**Net reduction:** `types.ts` ~200 → 60 lines · `context.ts` ~210 → 30 lines · `hooks.ts` 42 → 0 lines.

---

## The principle

> Host changes: zero. Context changes: zero. Extension is additive.

The registry stays generic. The host stays small. We populate `CapabilityRegistry` only with what the current plugin needs — the mechanism for adding new entries is one line plus a consumer, and nothing upstream changes.
