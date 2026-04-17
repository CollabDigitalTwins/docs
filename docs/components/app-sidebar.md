---
title: AppSidebarContent
description: Main sidebar navigation component that renders viewer, dataset, and extension menu items based on organization configuration and user role.
category: components
status: draft
last_updated: 2025-01-14
---

# AppSidebarContent

Renders the primary sidebar navigation for the CDT platform. Displays grouped menu items for 3D viewers (Map, BIM, Point Cloud), datasets (Sites, Buildings, Files, Infrastructure), and extensions. Adapts to organization-specific content restrictions, user roles, and collapsed/expanded sidebar states.

## Usage

```tsx
import { AppSidebarContent } from '@/components/AppSidebarContent';

<AppSidebarContent
  organization={organization}
  countrySubdivisionsData={countrySubdivisions}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `organization` | `Organization` | Yes | — | The current organization object containing name, logo, allowed viewers, and language settings. |
| `countrySubdivisionsData` | `Record<string, string>` | No | `undefined` | Mapping of country subdivision codes to names, used to populate map context. |

## Behaviour

- On mount, dispatches `SET_ORGANIZATION` to `AppConfigContext` and optionally `SET_COUNTRY_SUBDIVISIONS` to `MapContext`.
- Clicking a menu item calls `handleChangeViewer`, which resets selected item/site/file state, sets view to `'table'`, and updates `currentViewer` in menus state.
- Menu items are filtered by `organization.appContent` (if defined) and by user role via `accessibleTo`.
- Collapsed state hides text labels and centers icons; on mobile, the sidebar sheet open state determines layout.
- Footer displays language switcher (if organization supports multiple languages) and service links (e.g., support email).
- Active viewer is visually highlighted with primary color styling.

## Design Decisions

<!-- TODO: Why was this component built this way? Note any tradeoffs, constraints, or alternatives considered. -->

## Permissions

Menu items can be restricted by role using the `accessibleTo` property. Items are rendered only if the user's role matches one of the allowed roles.

```tsx
{
  title: t('users'),
  id: ViewerNames.users,
  accessibleTo: [RoleNames.admin],
  // ...
}
```

## Related

- [Sidebar UI Components](/docs/components/ui/sidebar)
- [LanguageSwitch](/docs/components/language-switch)
- [Logo](/docs/components/logo)
- [useMenusContext](/docs/hooks/menus-context)
- [useUserRole](/docs/hooks/users)
- [Organization Data Model](/docs/data-model/organization)
- [ViewerNames](/docs/types/viewer-names)