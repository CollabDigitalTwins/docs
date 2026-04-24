---
title: PluginContext API
description: The three members of the PluginContext handed to every activate() function.
sidebar_position: 3
category: plugins
status: draft
last_updated: 2026-04-24
---

# PluginContext API

Your `activate(ctx)` function receives a `PluginContext` scoped to your plugin. It has three members:

```ts
interface PluginContext {
  pluginId: string                                      // your plugin's slug
  config:   Record<string, unknown>                     // org-level settings
  register<K extends keyof CapabilityRegistry>(
    key:  K,
    item: CapabilityRegistry[K],
  ): void
}
```

## `ctx.pluginId`

Your plugin's slug, as declared in `manifest.json`. Useful for namespacing storage keys or log messages.

## `ctx.config`

Org-level settings loaded from the database at startup. The shape is defined by `manifest.configSchema`. If your plugin has no configuration, this is an empty object.

## `ctx.register(key, item)`

The only way to contribute UI or behaviour to the app. The `key` must be one of the 11 capability keys (see [All 11 capabilities](./all-capabilities.md)). If `key` is not declared in your manifest's `capabilities` array, this throws immediately — by design.

The `item` shape is determined by the key. TypeScript will enforce the correct shape at compile time.
