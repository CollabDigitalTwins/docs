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
  useState, useMemo, useRef, useEffect, useLayoutEffect, useCallback,
  type CSSProperties, type FC,
} from 'react';
import {
  type LogoComp,
  CaslLogo,
  DeckLogo,
  DockerLogo,
  MapLibreLogo,
  MinioLogo,
  NextAuthLogo,
  NextLogo,
  NodeLogo,
  PostGisLogo,
  PostgresLogo,
  PotreeLogo,
  PrismaLogo,
  ReactLogo,
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
export interface Edge { from: string; to: string; kind: FlowKind; style?: 'solid' | 'dashed'; }

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
const LabelIcon = (text: string): FC<{ s?: number; fg?: string }> =>
  ({ s = 18, fg = 'currentColor' }) => (
    <svg width={s} height={s} viewBox="0 0 32 32" aria-label={text}>
      <rect x="3" y="8" width="26" height="16" rx="2" fill="none" stroke={fg} strokeWidth="1.4" />
      <text x="16" y="20" textAnchor="middle" fontFamily="Geist Mono" fontSize="9" fontWeight="700" fill={fg}>{text}</text>
    </svg>
  );
const GLTF_ = LabelIcon('glTF');
const DXF_ = LabelIcon('DXF');
const IFC_ = LabelIcon('IFC');
const LAS_ = LabelIcon('LAS');

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
      tech: [{ n: 'Chrome' }, { n: 'Firefox' }, { n: 'Safari' }, { n: 'Edge' }],
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
      { id: 'files_svc', title: 'Unstructured Files', subtitle: `Large file processing ${DOT} Conversion`, kind: 'unstruct', Icon: FilesIcon, tech: [{ Logo: GLTF_, n: 'glTF' }, { Logo: DXF_, n: 'DXF' }, { Logo: IFC_, n: 'IFC' }, { Logo: LAS_, n: 'LAS' }] },
    ],
  },
  {
    id: 'data', label: 'DATA STORAGE', note: 'Source of truth',
    nodes: [
      { id: 'ext_open', title: 'External Open Data', subtitle: `Open Ottawa ${DOT} Open Toronto ${DOT} StatsCan`, kind: 'open', Icon: GlobeIcon, tech: [{ n: 'HTTPS feeds' }] },
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
      tech: [{ Logo: Docker_, n: 'Docker' }],
    }],
  },
];

export const DEFAULT_EDGES: Edge[] = [
  { from: 'user', to: 'frontend', kind: 'core' },
  { from: 'frontend', to: 'gateway', kind: 'core' },
  { from: 'frontend', to: 'geo_svc', kind: 'map', style: 'dashed' },
  { from: 'frontend', to: 'files_svc', kind: 'unstruct', style: 'dashed' },
  { from: 'opendata_svc', to: 'gateway', kind: 'open', style: 'dashed' },
  { from: 'opendata_svc', to: 'ext_open', kind: 'open', style: 'dashed' },
  { from: 'gateway', to: 'core_api', kind: 'core' },
  { from: 'gateway', to: 'auth_svc', kind: 'core' },
  { from: 'gateway', to: 'geo_svc', kind: 'map' },
  { from: 'gateway', to: 'files_svc', kind: 'unstruct' },
  { from: 'core_api', to: 'db', kind: 'core' },
  { from: 'auth_svc', to: 'db', kind: 'core' },
  { from: 'geo_svc', to: 'spatial_db', kind: 'map' },
  { from: 'files_svc', to: 'objstore', kind: 'unstruct' },
  { from: 'opendata_svc', to: 'db', kind: 'open', style: 'dashed' },
  { from: 'ext_open', to: 'cloud', kind: 'core', style: 'dashed' },
  { from: 'db', to: 'cloud', kind: 'core', style: 'dashed' },
  { from: 'objstore', to: 'cloud', kind: 'core', style: 'dashed' },
  { from: 'spatial_db', to: 'cloud', kind: 'core', style: 'dashed' },
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
  ({ open: 'Open Data', map: 'Map Data', unstruct: 'Unstructured', core: 'Core' }[k]);

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
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, borderRadius: '10px 0 0 10px', background: kindVar(node.kind), opacity: 0.9 }} />
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

const EdgeOverlay: FC<{
  nodeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  edges: Edge[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  hoveredNode: string | null;
}> = ({ nodeRefs, edges, containerRef, hoveredNode }) => {
  const [paths, setPaths] = useState<Array<Edge & { d: string; id: string }>>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const recalc = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    setSize({ w: cr.width, h: cr.height });

    const infos = edges.map(e => {
      const a = nodeRefs.current[e.from], b = nodeRefs.current[e.to];
      if (!a || !b) return null;
      return { e, ar: a.getBoundingClientRect(), br: b.getBoundingClientRect() };
    }).filter(Boolean) as Array<{ e: Edge; ar: DOMRect; br: DOMRect }>;

    const groups = new Map<string, typeof infos>();
    infos.forEach(info => {
      const k = `${Math.round(info.ar.bottom)}_${Math.round(info.br.top)}`;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(info);
    });

    const out: Array<Edge & { d: string; id: string }> = [];
    groups.forEach(arr => {
      arr.sort((x, y) =>
        (x.ar.left + x.ar.width / 2) - (y.ar.left + y.ar.width / 2));
      const n = arr.length;
      arr.forEach((info, i) => {
        const { e, ar, br } = info;
        const below = br.top > ar.bottom;
        const ax = ar.left + ar.width / 2 - cr.left;
        const ay = (below ? ar.bottom : ar.top) - cr.top;
        const bx = br.left + br.width / 2 - cr.left;
        const by = (below ? br.top : br.bottom) - cr.top;
        const gap = Math.abs(by - ay);
        const mid = (ay + by) / 2;
        const spread = Math.min(gap * 0.6, 10 * (n - 1));
        const laneStep = n > 1 ? spread / (n - 1) : 0;
        const lane = mid - spread / 2 + i * laneStep;
        const d = ax === bx
          ? `M ${ax} ${ay} L ${bx} ${by}`
          : buildRoundedOrthogonal(
            [{ x: ax, y: ay }, { x: ax, y: lane }, { x: bx, y: lane }, { x: bx, y: by }], 8);
        out.push({ ...e, d, id: `${e.from}__${e.to}__${i}` });
      });
    });
    setPaths(out);
  }, [edges, containerRef, nodeRefs]);

  useLayoutEffect(() => { recalc(); }, [recalc]);
  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    Object.values(nodeRefs.current).forEach(n => { if (n) ro.observe(n); });
    const mo = new MutationObserver(recalc);
    if (containerRef.current) mo.observe(containerRef.current, { subtree: true, childList: true, attributes: true });
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
          <marker key={k} id={`arr-${k}`} viewBox="0 0 10 10" refX="8" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={kindVar(k)} />
          </marker>
        ))}
      </defs>
      {paths.map(p => {
        const rel = isRel(p);
        const stroke = kindVar(p.kind);
        const opacity = anyHover ? (rel ? 1 : 0.15) : (p.kind === 'core' ? 0.65 : 0.9);
        const width = rel ? 2.4 : 1.6;
        return (
          <path key={p.id} d={p.d} fill="none" stroke={stroke} strokeWidth={width}
            strokeDasharray={p.style === 'dashed' ? '5 4' : undefined}
            opacity={opacity}
            markerEnd={`url(#arr-${p.kind})`}
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
