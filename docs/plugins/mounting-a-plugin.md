---
title: Mounting a plugin
description: Load a plugin into a running CDT platform deployment by dropping a folder next to it, without rebuilding the image or contributing to core.
sidebar_position: 5
category: plugins
status: draft
last_updated: 2026-08-10
---

# Mounting a plugin

You can add a plugin to your own CDT platform deployment without rebuilding it and
without going through us. You build the plugin, put the folder where the platform
can see it, and restart. It then appears on the extensions page for an
administrator to add.

This is for people running their own CDT platform. It is not available on the
CDT-hosted platform, where a plugin becomes available by being reviewed and
included in a release.

:::warning Read this before switching it on
A mounted plugin runs on the main thread with the same access as the CDT platform
itself. There is no sandbox. It can do anything the application can do: read any
data the signed in user can read, call any endpoint, and see anything on the page.

Treat mounting a plugin exactly as you would treat running someone else's server
code. Only mount plugins you trust and have read.

This is why loading is off unless you deliberately turn it on, and why an
administrator still has to add a plugin before it runs.
:::

## What a plugin folder looks like

```
plugins/
  hello-mounted/
    manifest.json      # slug, capabilities, config schema, translations
    dist/
      index.js         # the bundle the platform serves to the browser
```

Two rules the server enforces when it scans:

- **The folder name must match the `slug` in the manifest.** That name is the
  namespace the plugin's settings and stored records are keyed by. A folder whose
  manifest disagrees is skipped, so a plugin's data can never end up filed under a
  different name from the one its code is served as.
- **`dist/index.js` must exist.** A folder without it was mounted before being
  built. It is skipped at discovery rather than offered and failing later, because
  the person who mounted it is the one who can fix it.

Anything skipped is logged with the folder name and the reason. One broken plugin
never hides the others.

## Turning it on

### Docker Compose

```yaml
services:
  cdt:
    environment:
      PLUGINS_ENABLED: "true"
      PLUGINS_DIR: /app/plugins
    volumes:
      # Read-only on purpose: the platform only ever reads a plugin, and a writable mount
      # would let a plugin rewrite itself or its neighbours.
      - ./plugins:/app/plugins:ro
```

Then `docker compose up -d` and the plugins are picked up at startup.

### Environment variables

| Variable | Default | What it does |
|---|---|---|
| `PLUGINS_ENABLED` | unset (off) | Nothing is scanned, served or loaded unless this is `true` |
| `PLUGINS_DIR` | `/app/plugins` | Where the server looks for plugin folders |
| `PLUGINS_DEV` | unset (off) | Re-scan on every request and stop caching bundles. Development only |

With `PLUGINS_ENABLED` unset, none of this exists: the discovery endpoint returns
an empty list and the bundle endpoint returns 404 for everything, whatever is on
disk.

`PLUGINS_DIR` is a path inside the container. If you run the platform directly on
your machine rather than in Docker, set it to a real absolute path on that
machine: the default `/app/plugins` resolves somewhere unhelpful, and the scan
reports an unreadable directory instead of finding your plugin.

## Adding it in the app

Mounting a folder does not run anything. Discovery and enablement are separate
steps, deliberately.

1. Open **Extensions** in the sidebar.
2. The plugin appears under **Found on this server**, showing where it was found
   and what access it is asking for.
3. An administrator clicks **Add to organization**.
4. Each person then chooses whether it runs for them, as with any other plugin. See
   [Installing and enabling plugins](./installing-and-enabling.md).

## The development loop

Save, rebuild the plugin (roughly a second or two), refresh the browser.

There is no hot reloading. A prebuilt CDT platform image cannot rebuild your
plugin for you, so the page does not update itself the way it would in a normal
web project. Set
`PLUGINS_DEV=true` so nothing is cached and a refresh is enough.

## What a mounted plugin may import

A plugin keeps ordinary imports. The CDT platform publishes an import map that
points them at its own instances, so your plugin shares React and the SDK with the
application rather than shipping copies.

Available at runtime:

- `react`, `react-dom`, `react/jsx-runtime`
- `@collabdt/core/plugins-sdk` and its `/config`, `/messages`, `/store` and
  `/components` entries

Deliberately not available: `@thatopen/components`, `three`, `maplibre-gl`,
`lucide-react`. Your plugin receives viewer instances as props and names icons by
string, so it never needs them. This is not an arbitrary restriction: a second copy
of React breaks hooks outright, and a second copy of three.js crashes the viewer.
Bundling either one into your plugin is the one reliable way to break a CDT
platform installation, so the runtime does not let you.

If your bundler is configured to inline dependencies, mark those specifiers as
external so they survive into the built file as plain imports.

## Version compatibility

Declare `hostApi` in your manifest, set to the plugin host API version you built
against:

```json
{
  "slug": "hello-mounted",
  "hostApi": 1
}
```

The CDT platform refuses to load a plugin whose declared version does not match,
and says so on the plugin's card. That is deliberately better than letting it load
and fail
somewhere less obvious later. The host API version is separate from the
`@collabdt/core` package version: core can ship many releases without moving it,
and a plugin built against API 1 keeps working across all of them.

## Troubleshooting

| What you see | What it usually means |
|---|---|
| Nothing under **Found on this server** | `PLUGINS_ENABLED` is not `true`, or `PLUGINS_DIR` does not point where you think |
| Your plugin is missing, others are listed | It was skipped. Check the server log for the folder name and the reason: no `dist/index.js`, an unparseable manifest, or a slug that disagrees with the folder name |
| The card is red, mentioning host API | The plugin was built for a different version of the CDT platform. Rebuild it against yours, or update the platform |
| "Invalid hook call" in the browser console | The plugin bundled its own React. Mark `react` as external in your build |
| Changes to the plugin do not appear | Set `PLUGINS_DEV=true`, and confirm you rebuilt the plugin rather than only editing its source |

## What is still missing

There is no scaffolding command or build preset yet, so you are configuring your
own bundler for now. There is also no catalogue: plugins are found on your own
server, not browsed from a marketplace. Both are known gaps rather than
oversights.
