---
title: Call an API without CORS
description: Reach an external feed that browsers cannot call directly, through the platform's allowlisted plugin feed proxy.
sidebar_position: 9
---

# Call an API without CORS

Plugins run in the page and call `fetch` directly, so they can only reach APIs that send CORS
headers. For a feed that does not, the platform forwards requests through an allowlisted proxy:

```
GET /api/plugins/<plugin-slug>/proxy/<feed>
```

- The caller never sends a URL. Each `<plugin-slug>/<feed>` maps to one upstream URL in
  `src/app/lib/plugins/proxyFeeds.ts`, reviewed like any other code change.
- Only the headers listed for that feed are forwarded, for example an API key the user typed.
  Cookies and the session never reach the upstream.
- The caller must be signed in, and an administrator must have enabled the plugin for their
  organization. Upstream redirects are refused, so a forwarded key never follows one.
- Successful responses are cached for `cacheSeconds` per credential, so many viewers polling the
  same feed cost one upstream call.

| Status | Meaning |
|---|---|
| 200 | Upstream body, unchanged |
| 400 | A required forwarded header is missing |
| 401 / 403 / 429 | Passed through from the upstream (or 401 when not signed in) |
| 404 | Unknown plugin or feed, or plugin not enabled for the organization |
| 502 / 504 | Upstream unreachable / timed out |

## Adding a feed

Add an entry to `PROXY_FEEDS` in `proxyFeeds.ts`:

```ts
'my-plugin': {
  positions: { url: 'https://api.example.org/positions?format=json', forwardHeaders: ['x-api-key'], cacheSeconds: 15 },
},
```

and call it from the plugin:

```ts
const response = await fetch('/api/plugins/my-plugin/proxy/positions', { headers: { 'x-api-key': key } })
```

A key sent this way is visible to the user's browser. Do not use the proxy to hide a shared secret.
