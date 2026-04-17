---
title: useIsMobile hook
description: Detects whether the current viewport is mobile-sized based on a breakpoint.
category: hooks
status: draft
last_updated: 2025-01-14
---

# useIsMobile hook

A client-side hook that tracks viewport width and returns a boolean indicating whether the device is below the mobile breakpoint (768px). Uses `window.matchMedia` for efficient resize detection without polling.

## Hooks

| Hook | Description |
|------|-------------|
| `useIsMobile` | Returns `true` when viewport width is below 768px |

---

## `useIsMobile`

Tracks viewport width using a media query listener and returns whether the current window is mobile-sized.

### Signature

```ts
function useIsMobile(): boolean
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| (return value) | `boolean` | `true` if viewport width is below 768px, `false` otherwise |

### Example

```tsx
import { useIsMobile } from '@/core/hooks/ui/use-mobile';

function Header() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

### Notes

- Initial render returns `false` (the `undefined` state is coerced to `false` via `!!isMobile`).
- The breakpoint constant `MOBILE_BREAKPOINT` is set to 768px and is not configurable.
- Uses `matchMedia` change event listener rather than window resize for better performance.
<!-- TODO: Document SSR behaviour — initial server render will always return false since window is undefined. -->

---

## Related

- [Components: Sidebar](/docs/components/sidebar)
