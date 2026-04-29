---
title: Overview
description: How authorization works in CDT — organizations, roles, and the permission model in plain language.
sidebar_position: 1
---

# Authorization Overview

CDT uses **role-based access control** scoped to **organizations**. This page explains the model in plain language. For step-by-step UI tasks, see [Managing roles and permissions](./managing-roles.md). For the engine internals, see [Roles, Permissions & CASL](./authorization_roles_permissions.md).

## The model in three sentences

Every user belongs to one **organization**. Within that organization, the user is assigned one **role**. The role carries a list of **permissions** — pairs of `(action, subject)` that determine what the user can do.

## Why organizations matter

Permissions are not global. A user who is an *Admin* in Organization A is not automatically anything in Organization B. This makes CDT safe for multi-tenant deployments: a self-hosted instance can serve several teams, departments, or partner organizations without their data colliding.

For background, see [Concepts → Organizations and multi-tenancy](../concepts/organizations.md).

## Built-in roles

CDT ships with four default roles. Most deployments customize them — these are the starting point.

| Role | Default permissions |
|------|---------------------|
| **Viewer** | Read all assets in the organization. No mutations. |
| **Contributor** | Read everything; create and update files, comments, and media. |
| **Manager** | Everything Contributor can do, plus create and edit buildings, sites, sensors, and members. |
| **Admin** | Everything Manager can do, plus delete records, manage roles, and edit organization settings. |

The full default permission matrix is on the [Permission reference](./permission-reference.md) page.

## Where permissions are enforced

Permissions are checked in two places:

- **Server-side**, before every mutation in the API. This is the authoritative check — bypassing the UI does not bypass it.
- **Client-side**, to hide buttons and disable actions the user cannot perform. This is a UX layer only; do not rely on it for security.

The same `Ability` object drives both checks, so server and UI never disagree.

## What you can do next

| You want to… | Read |
|--------------|------|
| Invite members and assign them a role | [Managing roles and permissions](./managing-roles.md) |
| See the full permission matrix per role | [Permission reference](./permission-reference.md) |
| Understand how CASL evaluates rules | [Roles, Permissions & CASL](./authorization_roles_permissions.md) |
| Understand multi-tenancy | [Concepts → Organizations and multi-tenancy](../concepts/organizations.md) |
