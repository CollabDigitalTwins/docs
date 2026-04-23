---
sidebar_position: 5
---

# Internationalization

CDT supports multiple interface languages using **next-intl**. The current baseline includes **English, French, and Spanish**, and additional locales can be added without major architectural changes.

## How It Works

UI strings are stored in locale message files (e.g. `messages/en.json`) instead of being hardcoded in components. Components read translated strings at runtime through `next-intl` hooks. Locale-aware routing resolves the active language from the URL prefix. Numbers and dates use locale-aware formatters so language-specific conventions are applied automatically.

This keeps presentation text separate from business logic and makes translation updates mostly a content change rather than a code change.

> For data coming from the backend (not UI labels), separate API and database changes are needed — next-intl only handles UI strings.

---

## Basic Usage

```tsx
// Without i18n — avoid this
export default function HomePage() {
  return <h1>Hello World</h1>;
}
```

```tsx
// With next-intl
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  return <h1>{t('HomePage.greeting')}</h1>;
}
```

Message files live in `messages/`:

```json
// messages/en.json
{ "HomePage": { "greeting": "Hello" } }

// messages/fr.json
{ "HomePage": { "greeting": "Bonjour" } }
```

> When designing layouts, leave extra space for French — text is typically 15–30% longer than English.

---

## Naming Convention

Use the **component name** as the namespace:

```json
{
  "About": { "title": "About us" },
  "HomePage": { "submit": "Submit", "cancel": "Cancel" }
}
```

```tsx
const t = useTranslations('About');
return <h1>{t('title')}</h1>;
```

---

## Dynamic Values

```json
{ "message": "Hello {name}!" }
```

```tsx
t('message', { name: 'Jane' }); // "Hello Jane!"
```

---

## Pluralization

```json
{
  "followers": "You have {count, plural, =0 {no followers yet} =1 {one follower} other {# followers}}."
}
```

```tsx
t('followers', { count: 3580 }); // "You have 3,580 followers."
```

---

## Rich Text (Links, HTML)

```json
{ "guidelines": "Please refer to <link>the guidelines</link>." }
```

```tsx
t.rich('guidelines', {
  link: (chunks) => <a href="/guidelines">{chunks}</a>,
});
```

---

## Number Formatting

Use `useFormatter` for numbers outside of message strings:

```tsx
import { useFormatter } from 'next-intl';

function Price() {
  const format = useFormatter();
  return <span>{format.number(499.9, { style: 'currency', currency: 'CAD' })}</span>;
  // EN: "$499.90"  FR: "499,90 $"
}
```

| Convention | English | French |
|------------|---------|--------|
| Thousands separator | `,` (`1,234`) | non-breaking space (`1 234`) |
| Decimal separator | `.` | `,` |
| Currency symbol position | before (`$10.00`) | after (`10,00 $`) |

---

## Date and Time Formatting

```tsx
import { useFormatter } from 'next-intl';

function EventDate({ date }: { date: Date }) {
  const format = useFormatter();
  return <span>{format.dateTime(date, { year: 'numeric', month: 'short', day: 'numeric' })}</span>;
}
```

| Convention | English | French |
|------------|---------|--------|
| Date order | MM/DD/YYYY | DD/MM/YYYY |
| Month names | Capitalized ("April") | Lowercase in text ("avril") |
| Time format | 12h with AM/PM | 24h ("16 h 30") |

---

## Adding a New Language

1. Add a new message file to `messages/` (e.g. `messages/es.json`).
2. Register the locale in the i18n routing configuration.
3. Translate all keys from `en.json`.
4. Verify layouts with the translated text — some languages need more space.

---

## Reference Documentation

- [next-intl: Rendering messages](https://next-intl.dev/docs/usage/messages)
- [App Router setup with i18n routing](https://next-intl.dev/docs/getting-started/app-router/with-i18n-routing)
- [French vs English writing conventions (Government of Canada)](https://www.noslangues-ourlanguages.gc.ca/en/blogue-blog/differences-anglais-francais-differences-english-french-eng)
