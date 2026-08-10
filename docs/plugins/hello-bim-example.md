---
title: 'Real example: hello-bim'
description: An annotated walk through hello-bim, the worked BIM example that ships with CDT.
sidebar_position: 8
category: plugins
status: draft
last_updated: 2026-08-06
---

# Real example: hello-bim

`hello-bim` ships with CDT, at `src/core/plugins/hello-bim/`. It lists the spaces in a BIM model and drives the viewer from that list: click a room, it selects and the camera frames it.

It exists for two reasons. It is the fullest worked example of the BIM surface, and it is a regression test for the plugin boundary — it imports nothing outside `sdk/`, so if the SDK stops being sufficient for a real plugin, `hello-bim` stops compiling and someone finds out immediately.

Its sibling, `hello-map`, is the minimal example and is walked through in [Create your first plugin](./create-your-first-plugin.md).

## What it does

1. Asks the viewer for every element of one IFC class — `IFCSPACE` by default.
2. Reads each one's name.
3. Offers a switch to show the spaces in the model, because they start hidden.
4. Lists them; clicking one selects it and frames the camera on it.
5. Highlights the row matching the current selection, however that selection was made.

## The manifest

```json
{
  "slug": "hello-bim",
  "name": "Hello BIM",
  "version": "1.0.0",
  "hostApi": 1,
  "capabilities": ["bim.tools"],
  "configSchema": {
    "type": "object",
    "properties": {
      "category": { "type": "string", "default": "IFCSPACE" }
    }
  },
  "messages": {
    "en": { "title": "Hello BIM", "noSpaces": "This model has no spaces defined." },
    "fr": { "title": "Bonjour BIM", "noSpaces": "Cette maquette ne définit aucun espace." },
    "es": { "title": "Hola BIM", "noSpaces": "Este modelo no define ningún espacio." }
  }
}
```

The `category` setting means an administrator can point the same plugin at `IFCDOOR` or `IFCWALL` without touching code.

## Reading the model

```tsx
export function HelloBimTool({
  modelIds, selection, select, fitToSelection,
  setItemsVisible, getItemsOfCategory, getProperties,
}: ToolbarToolProps & BimToolProps) {
  const t = usePluginTranslations()
  const { category = 'IFCSPACE' } = usePluginConfig<{ category?: string }>()

  const modelKey = modelIds.join(',')

  React.useEffect(() => {
    let cancelled = false

    async function load() {
      if (modelIds.length === 0) { setRows([]); return }

      const found = await getItemsOfCategory(category)
      // 'Name' is the label; 'LongName' is where most authoring tools put the
      // room name. Read both, prefer whichever is filled in.
      const properties = await getProperties(found, ['Name', 'LongName'])
      if (cancelled) return
      setItems(found)
      setRows(properties.map(/* … */))
    }

    void load()
    return () => { cancelled = true }
    // modelKey, not modelIds: the array identity changes on every store update.
  }, [modelKey, category, getItemsOfCategory, getProperties, t])
```

Two details worth stealing:

- **The `cancelled` flag.** Model loading is asynchronous and the user can switch away mid-read. Without it you set state on an unmounted component, or overwrite fresh results with stale ones.
- **`modelKey` rather than `modelIds` in the dependency list.** The array is rebuilt on every store update, so depending on it directly re-runs the query constantly.

## Spaces start hidden

The single most common surprise when working with IFC spaces:

```tsx
const toggleVisibility = async () => {
  const next = !visible
  setVisible(next)
  await setItemsVisible(items, next)
}
```

`getItemsOfCategory('IFCSPACE')` finds the spaces whether or not they are visible. They are hidden by default because they are volumetric solids that would obscure everything inside them. Listing them and showing them are separate actions.

## Driving the viewer

```tsx
const focus = async (row: SpaceRow) => {
  await select({ [row.modelId]: new Set([row.localId]) })
  await fitToSelection()
}
```

Selections are keyed by model, because more than one model can be loaded at once. `ModelIdMap` is `{ [modelId]: Set<localId> }`.

## Following the selection

```tsx
const selectedIds = React.useMemo(() => {
  const ids = new Set<number>()
  for (const set of Object.values(selection)) {
    for (const id of set) ids.add(id)
  }
  return ids
}, [selection])
```

`selection` is live. It updates when the user clicks in the viewport, uses a sidebar tree, or when another plugin selects something — not only when this plugin does. That is why the list can highlight the current room without tracking clicks itself.

## What it does not do

No colours. A plugin cannot paint elements, and that is deliberate: core routes appearance through a component that groups elements into one material definition per appearance, and per-element painting would exhaust the model's material budget. `select` and `isolate` are the sanctioned ways to draw attention.

No stored data — yet. Writing a room inventory needs the plugin data store, which is [not finished](./overview.md).

## Try it

`hello-bim` is compiled into CDT but switched off. Open **Extensions**, add it to your organization, then open the BIM viewer with a model loaded. See [Installing and enabling plugins](./installing-and-enabling.md).
