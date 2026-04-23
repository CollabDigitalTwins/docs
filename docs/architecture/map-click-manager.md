---
sidebar_position: 11
title: Map Click Manager
description: Priority-based click dispatch system for the map viewer — how layers register handlers and how conflicts are resolved.
category: architecture
status: draft
last_updated: 2026-04-23
---

# Map Click Manager

`MapClickManager` is a priority-based click dispatch system for the MapLibre map viewer. When the user clicks the map, exactly one handler fires — the one with the highest priority whose layer contains a rendered feature at the click point.

Source: `src/core/components/viewers/map/utils/MapEventManager/MapClickManager.ts`

## Problem it solves

MapLibre fires a single `click` event for the whole map. Multiple layers may have rendered features at the same point (e.g., a building marker and an open data polygon overlap). Without a priority system, all registered handlers would fire — or the last one registered would win by accident.

`MapClickManager` makes priority explicit and deterministic.

## Priority Table

Higher number = higher priority = fires first.

```ts
export enum MapLayerClickPriority {
  BuildingLayersClickPriority = 100,
  CommentLayersClickPriority  = 200,
  MartinLayerClickPriority    = 300,
  OpenDataLayerClickPriority  = 350,
  FileLayerClickPriority      = 400,
  BimModelLayerPriority       = 600,
  ActiveTool                  = 1000, // special — see below
}
```

`ActiveTool` is reserved for active editing tools (clipping, measurement, placement). A handler registered at `ActiveTool` priority fires immediately and skips feature detection entirely, then returns. **You must unregister it when the tool deactivates.**

## API

```ts
class MapClickManager {
  constructor(map: maplibregl.Map)

  register(layerId: string, priority: MapLayerClickPriority, callback: ClickCallback): void
  unregister(layerId: string): void
  destroy(): void
}

type ClickCallback = (
  event: maplibregl.MapMouseEvent,
  features: maplibregl.MapGeoJSONFeature[]
) => void
```

### `register`

Adds a handler and re-sorts the internal list by descending priority. Multiple layers can share the same priority value, but only the first match fires per click.

### `unregister`

Removes the handler for a given `layerId`. Call this in a `useEffect` cleanup:

```ts
useEffect(() => {
  const manager = mapState.map.clickManager
  manager.register(LAYER_ID, MapLayerClickPriority.BuildingLayersClickPriority, handleClick)
  return () => manager.unregister(LAYER_ID)
}, [])
```

### `destroy`

Removes the global `click` listener from the map and clears all handlers. Called when the map viewer unmounts.

## Dispatch logic

On each map click:

1. If any `ActiveTool` handler is registered, it fires immediately with an empty features array and dispatch stops.
2. Otherwise, `queryRenderedFeatures` is called at the click point.
3. Handlers are iterated in descending priority order. The first handler whose `layerId` matches a rendered feature fires its callback, then dispatch stops (`break`).

```ts
private handleMapClick(e: maplibregl.MapMouseEvent) {
  for (const handler of this.clickHandlers) {
    if (handler.priority === MapLayerClickPriority.ActiveTool) {
      handler.callback(e, [])
      return
    }
  }

  const features = this.map.queryRenderedFeatures(e.point)
  if (!features) return

  for (const handler of this.clickHandlers) {
    const hits = features.filter(f => f.layer?.id === handler.layerId)
    if (hits.length > 0) {
      handler.callback(e, hits)
      break
    }
  }
}
```

## Adding a new layer with click behaviour

1. Choose a priority from `MapLayerClickPriority`. If none fits, add a new enum value — leave a comment explaining the ordering rationale.
2. Use the layer's MapLibre `layerId` string as the registration key.
3. Register on mount, unregister on unmount.
4. If implementing a tool (not a passive layer), use `ActiveTool` and ensure you call `unregister` when the tool is deactivated.

## Gotchas

- **`ActiveTool` leaks.** If a tool component unmounts without calling `unregister`, all subsequent map clicks are silently swallowed. Always pair `register(ActiveTool)` with a cleanup.
- **Layer ID must match exactly.** The `layerId` passed to `register` must match the `id` property of the MapLibre layer that `queryRenderedFeatures` returns. A mismatch means the handler never fires.
- **`queryRenderedFeatures` only returns visible layers.** If a layer is hidden (opacity 0 or visibility none), its features won't be returned even if geometrically at the click point.

## Key Files

| File | Role |
|------|------|
| `src/core/components/viewers/map/utils/MapEventManager/MapClickManager.ts` | Full implementation |
| `src/core/components/viewers/map/src/MapLayers/src/BuildingLayers/index.tsx` | Example of register/unregister pattern |

## Related

- [Map Layers](./map-layers.md) — all layers that use this system
- [State Management](./state-management.md) — `MapProvider` holds the `MapClickManager` instance
