---
sidebar_position: 5
---

# Internationalization

CDT supports multiple interface languages using **next-intl**. The current baseline includes **English, French, and Spanish**, and additional locales can be added without major architectural changes.

## How It Works

The i18n approach follows a standard `next-intl` setup:

- UI strings are stored in locale message files (for example, `en`, `fr`, `es`) instead of hardcoded text in components.
- Components read translated strings at runtime through `next-intl` translation hooks/functions.
- Locale-aware routing resolves the active language from the URL prefix and app configuration.
- Formatting for numbers and dates uses locale-aware formatters so language-specific conventions are applied consistently.

This keeps presentation text separate from business logic and makes translation updates mostly a content change rather than a code change.

## Adding a New Language

At a high level:

1. Add a new locale message file.
2. Register the locale in i18n routing/configuration.
3. Ensure navigation and language switcher expose the locale.
4. Verify layouts with translated text (some languages require more space).

## Reference Documentation

For exact APIs and recommended patterns, use the official next-intl docs:

- [next-intl docs](https://next-intl.dev/docs)
- [Rendering i18n messages](https://next-intl.dev/docs/usage/messages)
- [Routing setup](https://next-intl.dev/docs/routing)
