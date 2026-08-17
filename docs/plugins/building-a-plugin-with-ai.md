---
title: Building a plugin with AI
description: A prompt template for generating a CDT plugin, the mistakes models commonly make, and how to check the result.
sidebar_position: 6
category: plugins
status: draft
last_updated: 2026-08-17
---

# Building a plugin with AI

A CDT plugin suits an AI coding assistant well: it is small, the interface is narrow, and the build rejects most of the ways it can go wrong.

## Supply the right pages

Without them, a model will invent an API that looks plausible and does not exist. Include these URLs, or the pages themselves, in the prompt:

- [Create your first plugin](./create-your-first-plugin.md)
- [Capabilities](./all-capabilities.md)
- [Run your plugin](./mounting-a-plugin.md)

## A prompt template

The constraints matter more than the description of the behaviour, because they cannot be inferred from the plugin folder.

```text
Write a CDT platform plugin.

What it should do:
  <describe the behaviour>

Scaffold it first, do not hand-write the files:
  npx create-cdt-plugin --mode external --name "<Name>" --surface <capability> \
    --body example --yes

Constraints, all of which are load-bearing:
- The capability must be one of exactly these eight: map.tools, bim.tools,
  pointcloud.tools, map.layers, viewer.legends, viewer.tabs, data.pages,
  ui.dialogs. Nothing else exists. Do not invent one.
- Every capability you register must also be listed in manifest.capabilities.
- Do not import three, @thatopen/components, maplibre-gl or lucide-react as
  runtime values. Viewer instances arrive as props. Icons are named by string.
  Type-only imports of maplibre-gl or @thatopen/components are fine.
- manifest.slug must equal the folder name.
- hostApi must be 1.
- The build output is a single file, dist/index.js.
- Put every user-visible string in manifest.json under messages, and read it with
  usePluginTranslations(), passing an inline English fallback at each call.
- Render panel content only. The platform supplies the toolbar button and dropdown.

Then run npm install and npm run build, and fix anything the import guard reports.
```

## Common failures

**An invented capability.** `data.columns`, `commands` and `widgets` all read like plausible names. Registering one is a compile error when the scaffolded types are used, but a model that hand-writes the manifest and casts around the types can produce a plugin that builds, loads and displays nothing. When a plugin does not appear after being enabled, check the capability name first.

**Registering something the manifest does not declare.** This is easily introduced when a second surface is added later. CDT rolls back every contribution the plugin made and marks it errored, so the whole plugin disappears rather than only the new part.

**Importing the viewer library directly.** Asked to read the map centre, a model often reaches for `import { Map } from 'maplibre-gl'` instead of taking the viewer as a prop. The build catches this and names the specifier. The correction should be applied as given: a second copy of maplibre or three.js in the browser is a crash, not a size regression.

**A multi-file build.** A model that writes its own build configuration tends to enable code splitting, producing `dist/index.js` plus sibling chunks. CDT serves exactly one file per plugin, so the chunks fail to resolve and the plugin dies at load. Use the scaffolded `tsup.config.ts` unchanged.

**A slug that drifts from the folder name.** Renaming the folder, or editing the manifest's `name` and assuming the slug followed, produces a folder the scanner skips with a single log line.

## Checking the result without reading the code

In order. Each step rules out a different class of failure, and only the last one is conclusive.

1. **`npm run build` exits 0.** This shows the plugin imports only what CDT can resolve, and that it emits one file.
2. **It appears under Found on this server.** This shows the folder was discovered: `dist/index.js` exists, the manifest parses, and the slug matches the folder name. If it is missing while others are listed, the server log names the folder and the reason.
3. **It renders once enabled.** The only step that confirms the plugin works. A red card mentioning the host API means it was built against a different version of CDT.

A plugin that reaches step 2 and fails step 3 is almost always registering a capability that was not declared, or one that does not exist.

## A note on trust

A plugin runs with the same access as CDT itself. There is no sandbox: it is not isolated from the app, its data, or the browser session of anyone who has it enabled.

This matters more for generated code than for hand-written code, because the usual basis for trusting a plugin is having read it. Review what the model produced before mounting it anywhere holding real data.
