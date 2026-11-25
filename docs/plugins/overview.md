---
title: Overview
description: What a CDT plugin is, where one can appear in the app, and the two ways to get one running.
sidebar_position: 1
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# Plugins

A plugin adds functionality to the CDT platform without changing CDT core. It is a folder holding a manifest and some React components; the app picks it up and renders its contributions alongside the core.

A plugin declares what it adds, and CDT calls its `activate()` function once at start-up. The toolbar button, the panel frame, the dialog overlay and the page layout are all handled by the app. The plugin supplies the contents.

<BrowserOnly>
  {() => {
    const PluginSurfaces = require('@site/src/components/PluginSurfaces').default;
    return <PluginSurfaces />;
  }}
</BrowserOnly>

A single plugin can use as many of these as it needs; `hello-map` ships with CDT and uses six. See [Capabilities](./all-capabilities.md) for what each one receives.

## Getting a plugin running

Two conditions must be met.

**1. The code has to be present.** Either a built plugin folder sits next to a CDT deployment, or the plugin is compiled into `@collabdt/core` and ships with every installation.

|  | Mounted next to a deployment | Compiled into core |
|---|---|---|
| Intended for | Anyone self-hosting CDT | Plugins useful to every installation |
| How it gets in | Build it, add the folder, restart | A pull request to core, then a release |
| Available on the CDT-hosted platform | No | Yes |

Mounting is the place to start. A plugin that turns out to be broadly useful can then be submitted to core as a pull request.

**2. The plugin has to be enabled.** An administrator adds it to their organization on the **Plugins** page, can turn it on for everyone, and can let each person switch it on or off for themselves. Nothing runs merely because the code is present.

## Community plugins

Plugins built and shared by the community live in [CollabDigitalTwins/plugins](https://github.com/CollabDigitalTwins/plugins), an AGPL-3.0 repository open to pull requests. Start with `wildfire-monitoring`, a complete plugin that draws live Canadian wildfires from public government feeds.

- **Self-hosting?** Clone the repository into your `PLUGINS_DIR`, run `npm run build`, and add the plugins you want on the **Plugins** page. See [Run your plugin](./mounting-a-plugin.md).
- **On the CDT-hosted platform?** Merging into the repository does not put a plugin in front of users. Maintainers publish a reviewed version to the registry, and a platform admin shares it with your organization. See [Share and promote plugins](./plugin-registry.md).
- **Built something useful?** Scaffold it with `npx create-cdt-plugin` inside the repository and open a pull request. The repository's README and `CONTRIBUTING.md` list the checks CI runs.

Community plugins run with the same privileges as any other plugin. Read the code before turning one on, and mount a reviewed commit or tag rather than a moving branch.

## Plugin categories

Every plugin belongs to one category. The plugin repositories keep one folder per category (`plugins/<category>/<plugin>/`), and the manifest's `category` field must match that folder.

| Category | Folder | What belongs there | Examples |
|---|---|---|---|
| **Live data** | `live-data` | Real-time feeds on the map: transit, flights, sensors and hazards | [Live flights](https://collabdt.org/En/plugins/#airplanes), [OC Transpo](https://collabdt.org/En/plugins/#oc-transpo), [Wildfire monitoring](https://collabdt.org/En/plugins/#wildfires) |
| **Planning** | `planning` | City and asset data turned into evidence for decisions, from permits to what-if scenarios | [Building permits](https://collabdt.org/En/plugins/#building-permits), [Coastal flooding](https://collabdt.org/En/plugins/#flooding), [Power grid what-if](https://collabdt.org/En/plugins/#electric-grid), [Disaster response simulation](https://collabdt.org/En/plugins/#tabletop) |
| **Facility management** | `facility-management` | Running buildings day to day: spaces, assets and maintenance | [Space planner](https://collabdt.org/En/plugins/#space-planner) |
| **Utilities** | `utilities` | General-purpose tools for the map and the BIM viewer | |

See every plugin in action, grouped by category, in the [plugin gallery](https://collabdt.org/En/plugins/).

## Security

A plugin runs with the same access as CDT itself. There is no sandbox: it can read anything the signed-in person can read and call any endpoint they can call.

Treat a plugin as any other dependency being granted full access, and read it before mounting it. This is why plugin loading is off unless explicitly enabled, and why an administrator must still add a plugin before it runs.

## In this section

1. [Create your first plugin](./create-your-first-plugin.md): scaffold, manifest, entry point
2. [Capabilities](./all-capabilities.md): the eight places a plugin can add something
3. [SDK modules](./sdk-modules.md): data, state, charts, geocoding, tours and external APIs
4. [Patterns](./patterns.md): several surfaces, shared state, the viewers, mounted plugins
5. [Run your plugin](./mounting-a-plugin.md): build, mount, enable, troubleshoot
6. [Share and promote plugins](./plugin-registry.md): the registry, for platform admins
7. [Building a plugin with AI](./building-a-plugin-with-ai.md)
