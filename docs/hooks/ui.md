---
title: useIsMobile hook
description: Detects whether the current viewport is mobile-sized based on a breakpoint.
---

# useIsMobile hook

Tracks viewport width with `window.matchMedia` and returns `true` below the mobile breakpoint, using a media-query change listener rather than a resize handler.

```ts
function useIsMobile(): boolean
```

```tsx
import { useIsMobile } from '@collabdt/core/core/hooks/ui/use-mobile';

function Header() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

The breakpoint constant `MOBILE_BREAKPOINT` is 768px and is not configurable. The initial render returns `false`, because the internal `undefined` state is coerced with `!!isMobile`; on the server `window` is undefined, so a server render is always `false`.

## Related

- [Components: Sidebar](/docs/components/app-sidebar)
