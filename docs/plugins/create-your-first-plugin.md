---
title: Create your first plugin
description: Build a working CDT plugin — manifest, entry point, component, translations — and see it in the viewer.
sidebar_position: 2
category: plugins
status: draft
last_updated: 2026-08-06
---

# Create your first plugin

By the end of this you will have a button in the map toolbar that opens a small panel, translated into three languages.

:::info Where this plugin will live
This walkthrough builds a plugin compiled into `@collabdt/core`, under `src/core/plugins/<slug>/`. That is the route for a plugin you want present in every CDT installation, and it means opening a pull request against core.

To add a plugin to your own CDT platform without rebuilding anything, build the same code into a folder and [mount it](./mounting-a-plugin.md) instead. The plugin source is identical either way; only how it reaches CDT differs.
:::

## The fast path

To skip the boilerplate:

```bash
npx create-cdt-plugin
```

That writes the manifest, the build configuration, an entry point and a working component for whichever capability you pick, with `hostApi` and the slug already correct. The rest of this page walks through what it generates, which is worth reading once even if you never write those files by hand.

## 1. Create the folder

```
src/core/plugins/hello-map/
  manifest.json
  index.ts
  components/
    HelloMapTool.tsx
```

## 2. Write the manifest

Everything about your plugin that CDT needs before running any of your code — including your translations, so a small plugin is a single file to write and a single file to hand a translator.

```json
{
  "slug": "hello-map",
  "name": "Hello Map",
  "version": "1.0.0",
  "hostApi": 1,
  "description": "Shows where the map is currently centred.",
  "author": "Your name",
  "capabilities": ["map.tools"],
  "requiredPermissions": [],
  "configSchema": {
    "type": "object",
    "properties": {
      "decimals": { "type": "number", "default": 5 }
    }
  },
  "messages": {
    "en": { "title": "Hello Map", "copy": "Copy coordinates" },
    "fr": { "title": "Bonjour la carte", "copy": "Copier les coordonnées" },
    "es": { "title": "Hola mapa", "copy": "Copiar las coordenadas" }
  }
}
```

| Field | Why it matters |
|---|---|
| `slug` | Your namespace. Contributions, settings, translations and stored data are all keyed by it. |
| `hostApi` | Which version of the plugin system you built against. CDT refuses to load a mismatch, so an incompatible plugin fails clearly at load instead of confusingly at render. Omitting it is allowed but warned about. |
| `capabilities` | What you are allowed to register. Registering something you did not declare throws. |
| `requiredPermissions` | Shown to an administrator before they add your plugin. Be honest here. |
| `messages` | Optional. Merged under `plugins.<slug>`, so you cannot collide with core or another plugin. |

## 3. Write the entry point

```ts
import { HelloMapTool } from './components/HelloMapTool'

import type { PluginContext } from '../sdk/types'

export function activate(ctx: PluginContext): void {
  ctx.register('map.tools', {
    id: 'hello-map',
    label: 'Hello Map',
    icon: 'MapPin',
    component: HelloMapTool,
    stayActive: true,
  })
}
```

Export `deactivate(ctx)` too if you set up timers or listeners outside React; CDT calls it when the plugin is switched off, then removes your contributions automatically.

## 4. Write the component

You write the **panel content**. CDT wraps it in the standard toolbar button and dropdown using the `label` and `icon` from your registration.

```tsx
'use client'

import * as React from 'react'

import { Button, Separator } from '../../sdk/components'
import { usePluginConfig } from '../../sdk/config'
import { usePluginTranslations } from '../../sdk/messages'

import type { MapToolProps } from '../../sdk/mapViewer'
import type { ToolbarToolProps } from '../../sdk/types'

export function HelloMapTool({ map }: ToolbarToolProps & MapToolProps) {
  const t = usePluginTranslations()
  const { decimals = 5 } = usePluginConfig<{ decimals?: number }>()
  const [view, setView] = React.useState<{ lat: number; lng: number } | null>(null)

  React.useEffect(() => {
    if (!map) return                       // nullable: guard, do not assert

    const read = () => {
      const c = map.getCenter()
      setView({ lat: c.lat, lng: c.lng })
    }

    read()
    map.on('move', read)
    return () => { map.off('move', read) } // always clean up
  }, [map])

  return (
    <div className="w-60 p-1">
      <p className="px-2 py-1 text-sm font-medium">{t('title', 'Hello Map')}</p>
      <Separator className="my-1" />
      {view
        ? <p className="px-2 py-1 text-sm tabular-nums">{view.lat.toFixed(decimals)}, {view.lng.toFixed(decimals)}</p>
        : <p className="px-2 py-1 text-sm text-muted-foreground">Waiting for the map…</p>}
    </div>
  )
}
```

Three habits worth copying:

- **Guard the viewer handle.** It is null until the viewer finishes initialising.
- **Clean up every listener.** A leaked `move` handler keeps firing after the user switches viewers.
- **Pass a fallback to `t()`.** The second argument is used when your plugin has no translation for that key — so an untranslated plugin still reads correctly rather than showing a raw key.

## 5. Register it

Add the manifest to `src/core/plugins/manifests.ts`, then pair it with a **dynamic import** in `installed.ts`:

```ts
export const INSTALLED_PLUGINS: PluginSource[] = [
  { manifest: manifestFor('hello-map'), entry: () => import('./hello-map') },
]
```

The dynamic import matters. `installed.ts` is reachable from every route, so a static import would pull your components — and for a BIM plugin, the whole 3D engine — into the initial bundle. A thunk defers that until your plugin activates, so it lands in its own chunk.

Manifests live in a separate file from entries because the translation layer reads manifests without importing any plugin components.

## 6. See it

Your plugin now exists but is switched off. Open **Extensions** in the sidebar, find it under *Found on this server*, and click **Add to organization**. See [Installing and enabling plugins](./installing-and-enabling.md).

## The rules

- **Import only from `../sdk/*` and your own files.** Not from core, not from the plugin host. This is enforced by a lint rule that fails the build, because a plugin that reaches into core works in-repo and breaks the moment it becomes a standalone bundle.
- **`ctx.register()` is the only way to contribute.** Once per contribution, during `activate`.
- **Use the components from `../sdk/components`.** They are the approved subset.

## Next

- [Capabilities](./all-capabilities.md) — everything you can register, and what each receives
- [hello-bim](./hello-bim-example.md) — a fuller example that reads a BIM model
