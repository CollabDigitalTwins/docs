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

Two conditions must be met, and they are separate on purpose.

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

## Plugins on the maturity model

Plugins are how a twin climbs the [maturity model](../concepts/maturity-model.mdx). The core covers the descriptive baseline; each plugin adds a use case at the level it reaches, from a permit map to a live transit feed to a grid what-if.

<BrowserOnly>
  {() => {
    const MaturityModel = require('@site/src/components/MaturityModel').default;
    const g = 'https://collabdt.org/En/plugins/';
    return (
      <MaturityModel
        yAxisLabel="Maturity →"
        kicker="Use cases · Plugins"
        title={<>Plugins on the <span className="mm-acc">Maturity Model</span></>}
        lede="A sample of the plugins built so far, placed at the level each one reaches."
        useCases={[
          { id: 'building-permits', label: 'Building permits', level: 1, href: g + '#building-permits' },
          { id: 'airplanes', label: 'Live flights', level: 2, href: g + '#airplanes' },
          { id: 'space-planner', label: 'Space planning', level: 2, href: g + '#space-planner' },
          { id: 'flooding', label: 'Coastal flooding', level: 3, href: g + '#flooding' },
          { id: 'electric-grid', label: 'Energy grid what-if', level: 4, href: g + '#electric-grid' },
          { id: 'tabletop', label: 'Tabletop exercise', level: 4, href: g + '#tabletop' },
        ]}
      />
    );
  }}
</BrowserOnly>

See every plugin in action in the [plugin gallery](https://collabdt.org/En/plugins/).

## Security

A plugin runs with the same access as CDT itself. There is no sandbox: it can read anything the signed-in person can read and call any endpoint they can call.

Treat a plugin as any other dependency being granted full access, and read it before mounting it. This is why plugin loading is off unless explicitly enabled, and why an administrator must still add a plugin before it runs.

## In this section

Read in this order:

1. [Create your first plugin](./create-your-first-plugin.md)
2. [Capabilities](./all-capabilities.md)
3. [Run your plugin](./mounting-a-plugin.md)
4. [Example: one plugin, several surfaces](./hello-map-example.md)
5. [Mounted plugins in practice](./mounted-plugins-in-practice.md)
6. [Building a plugin with AI](./building-a-plugin-with-ai.md)
