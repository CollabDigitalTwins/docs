---
title: Share and promote plugins
description: Publish a plugin to a deployment's registry, share it with organizations, and promote it from a dev instance to production with a package file.
sidebar_position: 8
---

# Share and promote plugins

Each CDT deployment has its own plugin registry, stored in its database and a private MinIO bucket. The registry holds published, immutable plugin versions. Platform admins decide which organizations may use each one.

There are three separate steps. Each is controlled by a different person:

| Step | Who | Where |
|------|-----|-------|
| **Publish** a version | The dev team (`PLUGIN_PUBLISHER_EMAILS`, plus platform admins) | Dev instance: from a mounted build. Any other deployment: by importing a package |
| **Share** it with an organization | Platform admins | The "Visible to" column on the Plugins page |
| **Turn it on** | That organization's admin | The Plugins page, as for any plugin |

:::warning
A plugin runs with the full privileges of the person using it, and there is no sandbox. Publishing to a production registry puts code in front of every organization it is shared with. Only promote packages that were built from reviewed source.
:::

## Publish from a dev instance

A dev instance mounts plugin folders and sets both flags:

```bash
PLUGINS_ENABLED="true"
PLUGINS_DEV="true"
PLUGINS_DIR="/absolute/path/to/plugins"
PLUGIN_PUBLISHER_EMAILS="you@example.org"
```

Expand a mounted plugin on the Plugins page and choose **Publish to registry**. Without `PLUGINS_DEV`, the server refuses to publish from disk and the button is not shown. This is how staging and production keep the option hidden.

## Promote to staging and production

Deployments are never connected to each other. A version moves from one to the next as a file:

1. **Export.** On the dev instance, open the **Registry** tab, expand the plugin and choose **Export** next to the version. This downloads `<slug>-<version>.cdtplugin.json`, which holds the manifest, the bundle and its sha256.

   To promote a build that is mounted but not published, expand it on the Plugins page and choose **Export** in its "Shared registry" strip. This needs `PLUGINS_DEV` too. Prefer exporting a published version: that file holds the exact bytes the dev registry stored. A mounted build changes every time you rebuild it.
2. **Import.** On the target deployment, sign in as a platform admin, open the **Registry** tab and choose **Import package**. The confirmation shows the version, the `hostApi` and the sha256. Check that the sha256 matches the one on the dev instance.
3. **Share.** Use the "Visible to" picker to give organizations access. Each organization's admin then turns the plugin on.

The target deployment checks everything again on import:
- the bundle must match its sha256;
- the manifest must be valid and its `hostApi` supported;
- the bundle may only import modules the host provides;
- the version must be newer than any version already in that registry.

Import into staging first, then use the same file for production. The bytes are identical, so the sha256 is too.

Deploy the CDT release that supports the plugin's `hostApi` before importing. An older deployment rejects the package.

## Pin, retire and remove versions

A platform admin can pin each organization to a version from the plugin's access list, or leave it on **Latest version**.

Removing a version depends on who has access:
- **No organization has access:** the version is deleted, and its version number can be published again.
- **An organization has access:** the version is *retired*. Nobody new gets it, organizations pinned to it move to the latest published version, and it stays listed as **Retired**.
- **Already retired:** removing it again deletes it for good. A retired version is never served, so this cannot take code away from an organization.

A plugin can only be removed from the registry once no organization has access. Its slug stays reserved for its owner.

When a registry change affects the signed-in admin's own organization, the Plugins page updates without a reload and says what changed.

Version numbers follow semver. To compare versions the way the registry does, use the helpers it uses:

```ts
import { compareVersions, highestVersion, isValidVersion } from '@collabdt/core/plugins-sdk/semver'

compareVersions('1.0.0-beta.2', '1.0.0') // negative: the prerelease is older
highestVersion([{ version: '1.2.0' }, { version: '1.10.0' }]) // { version: '1.10.0' }
isValidVersion('v1.2.3') // false: no leading "v"
```

## Configure staging and production

| Variable | Value |
|----------|-------|
| `PLUGINS_ENABLED` | unset or `"false"`, unless you mount plugins from a folder on purpose |
| `PLUGINS_DEV` | unset or `"false"` |
| `PLUGIN_PUBLISHER_EMAILS` | empty, so only platform admins can import |
| `PLUGIN_REGISTRY_BUCKET` | defaults to `cdt-plugin-registry`. Create it as a private bucket |

The server logs `plugins: mounted=off dev=off` the first time it handles a plugin request. Check for this line after deploying.
