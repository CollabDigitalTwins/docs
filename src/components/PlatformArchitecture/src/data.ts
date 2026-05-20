import type { Layer, Edge } from './types';
import {
  UserIcon, GlobeIcon, ShieldIcon, LayersIcon,
  BoxIcon, CloudIcon, StackIcon,
} from './kindIcons';
import {
  Node_, Next_, React_, TS_, Tailwind_, Shadcn_, NextAuth_,
  MapLibre_, Deck_, Three_, TOC_, Potree_, Martin_,
  Postgres_, PostGIS_, MinIO_, Docker_, Prisma_, CASL_,
  Firefox_, Chrome_, Edge_, Opera_, Safari_,
  Fullhost_, GLTF_, DXF_, IFC_, LAS_, LAZ_,
} from './techLogos';

const DOT = '\u00B7'; // middle dot "·"

export const DEFAULT_LAYERS: Layer[] = [
  {
    id: 'user', label: 'USER LAYER', note: 'Human entry point',
    nodes: [{
      id: 'user', title: 'User',
      subtitle: `Browser ${DOT} Desktop ${DOT} Mobile ${DOT} Tablet`,
      kind: 'core', wide: true, Icon: UserIcon,
      tech: [
        { Logo: Firefox_, n: 'Firefox' },
        { Logo: Chrome_, n: 'Chrome' },
        { Logo: Edge_, n: 'Edge' },
        { Logo: Opera_, n: 'Opera' },
        { Logo: Safari_, n: 'Safari' },
      ],
    }],
  },
  {
    id: 'frontend', label: 'FRONT-END LAYER', note: 'Client application, rendered in the browser',
    nodes: [{
      id: 'frontend', title: 'Frontend Application',
      subtitle: `Next.js ${DOT} React ${DOT} TypeScript`,
      kind: 'core', wide: true, Icon: LayersIcon,
      header: [
        { Logo: Next_, n: 'Next.js' },
        { Logo: React_, n: 'React' },
        { Logo: TS_, n: 'TypeScript' },
      ],
      modules: [
        { name: 'UI / UX', items: [{ Logo: Tailwind_, n: 'Tailwind' }, { Logo: Shadcn_, n: 'shadcn/ui' }] },
        { name: 'Auth', items: [{ Logo: NextAuth_, n: 'NextAuth.js' }] },
        { name: 'Map', items: [{ Logo: MapLibre_, n: 'MapLibre' }, { Logo: Deck_, n: 'deck.gl' }] },
        { name: '3D Graphics / BIM / PC', items: [{ Logo: Three_, n: 'three.js' }, { Logo: TOC_, n: 'TOC' }, { Logo: Potree_, n: 'Potree' }] },
      ],
    }],
  },
  {
    id: 'integrations', label: 'INTEGRATIONS', note: 'External data services & scheduled pipelines',
    nodes: [{
      id: 'opendata_svc', title: 'External Open Data',
      subtitle: `Integration ${DOT} Transform ${DOT} Scheduled pulls`,
      kind: 'open', wide: true, Icon: GlobeIcon,
      tech: [{ Logo: Node_, n: 'Node.js' }],
    }],
  },
  {
    id: 'backend', label: 'BACKEND SERVICES', note: 'Next.js API routes and cross-cutting domain services',
    nodes: [
      {
        id: 'core_api', title: 'Core API',
        subtitle: `Next.js API routes ${DOT} Business logic ${DOT} CRUD`,
        kind: 'core', Icon: LayersIcon,
        tech: [{ Logo: Next_, n: 'Next.js' }, { Logo: Node_, n: 'Node.js' }],
      },
      {
        id: 'auth_svc', title: 'Authentication',
        subtitle: `Tokens ${DOT} Sessions ${DOT} MFA`,
        kind: 'core', Icon: ShieldIcon,
        tech: [{ Logo: NextAuth_, n: 'NextAuth.js' }],
      },
      {
        id: 'authz_svc', title: 'Authorization',
        subtitle: `RBAC ${DOT} Roles ${DOT} Permissions`,
        kind: 'core', Icon: ShieldIcon,
        tech: [{ Logo: CASL_, n: 'CASL' }],
      },
    ],
  },
  {
    id: 'data', label: 'DATA STORAGE', note: 'Source of truth',
    nodes: [
      {
        id: 'db', title: 'Database',
        subtitle: `Users ${DOT} Metadata ${DOT} Auth`,
        kind: 'core', Icon: StackIcon,
        tech: [{ Logo: Postgres_, n: 'PostgreSQL' }, { Logo: Prisma_, n: 'Prisma' }],
      },
      {
        id: 'spatial_db', title: 'Spatial Database',
        subtitle: `Geometry ${DOT} Raster ${DOT} Vector tiles`,
        kind: 'map', Icon: StackIcon,
        tech: [{ Logo: PostGIS_, n: 'PostGIS' }, { Logo: Martin_, n: 'Martin' }],
      },
      {
        id: 'objstore', title: 'Unstructured Files',
        subtitle: `BIM ${DOT} Point clouds ${DOT} Video ${DOT} CSV`,
        kind: 'unstruct', Icon: BoxIcon,
        tech: [
          { Logo: MinIO_, n: 'MinIO' },
          { Logo: IFC_, n: 'IFC' },
          { Logo: GLTF_, n: 'glTF' },
          { Logo: DXF_, n: 'DXF' },
          { Logo: LAS_, n: 'LAS/LAZ' },
        ],
      },
    ],
  },
  {
    id: 'infra', label: 'INFRASTRUCTURE', note: 'Self-hosted cloud',
    nodes: [{
      id: 'cloud', title: 'Cloud Infrastructure',
      subtitle: `Containers ${DOT} Self-hosted ${DOT} Reproducible deployments`,
      kind: 'core', wide: true, Icon: CloudIcon,
      tech: [{ Logo: Docker_, n: 'Docker' }, { Logo: Fullhost_, n: 'Fullhost' }],
    }],
  },
];

export const DEFAULT_EDGES: Edge[] = [
  // Primary top-down flow. Auth + Authz are cross-cutting concerns
  // Core API invokes on every request — their adjacency in the
  // Backend Services row conveys that without an explicit edge.
  { from: 'user', to: 'frontend', kind: 'core' },
  { from: 'frontend', to: 'core_api', kind: 'core' },

  // Backend → Data storage. Core API mediates all reads/writes;
  // auth + authz both persist their state in the relational DB.
  { from: 'core_api', to: 'db', kind: 'core' },
  { from: 'core_api', to: 'spatial_db', kind: 'map' },
  { from: 'core_api', to: 'objstore', kind: 'unstruct' },
  { from: 'auth_svc', to: 'db', kind: 'core' },
  { from: 'authz_svc', to: 'db', kind: 'core' },

  // External Open Data service bridges the frontend with the spatial store
  { from: 'opendata_svc', to: 'frontend', kind: 'open' },
  { from: 'opendata_svc', to: 'spatial_db', kind: 'open' },

  // Data layer sits on Cloud (substrate for everything above)
  { from: 'db', to: 'cloud', kind: 'core', bidir: false },
  { from: 'spatial_db', to: 'cloud', kind: 'map', bidir: false },
  { from: 'objstore', to: 'cloud', kind: 'unstruct', bidir: false },
];
