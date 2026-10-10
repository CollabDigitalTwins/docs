---
name: cdt-plugin-authoring
description: Author a CDT (Collab Digital Twins) platform plugin, from scaffold to a plugin rendering in the map or BIM viewer. Use when asked to build, scaffold, extend, or debug a CDT plugin, add a toolbar tool, sidebar tab, legend, map layer, dataset, data page, dialog, chart or floorplan overlay to CDT, or when a plugin builds but never shows up.
---

# Author a CDT platform plugin

$ARGUMENTS may name the plugin, the surfaces it targets, or the behaviour wanted.

Reference pages, fetch them when a detail below is not enough:
https://docs.collabdt.org/docs/plugins/all-capabilities ·
https://docs.collabdt.org/docs/plugins/mounted-plugins-in-practice ·
https://docs.collabdt.org/docs/plugins/mounting-a-plugin ·
https://docs.collabdt.org/docs/plugins/charts

## Constraints that are invisible from inside a plugin folder

Read these before writing any code. Each one is a failure that looks like success.

- **The capability must be one of exactly eight.** Nothing else exists. Inventing a plausible
  name such as `data.columns`, `commands` or `widgets` produces a plugin that builds, loads,
  registers and shows nothing, with nothing in any log pointing at the cause. **If a plugin
  appears on the Plugins page but never renders, check the capability name first.**

  | Capability | Where it appears | Component receives |
  |---|---|---|
  | `map.tools` | Map toolbar, as a button with a dropdown panel | `{ map }` |
  | `bim.tools` | BIM toolbar, as a button with a dropdown panel | `BimToolProps` |
  | `map.layers` | Drawn on the map for as long as the map exists | `{ map }`, renders `null` |
  | `map.datasets` | Datasets menu, under Organizational, or Live Data with `live: true` | no component |
  | `viewer.legends` | The shared legend card, map and BIM | a `useLegend` hook |
  | `viewer.tabs` | Viewer sidebar, as a tab | **no props at all** |
  | `data.pages` | Datasets nav, as a full page | `useRows` hook + `columns`, or a `component` with no props |
  | `ui.dialogs` | A modal, opened by id from any surface of the plugin | what `open()` passed + `close` |

- **A `viewer.tabs` or `viewer.legends` registration with no `viewers` appears in every
  viewer.** That is what omitting the field means, so it fails as a location nobody chose
  rather than as an error. Only `'map'` and `'bim'` host these; any other value, a typo like
  `'BIM'` included, renders nowhere and the platform logs a warning.
- **Never import `three`, `@thatopen/components`, `maplibre-gl` or `lucide-react` as runtime
  values.** Viewer instances arrive as props and icons are named by string. A second copy of
  React breaks hooks outright; a second copy of three.js crashes the BIM viewer. Type-only
  imports of `maplibre-gl` (map) and `@thatopen/components` (BIM) are correct and expected.
  An icon *inside* a component body therefore has to be inline SVG.
- **Only a fixed list of modules resolves at runtime:** `react`, `react-dom`,
  `react/jsx-runtime`, and `@collabdt/core/plugins-sdk` with its subpaths `/config`,
  `/messages`, `/store`, `/data`, `/state`, `/ui`, `/components` and `/charts`. Anything else
  must be bundled into `dist/index.js`, and the build's import guard names any specifier it
  cannot resolve. `usePluginBimAppearance`, `useBimViewer` and `useMapViewer` are not on the
  list; a `bim.tools` component gets the BIM viewer, its floorplans and element colours as props.
- **Charts come from `@collabdt/core/plugins-sdk/charts`,** never from an installed `recharts`.
  It exports the `Chart*` wrappers and the Recharts primitives the platform uses, and the host
  loads Recharts only when a plugin imports it. A bundled copy loses the platform's styling.
- **`manifest.slug` must equal the folder name.** The scanner skips the folder with only a log
  line otherwise, so a mismatch is a plugin that never appears. Renaming the folder, or editing
  the manifest's `name` and assuming the slug followed, is the usual cause.
- **`manifest.slug` must not collide with a plugin that ships with the platform**
  (`hello-map`, `hello-bim`). A mounted folder cannot shadow one: it loads and is then ignored
  forever.
- **Every capability registered must be declared in `manifest.capabilities`.** Registering an
  undeclared one throws, and the platform then rolls back every contribution that plugin made
  and marks it errored. This is easiest to introduce when a second surface is added later.
- **`hostApi` must be `1`.** Omitting it is permitted and only warned about, which defers a
  future incompatibility to a render-time failure.
- **The output is a single file, `dist/index.js`.** The platform serves exactly that path, so a
  code-split chunk would not resolve. Mounting unbuilt source is the likeliest mistake of all.

A plugin is *not* limited to one component. Source may span as many files as it likes, and
`activate()` may register several contributions across several surfaces. Each entry needs its
own `id`: contributions are de-duplicated by plugin and id, so reusing one silently drops the
second. What is ruled out is lazy-loading part of the plugin itself.

## Choose the surfaces before writing a component

Only the two toolbars and `map.layers` are handed a viewer. Everything else reaches it through
them, so the shape of the plugin follows from which surface holds the handles.

- **Do viewer work in the toolbar component and publish the result** with `usePluginState`.
  A tab, page, legend or dialog reads it from there, and leaves *requests* (an action plus a
  `nonce`) for the toolbar component to carry out in an effect.
- **A toolbar panel unmounts when its dropdown closes**, taking its effects with it, unless the
  registration sets `stayActive: true`, which keeps it mounted while hidden. Without that, have
  the tool claim a flag in plugin state while mounted and let other surfaces explain why an
  action is unavailable instead of doing nothing.
- **Anything drawn on the map that must outlive a panel belongs in `map.layers`.** Re-add the
  source and layer on `styledata` (a basemap switch drops them), guard both removals in cleanup,
  and update features with `setData` rather than re-adding the layer.
- **A dataset users should apply and hide like any other is `map.datasets`.** Give it a
  `source` of `{ type: 'wms', ... }` or `{ type: 'geojson', getFeatures }` and CDT draws it;
  omit `source` and draw it yourself from `map.layers`, gated on
  `usePluginDataset(id).visible`. A `viewer.legends` entry with `dataset: '<id>'` nests under
  that dataset's row. Fetch nothing until the dataset is applied.
- **A modal is `ui.dialogs`,** opened with `usePluginDialogs().open(id, props)`. It outlives
  whatever opened it, and a plugin can only open its own.
- **A full page is `data.pages`.** Give it `useRows` + `columns` for a searchable table, or
  `component` instead for a dashboard, a calendar or charts below the platform's frame and
  title. Never both forms.
- **Drawing on a BIM floorplan is `floorplan` on `BimToolProps`,** so it lives in the
  `bim.tools` component. Check `floorplan.available` first: it is false in a viewer without
  floorplans. After `activate(id)`, call `generateLines()` so the plan shows its walls and
  drawing snaps to them. `drawShape('rectangle' | 'polygon')` and `editShape(points)` resolve
  with `{ x, z }` points in world metres, or `null` on Escape; `frame(points)` fits the plan to
  an outline. `setOverlay(shapes, { onShapeClick })` draws the plugin's own labelled polygons on
  whichever plan is open, so filter them by `floorplan.active`; `clearOverlay()` removes them.
- **`buildingId` on `BimToolProps` is the open building**, `null` until one is chosen, and the
  only place a plugin learns it. Stamp it on records and publish it with `usePluginState` for
  the surfaces that are not handed it.

Pick the state hook by whether the value belongs in a database: `usePluginState` for a
selection or filter (in memory), `usePluginStore` for records the plugin owns, `usePluginConfig`
for settings. Platform records (buildings, sites, files, sensors, comments) come from the hooks
in `@collabdt/core/plugins-sdk/data`, which carry the user's session and organization scoping.

## Reading and colouring a BIM model

`getItemsOfCategory(...)` then `getProperties(items, [...])` reaches **attributes only**. The
durable IFC `GlobalId`, quantities (floor area) and spatial containment come off the raw
`fragments` handle on the same props:

```ts
const model = fragments.list.get(modelId)
const guids = await model.getGuidsByLocalIds(localIds)
const data = await model.getItemsData(localIds, {
  attributesDefault: true,
  relations: { IsDefinedBy: { attributes: true, relations: true },
               Decomposes: { attributes: true, relations: false } },
})
```

Walk the relations defensively with a depth cap (IFC2X3 and IFC4 nest quantities differently)
and treat a missing value as a normal model. `IFCSPACE` is hidden by default, so call
`setItemsVisible(items, true)` before acting on spaces. Key stored records by `GlobalId`, never
by `modelId` and `localId`, which only mean something while that model is open.

For a space's floor outline, area and height, `floorplan.getSpaceFootprints(items)` reads them
from each element's lowest flat face, ready to pass to `setOverlay`. Pass the spaces you redraw
as `setOverlay(shapes, { replacesSpaces })` so the plan hides its own room graphic under them.

Colour elements with `appearance` on `BimToolProps`: `setAppearance(groups)`, each group
`{ items, appearance: { color: 0xRRGGBB, opacity? } }`, and `clearAppearance()`. Pass every
group in **one** call, since each call replaces the plugin's previous paint, and call it from
an effect so that changed colours repaint. Paint is scoped to the plugin and outlives the panel
that applied it, so give the user a way to clear it. Never paint through
`model.highlight` on the raw `fragments` handle: it bypasses the platform's appearance layer.

## Steps

1. **Scaffold with explicit flags** rather than prompts, so the run is reproducible. Run it
   from the folder you keep plugins in; if that folder has a `plugins/` directory, the plugin
   lands inside it:

   ```bash
   npx create-cdt-plugin --name "Room Inventory" --surface bim.tools,viewer.tabs \
     --body example --description "Counts rooms per floor." --yes
   ```

   The only flags are `--name`, `--slug`, `--surface`, `--body`, `--author`,
   `--description` and `--yes`; any other flag is rejected. `--surface` is repeatable and
   takes a comma-separated list, so name every surface now rather than adding one later. Use
   `--body example` when the plugin reads the viewer, `--body empty` when it does not. Never
   hand-write `manifest.json`: the scaffolder fills in `hostApi`, the slug, the capability
   list, the `viewers` lists and the three locale blocks, and binds one context slot per viewer.

2. **Implement the behaviour** in the generated component files. Render panel content only. The
   platform supplies the toolbar button and dropdown from the registration's `label` and `icon`,
   so a plugin that draws its own floating card ends up with it inside the toolbar strip. Guard
   every viewer handle: each is `null` until the viewer has initialised.

3. **Keep every user-visible string** in `manifest.json`'s `messages` and read it with
   `usePluginTranslations()`, passing an inline English fallback at each call. Translate the
   `fr` and `es` blocks, which start as copies of the English ones. A mounted plugin's
   `titleKey`, `labelKey` and `emptyKey` never resolve, so write those three as English prose.

4. **Type `data.pages` rows loosely.** The registration pins a row to
   `Record<string, unknown>` under `strict: true`, so build rows with your own type and narrow
   inside each column's `render` and in `onRowClick`.

5. **Build:**

   ```bash
   cd <slug>
   npm install
   npm run build
   ```

   Run them as separate commands: Windows PowerShell 5.1 rejects `&&`. The build runs an import
   guard and fails if the plugin imports anything the platform publishes no shim for, naming
   the specifier. **A guard failure is a real problem in the plugin, never something to work
   around by editing the tsup config.** The preset refuses overrides of `entry`, `outDir`,
   `format`, `external` and `onSuccess` for exactly this reason.

6. **Mount it.** The deployment's `.env` needs `PLUGINS_ENABLED=true` and an absolute
   `PLUGINS_DIR` pointing at the folder that holds your plugin; the default `/app/plugins` is a
   container path. Add `PLUGINS_DEV=true` while developing so nothing is cached. There is no hot
   reloading: save, rebuild, refresh. Under Docker the folder is mounted read-only, so run the
   build on the host rather than inside the container.

7. **Enable it.** On the Plugins page an administrator adds it to the organization, then each
   person chooses whether it runs for them. To ship it to other deployments, publish it to the
   registry: https://docs.collabdt.org/docs/plugins/plugin-registry

## Verification

Nothing short of the last step proves it works.

1. `npm run build` exits 0, passing the import guard. This shows the plugin imports only what
   the platform can resolve, and that it emits one file.
2. The plugin appears on the Plugins page under **Found on this server**, which shows the folder
   was discovered. If it does not: check `PLUGINS_ENABLED`, check `PLUGINS_DIR`, check
   `dist/index.js` exists, and check the server log for the folder name and the skip reason.
3. It renders once enabled, in every place its surfaces name. A red card mentioning the host API
   means it was built against a different platform version.

A plugin that reaches step 2 and fails step 3 is almost always registering under a capability
nothing renders, or under a `viewers` value that is not `'map'` or `'bim'`.

## A warning to pass on

A plugin runs with the same access as CDT itself. There is no sandbox. Tell the user to review
generated code before mounting it anywhere holding real data.
