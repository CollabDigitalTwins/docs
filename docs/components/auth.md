---
title: Authentication Components
description: Sign-in screen and shared auth layout.
---

# Authentication Components

The authentication screens live in `@collabdt/core/core/components/authentication/`.

## `AuthPage`

The layout wrapper for every auth screen. It renders a split screen: an organization logo and an animated map globe on one side, a form slot for its children on the other, plus a theme toggle and a language switcher.

The logo is `<instance>-logo.png` or `<instance>-logo.svg` from the public `org-logos` bucket, whichever loads first; when neither does, the CDT icon is shown.

## `Signin`

Email and password sign-in, rendered inside `AuthPage`. Submission requires a reCAPTCHA challenge. On success the user is emailed a multi-factor code and prompted to enter it; codes expire after 5 minutes. Sessions last 8 hours and are not refreshed on activity.

`onAuthError(code)` is optional and receives each sign-in error code, whether it comes from the form submission or from the `?error=` query a provider redirect leaves on the page. Return `true` when your app shows its own message for that code; `Signin` then shows nothing. Return `false`, or omit the prop, and `Signin` shows its built-in message.

There is no self-service sign-up screen. Accounts are created by an Admin from **Settings → Users**.

## Related

- [Managing roles and permissions](../authorization/managing-roles.mdx)
- [Getting Started: Installation](../getting-started/installation.mdx)
