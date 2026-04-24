---
title: Create your first plugin
description: Five-step walkthrough — build a minimal map toolbar tool from scratch.
sidebar_position: 2
category: plugins
status: draft
last_updated: 2026-04-24
---

# Create your first plugin

This walkthrough builds a minimal map toolbar tool. Five steps, one file each.

## Directory layout

All plugins live under `src/core/plugins/` in the main repo. Create a directory named after your plugin's slug:

```
src/core/plugins/hello-map/
  manifest.json
  index.ts
  components/
    HelloMapTool.tsx
```

## manifest.json

The manifest declares your plugin's identity and which capabilities it needs. The host validates this before calling any of your code.

```json
{
  "slug": "hello-map",
  "name": "Hello Map",
  "version": "1.0.0",
  "description": "A minimal map toolbar example",
  "capabilities": ["map.tools"],
  "requiredPermissions": [],
  "configSchema": {
    "type": "object",
    "properties": {},
    "required": []
  }
}
```

**Rules**

- `slug` must be unique across all plugins and match the directory name.
- `capabilities` is the exact list of things your plugin will register. Attempting to register a capability not listed here throws at runtime.

## index.ts

Export an `activate(ctx)` function. This is the only entry point the host calls.

```ts
import type { PluginContext } from '../sdk/types'
import { Wrench } from 'lucide-react'
import { HelloMapTool } from './components/HelloMapTool'

export function activate(ctx: PluginContext): void {
  ctx.register('map.tools', {
    id: 'hello-map-tool',
    label: 'Hello Map',
    icon: Wrench,
    component: HelloMapTool,
  })
}
```

**Rules**

- Only import from `../sdk/types` and `../sdk/components` (or your own files). Never import from `src/core/` — that breaks plugin isolation.
- `ctx.register()` is the only way to contribute to the app. Call it once per contribution.

## Your component

The toolbar passes a `MapToolProps` object to your component. For map tools, that means `{ map: Map | null }`.

`src/core/plugins/hello-map/components/HelloMapTool.tsx`

```tsx
'use client'

import * as React from 'react'
import type { MapToolProps } from '../../sdk/types'
import { Button } from '../../sdk/components'

export function HelloMapTool({ map }: MapToolProps) {
  const handleClick = () => {
    if (!map) return
    console.log('Map centre:', map.getCenter())
  }

  return (
    <Button size="icon" variant="ghost" onClick={handleClick} title="Hello Map">
      🗺
    </Button>
  )
}
```

**Rules**

- Always guard against `map` being `null` — the toolbar renders before the map is guaranteed to be ready.
- Use components from `../../sdk/components` (shadcn/ui re-exports). Do not import from the app's component library directly.

## installed.ts

`src/core/plugins/installed.ts` is the single place that controls which plugins the app loads. Add your plugin here:

`src/core/plugins/installed.ts`

```ts
import type { PluginEntry, PluginManifest } from './sdk/types'
import * as helloMapPlugin from './hello-map'
import helloMapManifest from './hello-map/manifest.json'

export const INSTALLED_PLUGINS: Array<{
  manifest: PluginManifest
  entry: PluginEntry
}> = [
  { manifest: helloMapManifest as PluginManifest, entry: helloMapPlugin },
]
```

To disable a plugin, remove or comment out its entry. Nothing else needs to change.

:::note Result
After this step, start the dev server — your tool button appears in the map toolbar.
:::
