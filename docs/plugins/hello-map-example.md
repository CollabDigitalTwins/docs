---
title: 'Example: one plugin, several surfaces'
description: How hello-map contributes six surfaces over one set of data, and how hello-bim reads and paints a BIM model.
sidebar_position: 5
category: plugins
status: draft
last_updated: 2026-08-17
---

# Example: one plugin, several surfaces

Most useful plugins are not a single button. `hello-map` ships with CDT and puts the same set of markers in six places at once:

- a **map tool** showing the centre and zoom, with a button that records a marker there
- a **map layer** drawing the markers, so they survive the toolbar panel closing
- a **legend** with a row per colour in use and a live count
- a **sidebar tab** in the map and BIM viewers: add, select, rename, recolour, delete
- a **page** in the Datasets nav listing them all
- a **dialog** opened from the tab, from a page row, or by clicking a marker on the map

A marker recorded on the map is already listed in the tab after switching to the BIM viewer. Renaming it there updates the legend, the map and the page.

The source is at `src/core/plugins/hello-map/`.

## Declaring the surfaces

One manifest, one `activate()`. Each `register` call names its own surface, and `viewers` narrows the two that can appear in more than one.

```ts
import { ViewerNames } from '@collabdt/core/plugins-sdk'

export function activate(ctx: PluginContext): void {
  ctx.register('map.tools', {
    id: 'hello-map', label: 'Hello Map', icon: 'MapPinPlus', component: MapTool, stayActive: true,
  })

  // Separate from the tool, whose panel unmounts when its dropdown closes.
  ctx.register('map.layers', { id: 'markers', component: MarkersLayer })

  ctx.register('viewer.legends', {
    id: 'markers', title: 'Markers',
    viewers: [ViewerNames.map],                    // a list of map markers means nothing in BIM
    useLegend: useMarkersLegend,
  })

  ctx.register('viewer.tabs', {
    id: 'markers', labelKey: 'tabTitle', icon: 'MapPin',
    viewers: [ViewerNames.map, ViewerNames.bim],   // recorded on the map, read in BIM
    component: MarkersTab,
  })

  ctx.register('data.pages', {
    id: 'markers', titleKey: 'pageTitle', icon: 'MapPinned',
    useRows: useMarkerRows, columns: markerColumns, emptyKey: 'empty', searchKeys: ['name'],
  })

  ctx.register('ui.dialogs', {
    id: 'detail', titleKey: 'dialogTitle', size: 'md', component: MarkerDialog,
  })
}
```

`markers` appears four times without conflict: ids only have to be unique within a plugin, per capability.

## Sharing state between surfaces

The surfaces render in unrelated parts of the app's React tree. A toolbar panel, the map canvas, a sidebar tab, a full page and a modal have no common ancestor below the plugin host, so state cannot be lifted up and props cannot be passed between them.

The answer is **one hook** that owns everything, imported by every surface.

```ts
// markers.ts
export function useMarkers() {
  const store = usePluginStore<MarkerData>('markers')
  const [selectedKey, setSelectedKey] = usePluginState<string | null>('selected', null)

  const markers = React.useMemo(
    () => store.items.map(item => ({ key: item.key, ...item.data })),
    [store.items],
  )

  const add = async (latitude: number, longitude: number, zoom: number) => {
    const key = nextKey()
    await store.put(key, { name: `Marker ${store.items.length + 1}`, latitude, longitude, zoom, colour: stringToColour(key) })
    setSelectedKey(key)
  }

  return {
    markers,
    selected: markers.find(marker => marker.key === selectedKey) ?? null,
    select: setSelectedKey,
    add,
  }
}
```

The map tool calls `add()`. The layer, the legend, the tab, the page and the dialog all call `useMarkers()` and re-render. Nothing is passed between them.

The split is the part to copy: **markers are records, a selection is not.** `usePluginStore` writes to the database, so markers survive a reload and everyone in the organization sees them. `usePluginState` is in-memory, so the current selection and the open popup cost nothing and start clean when the plugin is enabled again. See [Where to keep state](./all-capabilities.md#where-to-keep-state).

Writes should be wrapped so that a rejected save is visible. A `store.put` that fails on permissions is otherwise indistinguishable from a dead button:

```ts
try {
  await store.put(key, data)
  setLastError(null)
} catch (error) {
  setLastError(error instanceof Error ? error.message : String(error))
}
```

## Dialogs connect the rest

A dialog is the one surface not tied to a place, which makes it the natural target for the others:

```ts
// from the sidebar tab
const { open } = usePluginDialogs()
<Button onClick={() => open('detail', { markerKey: selected.key })}>Open</Button>

// from a row on the data page
return { rows, onRowClick: row => open('detail', { markerKey: row.key }) }
```

Because CDT owns the dialog stack, a dialog survives the surface that opened it. One opened from the map tool's dropdown remains when the dropdown closes.

## Translations

Every surface shares one namespace. A `messages` block in the manifest resolves each `titleKey`, `labelKey` and `t()` call:

```json
"messages": {
  "en": { "tabTitle": "Markers", "pageTitle": "Markers", "dialogTitle": "Marker" },
  "fr": { "tabTitle": "Repères", "pageTitle": "Repères", "dialogTitle": "Repère" }
}
```

Keys CDT resolves fall back to the literal string when there is no catalog entry. Inside components, `usePluginTranslations()` takes an inline fallback: `t('empty', 'No markers yet.')`.

## Working with a BIM model

`hello-bim`, at `src/core/plugins/hello-bim/`, does the same across four surfaces in the BIM viewer: a tool panel, a sidebar tab, a legend and a dialog. It lists the spaces in a model, colours them, and renames them.

### Reading the model

```tsx
const modelKey = modelIds.join(',')

React.useEffect(() => {
  let cancelled = false

  async function load() {
    const found = await getItemsOfCategory(category)
    // 'Name' is the label; 'LongName' is where most authoring tools put the room name.
    const properties = await getProperties(found, ['Name', 'LongName'])
    if (cancelled) return
    setSpaces(toSpaces(found, properties))
  }

  void load()
  return () => { cancelled = true }
}, [modelKey, category, getItemsOfCategory, getProperties])
```

Two details to note:

- **The `cancelled` flag.** Model reads are asynchronous and the viewer can change mid-read, which otherwise means setting state on an unmounted component, or overwriting fresh results with stale ones.
- **`modelKey` rather than `modelIds` in the dependency list.** The array is rebuilt on every store update, so depending on it directly re-runs the query constantly.

### Showing, colouring and framing

IFC spaces start hidden, so they must be made visible before being painted:

```tsx
await setItemsVisible(items, true)

setAppearance(spaces.map(space => ({ items: space.items, appearance: { color: space.colour } })))
```

Pass every group in one `setAppearance` call, from an effect rather than a click handler, so that changing a colour repaints immediately. [Colouring elements](./all-capabilities.md#colouring-elements) has the details.

Framing one space:

```tsx
await select({ [space.modelId]: new Set([space.localId]) })
await fitToSelection()
```

`selection` is live. It updates when someone clicks in the viewport or uses a sidebar tree, not only when the plugin selects something — so a list can highlight the current space without tracking clicks itself.

### The model is never written to

Fragments are read-only geometry, so renaming a space is an annotation the plugin stores in `usePluginStore` and displays in its own surfaces. The model keeps its own name, and the dialog shows both.

That is the pattern for anything decorating a model it does not own: annotations as records, the current selection as session state.

## Running the examples

Both plugins are compiled into CDT and switched off by default. Open **Plugins**, add one to an organization, then open the map or the BIM viewer with a model loaded.
