---
title: usePlugin hooks
description: Hooks for plugin installations, per-user plugin settings, and the plugin key-value store.
---

# usePlugin hooks

Hooks for plugin state: which plugins an organization has installed, whether each user runs them, and the per-plugin document store.

See [Shared conventions](./overview.md#shared-conventions) for the loading and error fields the read hooks return.

| Hook | Description |
|------|-------------|
| `usePluginInstallations` | Fetches the organization's plugin installations |
| `usePluginUserSettings` | Fetches the current user's per-plugin settings |
| `usePluginRecords` | Reads and writes one plugin's documents in one collection |
| `usePluginActions` | The write functions for installations and user settings |

## `usePluginInstallations()`

Fetches the organization's installations as `installations: PluginInstallation[]`.

```tsx
const { installations, isLoading } = usePluginInstallations();
```

## `usePluginUserSettings()`

Fetches the current user's settings as `userSettings: PluginUserSetting[]`. There is no user id parameter: the server resolves the user from the session, so a client cannot read another user's settings.

## `usePluginRecords(pluginId, collection)`

One plugin's documents in one collection. Keyed on both, so two collections of the same plugin cache separately and a write to one does not revalidate the other.

| Field | Type | Description |
|-------|------|-------------|
| `records` | `PluginRecord[]` | The documents in the collection |
| `put` | `(key: string, value: unknown) => Promise<PluginRecord>` | Creates or replaces one document |
| `remove` | `(key: string) => Promise<void>` | Deletes one document |

```tsx
const { records, put, remove } = usePluginRecords(pluginId, "notes");

await put("note-1", { text: "Reviewed" });
```

Both writes revalidate the collection. `pluginId` comes from the plugin scope at the call site, never from the plugin itself.

## `usePluginActions()`

The write functions for installations and user settings. These are plain async functions rather than SWR mutations, because each is a per-plugin upsert triggered from a switch and is called from event handlers rather than during render.

| Function | Signature |
|----------|-----------|
| `setInstallation` | `(pluginId: string, patch: Partial<PluginInstallation>) => Promise<void>` |
| `removeInstallation` | `(pluginId: string) => Promise<void>` |
| `setUserSetting` | `(pluginId: string, patch: Partial<PluginUserSetting>) => Promise<void>` |

```tsx
const { setInstallation, setUserSetting } = usePluginActions();

await setInstallation(pluginId, { enabled: true });
```

Each revalidates the list it changed.

## Related

- [ApiAdapter → Plugins](./ports.md#plugins)
- [Plugins overview](/docs/plugins/overview)
- [Mounting a plugin](/docs/plugins/mounting-a-plugin)
