---
title: Capabilities
description: What a plugin can contribute to CDT, the props each contribution receives, and what is planned but not yet rendered.
sidebar_position: 4
category: plugins
status: draft
last_updated: 2026-08-06
---

# Capabilities

A capability is a place in CDT where a plugin can contribute something. Your plugin declares the ones it uses in its manifest, and calls `ctx.register()` once per contribution.

A capability exists in `VALID_CAPABILITIES` **if and only if core renders it.** Declaring one with no consumer is worse than not having it: the plugin registers successfully, nothing appears, and there is nothing to debug. Capabilities that are planned but not yet wired are listed at the bottom, and registering one is a compile error rather than a silent no-op.

## Supported today

| Capability | Where it appears | Required fields |
|---|---|---|
| `map.tools` | Map toolbar | `id`, `label`, `icon`, `component` |
| `bim.tools` | BIM toolbar | `id`, `label`, `icon`, `component` |
| `pointcloud.tools` | Point-cloud toolbar | `id`, `label`, `icon`, `component` |
| `map.legends` | Shared legend card, bottom-left of the map | `id`, `title`, `useLegend` |
| `sidebar.items` | Sidebar navigation | `id`, `label`, `icon`, `component` |
| `viewer.panels` | Viewer side panel | `id`, `label`, `icon`, `component`, optional `viewers` |

:::caution `sidebar.items` and `viewer.panels`
These two are declared and accepted, but core does not render them yet. They are kept because their shape is settled and a plugin can be written against them, but nothing will appear until the host components land. Use a `.tools` capability if you need something visible today.
:::

## Toolbar capabilities

All three toolbars share one registration shape. Core wraps what you register in the standard toolbar button and dropdown, built from the `label` and `icon` you declared — **you write the panel content, not the chrome.** A plugin that renders its own floating card would end up inside the toolbar strip.

```ts
ctx.register('bim.tools', {
  id: 'spaces',
  label: 'Spaces',
  icon: 'Boxes',            // a lucide icon name, or a component
  component: SpacesPanel,
  stayActive: true,         // optional: keep the panel open
})
```

`icon` may be a lucide icon name as a string — which is what survives a JSON manifest — or a component. An unknown name falls back to a placeholder icon rather than breaking the toolbar.

### What your component receives

Each toolbar passes the viewer it belongs to, as props. The types are bound per capability, so registering a component that expects the BIM viewer under `map.tools` is a compile error.

```ts
// map.tools
interface MapToolProps {
  map: import('maplibre-gl').Map | null
}

// pointcloud.tools
interface PointCloudToolProps {
  viewer: unknown   // Potree ships no types; narrow it yourself
  ready: boolean
}

// bim.tools
interface BimToolProps {
  components: OBC.Components | null
  world: OBC.World | null
  fragments: OBC.FragmentsManager | null
  modelIds: string[]

  selection: ModelIdMap              // live; updates as the user clicks
  select: (items: ModelIdMap) => Promise<void>
  clearSelection: () => void
  fitToSelection: () => Promise<void>

  isolate: (items: ModelIdMap) => Promise<void>
  setItemsVisible: (items: ModelIdMap, visible: boolean) => Promise<void>
  showAll: () => Promise<void>

  getItemsOfCategory: (category: string) => Promise<ModelIdMap>
  getProperties: (items: ModelIdMap, attributes?: string[]) => Promise<BimItemProperties[]>
}
```

Every handle is nullable: your component can render before the viewer has finished initialising. Guard rather than assert.

:::tip Spaces are hidden by default
`getItemsOfCategory('IFCSPACE')` returns the spaces in the model, but IFC spaces start hidden — they are volumetric and would obscure everything inside them. Listing them is not the same as showing them; call `setItemsVisible(spaces, true)` as well. See [hello-bim](./hello-bim-example.md).
:::

Colour and opacity overrides are deliberately not exposed. Core routes those through a component that buckets them into one material definition per appearance; per-element painting would exhaust the model's material slots. Use `select` and `isolate` to draw attention to elements instead.

## Map legends

`map.legends` contributes a section to the single shared legend card, rather than a floating box of its own. You supply a hook so the legend can re-read live counts:

```ts
ctx.register('map.legends', {
  id: 'my-legend',
  title: 'Sensors',
  useLegend: () => ({
    active: true,               // false: the host omits your section entirely
    rows: [{ label: 'Warm', color: '#ef9161', count: 12 }],
  }),
})
```

## One plugin, several contributions

A plugin is not limited to one contribution. `activate()` may call `ctx.register()` as many times as it needs, and contributions accumulate per capability:

- **Several entries under one capability.** Two `map.tools` registrations give two toolbar buttons, each with its own component and its own panel.
- **Several capabilities at once.** One plugin can contribute a map tool, a BIM tool and a map legend.

```ts
// manifest.json: "capabilities": ["map.tools", "map.legends"]
export function activate(ctx: PluginContext): void {
  ctx.register('map.tools', { id: 'rooms-inspect', label: 'Inspect', icon: 'Search', component: InspectTool })
  ctx.register('map.tools', { id: 'rooms-measure', label: 'Measure', icon: 'Ruler', component: MeasureTool })
  ctx.register('map.legends', { id: 'rooms-legend', title: 'Rooms', useLegend })
}
```

Two rules apply:

- **Every capability you register must appear in `manifest.capabilities`.** Registering an undeclared capability throws, and the platform then removes every contribution that plugin made and marks it errored. Activation is all-or-nothing on purpose: a half-registered plugin is harder to diagnose than one that refused to load.
- **Each entry needs an `id` unique within the plugin.** Contributions are de-duplicated by plugin and id, so reusing an id silently drops the second registration.

The single-file build output is a property of how a plugin is delivered, not a limit on how it is written. Source can span as many files and components as you like. The one thing it does rule out is lazy-loading part of your own plugin: the platform serves exactly one file per plugin, so a code-split chunk would not resolve.

## Planned, not yet available

These are not in `VALID_CAPABILITIES`, and registering one throws:

| Capability | Why it is not here |
|---|---|
| `map.layers` | No consumer yet. |
| `data.collections`, `data.columns` | No consumer yet. |
| `commands`, `widgets` | No consumer yet. |
| `jobs` | Needs server-side execution, which a browser-loaded plugin bundle cannot provide at all. Belongs to a separate server-plugin design. |

## Adding a capability

Add one entry to `VALID_CAPABILITIES` in `sdk/types.ts`, define its registration interface, add it to `CapabilityRegistry`, and **add a consumer that reads it**. A compile-time check keeps the two lists in sync; the consumer is what stops it being a capability that registers into a void.
