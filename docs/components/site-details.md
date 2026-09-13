---
title: SiteDetails Components
description: UI components for creating, viewing, and editing site records with associated buildings.
---

# SiteDetails Components

The components that manage site records in the Data viewer: a creation dialog, the detail panel, its field renderer, and the associated buildings table.

| Component | File | Description |
|-----------|------|-------------|
| `AddSite` | `AddSite.tsx` | Dialog for creating a new site with a name input |
| `AssociatedBuildingsTable` | `AssociatedBuildings.tsx` | Buildings linked to a site, with attach and create actions |
| `FieldRenderer` | `FieldRenderer.tsx` | Renders the right input control for a field's type |
| `SiteDetails` | `SiteDetails.tsx` | Tabbed detail panel for site properties |

## `AddSite`

Captures the name of a new site. On submit it creates a temporary site object with `id: -1`, selects it, and switches the view to detail mode; an empty name raises an error toast.

```tsx
import AddSite from '@collabdt/core/core/components/viewers/Data/siteDetails/AddSite'

const [siteName, setSiteName] = useState('')

<AddSite newItemName={siteName} setNewItemName={setSiteName} />
```

Both props are required: `newItemName` (`string`) is the current value of the name input and `setNewItemName` (`React.Dispatch<React.SetStateAction<string>>`) updates it. The trigger button is disabled without `create` on the `Site` subject.

## `AssociatedBuildingsTable`

The buildings associated with a site, with search, filtering, and two ways to add more.

```tsx
import AssociatedBuildingsTable from '@collabdt/core/core/components/viewers/Data/siteDetails/AssociatedBuildings'

<AssociatedBuildingsTable
  buildings={site.siteBuildings}
  siteId={site.id}
  onAttachBuilding={handleAttach}
  editing={isEditing}
  setEditing={setIsEditing}
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `buildings` | `Building[]` | Yes | Buildings currently associated with the site |
| `onRowClick` | `(building: Building) => void` | No | Fires when a building row is clicked |
| `siteId` | `number` | No | ID of the parent site |
| `onAttachBuilding` | `(building: Building) => void` | No | Fires when a building is attached |
| `editing` | `boolean` | No | Whether the parent form is in edit mode |
| `setEditing` | `(editing: boolean) => void` | No | Enables edit mode |

Search filters the displayed rows by name, address, municipality, subdivision or project type, and `FiltersDialog` applies more complex conditions. **Attach existing** searches buildings already in the organization; **create and attach** geocodes an address, creates the building record, and attaches it. Newly attached buildings appear immediately, before the save.

It draws on `useBuildings`, `useCreateBuilding`, `useUser` for the current user's organization, and the `fetchSuggestions` and `parseLocation` geocoding utilities.

## `FieldRenderer`

Renders the appropriate input control for a site property based on its type: text, number, date, enum, file, checkbox or array. Inputs are disabled without `update` on the `Site` subject.

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

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `property` | `string` | Yes | Property key being rendered |
| `value` | `any` | Yes | Current value of the property |
| `handleInputChange` | `(property: string, value: any) => void` | Yes | Fires when the value changes |
| `isTextAreaField` | `(property: string) => boolean` | Yes | Predicate for textarea fields |
| `isFileField` | `(property: string) => boolean` | Yes | Predicate for file upload fields |
| `isDateField` | `(property: string) => boolean` | No | Predicate for date fields |
| `isEnumField` | `(property: string) => boolean` | No | Predicate for enum fields |
| `getEnumType` | `(property: string) => string \| null` | No | Returns the enum type name for a property |
| `isNumberField` | `(property: string) => boolean` | No | Predicate for numeric fields |
| `isFullWidthField` | `(property: string) => boolean` | No | Predicate for full-width layout |

Supported enum types are `SiteEnergySource`, `SiteAssessmentConditions`, `SiteProjectPhase`, `SiteProjectType`, `SiteLandUse`, and `CountrySubdivisionData`, which is populated from map context.

## `SiteDetails`

The detail panel for a site, with tabbed sections defined by `useSiteHeaders`. It follows the [detail panel contract](./overview.md#shared-conventions): every prop is optional, and `saveChanges` calls `createSite` when `selectedSite.id < 0` (which also auto-enables edit mode) and `updateSite` with the changed fields otherwise. The Associated Buildings tab renders `AssociatedBuildingsTable` and tracks connects and disconnects.

```tsx
import SiteDetails, { SiteDetailsRef } from '@collabdt/core/core/components/viewers/Data/siteDetails/SiteDetails'

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

await detailsRef.current?.saveChanges()
```

The entity-specific props are `selectedSite` (`Site & { siteBuildings?: Building[] }`), `setSelectedSite` (`(site: Site) => void`) and `sites` (`Site[]`, unused in the current implementation).

## Related

- [useSite / useCreateSite hooks](../hooks/sites.md)
- [useBuildings / useCreateBuilding hooks](../hooks/buildings.md)
- [Site data model](../architecture/data-model.mdx#site)
- [Building data model](../architecture/data-model.mdx#building)
- [Roles & Permissions](../authorization/overview.mdx)
