---
title: Authentication Components
description: Sign-in screen and shared auth layout.
---

# Authentication Components

The authentication screens live in `@collabdt/core/core/components/authentication/`.

## `AuthPage`

The layout wrapper for every auth screen. It renders a split screen: an organization logo and an animated map globe on one side, a form slot for its children on the other, plus a theme toggle and a language switcher.

## `Signin`

Email and password sign-in, rendered inside `AuthPage`. Submission requires a reCAPTCHA challenge. On success the user is emailed a multi-factor code and prompted to enter it; codes expire after 5 minutes. Sessions last 8 hours and are not refreshed on activity.

There is no self-service sign-up screen. Accounts are created by an Admin from **Settings → Users**.

## Related

- [Managing roles and permissions](../authorization/managing-roles.mdx)
- [Getting Started — Installation](../getting-started/installation.mdx)
