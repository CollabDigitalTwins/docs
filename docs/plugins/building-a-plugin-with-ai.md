---
title: Building a plugin with AI
description: A prompt template and a reusable skill for generating a CDT plugin.
sidebar_position: 7
---

# Building a plugin with AI

A CDT plugin suits an AI coding assistant well: it is small, the interface is narrow, and the build rejects most of the ways it can go wrong.

## Supply the right pages

Without them, a model will invent an API that looks plausible and does not exist. Include these URLs, or the pages themselves, in the prompt:

- [Create your first plugin](./create-your-first-plugin.md)
- [Capabilities](./all-capabilities.md)
- [Run your plugin](./mounting-a-plugin.md)
- [Mounted plugins in practice](./mounted-plugins-in-practice.md), if the plugin is loaded at runtime rather than compiled into core

## A prompt template

The constraints matter more than the description of the behaviour, because they cannot be inferred from the plugin folder.

```text
Write a CDT platform plugin.

What it should do:
  <describe the behaviour>

Scaffold it first, do not hand-write the files:
  npx create-cdt-plugin --name "<Name>" --surface <capability> \
    --body example --yes

Constraints, all of which are load-bearing:
- The capability must be one of exactly these seven: map.tools, bim.tools,
  map.layers, viewer.legends, viewer.tabs, data.pages, ui.dialogs. Nothing
  else exists. Do not invent one.
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

## A reusable skill instead of a prompt

Pasting the template above works, but it has to be re-pasted and re-edited every time. If your
assistant supports **skills**, a file it loads by itself when a task matches its description,
install the plugin-authoring skill once and it applies to every plugin you write afterwards,
including follow-up work weeks later in a fresh session.

For Claude Code for example, save the file below as `.claude/skills/cdt-plugin-authoring/SKILL.md` in your
project, or in `~/.claude/skills/` to have it everywhere. Other assistants can use the same text
as a rules file or a system prompt: the content is what matters, not the location.

Two things it does that a pasted prompt does not: it survives a long task where earlier context
gets summarised away, and its `description` is what makes the assistant reach for it unprompted
when you come back three days later and say "add a floor filter to the BIM viewer".

````markdown
---
name: cdt-plugin-authoring
description: Author a CDT platform plugin, from scaffold to a plugin rendering in the viewer. Use when asked to build, scaffold, or debug a plugin for the CDT platform.
---

# Author a CDT platform plugin

$ARGUMENTS may name the plugin, the surfaces it targets, or the behaviour wanted.

## Constraints that are invisible from inside a plugin folder

Read these before writing any code. Each one is a failure that looks like success.

- **The capability must be one of exactly seven:** `map.tools`, `bim.tools`,
  `viewer.legends`, `map.layers`, `data.pages`, `viewer.tabs`, `ui.dialogs`.
  Nothing else exists. Inventing a plausible name such as `data.columns`, `commands` or
  `widgets` produces a plugin that builds, loads, registers and shows nothing, with nothing
  in any log pointing at the cause. **If a plugin appears on the Plugins page but never
  renders, check the capability name first.**
- **A `viewer.tabs` or `viewer.legends` registration with no `viewers` appears in every
  viewer.** That is what omitting the field means, so it fails as a location nobody chose
  rather than as an error. Only `map` and `bim` host these; any other value
  renders nowhere, and the platform logs a warning naming the plugin and the value.
- **Never import `three`, `@thatopen/components`, `maplibre-gl` or `lucide-react` as runtime
  values.** Viewer instances arrive as props and icons are named by string. A second copy of
  React breaks hooks outright; a second copy of three.js crashes the BIM viewer. Type-only
  imports of `maplibre-gl` (map) and `@thatopen/components` (BIM) are correct and expected.
- **`manifest.slug` must equal the folder name.** The scanner requires it and skips the folder
  with only a log line otherwise, so a mismatch is a plugin that never appears. Renaming the
  folder, or editing the manifest's `name` and assuming the slug followed, is the usual cause.
- **`manifest.slug` must not collide with a plugin that ships with the platform**
  (`hello-map`, `hello-bim`). A mounted folder cannot shadow one: it loads and is then ignored
  forever.
- **Every capability registered must be declared in `manifest.capabilities`.** Registering an
  undeclared one throws, and the platform then rolls back every contribution that plugin made
  and marks it errored. Activation is all-or-nothing on purpose. This is easiest to introduce
  when a second surface is added later.
- **`hostApi` must be `1`.** Omitting it is permitted and only warned about, which defers a
  future incompatibility to a render-time failure.
- **The output is a single file, `dist/index.js`.** The platform serves exactly that path, so a
  code-split chunk would not resolve. Mounting unbuilt source is the likeliest mistake of all.

A plugin is *not* limited to one component. Source may span as many files as it likes, and
`activate()` may register several contributions across several surfaces. Each entry needs its
own `id`: contributions are de-duplicated by plugin and id, so reusing one silently drops the
second. What is ruled out is lazy-loading part of the plugin itself.

## Steps

1. **Scaffold with explicit flags** rather than prompts, so the run is reproducible. Run it
   from the folder you keep plugins in:

   ```bash
   npx create-cdt-plugin \
     --mode external --name "Room Inventory" --surface map.tools --body example \
     --description "Counts rooms per floor." --yes
   ```

   `--surface` is repeatable and takes a comma-separated list, so a plugin spanning surfaces is
   `--surface bim.tools,viewer.tabs` rather than a later rewrite. Use `--body example` when the
   plugin reads the viewer, `--body empty` when it does not. Never hand-write `manifest.json`:
   the scaffolder fills in `hostApi`, the slug, the capability list and the three locale blocks.

2. **Implement the behaviour** in `src/components/<Name>Tool.tsx`. Render panel content only.
   The platform supplies the button and dropdown around it from the registration's `label` and
   `icon`, so a plugin that draws its own floating card ends up with it inside the toolbar
   strip.

3. **Bind a context slot per viewer if the plugin touches more than one.** The per-surface
   aliases (`MapPluginContext`, `BimPluginContext`) each bind one viewer, so a second viewer's
   component would otherwise be checked against `unknown`. The scaffolder writes this for you:

   ```ts
   import type { PluginContext } from '@collabdt/plugin-kit/types/ui'
   import type { MapToolProps } from '@collabdt/plugin-kit/types/map'
   import type { BimToolProps } from '@collabdt/plugin-kit/types/bim'

   type Ctx = PluginContext<MapToolProps, BimToolProps>
   ```

   The order is map, BIM, legend; trailing slots you do not use can be left off.

4. **Keep every user-visible string** in `manifest.json`'s `messages` and read it with
   `usePluginTranslations()`, passing an inline English fallback at each call. Translate the
   `fr` and `es` blocks, which start as copies of the English ones.

5. **Build:**

   ```bash
   cd <slug>
   npm install
   npm run build
   ```

   The build runs an import guard and fails if the plugin imports anything the platform
   publishes no shim for, naming the specifier. **A guard failure is a real problem in the
   plugin, never something to work around by editing the tsup config.** The preset refuses
   overrides of `entry`, `outDir`, `format`, `external` and `onSuccess` for exactly this reason.

6. **Mount it.** The deployment's `.env` needs `PLUGINS_ENABLED=true` and an absolute
   `PLUGINS_DIR` pointing at the folder that holds your plugin — the default `/app/plugins` is a
   container path. Add `PLUGINS_DEV=true` while developing so nothing is cached. There is no hot
   reloading: save, rebuild, refresh. Under Docker the folder is mounted read-only, so run the
   build on the host rather than inside the container.

7. **Enable it.** On the Plugins page an administrator adds it to the organization, then each
   person chooses whether it runs for them.

## Verification

Nothing short of the last step proves it works.

1. `npm run build` exits 0, passing the import guard. This shows the plugin imports only what
   the platform can resolve, and that it emits one file.
2. The plugin appears on the Plugins page under **Found on this server**, which shows the folder
   was discovered. If it does not: check `PLUGINS_ENABLED`, check `PLUGINS_DIR`, check
   `dist/index.js` exists, and check the server log for the folder name and the skip reason.
3. It renders once enabled. A red card mentioning the host API means it was built against a
   different platform version.

A plugin that reaches step 2 and fails step 3 is almost always registering under a capability
nothing renders.
````

## A note on trust

A plugin runs with the same access as CDT itself, with no sandbox, as [Security](./overview.md#security) explains. This matters more for generated code than for hand-written code, because the usual basis for trusting a plugin is having read it. Review what the model produced before mounting it anywhere holding real data.
