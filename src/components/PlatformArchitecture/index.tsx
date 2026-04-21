/**
 * PlatformArchitecture.tsx
 * Collab Digital Twins — full-stack platform architecture diagram.
 *
 * Self-contained React + TypeScript component. No runtime deps beyond React.
 * Extend by adding entries to the LAYERS and EDGES constants.
 * Edges route orthogonally with rounded corners; hovering a node highlights
 * its neighborhood.
 */

import React, {
  useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback, useId,
  type CSSProperties, type FC,
} from 'react';
import {
  type LogoComp,
  CaslLogo,
  ChromeLogo,
  DeckLogo,
  DockerLogo,
  DxfLogo,
  EdgeLogo,
  FirefoxLogo,
  FullhostLogo,
  GltfLogo,
  IfcLogo,
  MapLibreLogo,
  MinioLogo,
  NextAuthLogo,
  NextLogo,
  NodeLogo,
  OperaLogo,
  PostGisLogo,
  PostgresLogo,
  PotreeLogo,
  PrismaLogo,
  ReactLogo,
  SafariLogo,
  TailwindLogo,
  ThreeLogo,
  TsLogo,
} from '../HomepageFeatures/logos';

/* ── TYPES ─────────────────────────────────────────────── */
export type FlowKind = 'open' | 'map' | 'unstruct' | 'core';
export type Theme = 'dark' | 'light';

export interface TechChip { n: string; Logo?: FC<{ s?: number; fg?: string }>; }
export interface Module { name: string; items: TechChip[]; }
export interface Node {
  id: string;
  title: string;
  subtitle?: string;
  kind: FlowKind;
  wide?: boolean;
  Icon?: FC<{ s?: number; fg?: string }>;
  header?: TechChip[];
  modules?: Module[];
  tech?: TechChip[];
}
export interface Layer { id: string; label: string; note?: string; nodes: Node[]; }
export interface Edge {
  from: string;
  to: string;
  kind: FlowKind;
  style?: 'solid' | 'dashed';
  bidir?: boolean;
  /** Fractional position of the L's horizontal segment along the corridor.
   *  0 = at source edge, 0.5 = middle (default), 1 = at target edge. */
  corner?: number;
}

export interface PlatformArchitectureProps {
  /** Override detected theme. If omitted, follows html[data-theme]. */
  theme?: Theme;
  layers?: Layer[];
  edges?: Edge[];
  /** Hide the legend sidebar — render just the diagram. */
  bare?: boolean;
  /** Preview mode: hide chrome, disable hover, non-interactive. */
  preview?: boolean;
  className?: string;
  style?: CSSProperties;
}

/* ── INLINE LOGOS (simplified silhouettes) ─────────────── */
const adaptLogo = (Logo: LogoComp): FC<{ s?: number; fg?: string }> =>
  ({ s = 18 }) => <>{Logo({ size: s })}</>;

const Node_ = adaptLogo(NodeLogo);
const Next_ = adaptLogo(NextLogo);
const React_ = adaptLogo(ReactLogo);
const TS_ = adaptLogo(TsLogo);
const Tailwind_ = adaptLogo(TailwindLogo);
const Shadcn_: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-label="shadcn/ui">
    <rect x="2" y="2" width="28" height="28" rx="4" fill="none" stroke={fg} strokeWidth="1.8" />
    <line x1="13" y1="9" x2="9" y2="22" stroke={fg} strokeWidth="2" strokeLinecap="round" />
    <line x1="23" y1="16" x2="18" y2="22" stroke={fg} strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const NextAuth_ = adaptLogo(NextAuthLogo);
const Prisma_ = adaptLogo(PrismaLogo);
const CASL_ = adaptLogo(CaslLogo);
const Firefox_ = adaptLogo(FirefoxLogo);
const Chrome_ = adaptLogo(ChromeLogo);
const Edge_ = adaptLogo(EdgeLogo);
const Opera_ = adaptLogo(OperaLogo);
const Safari_ = adaptLogo(SafariLogo);
const MapLibre_ = adaptLogo(MapLibreLogo);
const Deck_ = adaptLogo(DeckLogo);
const Three_ = adaptLogo(ThreeLogo);
const Potree_ = adaptLogo(PotreeLogo);
const Martin_: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-label="Martin">
    <rect x="4" y="4" width="24" height="24" rx="3" fill="none" stroke={fg} strokeWidth="1.6" />
    <path d="M8 22 L14 12 L16 17 L18 12 L24 22" stroke={fg} strokeWidth="1.8" fill="none" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);
const Postgres_ = adaptLogo(PostgresLogo);
const PostGIS_ = adaptLogo(PostGisLogo);
const MinIO_ = adaptLogo(MinioLogo);
const Docker_ = adaptLogo(DockerLogo);
const Fullhost_ = adaptLogo(FullhostLogo);
const GLTF_ = adaptLogo(GltfLogo);
const DXF_ = adaptLogo(DxfLogo);
const IFC_ = adaptLogo(IfcLogo);
// LAS / LAZ → shared cloud glyph (point-cloud data)
const PointCloudFormatIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <path
      d="M10 24 C5 24 3 20 3 17 C3 13 7 11 10 12 C11 7 16 5 20 7 C23 4 29 5 30 10 C34 10 37 13 37 17 C37 21 33 24 29 24 Z"
      fill="none" stroke={fg} strokeWidth="1.8" strokeLinejoin="round"
      transform="translate(-3 -2) scale(0.9)"
    />
  </svg>
);
const LAS_ = PointCloudFormatIcon;
const LAZ_ = PointCloudFormatIcon;

/* ── Node kind icons ───────────────────────────────────── */
const UserIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <circle cx="16" cy="12" r="5" fill="none" stroke={fg} strokeWidth="1.8" />
    <path d="M6 27 C7 21 12 19 16 19 C20 19 25 21 26 27" fill="none" stroke={fg} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const GlobeIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <circle cx="16" cy="16" r="12" fill="none" stroke={fg} strokeWidth="1.6" />
    <ellipse cx="16" cy="16" rx="5" ry="12" fill="none" stroke={fg} strokeWidth="1.4" />
    <line x1="4" y1="16" x2="28" y2="16" stroke={fg} strokeWidth="1.4" />
  </svg>
);
const GatewayIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <rect x="4" y="10" width="24" height="12" rx="2" fill="none" stroke={fg} strokeWidth="1.6" />
    <path d="M9 10 V5 C9 4 10 4 11 4 H21 C22 4 23 4 23 5 V10" fill="none" stroke={fg} strokeWidth="1.6" />
    <circle cx="11" cy="16" r="1.3" fill={fg} /><circle cx="16" cy="16" r="1.3" fill={fg} /><circle cx="21" cy="16" r="1.3" fill={fg} />
  </svg>
);
const ShieldIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <path d="M16 3 L27 7 V16 C27 22 22 27 16 29 C10 27 5 22 5 16 V7 Z" fill="none" stroke={fg} strokeWidth="1.6" />
    <path d="M11 16 L15 20 L22 12" stroke={fg} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const LayersIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <polygon points="16,4 28,11 16,18 4,11" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <polyline points="4,16 16,23 28,16" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <polyline points="4,21 16,28 28,21" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const BoxIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <path d="M16 4 L28 10 V22 L16 28 L4 22 V10 Z" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M4 10 L16 16 L28 10 M16 16 V28" fill="none" stroke={fg} strokeWidth="1.6" />
  </svg>
);
const CloudIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s * 0.8} viewBox="0 0 40 32" aria-hidden>
    <path d="M10 24 C5 24 3 20 3 17 C3 13 7 11 10 12 C11 7 16 5 20 7 C23 4 29 5 30 10 C34 10 37 13 37 17 C37 21 33 24 29 24 Z" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);
const MapIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <polygon points="4,8 12,5 20,8 28,5 28,24 20,27 12,24 4,27" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <line x1="12" y1="5" x2="12" y2="24" stroke={fg} strokeWidth="1.4" />
    <line x1="20" y1="8" x2="20" y2="27" stroke={fg} strokeWidth="1.4" />
  </svg>
);
const FilesIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <path d="M8 6 H18 L24 12 V26 H8 Z" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M18 6 V12 H24" fill="none" stroke={fg} strokeWidth="1.6" />
  </svg>
);
const StackIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <rect x="4" y="6" width="24" height="5" rx="1" fill="none" stroke={fg} strokeWidth="1.6" />
    <rect x="4" y="13.5" width="24" height="5" rx="1" fill="none" stroke={fg} strokeWidth="1.6" />
    <rect x="4" y="21" width="24" height="5" rx="1" fill="none" stroke={fg} strokeWidth="1.6" />
  </svg>
);

/* ── DEFAULT DATA MODEL ────────────────────────────────── */
const DOT = '\u00B7'; // "·"

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
      header: [{ Logo: Next_, n: 'Next.js' }, { Logo: React_, n: 'React' }, { Logo: TS_, n: 'TypeScript' }],
      modules: [
        { name: 'UI / UX', items: [{ Logo: Tailwind_, n: 'Tailwind' }, { Logo: Shadcn_, n: 'shadcn/ui' }] },
        { name: 'Auth', items: [{ Logo: NextAuth_, n: 'NextAuth.js' }] },
        { name: 'Map', items: [{ Logo: MapLibre_, n: 'MapLibre' }, { Logo: Deck_, n: 'deck.gl' }] },
        { name: '3D Graphics', items: [{ Logo: Three_, n: 'three.js' }, { Logo: Potree_, n: 'Potree' }] },
      ],
    }],
  },
  {
    id: 'api', label: 'API LAYER', note: 'Gateways & scheduled pipelines',
    nodes: [
      { id: 'opendata_svc', title: 'External Open Data', subtitle: `Integration ${DOT} Transform ${DOT} Scheduled pulls`, kind: 'open', Icon: GlobeIcon, tech: [{ Logo: Node_, n: 'Node.js' }] },
      { id: 'gateway', title: 'API Gateway', subtitle: `Routing ${DOT} Rate-limit ${DOT} Observability`, kind: 'core', Icon: GatewayIcon, tech: [{ Logo: Node_, n: 'Node.js' }] },
    ],
  },
  {
    id: 'backend', label: 'BACKEND SERVICES', note: 'Domain services, horizontally scalable',
    nodes: [
      { id: 'core_api', title: 'Core API', subtitle: `Business logic ${DOT} CRUD ${DOT} Assets`, kind: 'core', Icon: BoxIcon, tech: [{ Logo: Node_, n: 'Node.js' }] },
      { id: 'auth_svc', title: 'Authentication', subtitle: `Tokens ${DOT} Permissions ${DOT} Sessions`, kind: 'core', Icon: ShieldIcon, tech: [{ Logo: NextAuth_, n: 'NextAuth.js' }, { Logo: CASL_, n: 'CASL' }] },
      { id: 'geo_svc', title: 'Geospatial Service', subtitle: `Tile generation ${DOT} Spatial ops`, kind: 'map', Icon: MapIcon, tech: [{ Logo: Martin_, n: 'Martin' }] },
      { id: 'files_svc', title: 'Unstructured Files', subtitle: `Large file processing ${DOT} Conversion`, kind: 'unstruct', Icon: FilesIcon, tech: [{ Logo: GLTF_, n: 'glTF' }, { Logo: DXF_, n: 'DXF' }, { Logo: IFC_, n: 'IFC' }, { Logo: LAS_, n: 'LAS' }, { Logo: LAZ_, n: 'LAZ' }] },
    ],
  },
  {
    id: 'data', label: 'DATA STORAGE', note: 'Source of truth',
    nodes: [
      { id: 'db', title: 'Database', subtitle: `Users ${DOT} Metadata ${DOT} Auth`, kind: 'core', Icon: StackIcon, tech: [{ Logo: Postgres_, n: 'PostgreSQL' }, { Logo: Prisma_, n: 'Prisma' }] },
      { id: 'objstore', title: 'Object Store', subtitle: `BIM ${DOT} Point clouds ${DOT} Video ${DOT} CSV`, kind: 'unstruct', Icon: BoxIcon, tech: [{ Logo: MinIO_, n: 'MinIO' }] },
      { id: 'spatial_db', title: 'Spatial Database', subtitle: `Geometry ${DOT} Raster ${DOT} Indexes`, kind: 'map', Icon: StackIcon, tech: [{ Logo: PostGIS_, n: 'PostGIS' }] },
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
  { from: 'user',     to: 'frontend', kind: 'core' },
  { from: 'frontend', to: 'gateway',  kind: 'core' },

  // Gateway fans out to backend services
  { from: 'gateway', to: 'core_api',  kind: 'core' },
  { from: 'gateway', to: 'auth_svc',  kind: 'core' },
  { from: 'gateway', to: 'geo_svc',   kind: 'map',  corner: 0.25 },
  { from: 'gateway', to: 'files_svc', kind: 'unstruct' },

  // Backend → Data storage (one-to-one)
  { from: 'core_api',  to: 'db',         kind: 'core' },
  { from: 'auth_svc',  to: 'db',         kind: 'core', corner: 0.75 },
  { from: 'geo_svc',   to: 'spatial_db', kind: 'map' },
  { from: 'files_svc', to: 'objstore',   kind: 'unstruct' },

  // External Open Data service bridges the frontend with the geospatial backend
  { from: 'opendata_svc', to: 'frontend', kind: 'open' },
  { from: 'opendata_svc', to: 'geo_svc',  kind: 'open' },

  // Data layer sits on Cloud (substrate for everything above)
  { from: 'db',         to: 'cloud', kind: 'core',     bidir: false },
  { from: 'objstore',   to: 'cloud', kind: 'unstruct', bidir: false },
  { from: 'spatial_db', to: 'cloud', kind: 'map',      bidir: false },
];

/* ── THEME TOKENS ──────────────────────────────────────────────
   Bind to the docs sovereign palette (--hp-* from custom.css).
   Dark / light switches automatically with html[data-theme].
   Only flow-kind colors (c-open etc.) stay per-mode.
   ────────────────────────────────────────────────────────────── */
const SHARED_VARS: Record<string, string> = {
  '--bg': 'var(--hp-surface)',
  '--bg-2': 'var(--hp-low)',
  '--panel': 'var(--hp-mid)',
  '--panel-2': 'var(--hp-high)',
  '--stroke': 'var(--hp-outline-variant)',
  '--stroke-2': 'var(--hp-outline)',
  '--text': 'var(--hp-on-surface)',
  '--text-dim': 'var(--hp-on-surface-variant)',
  '--text-dim-2': 'var(--hp-outline)',
  '--primary': 'var(--hp-primary-container)',
  '--primary-soft': 'color-mix(in srgb, var(--hp-primary-container) 14%, transparent)',
  '--primary-line': 'color-mix(in srgb, var(--hp-primary-container) 55%, transparent)',
  '--chip': 'color-mix(in srgb, var(--hp-on-surface) 3%, transparent)',
  '--grid': 'color-mix(in srgb, var(--hp-on-surface) 4%, transparent)',
  '--c-open-soft': 'color-mix(in srgb, var(--c-open) 14%, transparent)',
  '--c-map-soft': 'color-mix(in srgb, var(--c-map) 14%, transparent)',
  '--c-unstruct-soft': 'color-mix(in srgb, var(--c-unstruct) 14%, transparent)',
  '--c-core-soft': 'color-mix(in srgb, var(--hp-on-surface) 5%, transparent)',
};

const THEMES: Record<Theme, Record<string, string>> = {
  dark: {
    ...SHARED_VARS,
    '--c-open': '#EF9161',
    '--c-map': '#7FC4C4',
    '--c-unstruct': '#B79CE0',
    '--c-core': '#8A8680',
    '--logo-bg': '#fff',
  },
  light: {
    ...SHARED_VARS,
    '--c-open': '#EF9161',
    '--c-map': '#5AA0A0',
    '--c-unstruct': '#8C6EC8',
    '--c-core': '#7A756F',
    '--logo-bg': '#F5ECE0',
  },
};

/* ── ORTHOGONAL ROUTER ─────────────────────────────────── */
function buildRoundedOrthogonal(pts: { x: number; y: number }[], r: number): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p0 = pts[i - 1], p = pts[i], p1 = pts[i + 1];
    const v1x = Math.sign(p.x - p0.x), v1y = Math.sign(p.y - p0.y);
    const v2x = Math.sign(p1.x - p.x), v2y = Math.sign(p1.y - p.y);
    const d1 = Math.hypot(p.x - p0.x, p.y - p0.y) / 2;
    const d2 = Math.hypot(p1.x - p.x, p1.y - p.y) / 2;
    const rr = Math.min(r, d1, d2);
    if (rr < 0.5) { d += ` L ${p.x} ${p.y}`; continue; }
    const sx = p.x - v1x * rr, sy = p.y - v1y * rr;
    const ex = p.x + v2x * rr, ey = p.y + v2y * rr;
    const cross = v1x * v2y - v1y * v2x;
    const sweep = cross > 0 ? 1 : 0;
    d += ` L ${sx} ${sy} A ${rr} ${rr} 0 0 ${sweep} ${ex} ${ey}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last.x} ${last.y}`;
  return d;
}

const kindVar = (k: FlowKind) => `var(--c-${k})`;
const kindSoft = (k: FlowKind) => `var(--c-${k}-soft)`;
const kindName = (k: FlowKind) =>
  ({ open: 'Open', map: 'Map', unstruct: 'Files', core: 'Core' }[k]);

/* ── SUBCOMPONENTS ─────────────────────────────────────── */
const LogoChip: FC<{ Logo?: FC<any>; label: string; size?: number }> = ({ Logo, label, size = 14 }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 7px 3px 4px',
    background: 'var(--chip)', border: '1px solid var(--stroke)', borderRadius: 5,
    fontSize: 11, color: 'var(--text)',
  }}>
    {Logo ? (
      <span style={{
        display: 'inline-flex', width: size + 4, height: size + 4, alignItems: 'center', justifyContent: 'center',
        background: 'var(--logo-bg)', borderRadius: 3,
      }}>
        <Logo s={size} fg="currentColor" />
      </span>
    ) : (
      <span style={{ width: 6, height: 6, borderRadius: 2, background: 'var(--text-dim-2)' }} />
    )}
    <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
  </span>
);

const NodeCard: FC<{
  node: Node;
  state: 'focus' | 'rel' | 'dim' | undefined;
  onHover: (id: string) => void;
  onLeave: () => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  interactive: boolean;
}> = ({ node, state, onHover, onLeave, registerRef, interactive }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { registerRef(node.id, ref.current); });
  const hlStyle: CSSProperties =
    state === 'focus' ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary), 0 10px 30px -10px rgba(239,145,97,0.35)' }
      : state === 'dim' ? { opacity: 0.35 }
        : state === 'rel' ? { borderColor: 'var(--stroke-2)' }
          : {};
  return (
    <div
      ref={ref}
      data-node-id={node.id}
      data-hl={state}
      onMouseEnter={interactive ? () => onHover(node.id) : undefined}
      onMouseLeave={interactive ? onLeave : undefined}
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
        border: '1px solid var(--stroke)',
        borderRadius: 10,
        padding: '14px 16px 12px',
        minWidth: node.wide ? 560 : 200,
        flex: node.wide ? '1 1 100%' : '1 1 0',
        boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px -14px rgba(0,0,0,0.4)',
        transition: 'transform .18s, box-shadow .18s, border-color .18s, opacity .18s',
        ...hlStyle,
      }}
    >
      <div style={{
        position: 'absolute',
        left: -1, top: -1, bottom: -1,
        width: 5,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        background: kindVar(node.kind),
        opacity: 0.95,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        {node.Icon && (
          <span style={{
            display: 'inline-flex', width: 26, height: 26, alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--stroke)', borderRadius: 6, background: kindSoft(node.kind), color: kindVar(node.kind),
          }}><node.Icon s={16} /></span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{node.title}</div>
          {node.subtitle && <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.35, marginTop: 2 }}>{node.subtitle}</div>}
        </div>
        <span style={{
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          fontSize: 9, letterSpacing: '0.12em', color: kindVar(node.kind), background: kindSoft(node.kind),
          padding: '3px 6px', borderRadius: 4, textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>{kindName(node.kind)}</span>
      </div>

      {node.header && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, marginBottom: 4 }}>
          {node.header.map(h => <LogoChip key={h.n} Logo={h.Logo} label={h.n} size={14} />)}
        </div>
      )}
      {node.modules && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${node.modules.length}, minmax(0,1fr))`, gap: 8, marginTop: 10 }}>
          {node.modules.map(m => (
            <div key={m.name} style={{ padding: '10px 10px 8px', background: 'var(--chip)', border: '1px solid var(--stroke)', borderRadius: 7 }}>
              <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 9, letterSpacing: '0.1em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 6 }}>{m.name}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {m.items.map(i => <LogoChip key={i.n} Logo={i.Logo} label={i.n} size={12} />)}
              </div>
            </div>
          ))}
        </div>
      )}
      {node.tech && !node.modules && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {node.tech.map(t => <LogoChip key={t.n} Logo={t.Logo} label={t.n} size={12} />)}
        </div>
      )}
    </div>
  );
};

/* ── EDGE OVERLAY — simple orthogonal router ───────────────
   One routing model for every edge:
     source anchor (top or bottom) → vertical drop to mid-y between
     source and target → horizontal slide → target anchor (top or bottom).
   Fan-out: source anchors distribute across source's top/bottom edge,
   biased toward each target's x. Fan-in: target anchors cluster at
   target center. No side rails, no skip/gutter routing.              */
const EdgeOverlay: FC<{
  nodeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  edges: Edge[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  hoveredNode: string | null;
}> = ({ nodeRefs, edges, containerRef, hoveredNode }) => {
  const idPrefix = useId().replace(/[^a-zA-Z0-9_-]/g, 'm');
  const mid = (k: FlowKind) => `${idPrefix}-arr-${k}`;
  const [paths, setPaths] = useState<Array<Edge & { d: string; id: string }>>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const recalc = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    setSize({ w: cr.width, h: cr.height });

    const ARROW_INSET = 8;
    const CORNER_R = 6;
    const MIN_SEP = 16;
    const STRAIGHT_TOL = 12;
    const OBSTRUCTION_PAD = 10; // clearance around obstruction rects

    /* 1. Gather edges, compute direction. */
    type Info = { e: Edge; idx: number; ar: DOMRect; br: DOMRect; goingDown: boolean };
    const infos: Info[] = [];
    edges.forEach((e, idx) => {
      const a = nodeRefs.current[e.from];
      const b = nodeRefs.current[e.to];
      if (!a || !b) return;
      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const goingDown = br.top >= ar.bottom;
      infos.push({ e, idx, ar, br, goingDown });
    });

    /* Snapshot every node rect so edges can dodge unrelated cards. */
    const allRects: Array<{ id: string; r: DOMRect }> = [];
    Object.entries(nodeRefs.current).forEach(([id, el]) => {
      if (el) allRects.push({ id, r: el.getBoundingClientRect() });
    });

    /* 2. Group by source / target to distribute anchors. */
    const outMap = new Map<string, Info[]>();
    const inMap = new Map<string, Info[]>();
    infos.forEach(info => {
      if (!outMap.has(info.e.from)) outMap.set(info.e.from, []);
      if (!inMap.has(info.e.to)) inMap.set(info.e.to, []);
      outMap.get(info.e.from)!.push(info);
      inMap.get(info.e.to)!.push(info);
    });

    const anchors: Record<string, number> = {};

    /* OUT anchors: fan-out on source's edge, biased toward target x. */
    outMap.forEach(list => {
      const nr = list[0].ar;
      const pad = Math.min(24, nr.width * 0.14);
      const minX = nr.left + pad;
      const maxX = nr.right - pad;
      const sorted = [...list].sort((a, b) =>
        (a.br.left + a.br.width / 2) - (b.br.left + b.br.width / 2));
      const tentative = sorted.map(info =>
        Math.max(minX, Math.min(maxX, info.br.left + info.br.width / 2))
      );
      // De-collide left→right, then right→left.
      const pos = [...tentative];
      for (let i = 1; i < pos.length; i++)
        if (pos[i] - pos[i - 1] < MIN_SEP) pos[i] = pos[i - 1] + MIN_SEP;
      for (let i = pos.length - 2; i >= 0; i--)
        if (pos[i + 1] - pos[i] < MIN_SEP) pos[i] = pos[i + 1] - MIN_SEP;
      sorted.forEach((info, i) => {
        anchors[`${info.idx}_out`] = Math.max(minX, Math.min(maxX, pos[i]));
      });
    });

    /* IN anchors: cluster at target center. */
    inMap.forEach(list => {
      const nr = list[0].br;
      const cx = nr.left + nr.width / 2;
      const n = list.length;
      const spread = n === 1 ? 0
        : n === 2 ? Math.min(18, nr.width * 0.12)
        : n === 3 ? Math.min(30, nr.width * 0.22)
        : Math.min(nr.width / 2 - 22, nr.width * 0.34);
      const sorted = [...list].sort((a, b) =>
        (a.ar.left + a.ar.width / 2) - (b.ar.left + b.ar.width / 2));
      sorted.forEach((info, i) => {
        const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1;
        anchors[`${info.idx}_in`] = cx + t * spread;
      });
    });

    /* 2b. Snap-to-straight: for each edge, if the source and target x-ranges
       overlap, align both anchors to a shared x inside that overlap so the
       edge renders as a single vertical line with no bend. This runs per
       edge so a source can still fan multiple straight lines to different
       targets (e.g. opendata_svc → frontend + opendata_svc → geo_svc). */
    infos.forEach(info => {
      const { ar, br } = info;
      const aPad = Math.min(24, ar.width * 0.14);
      const bPad = Math.min(24, br.width * 0.14);
      const lo = Math.max(ar.left + aPad, br.left + bPad);
      const hi = Math.min(ar.right - aPad, br.right - bPad);
      if (lo > hi) return; // no overlap — must bend

      // Prefer a shared x close to the target's center (so fan-in still
      // clusters nicely on the target), clamped into the overlap window.
      const targetCx = br.left + br.width / 2;
      const sourceCx = ar.left + ar.width / 2;
      const preferred = (sourceCx + targetCx) / 2;
      const shared = Math.max(lo, Math.min(hi, preferred));
      anchors[`${info.idx}_out`] = shared;
      anchors[`${info.idx}_in`] = shared;
    });

    /* 3. Build every path with the same 3-segment orthogonal L.
       The corner (horizontal segment) must NEVER overlap a node rect.
       Strategy: scan candidate y-values and pick the one that does NOT
       intersect any unrelated node, preferring something close to the
       naive midpoint between source.bottom and target.top. */
    const out: Array<Edge & { d: string; id: string }> = [];

    // For the full container (local coords), for any given y, we can ask:
    // which node rects straddle this y? If any unrelated node does AND its
    // x-range overlaps the edge's horizontal segment, this y is blocked.
    const toLocal = (r: DOMRect) => ({
      left: r.left - cr.left,
      right: r.right - cr.left,
      top: r.top - cr.top,
      bottom: r.bottom - cr.top,
    });
    const localRects = allRects.map(({ id, r }) => ({ id, ...toLocal(r) }));

    infos.forEach(info => {
      const sx = anchors[`${info.idx}_out`] - cr.left;
      const ex = anchors[`${info.idx}_in`] - cr.left;
      const sy = (info.goingDown ? info.ar.bottom : info.ar.top) - cr.top;
      const eyRaw = (info.goingDown ? info.br.top : info.br.bottom) - cr.top;
      const dir = info.goingDown ? 1 : -1;
      const ey = eyRaw - dir * ARROW_INSET;

      // Short-circuit: truly vertical → single straight line.
      if (Math.abs(sx - ex) < STRAIGHT_TOL) {
        out.push({
          ...info.e,
          d: `M ${sx} ${sy} L ${sx} ${ey}`,
          id: `${info.e.from}__${info.e.to}__${info.idx}`,
        });
        return;
      }

      const corridorTop = Math.min(sy, eyRaw);
      const corridorBot = Math.max(sy, eyRaw);
      const hLo = Math.min(sx, ex);
      const hHi = Math.max(sx, ex);

      // A y-value is blocked if some unrelated node's rect (extended by
      // OBSTRUCTION_PAD) contains y AND its x-range overlaps [hLo, hHi].
      const yBlocked = (y: number): boolean => {
        for (const r of localRects) {
          if (r.id === info.e.from || r.id === info.e.to) continue;
          if (y < r.top - OBSTRUCTION_PAD || y > r.bottom + OBSTRUCTION_PAD) continue;
          if (r.right <= hLo || r.left >= hHi) continue;
          return true;
        }
        return false;
      };

      // Collect every candidate y: naive midpoint + just-above-top /
      // just-below-bottom of every obstruction in the corridor. Then pick
      // the nearest to the naive midpoint that's NOT blocked.
      // Per-edge `corner` prop lets a caller bias the fractional position
      // along the corridor (0 = near source, 0.5 = middle, 1 = near target).
      const cornerFrac = typeof info.e.corner === 'number'
        ? Math.max(0, Math.min(1, info.e.corner))
        : 0.5;
      const naive = info.goingDown
        ? corridorTop + (corridorBot - corridorTop) * cornerFrac
        : corridorBot - (corridorBot - corridorTop) * cornerFrac;
      const candidates = new Set<number>([naive]);
      for (const r of localRects) {
        if (r.id === info.e.from || r.id === info.e.to) continue;
        // Only consider rects actually in (or near) the corridor.
        if (r.bottom < corridorTop - 2 || r.top > corridorBot + 2) continue;
        if (r.right <= hLo || r.left >= hHi) continue;
        candidates.add(r.top - OBSTRUCTION_PAD);
        candidates.add(r.bottom + OBSTRUCTION_PAD);
      }

      let midY = naive;
      const valid = [...candidates]
        .filter(y => y > corridorTop + 2 && y < corridorBot - 2)
        .filter(y => !yBlocked(y));
      if (valid.length > 0) {
        if (typeof info.e.corner === 'number') {
          // Explicit corner: honour it — pick the unblocked candidate
          // nearest the requested fractional position.
          valid.sort((a, b) => Math.abs(a - naive) - Math.abs(b - naive));
        } else if (info.goingDown) {
          valid.sort((a, b) => b - a);   // largest first → near target-top
        } else {
          valid.sort((a, b) => a - b);   // smallest first → near target-bottom
        }
        midY = valid[0];
      }
      // If nothing's free, midY stays at naive (gracefully degrade).

      out.push({
        ...info.e,
        d: buildRoundedOrthogonal([
          { x: sx, y: sy },
          { x: sx, y: midY },
          { x: ex, y: midY },
          { x: ex, y: ey },
        ], CORNER_R),
        id: `${info.e.from}__${info.e.to}__${info.idx}`,
      });
    });

    setPaths(out);
  }, [edges, nodeRefs, containerRef]);

  useLayoutEffect(() => { recalc(); }, [recalc]);
  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(() => recalc());
    if (containerRef.current) ro.observe(containerRef.current);
    Object.values(nodeRefs.current).forEach(n => { if (n) ro.observe(n); });
    const mo = new MutationObserver(() => recalc());
    if (containerRef.current) mo.observe(containerRef.current, { subtree: true, childList: true });
    const onW = () => recalc();
    window.addEventListener('resize', onW);
    return () => { ro.disconnect(); mo.disconnect(); window.removeEventListener('resize', onW); };
  }, [recalc, containerRef, nodeRefs]);

  const isRel = (p: Edge) => hoveredNode ? (p.from === hoveredNode || p.to === hoveredNode) : false;
  const anyHover = !!hoveredNode;

  return (
    <svg width={size.w} height={size.h}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}>
      <defs>
        {(['open', 'map', 'unstruct', 'core'] as FlowKind[]).map(k => (
          <React.Fragment key={k}>
            <marker id={mid(k)} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={kindVar(k)} />
            </marker>
            <marker id={`${mid(k)}-s`} viewBox="0 0 10 10" refX="1" refY="5"
              markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 10 0 L 0 5 L 10 10 z" fill={kindVar(k)} />
            </marker>
          </React.Fragment>
        ))}
      </defs>
      {paths.map(p => {
        const rel = isRel(p);
        const stroke = kindVar(p.kind);
        const opacity = anyHover ? (rel ? 1 : 0.18) : (p.kind === 'core' ? 0.7 : 0.92);
        const width = rel ? 2.4 : 1.6;
        // Bidirectional markers by default; set bidir:false on an edge to opt out.
        const bidir = p.bidir !== false;
        return (
          <path key={p.id} d={p.d} fill="none" stroke={stroke} strokeWidth={width}
            strokeDasharray={p.style === 'dashed' ? '5 4' : undefined}
            opacity={opacity}
            markerEnd={`url(#${mid(p.kind)})`}
            markerStart={bidir ? `url(#${mid(p.kind)}-s)` : undefined}
            style={{ transition: 'opacity .15s, stroke-width .15s' }} />
        );
      })}
    </svg>
  );
};

const LayerRow: FC<{
  layer: Layer;
  nodeStates: Record<string, 'focus' | 'rel' | 'dim' | undefined>;
  onHover: (id: string) => void;
  onLeave: () => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  interactive: boolean;
}> = ({ layer, nodeStates, onHover, onLeave, registerRef, interactive }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 32, alignItems: 'stretch', position: 'relative' }}>
    <div style={{ padding: '28px 0', borderRight: '1px dashed var(--stroke)' }}>
      <div style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.16em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{layer.label}</div>
      {layer.note && <div style={{ fontSize: 11, color: 'var(--text-dim-2)', marginTop: 6, lineHeight: 1.4, paddingRight: 12 }}>{layer.note}</div>}
    </div>
    <div style={{ padding: '28px 0' }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'stretch' }}>
        {layer.nodes.map(n => (
          <NodeCard key={n.id} node={n}
            state={nodeStates[n.id]}
            onHover={onHover} onLeave={onLeave}
            registerRef={registerRef}
            interactive={interactive} />
        ))}
      </div>
    </div>
  </div>
);

const Legend: FC<{
  filters: Record<FlowKind, boolean>;
  setFilters: React.Dispatch<React.SetStateAction<Record<FlowKind, boolean>>>;
}> = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(false);

  const Chip = ({ k, label }: { k: FlowKind; label: string }) => (
    <button onClick={() => setFilters(s => ({ ...s, [k]: !s[k] }))}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 999,
        background: filters[k] ? 'var(--chip)' : 'transparent',
        border: '1px solid ' + (filters[k] ? 'var(--stroke-2)' : 'var(--stroke)'),
        color: filters[k] ? 'var(--text)' : 'var(--text-dim-2)',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, whiteSpace: 'nowrap',
      }}>
      <svg width="20" height="8">
        <line x1="1" y1="4" x2="19" y2="4" stroke={kindVar(k)} strokeWidth={2} opacity={filters[k] ? 1 : 0.3} />
      </svg>
      <span>{label}</span>
    </button>
  );

  return (
    <div style={{
      border: '1px dashed var(--stroke-2)', borderRadius: 10, background: 'var(--chip)',
      marginBottom: 16, overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          width: '100%', padding: '10px 14px', background: 'transparent', border: 'none',
          color: 'var(--text)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'Geist Mono,monospace', fontSize: 10, letterSpacing: '0.14em', color: 'var(--text-dim)' }}>LEGEND</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim-2)' }}>
            {open ? 'Click a flow to filter the diagram' : 'Filter flows'}
          </span>
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .15s', color: 'var(--text-dim)' }}>
          <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          padding: '10px 14px 14px',
          borderTop: '1px solid var(--stroke)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8,
        }}>
          <Chip k="open" label="Open Data" />
          <Chip k="map" label="Map Data" />
          <Chip k="unstruct" label="Unstructured" />
          <Chip k="core" label="Core / Primary" />
        </div>
      )}
    </div>
  );
};

/* ── MAIN COMPONENT ────────────────────────────────────── */
const PlatformArchitecture: FC<PlatformArchitectureProps> = ({
  theme: themeProp,
  layers = DEFAULT_LAYERS,
  edges = DEFAULT_EDGES,
  bare = false,
  preview = false,
  className,
  style,
}) => {
  // Auto-sync with Docusaurus color mode (html[data-theme])
  const [detectedTheme, setDetectedTheme] = useState<Theme>('dark');
  useEffect(() => {
    const sync = () => setDetectedTheme(
      document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    );
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);
  const theme: Theme = themeProp ?? detectedTheme;

  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const diagramRef = useRef<HTMLDivElement>(null);
  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    nodeRefs.current[id] = el;
  }, []);

  const [hovered, setHovered] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<FlowKind, boolean>>({ open: true, map: true, unstruct: true, core: true });

  const nodeStates = useMemo(() => {
    if (!hovered) return {};
    const rel = new Set([hovered]);
    for (const e of edges) {
      if (e.from === hovered) rel.add(e.to);
      if (e.to === hovered) rel.add(e.from);
    }
    const map: Record<string, 'focus' | 'rel' | 'dim'> = {};
    for (const L of layers) for (const n of L.nodes) {
      map[n.id] = n.id === hovered ? 'focus' : rel.has(n.id) ? 'rel' : 'dim';
    }
    return map;
  }, [hovered, layers, edges]);

  const filteredEdges = useMemo(
    () => edges.filter(e => filters[e.kind]),
    [edges, filters]);

  const themeVars = THEMES[theme] as CSSProperties;
  const showChrome = !bare && !preview;

  return (
    <div className={className} style={{ ...(themeVars as any), color: 'var(--text)', fontFamily: 'Geist, system-ui, sans-serif', ...style }}>
      <section style={{ padding: 0, maxWidth: 1440, margin: '0 auto' }}>
        {showChrome && (
          <Legend filters={filters} setFilters={setFilters} />
        )}
        <div ref={diagramRef}
          onMouseLeave={preview ? undefined : () => setHovered(null)}
          style={{
            position: 'relative',
            border: '1px solid var(--stroke)',
            borderRadius: 14,
            background: 'repeating-linear-gradient(0deg, transparent 0, transparent 39px, var(--grid) 40px), repeating-linear-gradient(90deg, transparent 0, transparent 39px, var(--grid) 40px), var(--bg-2)',
            padding: '28px 36px 36px',
            overflow: 'hidden',
            pointerEvents: preview ? 'none' : undefined,
          }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            {layers.map((lay, idx) => (
              <div key={lay.id} style={{ padding: '12px 0' }}>
                <LayerRow layer={lay} nodeStates={nodeStates}
                  onHover={setHovered} onLeave={() => setHovered(null)}
                  registerRef={registerRef}
                  interactive={!preview} />
                {idx < layers.length - 1 && (
                  <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, var(--stroke) 15%, var(--stroke) 85%, transparent)', margin: '20px 0' }} />
                )}
              </div>
            ))}
          </div>
          <EdgeOverlay nodeRefs={nodeRefs} edges={filteredEdges}
            containerRef={diagramRef} hoveredNode={hovered} />
        </div>
      </section>
    </div>
  );
};

export default PlatformArchitecture;
