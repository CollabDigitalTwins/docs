---
sidebar_position: 2
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# Frontend Architecture

Next.js 15, React 19, three specialized viewers, state management via Context, and i18n support.

<BrowserOnly>
  {() => {
    const FrontendArchitectureDiagram = require('@site/src/components/FrontendArchitectureDiagram').default;
    return <FrontendArchitectureDiagram bare preview />;
  }}
</BrowserOnly>

## Stack & Tooling

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 15 | Server-side rendering, API routes, app router |
| **UI Runtime** | React 19 | Component model, hooks, server components |
| **Build Tool** | Turbopack | Fast incremental development builds |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Components** | Radix UI | Headless, accessible component primitives |
| **i18n** | next-intl | Multi-language support with routing |

## Visualization Engines

CDT ships three specialized WebGL/canvas-based viewers, each optimized for distinct data types:

### MapLibre GL (`maplibre-gl`)

Renders 2D and 3D maps with vector tiles, basemaps, and satellite layers.

- **Data source:** Martin tile server (PostGIS → Mapbox Vector Tiles)
- **Measurement:** `maplibre-gl-measures` plugin for distance/area calculations
- **Geospatial ops:** Turf.js for buffering, intersection, and analysis
- **Interactivity:** Click to select building footprints, load details panel
- **Export:** Share current viewport as URL + QR code

### That Open Company BIM Viewer (`@thatopen/components`)

WebGL-based viewer for IFC (Industry Foundation Classes) building models.

- **Parser:** `web-ifc` streams IFC geometry directly into browser memory
- **Streaming:** Fragment-based loading allows large models (100MB+) to load progressively
- **Selection:** Click elements to view properties and attach comments
- **Measurement:** Built-in measurement tools
- **Export:** BCF (BIM Collaboration Format) for round-trip with Revit, Archicad

### Potree (`potree-cdt`)

Point cloud renderer for LiDAR scans and photogrammetry datasets.

- **Structure:** Octree LOD (level-of-detail) — only visible geometry is loaded
- **Performance:** Handles billions of points with flythrough smoothness
- **Styling:** Height-based or intensity-based coloring
- **Export:** Crop and download clips as LAS/LAZ

## State Management

Application state is organized as a composition of React Context providers, each owning a focused domain slice:

```typescript
// src/contexts/index.tsx - composed at app root

export function ContextProviders({ children }) {
  return (
    <AppConfigProvider>
      <PermissionsProvider>
        <MapProvider>
          <BimProvider>
            <PointCloudProvider>
              <MenusProvider>
                <ToolsProvider>
                  <ContentProvider>
                    <DatasetsProvider>
                      <FilesProvider>
                        <BuildingsProvider>
                          <Comments Provider>
                            {children}
                          </CommentsProvider>
                        </BuildingsProvider>
                      </FilesProvider>
                    </DatasetsProvider>
                  </ContentProvider>
                </ToolsProvider>
              </MenusProvider>
            </PointCloudProvider>
          </BimProvider>
        </MapProvider>
      </PermissionsProvider>
    </AppConfigProvider>
  );
}
```

### Provider Reference

| Provider | State Owned | Access Pattern |
|----------|------------|-----------------|
| **AppConfigProvider** | Organization settings, feature flags, map defaults | `useAppConfig()` |
| **PermissionsProvider** | Current user, role, CASL ability | `usePermissions()` |
| **MapProvider** | MapLibre instance, active layers, viewport | `useMap()` |
| **BimProvider** | IFC viewer engine, loaded fragments, selection | `useBim()` |
| **PointCloudProvider** | Potree viewer, loaded scenes | `usePointCloud()` |
| **MenusProvider** | Sidebar/toolbar menu open/closed state | `useMenus()` |
| **ToolsProvider** | Active tool per viewer (measure, annotate, etc.) | `useTools()` |
| **ContentProvider** | Which panel is shown, current view mode | `useContent()` |
| **DatasetsProvider** | Available datasets, active layers, metadata | `useDatasets()` |
| **FilesProvider** | Upload queue, progress, error state | `useFiles()` |
| **BuildingsProvider** | Selected building, cached properties | `useBuildings()` |
| **CommentsProvider** | Threads, annotations, real-time updates | `useComments()` |

## Data Fetching

### Client-Side: SWR

Fetches use **SWR** (stale-while-revalidate) for smart caching and background revalidation:

```typescript
// src/hooks/api.ts - thin wrapper around SWR

import useSWR from 'swr';

const fetcher = (url: string) => fetch(`/api${url}`).then(r => r.json());

export function useBuildings() {
  const { data, error, isLoading } = useSWR('/buildings', fetcher);
  return { buildings: data, error, isLoading };
}

export function useBuilding(id: string) {
  const { data, error } = useSWR(id ? `/buildings/${id}` : null, fetcher);
  return { building: data, error };
}
```

All API calls normalize through `/api` — the HTTP adapter masks server/client boundaries.

### Real-Time: WebSocket (Future)

Currently synchronized via polling; real-time collaboration (shared cursors, live annotations) will use WebSocket/Pusher for sub-second updates.

## UI Patterns

### Viewer Layout

All three viewers share the same chrome:

- **Left sidebar:** Navigation, data browser (buildings, sites, files)
- **Main viewport:** Viewer canvas (map, BIM, or point cloud)
- **Right panel:** Details/properties, comments, measurements
- **Bottom toolbar:** Tools, datasets toggle, share, settings, language

### Component Structure

```
src/components/
├── viewers/
│   ├── MapViewer.tsx          # MapLibre wrapper, controls
│   ├── BimViewer.tsx          # That Open Company wrapper
│   └── PointCloudViewer.tsx   # Potree wrapper
├── panels/
│   ├── Sidebar.tsx            # Left navigation
│   ├── DetailsPanel.tsx       # Right properties
│   └── ToolsPanel.tsx         # Bottom toolbar
├── ui/                        # Radix-based design system
│   ├── Button.tsx
│   ├── Dialog.tsx
│   ├── Tabs.tsx
│   └── ...
└── features/
    ├── buildings/             # Building-specific components
    ├── collaboration/         # Comments, BCF topics
    ├── datasets/              # Open data layer management
    └── ...
```

## Internationalization

See [Internationalization](./internationalization.md) for full i18n architecture. In short:

- **Message files:** `messages/{locale}.json` (en, fr, es)
- **Component usage:** `const t = useTranslations()` → `<h1>{t('page.title')}</h1>`
- **Routing:** `/en/*`, `/fr/*`, `/es/*` (or domain-based)
- **Format hooks:** `useFormatter()` for numbers, dates, currency with locale awareness

## Common Gotchas

- **Viewer refs:** Viewers (MapLibre, Potree, That Open Company) maintain internal mutation state. Store refs in `useRef`, not state.
- **State sync:** Map viewport + building selection must stay in sync across panels. Use `useEffect` dependencies carefully.
- **Memory:** Large IFC/point cloud files load into browser memory. Monitor DevTools → Memory for leaks on viewer switches.
- **Permissions:** UI controls hide via `PermissionsProvider`, but always verify on API side — frontend checks are for UX only.

