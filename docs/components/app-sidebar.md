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

Clicking a menu item calls `handleChangeViewer`, which resets the selected item, site and file state, sets the view to `'table'`, and updates `currentViewer` in menus state. The active viewer is highlighted in the primary colour.

Collapsed state hides text labels and centres the icons; on mobile the sidebar sheet's open state determines the layout instead. The footer shows a language switcher when the organization supports more than one language, plus service links such as a support email.

## Design decisions

AppSidebarContent owns navigation and organization context: which viewers are available, who can see them, and the dispatch that changes viewer on click.

Menu items are three static arrays, `viewerItems`, `datasetItems` and `managementItems`, rather than one flat list. The grouping maps directly onto the three sidebar sections, so items can be added, removed or reordered within a section without affecting the others. Commented-out items (Land, Users, Feedback) are left in place on purpose as placeholders for features that are partially implemented or pending; deleting them would lose the record of where they belong.

Viewer availability is controlled by `appContent` on the Organization model. An empty `appContent` shows every viewer; otherwise the list is filtered to what the organization has enabled, item by item via `.filter(item => appContent.includes(item.id))`, so the sidebar reflects each organization's configuration with no extra logic.

The list itself comes from `resolveAppContent(organization)` in `src/core/utils/appContent.ts`, which the sidebar shares with any other entry point into a viewer, notably the map building popover's tool row. Keeping one implementation matters because a tool that navigates to a viewer the sidebar hides is a dead end: the user arrives somewhere they cannot navigate back to. `resolveAppContent` always includes `map` and treats an unconfigured `appContent` as "everything", so an organization that never set the field keeps the full app.

Role-based visibility is separate from CASL, and deliberately so: the `accessibleTo` field on `MenuItem` and the `canRenderItem` callback decide whether a nav item is visible at all, while CASL decides what actions are available once inside a viewer.

```tsx
{
  title: t('users'),
  id: ViewerNames.users,
  accessibleTo: [RoleNames.admin],
  // ...
}
```

`handleChangeViewer` is exported so other parts of the app, such as map interactions and `HeaderButtons`, can trigger a viewer change without going through the sidebar. It always resets the selected item, site, file and view state, so a stale detail view cannot carry over between viewers.

Collapsed and expanded state drives label visibility and layout throughout, through an `isCollapsed` derived value rather than `sidebarState` directly. On mobile the sheet's open state counts as expanded, so labels render correctly while the drawer is visible.

## Related

- [useMenusContext](../hooks/ui.md)
- [useUserRole](../hooks/users.md)
- [Organization data model](../architecture/data-model.mdx#organization)
