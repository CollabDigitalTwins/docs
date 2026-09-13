---
title: Overview
description: Custom React components that make up the CDT platform UI.
sidebar_position: 1
---

# Components

Custom React components built for the CDT platform, all under `@collabdt/core/core/components/`. shadcn/ui primitives are third-party and not documented here.

Components are grouped by feature area: `authentication/`, `settings/`, `viewers/`, and `ui/` for shared UI elements. `Toolbar`, `AppSidebarContent` and `DataTable` are the main entry points for the platform shell.

Start with [DataMenu](./data-menu.md), the shell for managing building, site, file, and infrastructure data. For how those pages fit together end to end, see [Data Pages](../architecture/data-pages.mdx).

## Shared conventions

These hold across the section, and the pages below do not repeat them.

**Permissions are enforced at the action level, not at render time.** Presentation components (`Toolbar`, `DataTable`, `NavigationBar`, `Viewer`, `DataMenu`, the BIM toolbar tools) run no CASL check of their own and render for any authenticated user. Gating lives in the controls: `FieldRenderer` disables an input the user may not change, `DetailActions` and `HeaderButtons` hide or disable edit and create buttons. The check is always the same shape:

```tsx
{ability.can('update', 'Building') && <Input ... />}
```

`ability` comes from `usePermissions()`. Where a page below names a required action and subject, that is what the child control checks. See [Authorization](../authorization/overview.mdx).

**Detail panels share one contract.** `BuildingDetails`, `SiteDetails`, `InfrastructureDetails`, `UserDetails` and `FileDetails` are each a `forwardRef` exposing `saveChanges`, so `DataMenu`'s header Save button can drive a panel it does not own. Every prop is optional, and these are common to all of them:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selected<Entity>` | the entity record | — | The record to display or edit. A negative `id` means a new, unsaved record. |
| `setSelected<Entity>` | `(entity) => void` | — | Updates the selection in parent state after a save. |
| `editing` | `boolean` | `false` | Whether the form is in edit mode. |
| `setEditing` | `(editing: boolean) => void` | — | Toggles edit mode. |
| `setActiveChanges` | `(active: boolean) => void` | — | Signals that unsaved changes exist. |
| `activeTab` | `string` | — | The currently selected tab key. |
| `setActiveTab` | `(tab: string) => void` | `() => {}` | Fires when the tab selection changes. |

| Ref method | Signature | Description |
|------------|-----------|-------------|
| `saveChanges` | `() => Promise<void>` | Persists edits: creates when `id < 0`, otherwise updates. |

A record with a negative `id` also auto-enables edit mode on mount. Hook errors are surfaced as toasts through `handleApiError`. Full detail, including how `DataMenu` owns `editing` and `activeChanges`, is in [Data Pages](../architecture/data-pages.mdx#the-panel-contract).

## In this section

- [AppSidebarContent](./app-sidebar.md)
- [Authentication Components](./auth.md)
- [BIM Viewer Tools](./bim-tools.md)
- [BuildingDetails](./building-details.md)
- [DataMenu](./data-menu.md)
- [DataTable](./data-table.md)
- [File Components](./file-details.md)
- [InfrastructureDetails](./infrastructure-details.md)
- [NavigationBar](./top-navigation-bar.md)
- [Settings Components](./settings.md)
- [SiteDetails Components](./site-details.md)
- [Toolbar](./toolbar.md)
- [UserDetails](./user-details.md)
- [Viewer](./viewer.md)
- [ViewerSidebar](./viewer-sidebar.md)

## Related

- [Hooks](../hooks/overview.md)
- [State Management](../architecture/state-management.mdx)
