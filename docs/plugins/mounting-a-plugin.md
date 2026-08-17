---
title: Run your plugin
description: Build a plugin, load it into a running CDT deployment, enable it, and diagnose it when it does not appear.
sidebar_position: 4
category: plugins
status: draft
last_updated: 2026-08-17
---

# Run your plugin

A plugin can be added to a self-hosted CDT deployment without rebuilding it. Build the plugin, place the folder where CDT can see it, restart, and add it on the Plugins page.

This applies to self-hosted deployments. On the CDT-hosted platform, a plugin becomes available by being reviewed and included in a release.

:::warning
A plugin runs with the same access as CDT itself, and there is no sandbox. Only mount plugins that are trusted and have been read. See [Security](./overview.md#security).
:::

## 1. Build it

```bash
npm install && npm run build
```

That produces `dist/index.js` — a single file, which is what CDT serves to the browser. The resulting folder looks like this:

```
plugins/
  map-centre/
    manifest.json
    dist/
      index.js
```

**The folder name must match the `slug` in the manifest,** and `dist/index.js` must exist. CDT skips a folder that fails either check and logs the folder name and the reason, so one broken plugin never hides the others.

## 2. Place it where CDT can see it

```yaml
services:
  cdt:
    environment:
      PLUGINS_ENABLED: "true"
      PLUGINS_DIR: /app/plugins
    volumes:
      - ./plugins:/app/plugins:ro
```

Then `docker compose up -d`. The mount is read-only on purpose: CDT only ever reads a plugin.

| Variable | Default | Effect |
|---|---|---|
| `PLUGINS_ENABLED` | off | Nothing is scanned, served or loaded unless this is `true` |
| `PLUGINS_DIR` | `/app/plugins` | Where CDT looks for plugin folders |
| `PLUGINS_DEV` | off | Re-scan on every request and stop caching bundles. Development only |

`PLUGINS_DIR` is a path inside the container. If CDT runs directly on a machine rather than in Docker, set it to a real absolute path there, or the scan reports an unreadable directory.

## 3. Enable it

Mounting a folder does not run anything.

1. Open **Plugins** in the sidebar.
2. The plugin appears under **Found on this server**, with where it was found and what access it requests.
3. An administrator clicks **Add to organization**.
4. Each person then chooses whether it runs for them, with **Run this for me**.

An administrator can also make a plugin on by default, or lock the choice so that it cannot be turned off. A personal setting can never enable a plugin the organization has not added.

Removing a plugin from an organization does not delete what it stored. Re-adding it picks those records back up.

## The development loop

Save, rebuild the plugin, refresh the browser. Setting `PLUGINS_DEV=true` disables caching so that a refresh is enough.

There is no hot reloading: a prebuilt CDT image cannot rebuild a plugin.

## What a plugin can import

CDT publishes an import map that points a plugin's imports at CDT's own instances, so the plugin shares React and the SDK with the app rather than shipping copies.

Available at runtime:

- `react`, `react-dom`, `react/jsx-runtime`
- `@collabdt/core/plugins-sdk`, and its `/components`, `/config`, `/messages`, `/state`, `/store` and `/ui` entries

That list is exactly what CDT resolves. `usePluginBimAppearance`, `usePluginPermissions` and the SDK's data hooks are not in it, so they are currently available only to a plugin compiled into core.

Not available: `@thatopen/components`, `three`, `maplibre-gl`, `lucide-react`. None are needed — viewer instances arrive as props and icons are named by string — and a second copy of React or three.js in the page is a crash rather than a size regression. Type-only imports of `maplibre-gl` and `@thatopen/components` are fine, and `@collabdt/plugin-kit/types/*` provides those types without importing either package.

The scaffolded `tsup.config.ts` handles this. It calls `@collabdt/plugin-kit`'s preset, which marks exactly these specifiers external and then fails the build on anything else, naming what it rejected. A hand-configured bundler must mark them external too, and the built file's imports should be checked directly, since getting this wrong does not fail loudly.

## Version compatibility

`hostApi` in the manifest declares the plugin API version the plugin was built against:

```json
{ "slug": "map-centre", "hostApi": 1 }
```

CDT refuses to load a mismatch and says so on the plugin's card. The plugin API version is separate from the `@collabdt/core` package version: core can ship many releases without moving it, and a plugin built against API 1 keeps working across all of them.

## Troubleshooting

| Symptom | Usual cause |
|---|---|
| Nothing under **Found on this server** | `PLUGINS_ENABLED` is not `true`, or `PLUGINS_DIR` does not point where expected |
| One plugin missing, others listed | It was skipped. The server log names the folder and the reason: no `dist/index.js`, an unparseable manifest, or a slug that disagrees with the folder name |
| The card is red, mentioning host API | Built for a different version of CDT. Rebuild it against this one, or update CDT |
| "Invalid hook call" in the console | The plugin bundled its own React. Mark `react` as external |
| It loads but nothing appears | Check the capability name against [Capabilities](./all-capabilities.md), and that every registered capability is declared in the manifest |
| Changes do not appear | Set `PLUGINS_DEV=true`, and confirm the plugin was rebuilt rather than only edited |
