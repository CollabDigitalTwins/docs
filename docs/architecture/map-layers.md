---
sidebar_position: 10
title: Map Layers
description: The composable map layer system — what each layer renders, what data it reads, and how layers register with MapClickManager.
category: architecture
status: draft
last_updated: 2026-04-23
---

# Map Layers

The map viewer composes a fixed set of named layers declared in `src/core/components/viewers/map/src/MapLayers/`. Each layer is a self-contained React component responsible for fetching its own data, adding MapLibre sources and layers, and registering a click handler with `MapClickManager`.

## Layer Composition

`MapLayers` renders all layers in a fixed stacking order:

```tsx
// src/core/components/viewers/map/src/MapLayers/index.tsx
export const MapLayers = () => (
  <>
    <CountryLayer />
    <OpenDataLayers />
    <BuildingLayer />
    <CommentLayer />
    <SensorLayers />
    <FileLayers />
    <BimLayer />
  </>
)
```

Render order affects visual stacking but click priority is controlled separately by `MapClickManager` — see [Map Click Manager](./map-click-manager.md).

## Layers

### CountryLayer

Renders country and administrative boundary outlines from a tile source. Used as a base reference layer. Does not register a click handler.

**Source:** External tile provider (configured per organization via `mapStyles`).

---

### BuildingLayer (`BuildingLayer`)

Renders CDT buildings on the 3D MapTiler base layer. Highlights a building when selected and hides buildings whose IFC model is loaded in the BIM viewer (to avoid visual overlap).

**Data:** `useBuildings()` — all buildings for the active organization.  
**Layer ID:** `maptiler-3d-buildings`  
**Click priority:** `BuildingLayersClickPriority = 100`  
**On click:** Opens a `MapFeaturePopoverMenu` with building details.

---

### CommentLayer (`CommentLayer`)

Renders user comments as avatar markers on the map. Clustered when zoomed out.

**Data:** `useComments()` — all comments for the active organization.  
**Click priority:** `CommentLayersClickPriority = 200`  
**On click:** Opens the comment detail popup.

---

### SensorLayers (`SensorLayers`)

Renders IoT sensors as icon markers. Icons are resolved from `SensorType.icon` (Lucide icon name). Clustered when zoomed out.

**Data:** `useSensors()`, `useSensorTypes()`.  
**Click priority:** No explicit priority registered — sensors use marker-level click events rather than MapLibre layer events.

---

### FileLayers (`FileLayers`)

Renders files that have been pinned to map coordinates (images, IFC footprints, etc.) as markers. Also handles 3D model overlays via a custom Three.js `CustomModelLayer`.

**Data:** `useFiles()`.  
**Click priority:** `FileLayerClickPriority = 400`

---

### OpenDataLayers (`OpenDataLayers`)

Renders datasets fetched from external open data portals (ArcGIS, CKAN, Opendatasoft) as vector or GeoJSON sources.

**Data:** Active datasets from `DatasetsProvider`.  
**Click priority:** `OpenDataLayerClickPriority = 350`  
**On click:** Shows dataset feature properties.

---

### BimLayer (`BimLayer`)

Renders the georeferenced footprint of a loaded IFC model on the map. Hides the corresponding MapTiler building polygon to avoid overlap.

**Data:** BIM model position from `BimProvider`.  
**Click priority:** `BimModelLayerPriority = 600`

---

### SiteLayer (utility, not in `MapLayers`)

`src/core/components/viewers/map/src/MapLayers/src/SiteLayer/index.ts` exports `createSitesDataset()`, a helper that converts `Site[]` to a GeoJSON `FeatureCollection` for use as an OpenDataLayer dataset. It is not a standalone layer component.

## Adding a New Layer

1. Create a component in `src/core/components/viewers/map/src/MapLayers/src/<YourLayer>/`.
2. Register a click handler using `MapClickManager.register()` with an appropriate priority from `MapLayerClickPriority`. Add a new enum value if none fits — see [Map Click Manager](./map-click-manager.md).
3. Add your component to `MapLayers/index.tsx`.
4. Call `MapClickManager.unregister()` in a `useEffect` cleanup to avoid leaking handlers on unmount.

## Key Files

| File | Role |
|------|------|
| `src/core/components/viewers/map/src/MapLayers/index.tsx` | Composes all layers |
| `src/core/components/viewers/map/src/MapLayers/src/BuildingLayers/index.tsx` | Building layer implementation |
| `src/core/components/viewers/map/src/MapLayers/src/CommentLayers/CommentLayers.tsx` | Comment layer implementation |
| `src/core/components/viewers/map/src/MapLayers/src/SensorsLayer/index.tsx` | Sensor layer implementation |
| `src/core/components/viewers/map/src/MapLayers/src/FileLayer/index.tsx` | File layer implementation |
| `src/core/components/viewers/map/src/MapLayers/src/OpenDataLayers/src/index.tsx` | Open data layer implementation |
| `src/core/components/viewers/map/src/MapLayers/src/BimLayer/index.tsx` | BIM footprint layer |
| `src/core/components/viewers/map/src/MapLayers/src/SiteLayer/index.ts` | `createSitesDataset()` utility |
| `src/core/components/viewers/map/utils/MapEventManager/MapClickManager.ts` | Click priority registry |

## Related

- [Map Click Manager](./map-click-manager.md) — how click priority dispatch works
- [State Management](./state-management.md) — `MapProvider`, `DatasetsProvider`
- [Open Data Portals concept](../concepts/open-data-portals.md)
