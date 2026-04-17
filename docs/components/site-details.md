---
title: SiteDetails Components
description: UI components for creating, viewing, and editing site records with associated buildings.
category: components
status: draft
last_updated: 2025-01-14
---

# SiteDetails Components

Components for managing site records in the Data viewer. Includes site creation dialogs, detail editing forms, field renderers, and associated buildings tables.

## Components

| Component | File | Description |
|-----------|------|-------------|
| `AddSite` | `AddSite.tsx` | Dialog for creating a new site with name input |
| `AssociatedBuildingsTable` | `AssociatedBuildings.tsx` | Table displaying buildings linked to a site with attach/create functionality |
| `FieldRenderer` | `FieldRenderer.tsx` | Renders appropriate input controls based on field type |
| `SiteDetails` | `SiteDetails.tsx` | Main detail view with tabbed sections for site properties |

---

## AddSite

Dialog component that initiates site creation by capturing the site name.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `newItemName` | `string` | Yes | Current value of the site name input |
| `setNewItemName` | `React.Dispatch<React.SetStateAction<string>>` | Yes | Setter for updating the site name |

### Permissions

Requires permission: `{ action: "create", subject: "Site" }`

The trigger button is disabled when the user lacks create permission.

### Usage

```tsx
import AddSite from '@/core/components/viewers/Data/siteDetails/AddSite'

const [siteName, setSiteName] = useState('')

<AddSite newItemName={siteName} setNewItemName={setSiteName} />
```

### Behavior

- Opens a dialog with a text input for site name
- On submit, creates a temporary site object with `id: -1`
- Sets the temporary site as selected and switches view to detail mode
- Shows error toast if name is empty

### Notes

<!-- TODO: Edge cases, business logic, or constraints not obvious from the code. -->

---

## AssociatedBuildingsTable

Displays buildings associated with a site. Supports searching, filtering, attaching existing buildings, and creating new buildings from geocoded addresses.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `buildings` | `Building[]` | Yes | Array of buildings currently associated with the site |
| `onRowClick` | `(building: Building) => void` | No | Callback when a building row is clicked |
| `siteId` | `number` | No | ID of the parent site |
| `onAttachBuilding` | `(building: Building) => void` | No | Callback when a building is attached |
| `editing` | `boolean` | No | Whether the parent form is in edit mode |
| `setEditing` | `(editing: boolean) => void` | No | Setter to enable edit mode |

### Features

- **Search**: Filter displayed buildings by name, address, municipality, subdivision, or project type
- **Advanced Filters**: Apply complex filter conditions via `FiltersDialog`
- **Attach Existing**: Search and attach buildings already in the organization
- **Create & Attach**: Geocode an address and create a new building record, then attach it
- **Preview State**: Newly attached buildings show immediately before save

### Dependencies

- `useBuildings` — fetches all available buildings
- `useCreateBuilding` — creates new building records
- `useUser` — retrieves current user's organization
- `fetchSuggestions` / `parseLocation` — geocoding utilities

### Usage

```tsx
import AssociatedBuildingsTable from '@/core/components/viewers/Data/siteDetails/AssociatedBuildings'

<AssociatedBuildingsTable
  buildings={site.siteBuildings}
  siteId={site.id}
  onAttachBuilding={handleAttach}
  editing={isEditing}
  setEditing={setIsEditing}
/>
```

### Notes

<!-- TODO: Edge cases, business logic, or constraints not obvious from the code. -->

---

## FieldRenderer

Renders the appropriate input control for a site property based on its type (text, number, date, enum, file, checkbox, array).

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `property` | `string` | Yes | Property key being rendered |
| `value` | `any` | Yes | Current value of the property |
| `handleInputChange` | `(property: string, value: any) => void` | Yes | Callback when value changes |
| `isTextAreaField` | `(property: string) => boolean` | Yes | Predicate for textarea fields |
| `isFileField` | `(property: string) => boolean` | Yes | Predicate for file upload fields |
| `isDateField` | `(property: string) => boolean` | No | Predicate for date fields |
| `isEnumField` | `(property: string) => boolean` | No | Predicate for enum fields |
| `getEnumType` | `(property: string) => string \| null` | No | Returns enum type name for a property |
| `isNumberField` | `(property: string) => boolean` | No | Predicate for numeric fields |
| `isFullWidthField` | `(property: string) => boolean` | No | Predicate for full-width layout |

### Supported Enum Types

- `SiteEnergySource`
- `SiteAssessmentConditions`
- `SiteProjectPhase`
- `SiteProjectType`
- `SiteLandUse`
- `CountrySubdivisionData` — populated from map context

### Permissions

Input controls are disabled when user lacks `{ action: "update", subject: "Site" }`.

### Usage

```tsx
<FieldRenderer
  property="siteProjectPhase"
  value={site.siteProjectPhase}
  handleInputChange={handleChange}
  isTextAreaField={isTextAreaField}
  isFileField={isFileField}
  isEnumField={isEnumField}
  getEnumType={getEnumType}
/>
```

### Notes

<!-- TODO: Edge cases, business logic, or constraints not obvious from the code. -->

---

## SiteDetails

Main detail panel for viewing and editing a site. Organized into tabbed sections defined by `useSiteHeaders`.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `selectedSite` | `Site & { siteBuildings?: Building[] }` | No | The site being viewed/edited |
| `setSelectedSite` | `(site: Site) => void` | No | Setter for updating selected site |
| `editing` | `boolean` | No | Whether the form is in edit mode |
| `setEditing` | `(editing: boolean) => void` | No | Setter for edit mode |
| `setActiveChanges` | `(hasChanges: boolean) => void` | No | Setter indicating unsaved changes |
| `sites` | `Site[]` | No | List of all sites (unused in current implementation) |
| `activeTab` | `string` | No | Currently active tab key |
| `setActiveTab` | `(tab: string) => void` | No | Setter for active tab |

### Ref Methods

The component exposes a ref with the following method:

| Method | Description |
|--------|-------------|
| `saveChanges()` | Persists pending edits via `updateSite` or `createSite` |

### Behavior

- **New Site**: When `selectedSite.id < 0`, automatically enters edit mode and calls `createSite` on save
- **Existing Site**: Calls `updateSite` with changed fields on save
- **Associated Buildings Tab**: Renders `AssociatedBuildingsTable` with connect/disconnect tracking

### Usage

```tsx
import SiteDetails, { SiteDetailsRef } from '@/core/components/viewers/Data/siteDetails/SiteDetails'

const detailsRef = useRef<SiteDetailsRef>(null)

<SiteDetails
  ref={detailsRef}
  selectedSite={selectedSite}
  setSelectedSite={setSelectedSite}
  editing={editing}
  setEditing={setEditing}
  activeTab={activeTab}
  setActiveTab={setActiveTab}
/>

// Save from parent
await detailsRef.current?.saveChanges()
```

### Notes

<!-- TODO: Edge cases, business logic, or constraints not obvious from the code. -->

---

## Related

- [useSite / useCreateSite hooks](../hooks/sites.md)
- [useBuildings / useCreateBuilding hooks](../hooks/buildings.md)
- [Site data model](../data-model/site.md)
- [Building data model](../data-model/building.md)
- [Roles & Permissions](../authorization/roles-permissions.md)