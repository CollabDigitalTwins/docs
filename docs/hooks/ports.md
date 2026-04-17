---
title: ApiAdapter Interface
description: Port interface defining all data access operations across the platform's domain entities.
category: hooks
status: draft
last_updated: 2024-01-15
---

# ApiAdapter Interface

The `ApiAdapter` interface defines the contract for all data access operations in the CDT platform. It serves as a port in the hexagonal architecture, allowing the core application logic to remain decoupled from specific data fetching implementations (REST, GraphQL, mock data, etc.). This interface covers buildings, files, sites, users, organizations, comments, sensors, and infrastructure domains.

## Methods by Domain

| Domain | Methods |
|--------|---------|
| Buildings | `getBuildings`, `getBuilding`, `getBuildingsByOsm`, `getBuildingsByFeatureId`, `getBuildingOsmIds`, `updateBuilding`, `createBuilding` |
| Files | `listFiles`, `listFile`, `updateFile`, `listFilesByBuilding`, `listFilesBySite`, `uploadFileToBuilding`, `uploadFileToSite`, `uploadFileToUser`, `deleteFile` |
| Open Data Portals | `listOpenDataPortals`, `getOpenDataPortal`, `listOpenDataPortalsByMunicipality`, `listOpenDataPortalsByMunicipalityAndCountrySubdivision`, `listOpenDataPortalsByCountrySubdivision`, `listOpenDataPortalsByGroup`, `listOpenDataPortalsByName` |
| Sites | `listSites`, `getSite`, `updateSite`, `createSite`, `deleteSite` |
| Users | `getUsers`, `getUser`, `updateUser`, `deleteUser`, `verifyUserPassword`, `changeUserPassword`, `createUser`, `getUserRole`, `updateUserRole` |
| Organizations | `getOrganization`, `updateOrganization`, `getOrganizationByName`, `getOrganizationRoles` |
| Comments | `getComments`, `getCommentsByBuilding`, `getComment`, `updateComment`, `deleteComment`, `createComment`, `getCommentsByAuthor` |
| Sensors | `getSensors`, `getSensorsByBuilding`, `getSensor`, `updateSensor`, `deleteSensor`, `createSensor`, `getSensorsByAuthor` |
| Sensor Types | `getSensorTypes`, `getSensorType`, `updateSensorType`, `deleteSensorType`, `createSensorType` |
| Infrastructure | `listInfrastructure`, `getInfrastructure`, `updateInfrastructure`, `createInfrastructure`, `deleteInfrastructure` |

---

## Buildings

Methods for managing building entities, including lookups by OSM ID and feature ID.

### `getBuildings`

```ts
getBuildings(): Promise<Building[]>
```

Returns all buildings in the system.

### `getBuilding`

```ts
getBuilding(id: number): Promise<Building | null>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number` | Yes | Building primary key |

### `getBuildingsByOsm`

```ts
getBuildingsByOsm(osmId: number): Promise<Building[]>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `osmId` | `number` | Yes | OpenStreetMap identifier |

### `getBuildingsByFeatureId`

```ts
getBuildingsByFeatureId(featureId: string): Promise<Building[]>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `featureId` | `string` | Yes | GeoJSON feature identifier |

### `getBuildingOsmIds`

```ts
getBuildingOsmIds(): Promise<number[]>
```

Returns all OSM IDs for buildings in the system.

### `updateBuilding`

```ts
updateBuilding(id: number, patch: Partial<Building>): Promise<Building>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number` | Yes | Building primary key |
| `patch` | `Partial<Building>` | Yes | Fields to update |

### `createBuilding`

```ts
createBuilding(input: { buildingData: Partial<Building>; organizationId: string }): Promise<Building>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `input.buildingData` | `Partial<Building>` | Yes | Building properties |
| `input.organizationId` | `string` | Yes | Owning organization ID |

---

## Files

Methods for file management with MinIO storage, supporting attachments to buildings, sites, and users.

### `listFiles`

```ts
listFiles(): Promise<DbFile[]>
```

### `listFile`

```ts
listFile(id: number): Promise<DbFile>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number` | Yes | File primary key |

### `listFilesByBuilding`

```ts
listFilesByBuilding(buildingId: number, opts?: { tag?: string }): Promise<DbFile[]>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `buildingId` | `number` | Yes | Building primary key |
| `opts.tag` | `string` | No | Filter by file tag |

### `listFilesBySite`

```ts
listFilesBySite(siteId: number, opts?: { tag?: string }): Promise<DbFile[]>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `siteId` | `number` | Yes | Site primary key |
| `opts.tag` | `string` | No | Filter by file tag |

### `uploadFileToBuilding`

```ts
uploadFileToBuilding(buildingId: number, input: Partial<DbFile>): Promise<DbFile>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `buildingId` | `number` | Yes | Target building ID |
| `input` | `Partial<DbFile>` | Yes | File metadata |

### `uploadFileToSite`

```ts
uploadFileToSite(siteId: number, input: Partial<DbFile>): Promise<DbFile>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `siteId` | `number` | Yes | Target site ID |
| `input` | `Partial<DbFile>` | Yes | File metadata |

### `uploadFileToUser`

```ts
uploadFileToUser(userId: number, input: Partial<DbFile>): Promise<DbFile>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `number` | Yes | Target user ID |
| `input` | `Partial<DbFile>` | Yes | File metadata |

### `updateFile`

```ts
updateFile(id: number, patch: Partial<DbFile>): Promise<DbFile>
```

### `deleteFile`

```ts
deleteFile(fileId: number): Promise<DbFile>
```

---

## Sites

Methods for managing site entities, which can contain multiple buildings.

### `listSites`

```ts
listSites(): Promise<Site[]>
```

### `getSite`

```ts
getSite(id: string): Promise<Site | null>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Site primary key |

### `createSite`

```ts
createSite(input: Partial<Site>): Promise<Site>
```

### `updateSite`

```ts
updateSite(id: string, patch: Partial<Site> & {
  siteBuildings?: {
    connect?: { id: number }[];
    disconnect?: { id: number }[];
  };
}): Promise<Site>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Site primary key |
| `patch` | `Partial<Site>` | Yes | Fields to update |
| `patch.siteBuildings.connect` | `{ id: number }[]` | No | Buildings to associate |
| `patch.siteBuildings.disconnect` | `{ id: number }[]` | No | Buildings to disassociate |

### `deleteSite`

```ts
deleteSite(id: string | number): Promise<Site>
```

---

## Users

Methods for user management including authentication and role assignment.

### `getUsers`

```ts
getUsers(): Promise<User[]>
```

### `getUser`

```ts
getUser(id: string): Promise<User | null>
```

### `createUser`

```ts
createUser(input: { userData: Partial<User> }): Promise<User>
```

### `updateUser`

```ts
updateUser(id: string, patch: Partial<User>): Promise<User>
```

### `deleteUser`

```ts
deleteUser(id: string): Promise<User>
```

### `verifyUserPassword`

```ts
verifyUserPassword(id: string, password: string): Promise<boolean>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | User primary key |
| `password` | `string` | Yes | Password to verify |

### `changeUserPassword`

```ts
changeUserPassword(id: string, oldPassword: string, newPassword: string): Promise<User>
```

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | User primary key |
| `oldPassword` | `string` | Yes | Current password |
| `newPassword` | `string` | Yes | New password |

### `getUserRole`

```ts
getUserRole(id: string): Promise<Role>
```

### `updateUserRole`

```ts
updateUserRole(userId: string, roleId: number): Promise<User>
```

---

## Organizations

Methods for organization management and role retrieval.

### `getOrganization`

```ts
getOrganization(id: string): Promise<Organization | null>
```

### `getOrganizationByName`

```ts
getOrganizationByName(name: string): Promise<Organization | null>
```

### `updateOrganization`

```ts
updateOrganization(id: string, patch: Partial<Organization>): Promise<Organization>
```

### `getOrganizationRoles`

```ts
getOrganizationRoles(orgId: string): Promise<Role[]>
```

---

## Open Data Portals

Methods for querying external open data portal references by geographic and categorical filters.

### `listOpenDataPortals`

```ts
listOpenDataPortals(): Promise<OpenDataPortal[]>
```

### `getOpenDataPortal`

```ts
getOpenDataPortal(id: number): Promise<OpenDataPortal | null>
```

### `listOpenDataPortalsByMunicipality`

```ts
listOpenDataPortalsByMunicipality(municipality: string): Promise<OpenDataPortal[]>
```

### `listOpenDataPortalsByCountrySubdivision`

```ts
listOpenDataPortalsByCountrySubdivision(countrySubdivision: string): Promise<OpenDataPortal[]>
```

### `listOpenDataPortalsByMunicipalityAndCountrySubdivision`

```ts
listOpenDataPortalsByMunicipalityAndCountrySubdivision(
  municipality: string, 
  countrySubdivision: string
): Promise<OpenDataPortal[]>
```

### `listOpenDataPortalsByGroup`

```ts
listOpenDataPortalsByGroup(group: DatasetGroup): Promise<OpenDataPortal[]>
```

### `listOpenDataPortalsByName`

```ts
listOpenDataPortalsByName(name: string): Promise<OpenDataPortal[]>
```

---

## Comments

Methods for managing comments attached to buildings.

### `getComments`

```ts
getComments(): Promise<Comment[]>
```

### `getComment`

```ts
getComment(id: number): Promise<Comment>
```

### `getCommentsByBuilding`

```ts
getCommentsByBuilding(buildingId: number): Promise<Comment[]>
```

### `getCommentsByAuthor`

```ts
getCommentsByAuthor(authorId: number): Promise<Comment[]>
```

### `createComment`

```ts
createComment(input: { commentData: Partial<Comment> }): Promise<Comment>
```

### `updateComment`

```ts
updateComment(id: number, patch: Partial<Comment>): Promise<Comment>
```

### `deleteComment`

```ts
deleteComment(id: number): Promise<Comment>
```

---

## Sensors

Methods for managing sensor entities and their types.

### `getSensors`

```ts
getSensors(): Promise<Sensor[]>
```

### `getSensor`

```ts
getSensor(id: number): Promise<Sensor>
```

### `getSensorsByBuilding`

```ts
getSensorsByBuilding(buildingId: number): Promise<Sensor[]>
```

### `getSensorsByAuthor`

```ts
getSensorsByAuthor(authorId: number): Promise<Sensor[]>
```

### `createSensor`

```ts
createSensor(input: { sensorData: Partial<Sensor> }): Promise<Sensor>
```

### `updateSensor`

```ts
updateSensor(id: number, patch: Partial<Sensor>): Promise<Sensor>
```

### `deleteSensor`

```ts
deleteSensor(id: number): Promise<Sensor>
```

---

## Sensor Types

### `getSensorTypes`

```ts
getSensorTypes(): Promise<SensorType[]>
```

### `getSensorType`

```ts
getSensorType(id: number): Promise<SensorType>
```

### `createSensorType`

```ts
createSensorType(input: { sensorTypeData: Partial<SensorType> }): Promise<SensorType>
```

### `updateSensorType`

```ts
updateSensorType(id: number, sensorTypeData: Partial<SensorType>): Promise<SensorType>
```

### `deleteSensorType`

```ts
deleteSensorType(id: number): Promise<SensorType>
```

---

## Infrastructure

Methods for managing infrastructure entities.

### `listInfrastructure`

```ts
listInfrastructure(): Promise<Infrastructure[]>
```

### `getInfrastructure`

```ts
getInfrastructure(id: number): Promise<Infrastructure | null>
```

### `createInfrastructure`

```ts
createInfrastructure(input: Partial<Infrastructure>): Promise<Infrastructure>
```

### `updateInfrastructure`

```ts
updateInfrastructure(id: number, patch: Partial<Infrastructure>): Promise<Infrastructure>
```

### `deleteInfrastructure`

```ts
deleteInfrastructure(id: number): Promise<Infrastructure>
```

---

---

## Related

- [data-model/building.md](/docs/data-model/building.md)
- [data-model/site.md](/docs/data-model/site.md)
- [data-model/user.md](/docs/data-model/user.md)
- [data-model/sensor.md](/docs/data-model/sensor.md)
- [core/types/dbTypes.md](/docs/core/types/dbTypes.md)
