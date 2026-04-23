---
title: Authentication Components
description: Sign-in, sign-up, forgot password, and email verification screens.
category: components
status: draft
last_updated: 2026-04-23
---

# Authentication Components

The authentication screens live in `src/core/components/authentication/`. They share a common `AuthPage` layout wrapper that renders a split-screen with an animated map globe on one side and the form on the other.

Source: `src/core/components/authentication/`

## Components

| Component | File | Description |
|-----------|------|-------------|
| `AuthPage` | `AuthPage.tsx` | Layout wrapper for all auth screens |
| `Signin` | `Signin.tsx` | Email + password sign-in with reCAPTCHA |
| `SignUp` | `Signup.tsx` | Account registration form |
| `ForgotPassword` | `ForgotPassword.tsx` | Password reset form |
| `EmailTemplate` | `VerifyEmail.tsx` | Email verification message (server-rendered) |

---

## `AuthPage`

Shared layout for all auth screens. Renders:
- Organization logo (loaded from MinIO at `org-logos/{orgName}-logo.png`, falls back to SVG)
- Dynamic animated map globe (lazy-loaded, left half on desktop)
- Light/dark theme toggle
- Language switcher (`LanguageSwitch`)
- The form slot (`children`)

```tsx
import { AuthPage } from '@/core/components/authentication/AuthPage'

export default function SignInPage() {
  return (
    <AuthPage>
      <Signin />
    </AuthPage>
  )
}
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `children` | `ReactNode` | Yes | The form to render inside the layout |

### Theme context

`AuthPage` exports `AuthThemeContext` and `useAuthTheme()`. Child components can read the active theme (`'light' | 'dark'`) to style themselves accordingly.

---

## `Signin`

Email + password form. Uses NextAuth `signIn('credentials', ...)`. Requires reCAPTCHA verification before submission.

### Behaviour

- Shows a loading spinner during the `signIn` call.
- On error, displays the NextAuth error message.
- reCAPTCHA is reset on each failed attempt.
- After successful sign-in, NextAuth handles the redirect.

### Environment dependency

Reads `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` for reCAPTCHA. The key must be set for the form to be submittable.

---

## `SignUp`

Registration form with fields: first name, last name, email, password, confirm password.

### Validation

- Password must be 12–65 characters.
- Passwords must match.
- Errors are shown inline via `PasswordError`.
- `hasAttemptedSubmit` flag defers error display until the first submit attempt.

### Behaviour

On valid submission, calls `signIn('credentials', ...)` with the new account credentials, so the user is signed in immediately after registration.

---

## `ForgotPassword`

Password reset form with new password + confirm password fields. Uses the same validation rules as `SignUp` (12–65 characters, passwords must match).

### Notes

<!-- TODO: Document the reset token flow — how the user reaches this screen and what API endpoint processes the reset. -->

---

## `EmailTemplate`

Server-side email component rendered via a mail service for email verification. Not a UI screen — it generates the HTML body of the verification email.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | Yes | Recipient's name |
| `url` | `string` | Yes | Verification link |

---

## Permissions

Authentication screens are public — no CASL check applies. The reCAPTCHA guard on `Signin` is the primary anti-abuse measure.

## Related

- [Authorization](../authorization/authorization_roles_permissions.md)
- [Deployment — Node Application](../deployment/node-application.md) — `NEXTAUTH_SECRET` and provider config
- [Getting Started — Installation](../getting-started/installation.md)
