---
title: Usage Components
description: Panels and building blocks that show how much a user or an organization has uploaded.
---

# Usage Components

Upload volume for the signed-in user and for their organization: GB stored, file count, uploads per month, storage per file type, and a per-uploader table with CSV export. All amounts are volumes. Pricing is left to the app.

```tsx
import { MyUsage, OrganizationUsage } from '@collabdt/core/core/components/usage/UsagePanels';

<MyUsage />
<OrganizationUsage />
```

Both panels fetch their own data through the [`ApiAdapter`](../hooks/ports.md#usage), so they need `CoreHooksProvider` above them and an adapter that implements `getMyUsage` and `getOrganizationUsage`.

## Panels

| Component | Data | Shows |
|-----------|------|-------|
| `MyUsage` | `useMyUsage()` → `VolumeReport` | Summary cards, uploads per month, storage by file type |
| `OrganizationUsage` | `useOrganizationUsage()` → `UserUsageReport` | The same, plus a sortable per-uploader table with CSV export |

`OrganizationUsage` does no access control of its own. The backend answers `getOrganizationUsage` only for viewers allowed to see it, and the panel shows the load error otherwise.

## Building blocks

These are exported for apps that build their own views, such as a platform-wide report:

| Export | From | Purpose |
|--------|------|---------|
| `VolumeOverview` | `components/usage/VolumeOverview` | Cards, monthly chart and type breakdown for one `VolumeReport` |
| `UserUsageTable` | `components/usage/UserUsageTable` | Sortable uploader table; `showOrganization` adds an organization column, `actions` fills the header |
| `ReportState`, `ExportCsvButton` | `components/usage/UsagePanels` | Loading/error wrapper and a CSV download button |
| `StatCard` | `components/usage/StatCard` | A labelled metric card |
| `SortHeader`, `nextSort`, `compareValues` | `components/usage/SortHeader` | Sortable table header and its sort helpers |
| `USAGE_COLORS` | `components/usage/usagePalette` | Chart colours for storage, egress, shared cost and spikes, per theme |
| `gbFormatter`, `numberFormatter`, `relativeTime`, `monthLabel` | `utils/usageFormat` | Locale-aware formatting |
| `toCsv`, `csvCell`, `downloadText`, `userUsageToCsv` | `utils/csv`, `utils/usageCsv` | CSV that spreadsheets cannot execute as formulas, and a browser download |

Strings live in the `UsageReport` i18n namespace (en, fr, es).

## Design decisions

Files uploaded before the uploader was recorded have `userId: null`. The table lists them as "Unattributed" instead of dropping them, so the per-user rows still add up to the organization total.

The panels show volumes only. Cost depends on the hosting bill and on how a deployment splits it, which is a decision for the operator, so core leaves pricing to the app.

## Related

- [ApiAdapter: Usage](../hooks/ports.md#usage)
- [AppSidebar `userMenuItems`](./app-sidebar.md#appsidebar), which the app can use to link to its usage page
