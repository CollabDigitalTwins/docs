---
title: Overview
description: SWR-based data fetching hooks for the CDT platform.
sidebar_position: 1
---

# Hooks

SWR-based hooks for fetching and mutating data, organized by resource: each directory corresponds to a domain entity (`buildings/`, `sites/`, `sensors/`) and holds the hooks for reading and writing it.

New to the codebase? Start with [Buildings](./buildings.md), the most complete set and the one whose patterns the others follow.

## Shared conventions

These hold for every hook in this section, and the per-hook pages below do not repeat them.

**Construction.** Each family is built by a factory that takes an API adapter: `createBuildingHooks(adapter)`, `createSensorHooks(adapter)`, and so on. The adapter is supplied once by `CoreHooksProvider`, so application code calls the hooks directly and never passes an adapter. See [ApiAdapter](./ports.md) for the interface a host must implement.

**Every read hook returns** its entity field plus:

| Field | Type | Meaning |
|-------|------|---------|
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

Collection hooks default their array to `[]`, so a list is safe to map over while loading or after an error.

**Every mutation hook returns** its trigger function plus:

| Field | Type | Meaning |
|-------|------|---------|
| `isMutating` | `boolean` | Whether the operation is in progress |
| `<verb>Error` | `Error \| undefined` | Error from the most recent attempt |
| `<verb>edData` | `T \| undefined` | Response data on success |

**Skipping a fetch.** Any hook taking an id accepts `null` to skip fetching, which is how you defer a request until a selection exists.

**Cache keys** are arrays (`["buildings"]`, `["building", id]`). Where a mutation revalidates keys beyond its own, the hook's page says which.

## In this section

- [useBuilding hooks](./buildings.md)
- [useComment hooks](./comments.md)
- [useFile hooks](./files.md)
- [useInfrastructure hooks](./infrastructures.md)
- [useOpenDataPortals hooks](./open-data-portals.md)
- [useOrganization hooks](./organizations.md)
- [ApiAdapter Interface](./ports.md)
- [useSensorType hooks](./sensor-types.md)
- [useSensor hooks](./sensors.md)
- [useSite hooks](./sites.md)
- [useIsMobile hook](./ui.md)
- [useUser hooks](./users.md)

## Related

- [State Management](../architecture/state-management.mdx)
- [Data Model](../architecture/data-model.mdx)
