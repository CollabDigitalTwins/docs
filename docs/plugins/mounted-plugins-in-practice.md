---
title: Mounted plugins in practice
description: What a runtime-loaded plugin can and cannot reach, and the patterns that work around each limit.
sidebar_position: 6
---

# Mounted plugins in practice

[The previous example](./hello-map-example.md) is compiled into CDT. A **mounted** plugin, built to a `dist/index.js` and loaded at runtime as described in [Run your plugin](./mounting-a-plugin.md), is how a plugin written outside the core repository arrives, and it is the only route available to a self-hosted deployment.

A mounted plugin resolves a fixed list of imports, receives viewer handles only where the platform passes them as props, and never joins the message catalog. Everything on this page follows from those three facts, and none of it applies to a plugin compiled into core.

The examples come from a plugin that classifies IFC spaces across seven surfaces, but the constraints are the same whatever a mounted plugin does.

## Only one surface receives the viewer

Contributions are not equal. A `bim.tools` component is handed [`BimToolProps`](./all-capabilities.md#toolbar-tools); a `viewer.tabs` component is handed **nothing at all**, and `data.pages`, `ui.dialogs` and `viewer.legends` contribute hooks rather than components. A compiled-in plugin can call `useBimViewer()` from any of them; a mounted plugin cannot, because that module is not among the entries CDT publishes.

So do the work in the one place that holds the handles, and publish the result to the rest:

```tsx
// bim.tools — the only surface holding the handles
export function ScanTool(props: ToolbarToolProps & BimToolProps) {
  const { items } = useModelScan(props)   // scans once, writes to usePluginState
  ...
}

// viewer.tabs — no props at all, reads what the tool published
export function ResultsTab() {
  const [items] = usePluginState<Item[]>('items', [])
  ...
}
```

Requests travel the same way. A surface without handles cannot select, frame or hide anything itself, so it leaves a request for the one that can:

```ts
export interface ViewerCommand {
  action: 'select' | 'isolate' | 'showAll'
  key: string | null
  nonce: number        // asking twice for the same target has to happen twice
}
```

and the toolbar component carries it out in an effect keyed on the nonce.

:::caution The toolbar panel is not always mounted
CDT renders a toolbar contribution inside a dropdown, which unmounts its children when it closes. A request left by another surface is therefore only acted on while that panel is open. Say so in the interface rather than appearing to do nothing: have the tool claim a flag in plugin state while it is mounted, and have the other surfaces disable the affected controls and explain why when the flag is false.
:::

## Reaching past the SDK with the handles you are given

The props a viewer surface receives carry more than the SDK wraps. `getProperties` forwards attributes and nothing else, which leaves out three things a model-reading plugin usually needs: a durable IFC `GlobalId` (the `Guid` in an attributes read is a numeric index local to the model, not the 22-character identifier), quantities such as floor area, and spatial containment. All of them are reachable through the raw `fragments` handle on the same props:

```tsx
const model = fragments.list.get(modelId)

// A localId is only meaningful while the model is open; store records against the GUID.
const guids = await model.getGuidsByLocalIds(localIds)

const data = await model.getItemsData(localIds, {
  attributesDefault: true,
  relations: {
    IsDefinedBy: { attributes: true, relations: true },   // quantities and property sets
    Decomposes: { attributes: true, relations: false },   // the storey
  },
})
```

`@thatopen/components` may be imported for its **types**: type imports erase, so the built bundle still imports nothing outside the published list. Importing it as a runtime value is a build error, and rightly so.

The shapes that come back are not stable across IFC versions. A quantity sits at a different depth in IFC2X3 than in IFC4, so walk them defensively, with a depth cap, and treat a missing value as a normal model rather than a failure. Plenty of real exports carry no quantities at all.

`getItemsOfCategory('IFCSPACE')` finds spaces whether or not they are visible, and they are hidden by default, so anything acting on one calls `setItemsVisible(items, true)` first.

## Keeping a record in step with itself

`usePluginStore.put` replaces a record whole, and `items` lags the write that caused it. Two edits to the same record in quick succession therefore lose the first, because the second merges onto a snapshot taken before the first landed.

Merge against your own pending copy as well as the store:

```ts
const written = React.useRef(new Map<string, ItemRecord>())

const edit = async (key: string, changes: Partial<ItemRecord>) => {
  const current = written.current.get(key) ?? records.get(key)
  const next = { ...current, ...changes }

  written.current.set(key, next)   // before the await, so the next edit sees it
  await store.put(key, next)
}
```

Any plugin storing more than one field per record wants this.

## Reading platform data

The data hooks work exactly as they do for a compiled-in plugin, which is what `@collabdt/core/plugins-sdk/data` is for:

```tsx
const { buildings } = useBuildings()
const building = buildings.find(candidate => candidate.id === record.buildingId)
```

That id has to be *put* there by someone. **Only a `bim.tools` component is told which building the open models belong to**, as `buildingId` on its props. Stamp it onto every record the tool writes, so the surfaces that run with no model open, a data page say, still know where each record belongs, and publish it with `usePluginState` for a tab or legend that should follow the open building:

```tsx
export function PlannerTool({ buildingId }: ToolbarToolProps & BimToolProps) {
  const [, setOpenBuilding] = usePluginState<number | null>('openBuildingId', null)
  React.useEffect(() => { setOpenBuilding(buildingId) }, [buildingId, setOpenBuilding])
  ...
}
```

## Message keys always fall back

`titleKey`, `labelKey` and `emptyKey` resolve against the plugin's own message namespace and fall back to the key itself. For a **mounted** plugin they always fall back today: the catalog is assembled from the manifests compiled into the build, and a mounted manifest arrives too late to join it.

Write those three as English prose rather than as keys, so an unresolved lookup still reads correctly:

```ts
ctx.register('data.pages', {
  id: 'items',
  titleKey: 'Inventory',                 // renders as written
  columns: [{ key: 'name', labelKey: 'Name' }],
  emptyKey: 'Nothing recorded yet.',
})
```

Strings inside components are unaffected: `usePluginTranslations()` takes an inline English fallback at each call, which is why every example passes one.

## A data page row is a bag of unknowns

`CapabilityRegistry` pins a `data.pages` row to `Record<string, unknown>`, so a typed row cannot cross the registration under `strict: true`, which is what the scaffolder emits. Build the rows with a type of your own and narrow inside each column:

```tsx
export function useRows(): DataPageRows<Record<string, unknown>> {
  const rows = React.useMemo<Row[]>(() => /* … */, [])
  return { rows, onRowClick: row => typeof row.key === 'string' && open(row.key) }
}

export const columns: DataPageColumn<Record<string, unknown>>[] = [
  { key: 'area', labelKey: 'Area', render: row => format(typeof row.area === 'number' ? row.area : null) },
]
```

## Colouring from a mounted plugin

`usePluginBimAppearance` is not among the entries the CDT platform publishes to a mounted plugin, but its two functions are: a `bim.tools` component gets them as `appearance` on its props, scoped to the plugin like the hook.

```tsx
export function PaintTool({ appearance }: ToolbarToolProps & BimToolProps) {
  React.useEffect(() => {
    appearance.setAppearance(spaces.map(space => ({ items: space.items, appearance: { color: space.colour } })))
  }, [appearance, spaces])
  ...
}
```

The rules in [Colouring elements](./all-capabilities.md#colouring-elements) apply unchanged: one call with every group, from an effect, after `setItemsVisible(items, true)`. A tab or dialog that should change the colours leaves a request in plugin state for the tool to carry out, like any other viewer work.

## When mounting is the wrong answer

Most of the limits above have a workaround. Two do not, and they are the signal to submit the plugin to core as a pull request instead:

- **Anything outside the published import list.** The workarounds reach around core rather than through it, and they can conflict with it.
- **Translated interface text.** A mounted plugin's message keys cannot resolve, so it ships in one language.

Everything else on this page a mounted plugin can do for itself today.
