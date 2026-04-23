---
sidebar_position: 4
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# Data Layer

PostgreSQL database managed by Prisma ORM, object storage via MinIO, and real-time sync with Martin tile server.

<BrowserOnly>
  {() => {
    const DataLayerArchitectureDiagram = require('@site/src/components/DataLayerArchitectureDiagram').default;
    return <DataLayerArchitectureDiagram bare preview />;
  }}
</BrowserOnly>

## Database Schema

All structured data lives in **PostgreSQL**. **Prisma ORM** provides type-safe migrations and query generation.

### Core Models

```prisma
// prisma/schema.prisma

model Organization {
  id            String   @id @default(cuid())
  name          String
  config        Json     // Feature flags, map defaults
  createdAt     DateTime @default(now())
  
  users         User[]
  buildings     BuildingOnOrganizations[]
  roles         Role[]
  sites         Site[]
  sensors       Sensor[]
  files         File[]
}

model User {
  id               String  @id @default(cuid())
  email            String  @unique
  passwordHash     String
  role             Role    @relation(fields: [roleId], references: [id])
  roleId           String
  organization     Organization @relation(fields: [organizationId], references: [id])
  organizationId   String
  emailVerified    DateTime?
  createdAt        DateTime @default(now())
  
  accounts         Account[]       // OAuth provider links
  comments         Comment[]
}

model Role {
  id               String  @id @default(cuid())
  name             String  // "Admin", "Manager", "Contributor", "Viewer"
  organizationId   String
  permissions      Json    // Define ability rules as JSON
  users            User[]
}

model Building {
  id                   String   @id @default(cuid())
  address              String
  buildingLatitude     Float
  buildingLongitude    Float
  featureId            String?  // Vector tile reference
  
  // Rich attributes
  energyUse           Float?
  constructionYear    Int?
  floorArea           Float?
  fundingStatus       String?
  complianceNotes     String?
  
  // Relationships
  organizations       BuildingOnOrganizations[]
  sites               Site[]
  files               File[]
  sensors             Sensor[]
  infrastructure      Infrastructure[]
  comments            Comment[]
  
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  @@index([buildingLatitude, buildingLongitude])
}

model BuildingOnOrganizations {
  building        Building @relation(fields: [buildingId], references: [id], onDelete: Cascade)
  buildingId      String
  organization    Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  organizationId  String
  
  @@id([buildingId, organizationId])
}

model Site {
  id              String   @id @default(cuid())
  name            String
  organizationId  String
  
  buildings       Building[]
  organization    Organization @relation(fields: [organizationId], references: [id])
  
  createdAt       DateTime @default(now())
}

model File {
  id              String   @id @default(cuid())
  filename        String
  mimeType        String
  sizeBytes       Int
  s3Key           String   // MinIO object key
  
  buildingId      String?
  building        Building? @relation(fields: [buildingId], references: [id], onDelete: SetNull)
  
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id])
  
  uploadedBy      String   // User ID
  createdAt       DateTime @default(now())
}

model Sensor {
  id              String   @id @default(cuid())
  name            String
  type            SensorType @relation(fields: [typeId], references: [id])
  typeId          String
  
  buildingId      String?
  building        Building? @relation(fields: [buildingId], references: [id], onDelete: SetNull)
  
  organizationId  String
  organization    Organization @relation(fields: [organizationId], references: [id])
  
  lastReading     Json?    // { value: 23.5, unit: "°C", timestamp: ... }
  createdAt       DateTime @default(now())
}

model SensorType {
  id              String   @id @default(cuid())
  name            String   // "Temperature", "Humidity", "Co2"
  unit            String   // "°C", "%", "ppm"
  range           Json?    // { min: 0, max: 100 }
  sensors         Sensor[]
}

model Comment {
  id              String   @id @default(cuid())
  content         String
  author          User @relation(fields: [authorId], references: [id])
  authorId        String
  
  buildingId      String?
  building        Building? @relation(fields: [buildingId], references: [id], onDelete: Cascade)
  
  parentId        String?  // For threading
  parent          Comment? @relation("CommentThread", fields: [parentId], references: [id], onDelete: Cascade)
  replies         Comment[] @relation("CommentThread")
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

## Migrations

Prisma handles migrations declaratively. Workflow:

```bash
# 1. Update schema.prisma
# 2. Create migration (generates SQL)
npx prisma migrate dev --name add_energy_field

# 3. In CI/CD before deploy
npx prisma migrate deploy

# 4. Reset dev database (destructive)
npx prisma migrate reset
```

Migrations stored in `prisma/migrations/` as timestamped `.sql` files for version control and auditing.

## Object Storage (MinIO)

Binary assets — IFC models, point cloud tiles, PDFs, images — stored in **MinIO** (S3-compatible).

### Upload Flow

```typescript
// src/app/api/files/upload-url/route.ts

import { s3Client } from '@/lib/s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

export async function POST(req: Request) {
  const { filename, mimeType, sizeBytes, buildingId } = await req.json();

  // Generate presigned URL
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: `buildings/${buildingId}/${crypto.randomUUID()}-${filename}`,
    ContentType: mimeType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  // Browser uploads directly to S3
  return NextResponse.json({ uploadUrl: url });
}
```

### Download Flow

Browser receives presigned URL, downloads directly from MinIO:

```typescript
const url = await fetch(`/api/files/${fileId}/download-url`).then(r => r.json());
window.location = url; // Direct S3 URL with auth token
```

## Vector Tiles (Martin)

**Martin** is a separate PostGIS tile server. Reads building geometries + attributes from PostgreSQL, serves as Mapbox Vector Tiles to MapLibre.

### Setup

```toml
# martin.toml

[tiles.buildings]
query = """
SELECT 
  id,
  ST_AsGeom(geom) as geometry,
  address,
  energyUse
FROM buildings
WHERE buildingLatitude IS NOT NULL
"""
```

### Client Usage

```typescript
const buildingTiles = 'http://localhost:3001/tiles/buildings/{z}/{x}/{y}.pbf';

map.addSource('buildings', {
  type: 'vector',
  tiles: [buildingTiles],
  minzoom: 10,
});

map.addLayer({
  id: 'building-fill',
  type: 'fill',
  source: 'buildings',
  paint: { 'fill-color': '#fff', 'fill-opacity': 0.5 },
});
```

## Data Consistency

### PostGIS for Geospatial Queries

```typescript
// Find all buildings within 500m of a point
const nearby = await prisma.$queryRaw`
  SELECT * FROM "Building"
  WHERE ST_DWithin(
    ST_SetSRID(ST_Point(buildingLongitude, buildingLatitude), 4326),
    ST_SetSRID(ST_Point($1, $2), 4326),
    500
  )
`;
```

### Indexing Strategy

| Index | Reason |
|-------|--------|
| `buildingLatitude, buildingLongitude` | Map viewport queries |
| `organizationId` | Multi-tenant filtering |
| `createdAt` | Timeline queries |
| `s3Key` | File lookups |

### Transaction Safety

Bulk operations wrap in transactions:

```typescript
await prisma.$transaction(async (tx) => {
  // All-or-nothing
  for (const buildingData of csvRows) {
    await tx.building.create({ data: buildingData });
  }
});
```

## Backups & Recovery

- **Automated:** Daily backups to S3 (pgBackRest)
- **Retention:** 30-day rolling window
- **Recovery:** Point-in-time restore to any prior timestamp
- **MinIO:** S3 replication to separate region for disaster recovery

## Performance Tuning

### Query Monitoring

```typescript
const result = await prisma.$queryRaw`
  SELECT ... FROM buildings
  -- Debug: inspect query plan
  EXPLAIN ANALYZE
`;
```

### Connection Pooling

PgBouncer in front of PostgreSQL:

```env
DATABASE_URL="postgresql://user:pass@pgbouncer:6432/cdt?schema=public"
```

### Caching

Frequently accessed data (org config, sensor types) cached in Redis with 1-hour TTL.

