---
title: ApiAdapter Interface
description: Port interface defining all data access operations across the platform's domain entities.
---

# ApiAdapter Interface

`ApiAdapter` is the contract for every data access operation in CDT. It is a port in the hexagonal architecture: core logic depends on this interface, so the implementation behind it can be REST, GraphQL, or mock data without the hooks changing.

A host supplies one implementation to `CoreHooksProvider`, and the hook factories described in [Shared conventions](./overview.md#shared-conventions) call through it.

## Buildings

```ts
getBuildings(): Promise<Building[]>
getBuilding(id: number): Promise<Building | null>
getBuildingsByOsm(osmId: number): Promise<Building[]>
getBuildingsByFeatureId(featureId: string): Promise<Building[]>
getBuildingOsmIds(): Promise<number[]>
updateBuilding(id: number, patch: Partial<Building>): Promise<Building>
createBuilding(input: { buildingData: Partial<Building>; organizationId: string }): Promise<Building>
```

`osmId` is an OpenStreetMap identifier and `featureId` a GeoJSON feature identifier. `getBuildingOsmIds` returns the OSM IDs of every building in the system.

## Files

File management backed by MinIO storage, supporting attachments to buildings, sites, and users.

```ts
listFiles(): Promise<DbFile[]>
listFile(id: number): Promise<DbFile>
listFilesByBuilding(buildingId: number, opts?: { tag?: string }): Promise<DbFile[]>
listFilesBySite(siteId: number, opts?: { tag?: string }): Promise<DbFile[]>
uploadFileToBuilding(buildingId: number, input: Partial<DbFile>): Promise<DbFile>
uploadFileToSite(siteId: number, input: Partial<DbFile>): Promise<DbFile>
uploadFileToUser(userId: number, input: Partial<DbFile>): Promise<DbFile>
updateFile(id: number, patch: Partial<DbFile>): Promise<DbFile>
deleteFile(fileId: number): Promise<DbFile>
```

The optional `opts.tag` filters by file tag. The `input` on each upload is file metadata.

## Sites

```ts
listSites(): Promise<Site[]>
getSite(id: string): Promise<Site | null>
createSite(input: Partial<Site>): Promise<Site>
updateSite(id: string, patch: Partial<Site> & {
  siteBuildings?: {
    connect?: { id: number }[];
    disconnect?: { id: number }[];
  };
}): Promise<Site>
deleteSite(id: string | number): Promise<Site>
```

`siteBuildings.connect` and `siteBuildings.disconnect` associate and disassociate buildings in the same update call.

## Users

```ts
getUsers(): Promise<User[]>
getUser(id: string): Promise<User | null>
createUser(input: { userData: Partial<User> }): Promise<User>
updateUser(id: string, patch: Partial<User>): Promise<User>
deleteUser(id: string): Promise<User>
verifyUserPassword(id: string, password: string): Promise<boolean>
changeUserPassword(id: string, oldPassword: string, newPassword: string): Promise<User>
getUserRole(id: string): Promise<Role>
updateUserRole(userId: string, roleId: number): Promise<User>
```

## Organizations

```ts
getOrganization(id: string): Promise<Organization | null>
getOrganizationByName(name: string): Promise<Organization | null>
updateOrganization(id: string, patch: Partial<Organization>): Promise<Organization>
getOrganizationRoles(orgId: string): Promise<Role[]>
```

## Open Data Portals

Queries against external open data portal references, by geographic and categorical filters.

```ts
listOpenDataPortals(): Promise<OpenDataPortal[]>
getOpenDataPortal(id: number): Promise<OpenDataPortal | null>
listOpenDataPortalsByMunicipality(municipality: string): Promise<OpenDataPortal[]>
listOpenDataPortalsByCountrySubdivision(countrySubdivision: string): Promise<OpenDataPortal[]>
listOpenDataPortalsByMunicipalityAndCountrySubdivision(
  municipality: string,
  countrySubdivision: string
): Promise<OpenDataPortal[]>
listOpenDataPortalsByGroup(group: DatasetGroup): Promise<OpenDataPortal[]>
listOpenDataPortalsByName(name: string): Promise<OpenDataPortal[]>
```

## Comments

```ts
getComments(): Promise<Comment[]>
getComment(id: number): Promise<Comment>
getCommentsByBuilding(buildingId: number): Promise<Comment[]>
getCommentsByAuthor(authorId: number): Promise<Comment[]>
createComment(input: { commentData: Partial<Comment> }): Promise<Comment>
updateComment(id: number, patch: Partial<Comment>): Promise<Comment>
deleteComment(id: number): Promise<Comment>
```

## Sensors

```ts
getSensors(): Promise<Sensor[]>
getSensor(id: number): Promise<Sensor>
getSensorsByBuilding(buildingId: number): Promise<Sensor[]>
getSensorsByAuthor(authorId: number): Promise<Sensor[]>
createSensor(input: { sensorData: Partial<Sensor> }): Promise<Sensor>
updateSensor(id: number, patch: Partial<Sensor>): Promise<Sensor>
deleteSensor(id: number): Promise<Sensor>
```

## Sensor Types

```ts
getSensorTypes(): Promise<SensorType[]>
getSensorType(id: number): Promise<SensorType>
createSensorType(input: { sensorTypeData: Partial<SensorType> }): Promise<SensorType>
updateSensorType(id: number, sensorTypeData: Partial<SensorType>): Promise<SensorType>
deleteSensorType(id: number): Promise<SensorType>
```

## Infrastructure

```ts
listInfrastructure(): Promise<Infrastructure[]>
getInfrastructure(id: number): Promise<Infrastructure | null>
createInfrastructure(input: Partial<Infrastructure>): Promise<Infrastructure>
updateInfrastructure(id: number, patch: Partial<Infrastructure>): Promise<Infrastructure>
deleteInfrastructure(id: number): Promise<Infrastructure>
```

## Related

- [Data model](/docs/architecture/data-model)
- [Hooks overview](./overview.md)
