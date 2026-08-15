---
title: Building a plugin with AI
description: How to prompt a model to write a CDT platform plugin, what these models reliably get wrong, and how to check the result without reading the code.
sidebar_position: 9
category: plugins
status: draft
last_updated: 2026-08-13
---

# Building a plugin with AI

A CDT platform plugin is a good fit for an AI coding assistant. It is small, it has a narrow interface, and the build refuses most of the ways it can be got wrong. This page is for someone who will prompt a model to write one rather than write it by hand.

## Give the model the right pages

A model given none of these will invent an API that looks plausible and does not exist. Paste the URLs, or the pages themselves, into your prompt:

- [Create your first plugin](./create-your-first-plugin.md)
- [PluginContext API](./plugin-context-api.md)
- [Capabilities](./all-capabilities.md)
- [Mounting a plugin](./mounting-a-plugin.md)

## A prompt template

The constraints matter more than the description of what you want, because they cannot be inferred from the plugin folder alone.

```text
Write a CDT platform plugin.

What it should do:
  <describe the behaviour>

Scaffold it first, do not hand-write the files:
  npx create-cdt-plugin --mode external --name "<Name>" --surface <capability> \
    --body example --yes

Constraints, all of which are load-bearing:
- The capability must be one of exactly four: map.tools, bim.tools,
  pointcloud.tools, map.legends. Nothing else renders. Do not invent one.
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

## What models reliably get wrong here

Four failures come up repeatedly. Three of them look like success.

**Inventing a capability.** `map.layers`, `data.columns` and `commands` all read like things that should exist, and they appear in the platform's own list of capabilities planned for later. A plugin registering one builds, loads, registers without error and shows nothing. There is no log line, because nothing went wrong: the plugin contributed to a surface with no consumer. If a plugin does not appear after being enabled, check the capability name first.

**Importing the viewer library directly.** Asked to read the map centre, a model will often reach for `import { Map } from 'maplibre-gl'` rather than taking the viewer as a prop. This is the one failure the tooling catches for you: the build fails and names the specifier. Take the correction at face value rather than working around it, because a second copy of maplibre or three.js in the browser is a crash rather than a size regression.

**Emitting a multi-file build.** A model that writes its own build configuration tends to enable code splitting, which produces `dist/index.js` plus sibling chunks. The platform serves exactly one file per plugin, so the chunks fail to resolve and the plugin dies at load. Use the scaffolded `tsup.config.ts` unchanged. It calls a preset that refuses the overrides which would break this, rather than accepting them quietly.

**Letting the slug and the folder name drift apart.** Renaming the folder, or editing `manifest.json`'s name field and assuming the slug followed, gives a folder the scanner skips with a single log line. Nothing appears on the plugins page and nothing explains why.

## Checking the result without reading the code

In order. Each step rules out a different class of failure, and only the last one proves anything.

1. **The build passes.** `npm run build` exits 0. This proves the plugin imports only what the platform can resolve, and that it emits one file.
2. **The plugin appears under Found on this server** on the plugins page. This proves the folder was discovered: `dist/index.js` exists, the manifest parses, and the slug matches the folder name. If it is missing while others are listed, the server log names the folder and the reason it was skipped.
3. **It renders once enabled.** This is the only step that proves the plugin works. A red card mentioning the host API means it was built against a different version of the platform.

A plugin that reaches step 2 and fails step 3 is almost always registering under a capability nothing renders.

## A warning worth reading twice

A mounted plugin runs with the same access as the CDT platform itself. There is no sandbox: it is not isolated from the application, its data, or the browser session of whoever has it enabled.

This matters more for generated code than for code you wrote, because the usual reason to trust a plugin is having read it. Read what the model produced before mounting it anywhere that holds real data, and treat a plugin from someone else the way you would treat any dependency you are about to give full access to.
