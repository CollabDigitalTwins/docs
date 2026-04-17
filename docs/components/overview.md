---
title: Overview
description: Custom React components that make up the CDT platform UI.
---

# Components

Custom React components built for the CDT platform. This section covers components in `src/core/components/` — excluding shadcn/ui primitives, which are third-party and not documented here.

Components are organized by feature area: `authentication/`, `settings/`, `viewers/`, and `ui/` for shared UI elements. Top-level components like `Toolbar`, `AppSidebar`, and `DataTable` are the main entry points for the platform shell.

Start with [DataMenu](./data-menu.md) — it's the main shell for managing building, site, file, and infrastructure data, and references several other components.

## Related

- [Hooks](../hooks/overview.md)
- [State Management](../state-management/overview.md)
- [Authorization](../authorization/roles-permissions.md)