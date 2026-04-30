---
title: Overview
description: SWR-based data fetching hooks for the CDT platform.
sidebar_position: 1
---

# Hooks

SWR-based hooks for fetching and mutating data across the CDT platform. Hooks are organized by resource — each directory corresponds to a domain entity (e.g. `buildings/`, `sites/`, `sensors/`) and contains hooks for reading and writing that resource.

All hooks follow the same pattern: a `useResource` hook for fetching and a `useCreateResource` or similar for mutations. They map 1:1 with the API routes documented in the [API](../api/overview.md) section.

If you're new to the codebase, start with [Buildings](./buildings.md) — it's the most complete and covers patterns used across all other hooks.

## In this section

- [useBuilding hooks](./buildings.md)
- [useComment hooks](./comments.md)
- [File hooks](./files.md)
- [Infrastructure hooks](./infrastructures.md)
- [useOpenDataPortals hooks](./open-data-portals.md)
- [useOrganization hooks](./organizations.md)
- [ApiAdapter Interface](./ports.md)
- [useSensorType hooks](./sensor-types.md)
- [Sensor hooks](./sensors.md)
- [Site hooks](./sites.md)
- [useIsMobile hook](./ui.md)
- [User hooks](./users.md)

## Related

- [API](../api/overview.md)
- [State Management](../architecture/state-management.mdx)
- [Data Model](../architecture/data-model.mdx)