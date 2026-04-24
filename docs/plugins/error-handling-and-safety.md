---
title: Error handling & safety
description: How the host isolates plugin failures, enforces the manifest contract, and cleans up on unload.
sidebar_position: 5
category: plugins
status: draft
last_updated: 2026-04-24
---

# Error handling & safety

## Isolated failures

If your `activate()` throws an unhandled error, the host catches it, logs it to the console, and continues loading the remaining plugins. A broken plugin cannot crash the app or prevent other plugins from loading.

`host/host.ts` — relevant excerpt (for reference, do not copy)

```ts
try {
  await entry.activate(context)
  loaded.status = 'active'
} catch (err) {
  loaded.status = 'errored'
  console.error(`Plugin "${manifest.slug}" activation failed:`, err)
}
```

## Capability guard

Calling `ctx.register()` with a key not declared in your manifest throws immediately:

```
Error: Plugin "my-plugin" did not declare capability "sidebar.items" in its manifest
```

This is intentional. Declare what you use — the manifest is the contract.

## Cleanup with `deactivate`

If your plugin sets up timers, event listeners, or other side effects, export a `deactivate(ctx)` function:

```ts
export function activate(ctx: PluginContext): void {
  // ... register contributions
}

export function deactivate(ctx: PluginContext): void {
  // clean up timers, remove event listeners, etc.
}
```

The host calls `deactivate()` (if exported) and then removes all registry contributions automatically when a plugin is unloaded.
