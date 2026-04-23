---
sidebar_position: 3
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# Backend & API

Next.js API routes, authentication via NextAuth + CASL, REST endpoints organized by domain.

<BrowserOnly>
  {() => {
    const BackendArchitectureDiagram = require('@site/src/components/BackendArchitectureDiagram').default;
    return <BackendArchitectureDiagram bare preview />;
  }}
</BrowserOnly>

## Architecture

CDT's backend lives entirely within Next.js API routes — no separate server process. The structure mirrors domain-driven design:

```
src/app/api/
├── auth/
│   ├── [...nextauth].ts       # NextAuth handlers
│   ├── verify-email/
│   └── reset-password/
├── buildings/
│   ├── route.ts               # GET /api/buildings (list)
│   ├── [id]/
│   │   ├── route.ts           # GET/PATCH /api/buildings/:id
│   │   ├── files/route.ts     # POST /api/buildings/:id/files
│   │   └── comments/route.ts  # GET/POST comments on building
│   └── bulk-import/route.ts   # POST for batch building create
├── sites/route.ts
├── sensors/route.ts
├── files/route.ts             # Upload, download, presigned URLs
├── datasets/route.ts          # Dataset metadata & records
├── openDataPortals/route.ts
├── ckanProxy/route.ts         # CKAN API proxy (CORS bypass)
├── opendatasoftProxy/route.ts
├── dataAnalysis/route.ts      # Aggregations, reports
└── health/route.ts            # Readiness/liveness checks
```

## Route Conventions

Each route follows a consistent pattern:

```typescript
// src/app/api/buildings/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  // 1. Authenticate
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. Check permissions
  const orgId = req.nextUrl.searchParams.get('orgId');
  const can = defineAbilityFor(session.user);
  if (!can.can('read', 'Building', { organizationId: orgId })) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 3. Query & respond
  const buildings = await prisma.building.findMany({
    where: { BuildingOnOrganizations: { some: { organizationId: orgId } } },
  });
  return NextResponse.json(buildings);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();

  // Validate, mutate, respond
  const building = await prisma.building.create({ data: body });
  return NextResponse.json(building, { status: 201 });
}
```

## Authentication

**NextAuth v5** manages user sessions and OAuth.

### Setup

```typescript
// src/lib/auth.ts

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './prisma';

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      async authorize(credentials) {
        // Email + bcrypt password validation
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        return isValid ? user : null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
});
```

### Session & Verification

- **Email verification:** Sent via Nodemailer on sign-up; token expires in 24h
- **Password reset:** Temporary link expires in 1h; bcrypt with `rounds=12`
- **Session duration:** 30 days (JWT), refreshed on each request
- **CORS:** Credentials with `sameSite=lax` for cross-subdomain auth

## Permissions (CASL)

**CASL** (an attribute-based access control library) enforces permissions consistently on server + client.

### Define Abilities

```typescript
// src/lib/permissions.ts

import { defineAbility } from '@casl/ability';

export function defineAbilityFor(user) {
  const { can, rules } = new AbilityBuilder(Ability);

  if (user.role === 'Admin') {
    can('manage', 'all'); // Full access
  } else if (user.role === 'Manager') {
    can('read', 'Building');
    can('update', 'Building', { organizationId: user.organizationId });
    can('delete', 'Building', { organizationId: user.organizationId });
  } else if (user.role === 'Contributor') {
    can('read', 'Building');
    can('create', 'File');
    can('create', 'Comment');
  } else {
    can('read', 'Building');
  }

  return new Ability(rules);
}
```

### API Check

```typescript
const can = defineAbilityFor(session.user);
if (!can.can('update', 'Building', building)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

### Frontend Check

```typescript
const can = defineAbilityFor(user);
return (
  <>
    {can.can('update', building) && <EditButton />}
    {can.can('delete', building) && <DeleteButton />}
  </>
);
```

## Common Endpoints

### Buildings

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/buildings` | GET | List all buildings in org |
| `/api/buildings` | POST | Create building |
| `/api/buildings/:id` | GET | Fetch single building |
| `/api/buildings/:id` | PATCH | Update fields |
| `/api/buildings/:id/files` | POST | Attach file to building |
| `/api/buildings/bulk-import` | POST | CSV/GeoJSON bulk upload |

### Files

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/files/upload-url` | POST | Get presigned S3 URL |
| `/api/files/:id/download-url` | GET | Get presigned download URL |
| `/api/files/:id` | DELETE | Remove file + S3 object |

### Comments

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/buildings/:id/comments` | GET | Fetch comment thread |
| `/api/buildings/:id/comments` | POST | Add comment |
| `/api/comments/:id` | PATCH | Edit comment |

### External Data Proxies

| Endpoint | Purpose |
|----------|---------|
| `/api/ckanProxy` | Proxy CKAN portal queries (avoid CORS, hide API key) |
| `/api/opendatasoftProxy` | Proxy Opendatasoft queries |

## Error Handling

Standard response format:

```typescript
{
  "error": "Validation failed",
  "details": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

Common status codes:

- **400** — Validation error (bad input)
- **401** — Not authenticated
- **403** — Authenticated but not authorized
- **404** — Resource not found
- **429** — Rate limit exceeded
- **500** — Server error

## Middleware & Hooks

### Request Logging

```typescript
// middleware.ts - logs all API requests

export function middleware(req: NextRequest) {
  console.log(`[${req.method}] ${req.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
```

### Rate Limiting

Enforced per user/IP:

```typescript
const rateLimit = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
});
```

## Testing

Route tests authenticate via mock session:

```typescript
// __tests__/api/buildings.test.ts

describe('GET /api/buildings', () => {
  it('returns 401 if not authenticated', async () => {
    const res = await fetch('/api/buildings');
    expect(res.status).toBe(401);
  });

  it('returns user's buildings if authenticated', async () => {
    const res = await fetch('/api/buildings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('buildings');
  });
});
```

