---
title: Guided tours
description: Walk users through a plugin step by step, spotlighting parts of the page, with @collabdt/core/plugins-sdk/tour.
sidebar_position: 11
---

# Guided tours

`@collabdt/core/plugins-sdk/tour` gives a plugin the guided tour the CDT platform uses. It dims the page, spotlights one element per step and places a card beside it without covering the target or the panels you name. The page stays usable underneath, so people can try each part as they read about it.

```tsx
import { Button } from '@collabdt/core/plugins-sdk/components'
import { browserTourStore, GuidedTour, useTour } from '@collabdt/core/plugins-sdk/tour'
import type { TourStep } from '@collabdt/core/plugins-sdk/tour'

const STORE = browserTourStore({ storage: 'local', namespace: 'my-plugin' })

export function SitesPanel() {
  const tour = useTour('sites', STORE)

  const steps: TourStep[] = [
    { id: 'welcome', target: null, title: 'Welcome', body: 'A quick look at where everything is.' },
    { id: 'filters', target: 'filters', title: 'Filters', body: 'Narrow the list by area and type.' },
    { id: 'list', target: 'site-list', title: 'Sites', body: 'Open — in use today\nPlanned — approved, not yet built' },
  ]

  return (
    <div>
      {tour.open && <GuidedTour steps={steps} onHide={tour.hide} />}
      {!tour.open && <Button size="sm" variant="outline" onClick={tour.start}>Guide</Button>}
      <div data-tour="filters">…</div>
      <ul data-tour="site-list">…</ul>
    </div>
  )
}
```

## Steps

| Field | |
|---|---|
| `id` | Unique within the tour. |
| `target` | What the step spotlights: the id of a `data-tour="…"` attribute on the page, a function that returns the element, or `null` for a card centred on a dimmed page. |
| `title`, `body` | Already translated: pass the result of your plugin's translator. A string `body` is split on newlines into paragraphs, and lines written as `Term — description` become a definition list. Any other React node renders as given. |
| `items` | Rows under the body, each with an `id`, a `term`, a `description` and an optional `icon`. A row with `onSelect` is a button, for example one that starts a closer tour of the part it names. |
| `onEnter` | Runs when the step opens. Use it to open the panel or select the item the target lives in. Return a function to undo that when the step closes. |
| `invite` | Points an arrow at the target. Clicking the target ends the tour, which suits a last step like "open the report". |
| `scroll` | `false` stops the target scrolling into view. Use it for targets that fill the page, such as the map. |
| `shortcut` | `{ label, onSelect }` puts a small button at the top of the card, for example one that skips ahead to another tour. |
| `skip` | A function checked when Next or Back would reach the step. Return `true` to pass over it, for a hint about a state the page is not in. |

Use a function target for an element you cannot tag yourself, such as the map container (`() => map.getContainer()`) or the platform's own sidebar entry for one of your data pages (`() => findSidebarPageLink(title)`).

While a step's target has not appeared, the card shows a loading placeholder for a few seconds; the tour carries on either way.

## Anchors

Tag targets with `data-tour="<id>"`. The CDT platform's own anchors are unprefixed (`sidebar`, `toolbar`, …), so prefix yours with your plugin slug.

## Showing it once

`useTour(tourId, store)` returns `{ open, start, hide }`. The tour starts open until `store` says it is done; `hide` marks it done and closes it. Pass `hide` as `onHide`, which runs when the person hides the tour, presses Escape, finishes the last step or clicks an invited target.

`browserTourStore({ storage, namespace })` keeps that flag in the browser. `'session'` brings the tour back in a new browser session; `'local'` keeps it closed on that device. `namespace` keeps your tour ids apart from other plugins'. If storage is blocked, as in some private windows, the tour simply shows again. To remember it elsewhere, pass any object with `isDone(tourId)` and `markDone(tourId)`.

Create the store once, outside the component.

`startAt` opens the tour on the step with that id. `onFinish` runs instead of `onHide` when the person finishes the last step, which lets a closer tour return to the one it branched from rather than close. `onStepChange` is called with the id of each step as it opens; keep it and pass it back as `startAt` if your tour can remount.

## Panels the card must not cover

`avoid` returns elements the card should keep clear of, such as your toolbar dropdown or a legend:

```tsx
<GuidedTour steps={steps} onHide={tour.hide} avoid={() => Array.from(document.querySelectorAll('.my-legend'))} />
```

`setToolbarPanel(element, open)` opens or closes the platform's toolbar dropdown that contains `element`, which makes it handy in `onEnter` for a step inside your `map.tools` panel.

Inside core, `components/tour/hostTargets` also exports `anchorSelector(name)`, the CSS selector for `data-tour="<name>"` with quotes and backslashes escaped, and `findAnchor(name, root?)`, which returns the first element with that anchor under `root` (the document by default) or `null`. They are not part of `plugins-sdk/tour`.

## Look and labels

The tour uses the CDT palette by default. It reads the platform's theme tokens, so it follows light and dark mode: a terracotta accent and header, the platform's card surface and text colours, and a dark scrim. Written out for the light theme, the defaults are:

```css
.my-tour {
  --tour-accent: #c05520;
  --tour-accent-strong: color-mix(in srgb, var(--tour-accent) 75%, black);
  --tour-on-accent: #fff;
  --tour-ink: #181425;
  --tour-header-bg: var(--tour-accent);
  --tour-header-fg: var(--tour-on-accent);
  --tour-scrim: rgba(0, 0, 0, 0.45);
}
```

You can swap these for your plugin's or your organization's own palette: pass a `className` to the tour and set the `--tour-*` variables you want to change in your stylesheet. Any variable you leave out keeps the CDT default, so setting `--tour-accent` alone is often enough.

The full set is `--tour-surface`, `--tour-text`, `--tour-ink`, `--tour-muted`, `--tour-accent`, `--tour-accent-strong`, `--tour-on-accent`, `--tour-header-bg`, `--tour-header-fg`, `--tour-scrim`, `--tour-ring` and `--tour-focus`, plus `--tour-z` for the layer the tour sits on.

`header` puts your own content, such as a logo, at the start of the card's header.

The buttons and progress text come in the platform's languages. Override any of them with `labels`: `next`, `back`, `finish`, `hide`, `missing` and `progress(step, total)`.

Keyboard: the arrow keys move between steps and Escape hides the tour. Animations stop when the person prefers reduced motion.

## Types

The types are in `@collabdt/plugin-kit/types/tour` and come from the module itself. On a CDT platform version that does not publish this module, a plugin fails at the import, see [What a plugin can import](./mounting-a-plugin.md#what-a-plugin-can-import).
