---
title: Viewer hooks
description: Share URLs, screenshots, camera position, undo/redo shortcuts, and geocoder configuration.
---

# Viewer hooks

Hooks that act on whichever viewer is currently active. Each reads `MenusContext` and the viewer contexts, so they must be called inside the provider tree.

| Hook | Description |
|------|-------------|
| `useShareUrl` | Builds a URL encoding the current view |
| `useCaptureScreenshot` | Captures the active viewer as an image |
| `useCurrentViewerPosition` | Reads the active viewer's camera position |
| `useUndoRedoShortcuts` | Binds undo and redo keyboard shortcuts |
| `useGeocodingRuntimeConfig` | Supplies geocoder endpoints at runtime |

## `useShareUrl()`

Returns a function producing the shareable URL for the current view.

```ts
function useShareUrl(): () => Promise<string>
```

```tsx
const getShareUrl = useShareUrl();
const url = await getShareUrl();
```

What the URL encodes depends on the active viewer: longitude, latitude, zoom, pitch, bearing, style and loaded asset IDs on the map; camera position, target and asset ID in the BIM viewer. See [Collaboration → Share a live view](/docs/guides/collaboration).

## `useCaptureScreenshot()`

Returns a function that captures the active viewer, resolving to a data URL or `null` when there is nothing to capture.

```ts
function useCaptureScreenshot(): () => Promise<string | null>
```

## `useCurrentViewerPosition()`

Returns a function reading the active viewer's camera position, or `null` when no viewer is mounted.

```ts
function useCurrentViewerPosition(): () => ViewerPosition | null
```

It is a getter rather than a value, so reading the camera does not re-render on every camera move.

## `useUndoRedoShortcuts({ undo, redo, enabled })`

Binds `Ctrl+Z` / `Cmd+Z` and `Ctrl+Y` / `Ctrl+Shift+Z` to the handlers you pass. `enabled` defaults to `true`.

```tsx
useUndoRedoShortcuts({ undo, redo, enabled: !isEditingText });
```

Handlers are held in a ref, so passing inline arrow functions does not rebind the listener on every render.

## `useGeocodingRuntimeConfig(config?)`

Pushes geocoder endpoints into the geocoding module at runtime. The host reads the values server-side and passes them down, which is how the geocoder is configured without any variable reaching the client bundle.

```tsx
useGeocodingRuntimeConfig({ geocodeEarthApiKey, geocoderUrl, photonUrl, nominatimUrl });
```

Returns nothing. Calling it with no argument clears the configuration, falling back to the public services. See [Environment variables](/docs/getting-started/environment-variables) for the provider priority order.

## Related

- [Hooks overview](./overview.md)
- [Guides: Collaboration](/docs/guides/collaboration)
