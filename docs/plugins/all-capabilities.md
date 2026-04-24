---
title: All 11 capabilities
description: The full capability table — what each extends, required fields, and the props each component receives.
sidebar_position: 4
category: plugins
status: draft
last_updated: 2026-04-24
---

# All 11 capabilities

Declare the capability keys you need in `manifest.json`. Call `ctx.register()` with the matching shape.

| Capability | Extends | Required fields |
|------------|---------|-----------------|
| `map.tools` | Map toolbar | `id`, `label`, `icon`, `component` |
| `sidebar.items` | Sidebar navigation | `id`, `label`, `icon`, `component` |
| `viewer.panels` | 3D viewer overlay | `id`, `label`, `icon`, `component` |
| `bim.tools` | BIM toolbar | `id`, `label`, `icon`, `component` |
| `pointcloud.tools` | Point cloud toolbar | `id`, `label`, `icon`, `component` |
| `map.layers` | Map layer list | `id`, `label` |
| `data.collections` | Data menu | `id`, `label`, `listComponent` |
| `data.columns` | Table column definitions | `id`, `target` |
| `jobs` | Background job scheduler | `id`, `cron`, `handler` |
| `commands` | Named command bus | `id`, `handler` |
| `widgets` | Dashboard widget panel | `id`, `label`, `component` |

## Toolbar components receive `MapToolProps`

Applies to `map.tools`, `bim.tools`, and `pointcloud.tools`:

```ts
interface MapToolProps {
  map: import('maplibre-gl').Map | null
}
```

**Sidebar, viewer, and widget components** receive no props from the framework — manage their own data via React context or props passed through your own component tree.

:::note Adding a new capability in the future
Add one entry to `VALID_CAPABILITIES` in `sdk/types.ts`, define its registration interface, and add it to `CapabilityRegistry`. A compile-time parity check in `types.ts` will catch any mismatch between the two lists.
:::
