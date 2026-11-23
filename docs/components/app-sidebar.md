---
title: AppSidebarContent
description: Main sidebar navigation component that renders viewer, dataset, and plugin menu items based on organization configuration and user role.
---

# AppSidebarContent

The primary sidebar navigation. It renders grouped menu items for the 3D viewers (Map, BIM), the datasets (Sites, Buildings, Files, Infrastructure) and plugins, adapting to organization content restrictions, user roles, and the collapsed or expanded sidebar state.

```tsx
import { AppSidebarContent } from '@collabdt/core/core/components/AppSidebarContent';

<AppSidebarContent
  organization={organization}
  countrySubdivisionsData={countrySubdivisions}
/>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `organization` | `Organization` | Yes | — | The current organization: name, logo, allowed viewers and language settings |
| `countrySubdivisionsData` | `Record<string, string>` | No | `undefined` | Subdivision codes to names, used to populate map context |

## Behaviour

On mount it dispatches `SET_ORGANIZATION` to `AppConfigContext` and, when `countrySubdivisionsData` is given, `SET_COUNTRY_SUBDIVISIONS` to `MapContext`.

Clicking a menu item calls `useChangeViewer` (`hooks/ui/useChangeViewer`), which resets the selected item, site and file state, sets the view to `'table'`, updates `currentViewer` in menus state and closes the side panel. The active viewer is highlighted in the primary colour.

The header logo tries, in order, the organization's stored `logoKey`, then `<organization name>-logo.png` and `<organization name>-logo.svg` in the public `org-logos` bucket, then the CDT logo. It never renders a broken image: each candidate is probed with a detached `Image()` before it is shown, through `useFirstLoadableImage` and the `fallbacks` prop on `Logo`.

Collapsed state hides text labels and centres the icons; on mobile the sidebar sheet's open state determines the layout instead. The footer shows a language switcher when the organization supports more than one language, plus service links such as a support email.

## Design decisions

AppSidebarContent owns navigation and organization context: which viewers are available, who can see them, and the dispatch that changes viewer on click.

Menu items are three static arrays, `viewerItems`, `datasetItems` and `managementItems`, rather than one flat list. The grouping maps directly onto the three sidebar sections, so items can be added, removed or reordered within a section without affecting the others. Commented-out items (Land, Users, Feedback) are left in place on purpose as placeholders for features that are partially implemented or pending; deleting them would lose the record of where they belong.

Viewer availability is controlled by `appContent` on the Organization model. An empty `appContent` shows every viewer; otherwise the list is filtered to what the organization has enabled, item by item via `isViewerAllowed`, so the sidebar reflects each organization's configuration with no extra logic.

The list itself comes from `resolveAppContent(organization)` in `src/core/utils/appContent.ts`, which the sidebar shares with any other entry point into a viewer, notably the map building popover's tool row. Keeping one implementation matters because a tool that navigates to a viewer the sidebar hides is a dead end: the user arrives somewhere they cannot navigate back to. `resolveAppContent` always includes `map`, `plugins` and `settings` and treats an unconfigured `appContent` as "everything", so an organization that never set the field keeps the full app.

Role-based visibility is separate from CASL, and deliberately so: the `accessibleTo` field on `MenuItem` and the `canRenderItem` callback decide whether a nav item is visible at all, while CASL decides what actions are available once inside a viewer.

```tsx
{
  title: t('users'),
  id: ViewerNames.users,
  accessibleTo: [RoleNames.admin],
  // ...
}
```

`handleChangeViewer` is exported so other parts of the app, such as map interactions and `ResultActions`, can trigger a viewer change without going through the sidebar. It always resets the selected item, site, file and view state, so a stale detail view cannot carry over between viewers.

Collapsed and expanded state drives label visibility and layout throughout, through an `isCollapsed` derived value rather than `sidebarState` directly. On mobile the sheet's open state counts as expanded, so labels render correctly while the drawer is visible.

## AppSidebar

`AppSidebar` is the frame around `AppSidebarContent`: the toggle buttons, the footer, and the avatar menu (`NavUser`).

```tsx
import { AppSidebar } from '@collabdt/core/core/components/ui/AppSidebar';
import { DropdownMenuItem } from '@collabdt/core/core/components/ui/DropdownMenu';

<AppSidebar
  signOut={signOut}
  userMenuItems={
    <DropdownMenuItem asChild>
      <Link href={`/${organization.name}/usage`}>Usage</Link>
    </DropdownMenuItem>
  }
>
  <AppSidebarContent organization={organization} />
</AppSidebar>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `signOut` | `(options?) => Promise<void>` | Yes | — | Called by the avatar menu's Logout item |
| `children` | `ReactNode` | No | `undefined` | Sidebar body, usually `AppSidebarContent` |
| `userMenuItems` | `ReactNode` | No | `undefined` | Extra `DropdownMenuItem`s in the avatar menu, rendered between Settings and Logout |

`userMenuItems` is a slot rather than a list of routes, so core stays free of app routes: the app decides what the item links to and who sees it.

## Platform tour

`AppSidebar` also mounts `PlatformTour`, a [guided tour](../plugins/tour.md) of the app shell: the sidebar, the two ways to see data (3D viewers and data pages), plugins, support and the account menu. Then it tours the page the person is on, and every overview card has a shortcut at the top straight to that part. The last card offers closer tours of the 3D viewers or the data pages. The tour only offers the viewers and data pages the organization shows. A viewer tour covers its search, side panel and toolbar. The map tour adds its controls, settings, attribution and a legend (a live zoning demo where the map can reach Ottawa, otherwise an example). The BIM tour adds hints on its empty card and its view cube. The settings tours briefly change each setting to show what it does, then put it back.

The tour opens by itself once per device, on the first visit, and is remembered in local storage under `cdt.tour.platform.hidden`. The Guide item at the top of the Support menu opens it again at any time. That item calls `SupportMenu`'s `onOpenGuide`, which sets `guideOpen` through `useSidebar()`:

```tsx
const { setGuideOpen } = useSidebar()
setGuideOpen(true)
```

`guideOpen` lives in the sidebar context, next to the bug report and feature request dialogs, for the same reason: on mobile `AppSidebarContent` sits inside a sheet that unmounts when it closes, so anything it opens must render outside it. On a phone, the steps that point into the sidebar open that sheet and close it when the tour moves on.

The steps target these `data-tour` anchors on the shell. Keep them on the same elements when you restyle the sidebar, toolbar or top bar, or the step shows a "Waiting for this part of the screen to appear." note instead of a spotlight:

| Anchor | Element |
|--------|---------|
| `sidebar` | The whole sidebar |
| `sidebar-interfaces` | The 3D viewers and data pages groups together |
| `sidebar-viewers`, `sidebar-data`, `sidebar-plugins`, `sidebar-support` | The sidebar's groups |
| `sidebar-account` | The avatar menu |
| `viewer-search` | The geocoder on the map, the element search in BIM |
| `viewer-panel-toggle` | The button that opens the viewer side panel |
| `toolbar` | The bottom toolbar of either viewer |
| `bim-empty` | The BIM viewer's empty card; `data-state` says which (`noBuilding`, `noBimFiles`, …) |
| `settings-*` | Each map and BIM setting the settings tours visit |

The BIM view cube is found by its `cdt-view-cube` class.

## Related

- [useMenusContext](../hooks/ui.md)
- [useUserRole](../hooks/users.md)
- [Organization data model](../architecture/data-model.mdx#organization)
