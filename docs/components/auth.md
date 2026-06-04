---
title: Authentication Components
description: Sign-in screen and shared auth layout.
category: components
status: draft
last_updated: 2026-04-23
---

# Authentication Components

The authentication screens live in `@collabdt/core/components/authentication/`. They share a common `AuthPage` layout wrapper that renders a split-screen with an animated map globe on one side and the form on the other.

## Components

| Component | Description |
|-----------|-------------|
| `AuthPage` | Layout wrapper for all auth screens |
| `Signin` | Email + password sign-in with reCAPTCHA, followed by an emailed MFA code |

---

## `AuthPage`

Shared layout for all auth screens. Renders an organization logo, an animated map background, theme toggle, language switcher, and a form slot for its children.

## `Signin`

Email + password sign-in. Submission requires a reCAPTCHA challenge. On success, the user is sent a multi-factor code by email and prompted to enter it; codes expire after 5 minutes. Sessions last 8 hours and are not refreshed on activity.

Account creation is performed by an Admin from **Settings → Users** — there is no self-service sign-up screen.

## Related

- [Managing roles and permissions](../authorization/managing-roles.mdx)
- [Getting Started — Installation](../getting-started/installation.mdx)
