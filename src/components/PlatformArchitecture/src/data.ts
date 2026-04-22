import type { Layer, Edge } from './types';
import {
  UserIcon, GlobeIcon, GatewayIcon, ShieldIcon, LayersIcon,
  BoxIcon, CloudIcon, MapIcon, FilesIcon, StackIcon,
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
    id: 'api', label: 'API LAYER', note: 'Gateways & scheduled pipelines',
    nodes: [
      {
        id: 'opendata_svc', title: 'External Open Data',
        subtitle: `Integration ${DOT} Transform ${DOT} Scheduled pulls`,
        kind: 'open', Icon: GlobeIcon,
        tech: [{ Logo: Node_, n: 'Node.js' }],
      },
      {
        id: 'gateway', title: 'API Gateway',
        subtitle: `Routing ${DOT} Rate-limit ${DOT} Observability`,
        kind: 'core', Icon: GatewayIcon,
        tech: [{ Logo: Node_, n: 'Node.js' }],
      },
    ],
  },
  {
    id: 'backend', label: 'BACKEND SERVICES', note: 'Domain services, horizontally scalable',
    nodes: [
      {
        id: 'core_api', title: 'Core API',
        subtitle: `Business logic ${DOT} CRUD ${DOT} Assets`,
        kind: 'core', Icon: BoxIcon,
        tech: [{ Logo: Node_, n: 'Node.js' }],
      },
      {
        id: 'auth_svc', title: 'Authentication',
        subtitle: `Tokens ${DOT} Permissions ${DOT} Sessions`,
        kind: 'core', Icon: ShieldIcon,
        tech: [{ Logo: NextAuth_, n: 'NextAuth.js' }, { Logo: CASL_, n: 'CASL' }],
      },
      {
        id: 'geo_svc', title: 'Geospatial Service',
        subtitle: `Tile generation ${DOT} Spatial ops`,
        kind: 'map', Icon: MapIcon,
        tech: [{ Logo: Martin_, n: 'Martin' }],
      },
      {
        id: 'files_svc', title: 'Unstructured Files',
        subtitle: `Large file processing ${DOT} Conversion`,
        kind: 'unstruct', Icon: FilesIcon,
        tech: [
          { Logo: GLTF_, n: 'glTF' },
          { Logo: DXF_, n: 'DXF' },
          { Logo: IFC_, n: 'IFC' },
          { Logo: LAS_, n: 'LAS/LAZ' },
        ],
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
        id: 'objstore', title: 'Object Store',
        subtitle: `BIM ${DOT} Point clouds ${DOT} Video ${DOT} CSV`,
        kind: 'unstruct', Icon: BoxIcon,
        tech: [{ Logo: MinIO_, n: 'MinIO' }],
      },
      {
        id: 'spatial_db', title: 'Spatial Database',
        subtitle: `Geometry ${DOT} Raster ${DOT} Indexes`,
        kind: 'map', Icon: StackIcon,
        tech: [{ Logo: PostGIS_, n: 'PostGIS' }],
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
  // Primary top-down flow
  { from: 'user', to: 'frontend', kind: 'core' },
  { from: 'frontend', to: 'gateway', kind: 'core' },

  // Gateway fans out to backend services
  { from: 'gateway', to: 'core_api', kind: 'core' },
  { from: 'gateway', to: 'auth_svc', kind: 'core' },
  { from: 'gateway', to: 'geo_svc', kind: 'map', corner: 0.25 },
  { from: 'gateway', to: 'files_svc', kind: 'unstruct' },

  // Backend → Data storage (one-to-one)
  { from: 'core_api', to: 'db', kind: 'core' },
  { from: 'auth_svc', to: 'db', kind: 'core', corner: 0.75 },
  { from: 'geo_svc', to: 'spatial_db', kind: 'map' },
  { from: 'files_svc', to: 'objstore', kind: 'unstruct' },

  // External Open Data service bridges the frontend with the geospatial backend
  { from: 'opendata_svc', to: 'frontend', kind: 'open' },
  { from: 'opendata_svc', to: 'geo_svc', kind: 'open' },

  // Data layer sits on Cloud (substrate for everything above)
  { from: 'db', to: 'cloud', kind: 'core', bidir: false },
  { from: 'objstore', to: 'cloud', kind: 'unstruct', bidir: false },
  { from: 'spatial_db', to: 'cloud', kind: 'map', bidir: false },
];
