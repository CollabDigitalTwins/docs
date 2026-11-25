---
title: SDK modules
description: What each @collabdt/core/plugins-sdk entry gives a plugin, from platform data and state to charts, geocoding, guided tours and proxied feeds.
sidebar_position: 4
---

# SDK modules

A plugin reaches the platform through `@collabdt/core/plugins-sdk` and its entries. They are the only imports besides React that resolve at runtime, see [What a plugin can import](./mounting-a-plugin.md#what-a-plugin-can-import).

| Entry | What it gives a plugin |
|---|---|
| `plugins-sdk` | `ViewerNames` and the shared types |
| `/components` | The approved UI components (`Button`, `Input`, `Separator`, `ConfirmDialog`, …) |
| `/config` | `usePluginConfig`, `usePluginId` |
| `/messages` | `usePluginTranslations` |
| `/data` | [Platform data](#platform-data), `usePluginUser`, `usePluginDataset`, `usePluginPermissions` |
| `/state`, `/store` | [State](#state): `usePluginState`, `usePluginStore` |
| `/ui` | `usePluginDialogs`, `toast`, see [Dialogs](./all-capabilities.md#dialogs) |
| `/charts` | [Charts](#charts) |
| `/geocoding` | [Address search](#geocoding) |
| `/tour` | [Guided tours](#guided-tours) |

Types for each entry are in `@collabdt/plugin-kit/types/<entry>`. On a platform version that does not publish an entry, a plugin that imports it fails at the import.

## Platform data

Buildings, sites, sensors, comments and files come from `/data`. A plugin goes through the same request path as the rest of CDT, so it inherits the signed-in user's session, the organization scoping and the shared cache. There is no second data path and no way past the tenant boundary.

```tsx
import { useBuildings, useSensorsByBuilding } from '@collabdt/core/plugins-sdk/data'

function Panel() {
  const { buildings, isLoading } = useBuildings()
  const { sensors } = useSensorsByBuilding(buildings[0]?.id ?? null)

  if (isLoading) return null
  return <p>{sensors.length} sensors</p>
}
```

Every read hook returns its payload plus `isLoading` and `isError`. A list hook returns `[]` before it resolves, a single-record hook `null`.

| Read | Hook |
|---|---|
| Buildings | `useBuildings`, `useBuilding`, `useBuildingsByOsm`, `useBuildingOsmIds` |
| Sites | `useSites`, `useSite` |
| Infrastructure | `useInfrastructures`, `useInfrastructure` |
| Organization | `useOrganization`, `useOrganizationByName` |
| Files | `useFiles`, `useFile`, `useFilesByBuildingId`, `useFilesBySiteId`, `useDownloadFile` |
| Sensors | `useSensors`, `useSensor`, `useSensorsByBuilding`, `useSensorsByAuthor`, `useSensorTypes`, `useSensorType` |
| Comments | `useComments`, `useComment`, `useCommentsByBuilding`, `useCommentsByAuthor` |

Buildings and sites are read-only to a plugin. Sensors and comments can be written with `useCreateSensor`, `useCreateComment` and `useDeleteComments`. A plugin's own records go in [`usePluginStore`](#state).

`usePluginUser()` returns the signed-in person as `{ id, name }`, or `null` while the session loads. Use it for attribution, such as who booked a room. Never send the id as proof of identity: the server already knows who is calling.

A `PluginFile`'s place in the BIM viewer is `fileTransformX` / `Y` / `Z` (metres), `fileRotationX` / `Y` / `Z` (radians) and `fileScale`. For a BIM model, `fileRotationZ` is its project north. The older `x`, `y` and `z` fields are deprecated and stale for any file placed since.

## State

Surfaces render in unrelated parts of the app, so they share state through hooks rather than props. Pick the hook by whether the value belongs in a database:

| Kind of value | Hook | Survives a reload |
|---|---|---|
| A selection, a filter, a draft | `usePluginState(key, initial)` | No |
| Records the plugin owns | `usePluginStore(collection)` | Yes, shared with the organization |
| Org-wide settings and per-user preferences | `usePluginConfig()` | Yes |

Both are scoped per plugin, so two plugins using the key `selected` never see each other's value. `usePluginStore` returns `items` and `put(key, data)`; `put` replaces a record whole. See [Patterns](./patterns.md#one-hook-shared-by-every-surface) for how a plugin combines them.

## Charts

`/charts` gives a plugin the platform's charts: the shadcn chart wrappers, styled for light and dark mode, and the Recharts primitives they wrap. Import them from here rather than installing `recharts`, so the plugin shares the platform's copy.

```tsx
import { Bar, BarChart, ChartContainer, ChartTooltip, ChartTooltipContent, XAxis } from '@collabdt/core/plugins-sdk/charts'
import type { ChartConfig } from '@collabdt/core/plugins-sdk/charts'

const config: ChartConfig = { office: { label: 'Office', color: '#4f9d69' } }

export function BookedHours({ data }: { data: Array<{ day: string, office: number }> }) {
  return (
    <ChartContainer config={config} style={{ height: 260 }}>
      <BarChart data={data} accessibilityLayer>
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="office" fill="var(--color-office)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
```

| Kind | Exports |
|---|---|
| Wrappers | `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartConfig` |
| Charts | `AreaChart`, `BarChart`, `LineChart`, `PieChart` |
| Parts | `Area`, `Bar`, `Line`, `Pie`, `Cell`, `CartesianGrid`, `XAxis`, `YAxis`, `ResponsiveContainer` |

Nothing else from Recharts is available.

- `config` is keyed by data key. Each series gets a `label` and a `color`, or `theme: { light, dark }`. `ChartContainer` sets `--color-<key>` from it, which is what `fill` reads.
- Give `ChartContainer` a height. Without one it falls back to a 16:9 box.
- Recharts loads the first time a plugin imports `/charts`, so a deployment that draws no chart never downloads it.
- The Recharts components are typed loosely, so a misspelt prop is not a compile error. Check the [Recharts API](https://recharts.org/en-US/api).

## Geocoding

`/geocoding` gives a plugin the map's address search. Requests go through the geocoder the platform is configured with (Geocode Earth or a self-hosted Pelias) and fall back to the public OSM services, Photon and Nominatim. A plugin needs no API key.

```ts
import { reverseAddress, searchAddress } from '@collabdt/core/plugins-sdk/geocoding'

const places = await searchAddress('Plaza de Armas', { countryCode: 'CL', size: 5 })
map.flyTo({ center: [places[0].lng, places[0].lat] })

const place = await reverseAddress(lng, lat)
```

| Function | Resolves to |
|---|---|
| `searchAddress(text, { countryCode?, size? })` | Up to `size` (default 5) `PluginPlace`s, or `[]`. Blank text makes no request. |
| `reverseAddress(lng, lat, { countryCode? })` | The nearest `PluginPlace`, or `null`. Longitude first, as in GeoJSON. |

A `PluginPlace` is `{ label, lng, lat }` in WGS84.

- `countryCode` is ISO 3166-1 alpha-2. The public fallbacks cannot filter by it: Photon prefers that country, Nominatim ignores it.
- Each call is a request. Search after a pause in typing or on a button press, and reverse-look-up a point when it is picked, not while the map moves. Nominatim allows about one request per second.
- Both functions reject only when the fallback fails too, for example offline. Catch it and tell the person search is unavailable.

## Guided tours

`/tour` gives a plugin the platform's guided tour. It dims the page, spotlights one element per step and places a card beside it. The page stays usable underneath.

```tsx
import { browserTourStore, GuidedTour, useTour } from '@collabdt/core/plugins-sdk/tour'
import type { TourStep } from '@collabdt/core/plugins-sdk/tour'

const STORE = browserTourStore({ storage: 'local', namespace: 'my-plugin' })

export function SitesPanel() {
  const tour = useTour('sites', STORE)
  const steps: TourStep[] = [
    { id: 'welcome', target: null, title: 'Welcome', body: 'A quick look at where everything is.' },
    { id: 'filters', target: 'my-plugin-filters', title: 'Filters', body: 'Narrow the list by area and type.' },
  ]

  return (
    <div>
      {tour.open && <GuidedTour steps={steps} onHide={tour.hide} />}
      {!tour.open && <button onClick={tour.start}>Guide</button>}
      <div data-tour="my-plugin-filters">…</div>
    </div>
  )
}
```

Tag targets with `data-tour="<id>"`. The platform's own anchors are unprefixed (`sidebar`, `toolbar`), so prefix yours with the plugin slug.

| Step field | |
|---|---|
| `id` | Unique within the tour. |
| `target` | A `data-tour` id, a function returning the element (`() => map.getContainer()`), or `null` for a centred card. |
| `title`, `body` | Already translated. A string `body` splits on newlines; `Term — description` lines become a definition list. |
| `items` | Rows under the body (`id`, `term`, `description`, `icon?`, `onSelect?`). |
| `onEnter` | Runs when the step opens, for example to open a panel. Return a function to undo it. |
| `invite` | Points an arrow at the target; clicking it ends the tour. |
| `scroll` | `false` keeps the target from scrolling into view. |
| `shortcut` | `{ label, onSelect }`, a small button at the top of the card. |
| `skip` | Return `true` to pass over the step. |

`useTour(tourId, store)` returns `{ open, start, hide }`. The tour starts open until the store says it is done, and `hide` marks it done. `browserTourStore` keeps that flag in `'local'` or `'session'` storage; any object with `isDone(tourId)` and `markDone(tourId)` works instead. Create the store once, outside the component.

`GuidedTour` also takes:

| Prop | |
|---|---|
| `startAt`, `onStepChange` | Open on a given step, and track the current one so a remounted tour can resume. |
| `onFinish` | Runs instead of `onHide` after the last step, for a closer tour that returns to its parent. |
| `avoid` | `() => Element[]` the card must not cover, such as a legend. |
| `sections` | `{ current, list() }`, which adds a searchable list of sections and steps. Picking another section calls its `start(stepId)`. |
| `className`, `header`, `labels` | Styling, a logo slot, and overrides for `next`, `back`, `finish`, `hide`, `missing`, `progress(step, total)`. |

`setToolbarPanel(element, open)` opens the toolbar dropdown containing `element`, which suits `onEnter` for a step inside a `map.tools` panel.

The tour follows the platform theme. To restyle it, pass a `className` and set any of `--tour-accent`, `--tour-accent-strong`, `--tour-on-accent`, `--tour-surface`, `--tour-text`, `--tour-ink`, `--tour-muted`, `--tour-header-bg`, `--tour-header-fg`, `--tour-scrim`, `--tour-ring`, `--tour-focus` and `--tour-z`. Arrow keys move between steps and Escape hides it.

## Calling an external API

A plugin calls `fetch` from the page, so it can only reach APIs that send CORS headers. For one that does not, the platform forwards requests through an allowlisted proxy:

```ts
const response = await fetch('/api/plugins/my-plugin/proxy/positions', { headers: { 'x-api-key': key } })
```

Each `<plugin-slug>/<feed>` maps to one upstream URL in `PROXY_FEEDS`, in the platform's `src/app/lib/plugins/proxyFeeds.ts`. Adding one is a reviewed change to the platform:

```ts
'my-plugin': {
  positions: { url: 'https://api.example.org/positions?format=json', forwardHeaders: ['x-api-key'], cacheSeconds: 15 },
},
```

- The caller never sends a URL, and only the listed headers are forwarded. Cookies and the session never reach the upstream, and upstream redirects are refused.
- The caller must be signed in, with the plugin enabled for their organization.
- Successful responses are cached for `cacheSeconds` per credential, so many viewers polling one feed cost one upstream call.
- A key sent this way is visible in the browser. The proxy does not hide a shared secret.

| Status | Meaning |
|---|---|
| 200 | Upstream body, unchanged |
| 400 | A required forwarded header is missing |
| 401 / 403 / 429 | From the upstream, or 401 when not signed in |
| 404 | Unknown plugin or feed, or plugin not enabled |
| 502 / 504 | Upstream unreachable / timed out |
