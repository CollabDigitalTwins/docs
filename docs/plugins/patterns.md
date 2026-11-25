---
title: Patterns
description: How a plugin spans several surfaces, shares state between them, works with the viewers, and what changes when it is mounted rather than compiled into core.
sidebar_position: 5
---

# Patterns

Most useful plugins are not a single button. The examples here come from `hello-map` and `hello-bim`, which ship with CDT (`src/core/plugins/`), and from a mounted plugin that classifies IFC spaces. Both examples are off by default: add one on the **Plugins** page to try it.

`hello-map` puts one set of markers in six places: a map tool that records a marker, a map layer that draws them, a legend, a sidebar tab in both viewers, a data page and a detail dialog. A marker recorded on the map is already listed in the tab after switching to the BIM viewer.

## One plugin, several surfaces

One manifest, one `activate()`, one `register` call per surface. `viewers` narrows the two that can appear in more than one viewer.

```ts
export function activate(ctx: PluginContext): void {
  ctx.register('map.tools', { id: 'hello-map', label: 'Hello Map', icon: 'MapPinPlus', component: MapTool, stayActive: true })
  ctx.register('map.layers', { id: 'markers', component: MarkersLayer })
  ctx.register('viewer.legends', { id: 'markers', title: 'Markers', viewers: [ViewerNames.map], useLegend: useMarkersLegend })
  ctx.register('viewer.tabs', { id: 'markers', labelKey: 'tabTitle', icon: 'MapPin', viewers: [ViewerNames.map, ViewerNames.bim], component: MarkersTab })
  ctx.register('data.pages', { id: 'markers', titleKey: 'pageTitle', icon: 'MapPinned', useRows: useMarkerRows, columns: markerColumns, emptyKey: 'empty', searchKeys: ['name'] })
  ctx.register('ui.dialogs', { id: 'detail', titleKey: 'dialogTitle', size: 'md', component: MarkerDialog })
}
```

Ids only have to be unique per capability, so `markers` can appear four times. Anything drawn on the map lives in `map.layers`, because a toolbar panel unmounts when its dropdown closes.

## One hook shared by every surface

The surfaces render in unrelated parts of the React tree, so state cannot be lifted and props cannot be passed between them. Instead, one hook owns the data and every surface imports it:

```ts
export function useMarkers() {
  const store = usePluginStore<MarkerData>('markers')
  const [selectedKey, setSelectedKey] = usePluginState<string | null>('selected', null)
  const markers = React.useMemo(() => store.items.map(item => ({ key: item.key, ...item.data })), [store.items])

  const add = async (latitude: number, longitude: number) => {
    const key = nextKey()
    await store.put(key, { name: `Marker ${store.items.length + 1}`, latitude, longitude })
    setSelectedKey(key)
  }

  return { markers, selected: markers.find(marker => marker.key === selectedKey) ?? null, select: setSelectedKey, add }
}
```

**Records go in the store, a selection does not.** Markers survive a reload and the whole organization sees them; the selection costs nothing and starts clean. See [State](./sdk-modules.md#state).

Catch a failed `store.put` and show it. A write rejected on permissions otherwise looks like a dead button.

### Two quick edits to one record

`put` replaces a record whole, and `items` lags the write that caused it, so a second edit made before the first lands overwrites it. Merge against your own pending copy:

```ts
const written = React.useRef(new Map<string, ItemRecord>())

const edit = async (key: string, changes: Partial<ItemRecord>) => {
  const next = { ...(written.current.get(key) ?? records.get(key)), ...changes }
  written.current.set(key, next)
  await store.put(key, next)
}
```

## Dialogs connect the rest

A dialog is not tied to a place, so any surface can open it, and it outlives the surface that opened it:

```ts
const { open } = usePluginDialogs()
open('detail', { markerKey: selected.key })                          // from the tab
return { rows, onRowClick: row => open('detail', { markerKey: row.key }) }   // from the data page
```

## Loading remote data

Several surfaces mount together, so load each remote resource once per session and share the in-flight promise. Never abort a fetch from an effect cleanup whose dependencies include the loading status: the abort resets the status, the effect runs again, and the tab freezes while hammering the server. Treat an error as final and offer a retry button rather than retrying from the effect.

## Only the toolbars hold the viewer

Only `map.tools`, `bim.tools` and `map.layers` are handed a viewer. A `viewer.tabs` component gets no props; `data.pages`, `ui.dialogs` and `viewer.legends` contribute hooks. A plugin compiled into core can call `useBimViewer()` anywhere, but a mounted plugin cannot.

So do viewer work in the toolbar component, publish the result with `usePluginState`, and have other surfaces read it. A surface that wants the viewer to act leaves a request for the toolbar to carry out in an effect:

```ts
interface ViewerCommand {
  action: 'select' | 'isolate' | 'showAll'
  key: string | null
  nonce: number
}
```

The `nonce` makes asking twice for the same target happen twice. A toolbar panel acts only while it is mounted, so either register it with `stayActive: true`, or have it set a flag in plugin state while mounted and let the other surfaces disable the affected controls.

The same goes for the open building: **only `bim.tools` receives `buildingId`.** Stamp it on every record the tool writes, and publish it with `usePluginState` for a tab or legend that should follow it.

## Working with a BIM model

### Reading

```tsx
const modelKey = modelIds.join(',')

React.useEffect(() => {
  let cancelled = false
  async function load() {
    const found = await getItemsOfCategory('IFCSPACE')
    const properties = await getProperties(found, ['Name', 'LongName'])
    if (!cancelled) setSpaces(toSpaces(found, properties))
  }
  void load()
  return () => { cancelled = true }
}, [modelKey, getItemsOfCategory, getProperties])
```

- **`cancelled`** stops a slow read from overwriting fresh results or setting state after unmount.
- **`modelKey`, not `modelIds`**, in the dependencies: the array is rebuilt on every store update.
- `'LongName'` is where most authoring tools put the room name.

`getProperties` reaches attributes only. The durable IFC `GlobalId`, quantities such as floor area, and spatial containment come from the raw `fragments` handle on the same props:

```ts
const model = fragments.list.get(modelId)
const guids = await model.getGuidsByLocalIds(localIds)
const data = await model.getItemsData(localIds, {
  attributesDefault: true,
  relations: {
    IsDefinedBy: { attributes: true, relations: true },
    Decomposes: { attributes: true, relations: false },
  },
})
```

Store records against the `GlobalId`: a `localId` only means something while the model is open. Quantities nest differently in IFC2X3 and IFC4, and many exports have none, so walk them defensively and treat a missing value as normal. Type-only imports of `@thatopen/components` are fine; a runtime import fails the build.

### Showing, colouring and framing

IFC spaces start hidden, so make them visible before painting them. A `bim.tools` component gets colouring as `appearance` on its props:

```tsx
await setItemsVisible(items, true)
appearance.setAppearance(spaces.map(space => ({ items: space.items, appearance: { color: space.colour } })))

await select({ [space.modelId]: new Set([space.localId]) })
await fitToSelection()
```

Pass every group in one call, from an effect, so a changed colour repaints. See [Colouring elements](./all-capabilities.md#colouring-elements). `selection` is live: it follows clicks in the viewport and the sidebar tree, so a list can highlight the current item without tracking clicks.

The model is never written to. Renaming a space is an annotation the plugin stores and shows in its own surfaces.

## Translations

Every surface shares the manifest's `messages` block. Inside components, `usePluginTranslations()` takes an inline fallback: `t('empty', 'No markers yet.')`.

A **mounted** plugin's `titleKey`, `labelKey` and `emptyKey` never resolve: the catalog is built from manifests compiled into the platform. Write those three as English prose (`titleKey: 'Inventory'`) so the fallback reads correctly.

## Typing data page rows

A `data.pages` row is `Record<string, unknown>`, so a typed row cannot cross the registration under `strict: true`. Build rows with your own type and narrow inside each column:

```tsx
export const columns: DataPageColumn<Record<string, unknown>>[] = [
  { key: 'area', labelKey: 'Area', render: row => format(typeof row.area === 'number' ? row.area : null) },
]
```

## Mounted or compiled into core

Everything above works for a mounted plugin. Two things do not, and they are the signal to submit the plugin to core as a pull request:

- **A module outside the [published import list](./mounting-a-plugin.md#what-a-plugin-can-import).**
- **Translated registration titles**, since a mounted plugin's message keys cannot resolve.
