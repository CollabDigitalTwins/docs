---
title: Capabilities
description: Everything a CDT plugin can add, the fields each registration needs, and the props each contribution receives.
sidebar_position: 3
---

# Capabilities

A capability is a place in CDT where a plugin can add something. A plugin declares the capabilities it uses in its manifest, then calls `ctx.register()` once per contribution.

These eight are the whole list. Registering anything else is a compile error, and registering a capability that is not declared in the manifest throws.

| Capability | Where it appears | Fields |
|---|---|---|
| `map.tools` | Map toolbar | `id`, `label`, `icon`, `component` |
| `bim.tools` | BIM toolbar | `id`, `label`, `icon`, `component` |
| `map.layers` | Drawn on the map | `id`, `component` |
| `map.datasets` | Datasets menu, under Organizational or Live Data | `id`, `name`, optional `live`, `source`, `description`, `publisher`, `information` |
| `viewer.legends` | Legend card, map and BIM viewer | `id`, `title`, `useLegend`, optional `viewers` |
| `viewer.tabs` | Viewer sidebar, as a tab | `id`, `labelKey`, `icon`, `component`, optional `viewers` |
| `data.pages` | Datasets nav, as a full page | `id`, `titleKey`, `icon`, then `useRows` and `columns`, or `component` |
| `ui.dialogs` | Anywhere, opened by id | `id`, `titleKey`, `component`, optional `size` |

Each `id` must be unique within the plugin. Reusing one silently drops the second registration.

## Toolbar tools

The two toolbars share one registration shape. The plugin supplies the panel content; CDT supplies the button and the dropdown around it.

```ts
ctx.register('bim.tools', {
  id: 'spaces',
  label: 'Spaces',
  icon: 'Boxes',            // a lucide icon name, or a component
  component: SpacesPanel,
  stayActive: true,         // optional: keep the panel open
})
```

Naming the icon as a string is what survives a JSON manifest, and it means no icon package is ever imported. An unknown name falls back to a placeholder rather than breaking the toolbar.

Each toolbar passes its own viewer to the component as props:

```ts
// map.tools
interface MapToolProps {
  map: import('maplibre-gl').Map | null
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

  buildingId: number | null          // the building whose models are open
  floorplan: PluginFloorplan         // storeys, plan sketching and plan overlays
  appearance: PluginBimAppearance    // element colours
  modelPlacement: PluginModelPlacement  // follow models the user moves or turns
}
```

`ModelIdMap` is `{ [modelId]: Set<localId> }`, keyed by model, because more than one can be loaded at once.

Every handle is nullable, since a component can render before the viewer has finished initialising. Guard rather than assert.

`getItemsOfCategory('IFCSPACE')` finds spaces whether or not they are visible, and they are hidden by default, being volumetric solids that would obscure everything inside them. Anything acting on one calls `setItemsVisible(spaces, true)` as well.

`buildingId` is `null` until a building is chosen. It is how a plugin learns which building the open models belong to, so a tool that keeps records per building stamps it on each one, and publishes it with `usePluginState` for the surfaces that are not handed it.

`floorplan` and `appearance` are bound to the calling plugin: its overlay and its paint are its own, and clearing them never touches another plugin's. See [Colouring elements](#colouring-elements) and [Floorplans](#floorplans).

## Colouring elements

A `bim.tools` component colours elements through `appearance` on its props. A plugin compiled into core can also paint from a sidebar tab or a dialog with the `usePluginBimAppearance()` hook, which returns the same two functions; the hook is not among the entries the CDT platform publishes to a mounted plugin, see [What a plugin can import](./mounting-a-plugin.md#what-a-plugin-can-import).

```tsx
const { setAppearance, clearAppearance } = props.appearance

// Colour is 0xRRGGBB, opacity is 0-1, and either may be omitted.
setAppearance(spaces.map(space => ({
  items: space.items,
  appearance: { color: space.colour },
})))

clearAppearance()   // back to the model's own colours
```

**Pass every group in one call, not one call per group.** A plugin holds a single paint entry, so calling `setAppearance` in a loop replaces the previous group each time and leaves only the last one painted. Twenty spaces in twenty colours is one call with twenty groups. An empty list clears the paint.

**Paint from an effect rather than a click handler** where the colours can change. A re-render with new colours then repaints, and the model follows the list instead of waiting for another button press.

Painting a hidden element colours something that is not visible, so call `setItemsVisible(items, true)` first.

Paint is scoped per plugin, so two plugins painting the same model do not clobber one another and either can be cleared alone.

Paint is a change to the model, not to the component, so it outlives the panel that applied it. A tool registered with `stayActive: true` lives as long as the toolbar and can clear its paint in an unmount cleanup. Without `stayActive` the panel unmounts whenever its dropdown closes, so leave the paint in place and give the user a way to turn it off.

## Floorplans

`floorplan` on `BimToolProps` is the BIM viewer's 2D plans as a plugin sees them: which storeys have one, which is open, a way to let the user draw on it, and a layer of the plugin's own shapes on top. Coordinates are world metres on the horizontal plane, as `PlanPoint { x, z }` with `x` east and `z` south.

```ts
interface PluginFloorplan {
  available: boolean                  // false in a viewer without floorplans; every method is then a no-op
  storeys: FloorplanStorey[]          // { id, name, elevation, modelId }
  active: FloorplanStorey | null      // the open plan, or null in 3D
  isDrawing: boolean
  isEditingShape: boolean             // editShape is waiting for the user
  hasLines: boolean                   // the open storey's vector lines exist
  activate: (storeyId: string) => Promise<void>
  deactivate: () => Promise<void>     // back to 3D
  generateLines: () => Promise<void>  // project the open storey's lines
  frame: (points: readonly PlanPoint[]) => Promise<void>   // fit the open plan to an outline
  drawShape: (kind: SketchKind) => Promise<PlanPoint[] | null>   // 'rectangle' | 'polygon'
  editShape: (points: readonly PlanPoint[]) => Promise<PlanPoint[] | null>
  finishEditingShape: () => void
  cancelDrawing: () => void           // ends a drawing or a shape edit
  setOverlay: (shapes: readonly PlanOverlayShape[], options?: PlanOverlayOptions) => void
  clearOverlay: () => void
  getSpaceFootprints: (items: ModelIdMap) => Promise<PlanFootprint[]>
}
```

`storeys`, `active`, `isDrawing`, `isEditingShape` and `hasLines` are live, so a storey picker or a disabled Draw button needs no state of its own.

**Lines.** Opening a storey shows the cut model from above. Its vector lines (walls, doors, slab edges) are a separate step, because projecting them is slow on a large model: call `generateLines()` once the plan is open, or after `activate` resolves. The plan reads far better with them, and drawing snaps to their corners, so a plugin that draws should generate them:

```tsx
const open = async (storeyId: string) => {
  await floorplan.activate(storeyId)
  await floorplan.generateLines()
}
```

**Drawing.** `drawShape` lets the user draw on the open plan and resolves with the outline. A rectangle takes two corner clicks; a polygon takes a click per corner and closes on Enter, a right-click, a double-click or a click on its first corner. Points snap to the corners (a small square) and edges (a diamond) of the plan's lines; holding Alt places a point exactly under the cursor. While drawing, left-click only places points: the user pans with middle-drag or Space+drag and zooms with the wheel, and Backspace removes the last corner. Escape or `cancelDrawing()` resolves it with `null`, as does a right-click before a polygon has three corners, or a call with no plan open:

```tsx
const draw = async (kind: SketchKind) => {
  const points = await floorplan.drawShape(kind)
  if (!points || !floorplan.active) return
  await store.put(newKey(), { storey: floorplan.active.name, polygon: points })
}
```

**Reshaping.** `editShape(points)` puts handles on an existing outline. The user drags a corner, or an edge to move both its ends, with the same snapping as drawing. Ctrl+click on an edge splits it with a new corner, and Ctrl+click on the plan adds one after the selected corner; Delete or Backspace removes the selected corner, down to three. Enter or `finishEditingShape()` resolves with the new outline, Escape or `cancelDrawing()` with `null`. A press away from the outline still pans. Hide the shape from your overlay while it is being edited, so only the handles show:

```tsx
const reshape = async (room: Room) => {
  const points = await floorplan.editShape(room.polygon)
  if (points) await store.put(room.key, { ...room, polygon: points })
}
```

**Overlay.** `setOverlay` replaces the plugin's shapes on the open plan. Each is a filled polygon, optionally outlined and labelled:

```ts
setOverlay(rooms.map(room => ({
  id: room.key,
  points: room.polygon,
  fill: 0x4f9d69,          // 0xRRGGBB
  opacity: 0.45,           // optional; 0.45 is the default
  stroke: 0x2b5a3a,        // optional
  label: room.name,        // optional
})))
```

Pass `{ onShapeClick }` as the second argument to make the shapes clickable: the shape under the pointer brightens, the cursor becomes a pointer, and a click calls it with that shape's `id`. A click that ends a pan is ignored, and so is any click while a drawing or shape edit is in progress.

```tsx
setOverlay(shapes, { onShapeClick: id => open('room', { roomKey: id }) })
```

When the shapes redraw IFC spaces, pass those elements as `replacesSpaces` (a `ModelIdMap`). The plan then hides its own room fill, X and name tag under them, so the room is not drawn twice, and shows them again once the overlay is replaced or cleared. An overlay with no shapes still hides them, which is how a plugin switches its rooms off without the IFC rooms showing through.

```tsx
setOverlay(shapes, { onShapeClick, replacesSpaces: { [modelId]: new Set(localIds) } })
```

The overlay is drawn on whichever plan is open, so filter the shapes by `floorplan.active` and set them from an effect that depends on it. Like paint, it outlives the component that set it; `clearOverlay()` removes it.

**Framing.** `frame(points)` fits the open plan's view to an outline with a margin around it, for a list row that takes the user to a room: open its storey with `activate`, then `frame` its outline.

**Space outlines.** `getSpaceFootprints(items)` reads each element's floor outline from its lowest flat face, so a plugin can draw a model's `IFCSPACE`s on the plan without walking geometry itself. Each `PlanFootprint` has `modelId`, `localId`, `outline`, `area` (m²), `centroid` and `elevation`; compare the elevation with each storey's to place it.

```ts
const spaces = await getItemsOfCategory('IFCSPACE')
const footprints = await floorplan.getSpaceFootprints(spaces)
```

The types are `PluginFloorplan`, `FloorplanStorey`, `PlanPoint`, `SketchKind`, `PlanOverlayShape` and `PlanFootprint`, all from `@collabdt/plugin-kit/types/bim`.

### Following a moved model

Outlines a plugin stores in world coordinates stay where they were when the user moves or turns the model under them. `modelPlacement.watch` keeps them attached: the platform calls `onPlacementChanged` after every confirmed move or turn, with a `mapPoint` that takes a plan point to where it now sits, the `elevationChange` in metres, and `rotated` when the model turned rather than only moved.

Before a turn, the platform asks each watcher for a `turnWarning`. When any returns text, the user sees it in a confirmation dialog and can keep the model where it is. Return `null` when none of the plugin's data sits on that model, and the turn goes ahead without asking.

```ts
React.useEffect(() => props.modelPlacement.watch({
  turnWarning: modelId => {
    const count = roomsOn(modelId).length
    return count === 0 ? null : `${count} rooms turn with the model.`
  },
  onPlacementChanged: async ({ modelId, mapPoint }) => {
    await Promise.all(roomsOn(modelId).map(room =>
      store.put(room.key, { ...room.data, polygon: room.data.polygon.map(mapPoint) })))
  },
}), [props.modelPlacement])
```

`watch` returns the function that stops watching, so returning it from the effect cleans up on unmount. Have `roomsOn` read the plugin's records through a ref rather than adding them to the effect's dependencies: every new dependency registers the watcher again. The types are `PluginModelPlacement`, `ModelPlacementWatcher` and `ModelPlacementChange`, from `@collabdt/plugin-kit/types/bim`.

## Legends

`viewer.legends` adds a section to the one shared legend card, which appears in both the map and the BIM viewer. `viewers` narrows a legend to where it makes sense. The registration takes a hook, so the legend can re-read live counts.

```ts
ctx.register('viewer.legends', {
  id: 'my-legend',
  title: 'Sensors',
  viewers: [ViewerNames.bim],   // omit to appear in every viewer
  useLegend: () => ({
    active: true,               // false: the section is left out entirely
    rows: [{ label: 'Warm', color: '#ef9161', count: 12 }],
  }),
})
```

On the map, legends stack inside the applied-layers card in the bottom-left corner. In the BIM viewer they have a card of their own.

A legend for one of the plugin's own `map.datasets` names it with `dataset`. It is then nested under that dataset's row in the applied-layers card, and the row's switch shows and hides the layer without removing it. Rows take an optional switch, and `controls` adds the plugin's own inputs under them:

```tsx
ctx.register('viewer.legends', {
  id: 'active-fires',
  title: 'Fires by size',
  viewers: ['map'],
  dataset: 'active-fires',
  useLegend: () => ({
    active: usePluginDataset('active-fires').applied,
    rows: [{
      label: 'Under 50 ha', color: '#9acd32', count: 40,
      visible: !hidden.includes(0),            // with onVisibleChange, the row gets a switch
      onVisibleChange: visible => toggleBand(0, visible),
    }],
    controls: <MonthSlider />,                 // rendered under the rows
  }),
})
```

A legend that returns `unavailable: true` while `active` shows a "Feed unavailable" banner over its last rows, and CDT raises one warning toast naming it, so a user knows the feed is down rather than seeing an empty map. Set it when your fetch fails or times out, and clear it on the next good response.

## Drawing on the map

`map.layers` registers a component CDT mounts for as long as the map exists. It renders `null`: everything it does goes through the map handle.

```ts
ctx.register('map.layers', { id: 'markers', component: MarkersLayer })
```

Use it rather than a `map.tools` panel whenever the drawing has to outlive the toolbar. **A tool's panel is a dropdown: it unmounts when it closes and takes its sources and layers with it.** Anything drawn from a sidebar tab or a data page has no panel at all.

```tsx
export function MarkersLayer({ map }: MapToolProps) {
  useEffect(() => {
    if (!map) return

    const ensureLayer = () => {
      if (!map.getStyle() || map.getSource(SOURCE)) return
      map.addSource(SOURCE, { type: 'geojson', data: featureCollection })
      map.addLayer({
        id: LAYER, type: 'circle', source: SOURCE,
        paint: { 'circle-color': ['get', 'colour'], 'circle-radius': 7 },
      })
    }

    if (map.isStyleLoaded()) ensureLayer()
    map.on('styledata', ensureLayer)
    map.on('click', LAYER, onFeatureClick)

    return () => {
      map.off('styledata', ensureLayer)
      map.off('click', LAYER, onFeatureClick)
      if (map.getLayer(LAYER)) map.removeLayer(LAYER)
      if (map.getSource(SOURCE)) map.removeSource(SOURCE)
    }
  }, [map])

  return null
}
```

Three common mistakes:

- **Re-add on `styledata`, not only once.** Switching the basemap replaces the style and silently drops every source and layer added before it.
- **Guard both cleanup calls.** The style can be torn down before cleanup runs, and removing a layer that is already gone throws. A source left behind makes the next mount fail on a duplicate id.
- **`maplibre-gl` cannot be imported as a runtime value,** so `new maplibregl.Marker()` and `new maplibregl.Popup()` are unavailable. The platform shims four packages this way — `three`, `@thatopen/components`, `maplibre-gl` and `lucide-react` — because a second copy of any of them breaks the viewer. Type-only imports are fine and expected. A GeoJSON source with a circle or symbol layer does the same job and pans and zooms on the GPU for free. A popup can be built by portalling an element into `map.getContainer()` and positioning it with `map.project()`.

Update features with `setData` rather than removing and re-adding the layer, or they flicker on every change.

For colours, `stringToColour(key)` and `MAP_COLOUR_PALETTE` are exported from `@collabdt/core/plugins-sdk`. They are the platform's colourblind-accessible palette, and `stringToColour` is deterministic, so the same key always produces the same colour.

## Datasets

`map.datasets` lists a dataset in the Datasets menu and the map sidebar's Layers tab. Users apply it, hide it and remove it like any other dataset. With `live: true` it is listed under **Live Data**; otherwise it is listed under **Organizational**, as data of the viewer's own organization.

```ts
ctx.register('map.datasets', {
  id: 'weather-radar',
  name: 'Live Weather Radar (Canada)',
  publisher: 'Environment and Climate Change Canada',
  live: true,
  source: { type: 'wms', baseUrl: 'https://geo.weather.gc.ca/geomet', layers: 'RADAR_1KM_RRAI', timeEnabled: true },
})
```

`source` says how CDT draws it:

| `source` | Drawn by |
|---|---|
| `{ type: 'wms', baseUrl, layers, timeEnabled? }` | CDT's WMS layer. `timeEnabled` nests a play button, time scrubber and the server's legend image under the dataset's row in the applied-layers card. |
| `{ type: 'geojson', getFeatures }` | CDT's GeoJSON layer, with its clustering, colouring and feature popups. `getFeatures` returns a FeatureCollection. |
| omitted | Nothing. The plugin draws it from its own `map.layers` component. |

A plugin that draws its own dataset asks whether it is on the map with `usePluginDataset(id)` from `@collabdt/core/plugins-sdk/data`, passing the registration's `id`. Its layer draws, and its legend sets `active`, only while `visible` is true:

```tsx
export function ActiveFiresLayer({ map }: MapToolProps) {
  const { visible } = usePluginDataset('active-fires')   // { applied, visible, apply, remove }
  const fires = useActiveFiresFeed(visible)               // fetch nothing until applied
  useFireLayer(map, visible ? fires : null)
  return null
}
```

`applied` is true once a user adds the dataset; `visible` is false again while they hide it from the applied list. The `wildfire-monitoring` and `weather-radar` plugins in `cdt-na/plugins` show one of each.

To give a plugin its own switch for its dataset, call `apply()` and `remove()` from the same hook. They do exactly what ticking and unticking the dataset in the Datasets menu does, so the switch and the menu always agree: `apply()` adds the dataset, or shows it again if it was hidden, and `remove()` takes it off the map. A switch that reads `visible` and calls them needs no state of its own:

```tsx
function LiveAircraftSwitch() {
  const aircraft = usePluginDataset('live-aircraft')
  return (
    <Switch checked={aircraft.visible} onCheckedChange={on => (on ? aircraft.apply() : aircraft.remove())}>
      Live aircraft
    </Switch>
  )
}
```

`apply()` only finds datasets the calling plugin registered, so one plugin cannot add another's. The `airplanes` plugin's toolbar card uses this.

## Data pages

`data.pages` puts a full page in the Datasets group of the sidebar, beside Buildings and Sites. It takes one of two forms: a **table**, for which the plugin supplies rows and columns, or a **custom page**, for which it supplies a component.

### A table

The platform renders the frame, breadcrumb, title, search box and table; the plugin supplies the rows and columns.

```ts
ctx.register('data.pages', {
  id: 'rooms',
  titleKey: 'rooms.title',
  icon: 'Table',
  useRows: useRoomRows,
  columns: [
    { key: 'name',  labelKey: 'rooms.name' },
    { key: 'floor', labelKey: 'rooms.floor' },
  ],
  emptyKey: 'rooms.empty',     // optional
  searchKeys: ['name'],        // optional; omit to search every column
})
```

`useRows` is a **hook**, not a value. CDT calls it while rendering the page, so the rows can come from anywhere a hook can reach. It returns the rows and, optionally, what clicking one does:

```ts
function useRoomRows(): DataPageRows<Room> {
  const { items } = usePluginStore<Room>('rooms')
  const { open } = usePluginDialogs()

  return {
    rows: items.map(item => ({ key: item.key, ...item.data })),
    onRowClick: row => open('room-detail', { roomKey: row.key }),
  }
}
```

`onRowClick` is returned from the hook rather than set on the registration because it usually needs other hooks, and `activate()` runs outside React. Omit it and the rows stay non-interactive, which is also what a screen reader is told.

A column renders its raw value unless given a `render`. Values that are not strings, numbers or booleans render empty rather than `[object Object]`.

### A custom page

For anything a table cannot show, a dashboard or a calendar say, register a `component` instead of `useRows` and `columns`. The platform keeps the frame, breadcrumb and title and renders the component below them, inside the plugin's scope, so every plugin hook works in it. There is no search box.

```ts
ctx.register('data.pages', {
  id: 'space-planner',
  titleKey: 'Space planner',
  icon: 'CalendarRange',
  component: SpacePlannerPage,   // receives no props
})
```

A registration takes one form or the other: `component` alongside `useRows` or `columns` is a type error. For charts, use [`@collabdt/core/plugins-sdk/charts`](./charts.md).

### Permissions

The data behind a plugin page belongs to the plugin, so the permission subject to check is `PluginRecord`. Use `usePluginPermissions()` from `@collabdt/core/plugins-sdk/data` to hide controls the person may not use. Either way the server re-checks every write, so a rejected one should be handled visibly rather than prevented only by hiding a control.

## Viewer sidebar tabs

`viewer.tabs` adds a tab to the viewer sidebar, beside Files, Layers and Sensors. CDT owns the tab strip and the panel frame.

```ts
ctx.register('viewer.tabs', {
  id: 'rooms',
  labelKey: 'rooms.tab',
  icon: 'ListChecks',
  viewers: [ViewerNames.map, ViewerNames.bim],   // omit to appear in all of them
  component: RoomsTab,
})
```

Import `ViewerNames` from `@collabdt/core/plugins-sdk`; it is exported as a value so that a tab or a legend can name its viewers. A mounted plugin built against `@collabdt/plugin-kit` spells them as plain strings instead: `viewers: ['map', 'bim']`, typed as `PluginViewerTarget`.

:::caution Say where it goes
Omitting `viewers` means every viewer, which is rarely a location anyone chose. `create-cdt-plugin` writes the list explicitly, taken from the viewer surfaces you scaffolded with: pick `bim.tools` and a tab, and you get `viewers: ['bim']`.

Only `'map'` and `'bim'` host tabs and legends. Any other name, a typo like `'BIM'` or a `ViewerNames` member such as `settings` that is a route rather than a viewer, renders nowhere; the platform logs a warning naming the plugin and the value.
:::

The component receives no props. It renders inside the panel, so it should fill the width and let the panel scroll.

## Dialogs

`ui.dialogs` registers a modal that CDT owns, opened by id from any other surface of the same plugin.

```ts
ctx.register('ui.dialogs', {
  id: 'room-detail',
  titleKey: 'rooms.detail',
  size: 'lg',            // 'sm' | 'md' | 'lg' | 'xl', default 'md'
  component: RoomDetail,
})
```

```ts
const { open, close } = usePluginDialogs()

open('room-detail', { roomKey: 'r-12' })   // props reach the component
close('room-detail')                        // or the component calls its own `close`
```

The component receives whatever `open` passed, plus a `close` function. CDT supplies the overlay, the title bar, the focus trap and Escape; the plugin renders the body only.

Two consequences of CDT owning the dialog stack:

- **A dialog outlives whatever opened it.** One opened from a map tool's panel stays on screen after that panel closes.
- **A plugin can only open its own dialogs.** The plugin id comes from the scope CDT established, so naming another plugin's dialog id addresses nothing.

### Confirming and reporting

`ConfirmDialog` from `@collabdt/core/plugins-sdk/components` is the dialog the platform asks with before a delete, and `toast` from `@collabdt/core/plugins-sdk/ui` shows the same confirmations it does. Use them so a plugin's deletes and saves read like the rest of the platform.

```tsx
const [confirming, setConfirming] = React.useState(false)

<ConfirmDialog
  isOpen={confirming}
  onOpenChange={setConfirming}
  handleConfirm={() => void deleteRoom().then(() => toast.success(`Deleted ${room.name}`))}
  itemName={room.name}
  dataType="room"
/>
```

Without `title` and `description` it asks the standard delete question about `itemName`. For a question that destroys nothing, pass your own copy, a `confirmLabel` and `tone="default"`. `isDeleting` shows a spinner on the confirm button while the work runs. `toast` has `success`, `error` and `info`, each taking a message.

## Reading platform data

Buildings, sites, sensors, comments and files come from `@collabdt/core/plugins-sdk/data`. A plugin goes through the same request path as the rest of CDT, so it inherits the signed-in user's session, the organization scoping and the shared cache. There is no second data path and no way past the tenant boundary.

```tsx
import { useBuildings, useSensorsByBuilding } from '@collabdt/core/plugins-sdk/data'

function Panel() {
  const { buildings, isLoading } = useBuildings()
  const { sensors } = useSensorsByBuilding(buildings[0]?.id ?? null)

  if (isLoading) return null
  return <p>{sensors.length} sensors</p>
}
```

Every read hook returns its payload plus `isLoading` and `isError`. A list hook returns `[]` before it resolves rather than `undefined`, so it can be mapped straight away; a single-record hook returns `null`.

| Read | Hook |
|---|---|
| Buildings | `useBuildings`, `useBuilding`, `useBuildingsByOsm`, `useBuildingOsmIds` |
| Sites | `useSites`, `useSite` |
| Infrastructure | `useInfrastructures`, `useInfrastructure` |
| Organization | `useOrganization`, `useOrganizationByName` |
| Files | `useFiles`, `useFile`, `useFilesByBuildingId`, `useFilesBySiteId`, `useDownloadFile` |
| Sensors | `useSensors`, `useSensor`, `useSensorsByBuilding`, `useSensorsByAuthor`, `useSensorTypes`, `useSensorType` |
| Comments | `useComments`, `useComment`, `useCommentsByBuilding`, `useCommentsByAuthor` |

Buildings and sites are read-only to a plugin: they are canonical asset records, so changing one is a change to CDT rather than to a plugin. Sensors and comments are the domains plugins are expected to author, and they have `useCreateSensor`, `useCreateComment` and `useDeleteComments`. A plugin's own records go in `usePluginStore`.

Types come from `@collabdt/plugin-kit/types/data`, which declares the fields the SDK commits to rather than every column CDT's schema carries.

A `PluginFile`'s place in the BIM viewer is `fileTransformX` / `Y` / `Z` (metres), `fileRotationX` / `Y` / `Z` (radians) and `fileScale` (one uniform number). For a BIM model, `fileRotationZ` is its project north: a turn about the vertical axis added to `fileRotationY`. Its `x`, `y` and `z` are deprecated: the CDT platform no longer writes them, so they are `null` or stale for any file placed since.

## Where to keep state

Surfaces share state through hooks rather than props. The choice depends on whether the value belongs in a database:

| Kind of value | Hook | Survives a reload |
|---|---|---|
| A selection, a filter, a draft | `usePluginState` | No |
| Records the plugin owns | `usePluginStore` | Yes |
| Per-user preferences | `usePluginConfig`, via user settings | Yes |
| Org-wide settings | `usePluginConfig` | Yes |

`usePluginState` is in-memory and scoped per plugin, so two plugins using the key `selected` never see each other's value. `usePluginStore` will hold a selection, but makes every click a database write.

[Example: one plugin, several surfaces](./hello-map-example.md) shows both in one plugin.

## Registering more than one contribution

`activate()` can call `ctx.register()` as many times as needed, under one capability or several:

```ts
// manifest.json: "capabilities": ["map.tools", "viewer.legends"]
export function activate(ctx: PluginContext): void {
  ctx.register('map.tools', { id: 'rooms-inspect', label: 'Inspect', icon: 'Search', component: InspectTool })
  ctx.register('map.tools', { id: 'rooms-measure', label: 'Measure', icon: 'Ruler', component: MeasureTool })
  ctx.register('viewer.legends', { id: 'rooms-legend', title: 'Rooms', useLegend })
}
```

If any `register` call names a capability missing from the manifest, CDT removes every contribution that plugin made and marks it errored. Activation is all-or-nothing, so a half-registered plugin never occurs.
