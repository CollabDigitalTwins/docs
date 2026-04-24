---
title: "Real example: daynight-cycle"
description: Annotated walkthrough of the canonical example plugin — manifest, activate, component patterns, and isolated pure logic.
sidebar_position: 6
category: plugins
status: draft
last_updated: 2026-04-24
---

# Real example: daynight-cycle (annotated)

The daynight-cycle plugin ships with the framework and is the canonical example. It adds a day/night lighting control to the map toolbar.

## `manifest.json`

```json
{
  "slug": "daynight-cycle",
  "name": "Day/Night Cycle",
  "version": "1.0.0",
  "description": "Adds a day/night lighting cycle to the MapLibre map viewer",
  "capabilities": ["map.tools"]
}
```

:::note
Only one capability declared — `map.tools`. The plugin touches nothing else in the app.
:::

## `index.ts`

```ts
import type { PluginContext } from '../sdk/types'
import { SunMoon } from 'lucide-react'
import { DayNightToolbarIcon } from './components/DayNightToolbarIcon'

export function activate(ctx: PluginContext): void {
  ctx.register('map.tools', {
    id: 'daynight-toggle',
    label: 'Day/Night Cycle',
    icon: SunMoon,
    component: DayNightToolbarIcon,
    stayActive: true,        // keeps the panel open between map interactions
  })
}
```

**`stayActive: true`** — most toolbar tools are one-shot actions. Setting `stayActive` keeps the floating panel open while the user pans and zooms the map. Without it, the panel would close on every map interaction.

**No `deactivate`** — the component cleans up its own map layers via a React `useEffect` cleanup function. No plugin-level teardown is needed.

## `components/DayNightToolbarIcon.tsx` — key patterns

```tsx
import type { MapToolProps } from '../../sdk/types'
// ✓ Only imports from sdk/. No imports from src/core/.

export function DayNightToolbarIcon({ map }: MapToolProps) {
  // map is MapLibre Map | null

  // 1. Track map longitude → derive solar time offset
  React.useEffect(() => {
    if (!map) return
    const update = () => setTimeOffset(getTimeOffset(map.getCenter().lng))
    update()
    map.on('moveend', update)
    return () => { map.off('moveend', update) }  // cleanup
  }, [map])

  // 2. Apply lighting to the map on every time change
  React.useEffect(() => {
    if (!map || !map.isStyleLoaded()) return
    if (!isEnabled) { removeLayers(map); return }
    map.setLight(getLight(timeOfDay, timeOffset))
    // ... manage background overlay layer opacity
  }, [timeOfDay, isEnabled, timeOffset, map])

  // 3. Clean up map layers on component unmount
  React.useEffect(() => {
    return () => { if (map) removeLayers(map) }
  }, [map])
}
```

**Key patterns**

- **Guard `map` for null** before every call — the component mounts before the map is guaranteed ready.
- **`useEffect` cleanup** removes map event listeners and layers. Never leave dangling map listeners.
- **Pure logic in `lib/sun.ts`** — all solar calculations (time offset, light config, overlay opacity) live in a separate file with no React or map imports. This makes them independently testable.

## `lib/sun.ts` — isolation in practice

```ts
// lib/sun.ts — no React, no MapLibre, no core imports
import SunCalc from 'suncalc'

export function getTimeOffset(lng: number): number { /* ... */ }
export function getLight(sliderMinutes: number, offset: number): LightConfig { /* ... */ }
export function getOverlayOpacity(sliderMinutes: number, offset: number): number { /* ... */ }
```

Pure functions with no side effects are easier to test and easier to reason about. If your plugin has non-trivial logic, extract it to a `lib/` file and write unit tests for it.
