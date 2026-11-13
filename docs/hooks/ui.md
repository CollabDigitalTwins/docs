---
title: UI hooks
description: Viewport, tab strip, and sidebar layout hooks.
---

# UI hooks

Layout hooks that read the environment rather than platform data, so they return plain values instead of the SWR shape.

| Hook | Description |
|------|-------------|
| `useIsMobile` | Whether the viewport is below the mobile breakpoint |
| `useCompactTabStrip` | Whether a tab strip should drop its labels to fit |
| `useResizableSidebarWidth` | Drag-to-resize state for the sidebar |
| `useFirstLoadableImage` | The first image URL in a list that actually loads |

## `useIsMobile()`

Tracks viewport width with `window.matchMedia` and returns `true` below the mobile breakpoint, using a media-query change listener rather than a resize handler.

```tsx
import { useIsMobile } from '@collabdt/core/core/hooks/ui/use-mobile';

function Header() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

The breakpoint constant `MOBILE_BREAKPOINT` is 768px and is not configurable. The initial render returns `false`, because the internal `undefined` state is coerced with `!!isMobile`; on the server `window` is undefined, so a server render is always `false`.

## `useCompactTabStrip(ref, itemCount, minItemWidth?)`

Returns `true` when the element in `ref` cannot give each of its `itemCount` tabs at least `minItemWidth` pixels, so the strip should render icons without labels. `minItemWidth` defaults to the platform's minimum tab label width.

```tsx
const ref = React.useRef<HTMLDivElement>(null);
const compact = useCompactTabStrip(ref, tabs.length);
```

It starts `true` and measures after mount, so a strip never flashes overflowing labels on first paint.

## `useResizableSidebarWidth()`

Drag-to-resize state for the sidebar.

| Field | Type | Description |
|-------|------|-------------|
| `width` | `number` | Current width in px. Only meaningful when `canResize` is true |
| `isResizing` | `boolean` | True while a drag is in progress, for cursor and no-select styling |
| `canResize` | `boolean` | Desktop only. Mobile uses a fixed drawer width |
| `startResize` | `(e: React.PointerEvent) => void` | Attach to the drag handle's `onPointerDown` |

```tsx
const { width, isResizing, canResize, startResize } = useResizableSidebarWidth();
```

The width is restored from storage after mount rather than during render, which avoids a server/client mismatch on first paint.

## `useFirstLoadableImage(candidates)`

Returns the first URL in `candidates` that loads, or `null` while probing and when none do. Blank entries are skipped.

```tsx
import { useFirstLoadableImage } from '@collabdt/core/hooks/useFirstLoadableImage';

const src = useFirstLoadableImage([organizationLogo, conventionLogo, '/images/cdt-logo-stroke.svg']);
```

Each candidate is probed with a detached `Image()` rather than a rendered `<img>` and its `onError`, so an image that fails before hydration cannot leave a broken icon behind. The list is compared by value, so passing a new array with the same URLs does not probe again.

## Related

- [Components: Sidebar](/docs/components/app-sidebar)
- [Components: Viewer sidebar](/docs/components/viewer-sidebar)
