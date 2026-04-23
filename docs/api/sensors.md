---
title: /api/sensors
description: CRUD operations for sensors and sensor types.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/sensors

Manages `Sensor` records (IoT devices placed in the 3D world) and `SensorType` records (categories that define icon, colour scale, and value range).

## Sensor Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/sensors` | List all sensors |
| `GET` | `/api/sensors/[id]` | Get a single sensor |
| `GET` | `/api/sensors/building/[buildingId]` | List sensors for a building |
| `GET` | `/api/sensors/author/[authorId]` | List sensors by author |
| `POST` | `/api/sensors/create` | Create a sensor |
| `PUT` | `/api/sensors/[id]` | Update a sensor |
| `DELETE` | `/api/sensors/[id]` | Delete a sensor |

## Sensor Type Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/sensor-types` | List all sensor types |
| `GET` | `/api/sensor-types/[id]` | Get a single sensor type |
| `POST` | `/api/sensor-types/create` | Create a sensor type |
| `PUT` | `/api/sensor-types/[id]` | Update a sensor type |
| `DELETE` | `/api/sensor-types/[id]` | Delete a sensor type |

---

## GET `/api/sensors`

Returns all sensors for the authenticated user's organization.

### Authentication

Requires permission: `{ action: "read", subject: "Sensor" }`

### Response

```json
[
  {
    "id": 1,
    "name": "Lobby Temperature",
    "typeId": 2,
    "viewer": "bim",
    "visible": true,
    "data": "[{\"ts\":1700000000,\"v\":21.5}]",
    "dataFormat": "Json",
    "updateFrequency": 60,
    "organizationId": 1
  }
]
```

---

## POST `/api/sensors/create`

Creates a new sensor.

### Request body

```json
{
  "sensorData": {
    "name": "Lobby Temperature",
    "typeId": 2,
    "viewer": "bim",
    "visible": true,
    "data": "[]",
    "dataFormat": "Json",
    "updateFrequency": 60,
    "buildingId": 1
  }
}
```

---

## PUT `/api/sensors/[id]`

Partial update. Moving a sensor between buildings revalidates both the old and new building's sensor lists.

### Notes

`SWR` keys invalidated on update: `["sensor", id]`, `["sensors"]`, `["sensors", "building", buildingId]`, `["sensors", "author", authorId]` for both old and new values.

---

## GET `/api/sensor-types`

Returns all sensor type definitions. Sensor types are shared across the organization.

### Response

```json
[
  {
    "id": 1,
    "name": "Temperature",
    "icon": "Thermometer",
    "minValue": -20,
    "maxValue": 50,
    "minColour": "#0000ff",
    "midColour": "#00ff00",
    "maxColour": "#ff0000"
  }
]
```

---

## Related

- [Hooks — Sensors](../hooks/sensors.md)
- [Hooks — Sensor Types](../hooks/sensor-types.md)
- [Data Model — Sensor / SensorType](../architecture/data-model.md#sensor)
- [Guides — Sensors & IoT](../guides/sensors-and-iot.md)
