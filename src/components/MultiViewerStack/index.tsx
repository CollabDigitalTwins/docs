import { useEffect, useState, type CSSProperties, type FC, type ReactNode } from 'react';
import type { Theme, FlowKind } from '../PlatformArchitecture/src/types';
import { THEMES, kindVar, kindSoft } from '../PlatformArchitecture/src/theme';
import {
  MapLibreLogo,
  TocLogo,
  ThreeLogo,
  PotreeLogo,
  NextLogo,
  PostgresLogo,
  PostGisLogo,
  MinioLogo,
} from '../HomepageFeatures/logos';

const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return isMobile;
}

type Chip = { label: string; logo?: ReactNode };

/* ── Card with optional kind accent + chips with logos ───────── */
const Card: FC<{
  title: string;
  sub?: string;
  chips?: Chip[];
  kind?: FlowKind;
  centered?: boolean;
}> = ({ title, sub, chips, kind, centered }) => (
  <div style={{
    position: 'relative',
    background: kind
      ? `linear-gradient(180deg, color-mix(in srgb, ${kindVar(kind)} 6%, var(--panel)), var(--panel-2))`
      : 'linear-gradient(180deg, var(--panel), var(--panel-2))',
    border: `1px solid ${kind
      ? `color-mix(in srgb, ${kindVar(kind)} 30%, var(--stroke))`
      : 'var(--stroke)'}`,
    borderRadius: 10,
    padding: centered ? '11px 14px' : '11px 14px 11px 17px',
    boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset, 0 4px 12px -8px rgba(0,0,0,0.35)',
    textAlign: centered ? 'center' : 'left',
  }}>
    {kind && !centered && (
      <div style={{
        position: 'absolute',
        left: -1, top: -1, bottom: -1, width: 4,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        background: kindVar(kind),
        opacity: 0.95,
      }} />
    )}

    <div style={{
      fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
      color: 'var(--text)', lineHeight: 1.3, marginBottom: sub ? 3 : 0,
      fontFamily: 'Geist Mono, ui-monospace, monospace',
    }}>
      {title}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.45 }}>
        {sub}
      </div>
    )}

    {chips && chips.length > 0 && (
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8,
        justifyContent: centered ? 'center' : 'flex-start',
      }}>
        {chips.map(c => (
          <span key={c.label} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 8px 2px 5px',
            background: kind ? kindSoft(kind) : 'var(--chip)',
            border: `1px solid ${kind
              ? `color-mix(in srgb, ${kindVar(kind)} 25%, var(--stroke))`
              : 'var(--stroke)'}`,
            borderRadius: 5,
            fontSize: 10.5,
            fontFamily: 'Geist Mono, ui-monospace, monospace',
            color: 'var(--text)',
            whiteSpace: 'nowrap',
          }}>
            {c.logo && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 14, height: 14, flexShrink: 0,
              }}>
                {c.logo}
              </span>
            )}
            {c.label}
          </span>
        ))}
      </div>
    )}
  </div>
);

/* ── Simple double-headed vertical arrow (mobile fallback) ───── */
const SimpleArrow: FC<{ height?: number }> = ({ height = 22 }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '10px 0',
  }}>
    <svg width="10" height="7" viewBox="0 0 10 7" style={{ display: 'block' }}>
      <path d="M0 7 L5 1 L10 7 z" fill="var(--primary)" />
    </svg>
    <div style={{ width: 1.5, height, background: 'var(--primary)' }} />
    <svg width="10" height="7" viewBox="0 0 10 7" style={{ display: 'block' }}>
      <path d="M0 0 L5 6 L10 0 z" fill="var(--primary)" />
    </svg>
  </div>
);

/* ── Branching connector: N columns merge / split with double-head arrows ─
   Single SVG, arrowheads drawn as polygons in the same coordinate space
   as the lines, so the line-to-head join is pixel-exact.
   ────────────────────────────────────────────────────────────── */
const BranchArrows: FC<{ columns: number; mode: 'merge' | 'split' }> = ({ columns, mode }) => {
  const HEIGHT = 56;
  // arrowhead polygon dimensions (in SVG user units)
  const HEAD_W = 10;
  const HEAD_H = 7;
  // Y positions of arrowhead TIPS (where the line should meet)
  const TOP_TIP_Y = 1;
  const BOTTOM_TIP_Y = HEIGHT - 1;
  // arrowhead BASES are HEAD_H px away from the tip, in the direction of the line
  const TOP_BASE_Y = TOP_TIP_Y + HEAD_H;
  const BOTTOM_BASE_Y = BOTTOM_TIP_Y - HEAD_H;
  const SPINE_Y = HEIGHT / 2;
  const STROKE = 1.5;
  // Extend line slightly past the base to remove any sub-pixel gap
  const OVERLAP = 1;

  // x positions for the N branch lanes (in percentages, used in CSS) and as
  // numeric values for the arrowhead polygons (which need numeric x coords).
  const lanes = Array.from({ length: columns }, (_, i) => (100 / (columns * 2) + i * (100 / columns)));
  const leftPct = lanes[0];
  const rightPct = lanes[lanes.length - 1];

  // Generate an arrowhead polygon centred on a percentage x, pointing UP or DOWN.
  const arrowhead = (xPct: number, dir: 'up' | 'down', key: string | number) => {
    // Polygon points use a CSS calc()-equivalent via the "points" attribute
    // — but SVG doesn't allow calc(); we render the polygon inside a nested <svg>
    // anchored with x="<percent>" to keep percentage-based horizontal positioning.
    const tipY = dir === 'up' ? TOP_TIP_Y : BOTTOM_TIP_Y;
    const baseY = dir === 'up' ? TOP_BASE_Y : BOTTOM_BASE_Y;
    return (
      <svg
        key={key}
        x={`${xPct}%`}
        y={tipY < baseY ? tipY : baseY}
        width={HEAD_W}
        height={HEAD_H}
        viewBox={`0 0 ${HEAD_W} ${HEAD_H}`}
        overflow="visible"
        style={{ transform: `translateX(-${HEAD_W / 2}px)` }}
      >
        <path
          d={dir === 'up'
            ? `M0 ${HEAD_H} L${HEAD_W / 2} 0 L${HEAD_W} ${HEAD_H} z`
            : `M0 0 L${HEAD_W / 2} ${HEAD_H} L${HEAD_W} 0 z`}
          fill="var(--primary)"
        />
      </svg>
    );
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: HEIGHT,
      margin: '14px 0 18px',
    }}>
      <svg
        width="100%"
        height={HEIGHT}
        preserveAspectRatio="none"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* horizontal spine joining all branch lanes */}
        <line
          x1={`${leftPct}%`} y1={SPINE_Y}
          x2={`${rightPct}%`} y2={SPINE_Y}
          stroke="var(--primary)" strokeWidth={STROKE}
        />

        {mode === 'merge' ? (
          <>
            {/* N branches up from spine to top arrowhead bases */}
            {lanes.map((x, i) => (
              <line
                key={`branch-${i}`}
                x1={`${x}%`} y1={SPINE_Y}
                x2={`${x}%`} y2={TOP_BASE_Y - OVERLAP}
                stroke="var(--primary)" strokeWidth={STROKE}
                strokeLinecap="butt"
              />
            ))}
            {/* trunk down from spine centre to bottom arrowhead base */}
            <line
              x1="50%" y1={SPINE_Y}
              x2="50%" y2={BOTTOM_BASE_Y + OVERLAP}
              stroke="var(--primary)" strokeWidth={STROKE}
              strokeLinecap="butt"
            />
            {/* arrowheads */}
            {lanes.map((x, i) => arrowhead(x, 'up', `top-${i}`))}
            {arrowhead(50, 'down', 'bot-centre')}
          </>
        ) : (
          <>
            {/* trunk up from top arrowhead base to spine centre */}
            <line
              x1="50%" y1={TOP_BASE_Y - OVERLAP}
              x2="50%" y2={SPINE_Y}
              stroke="var(--primary)" strokeWidth={STROKE}
              strokeLinecap="butt"
            />
            {/* N branches down from spine to bottom arrowhead bases */}
            {lanes.map((x, i) => (
              <line
                key={`branch-${i}`}
                x1={`${x}%`} y1={SPINE_Y}
                x2={`${x}%`} y2={BOTTOM_BASE_Y + OVERLAP}
                stroke="var(--primary)" strokeWidth={STROKE}
                strokeLinecap="butt"
              />
            ))}
            {/* arrowheads */}
            {arrowhead(50, 'up', 'top-centre')}
            {lanes.map((x, i) => arrowhead(x, 'down', `bot-${i}`))}
          </>
        )}
      </svg>
    </div>
  );
};

/* ── Main component ──────────────────────────────────────────── */
const MultiViewerStack: FC = () => {
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

  const isMobile = useIsMobile();
  const themeVars = THEMES[detectedTheme] as CSSProperties;

  const viewers = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: isMobile ? 10 : 14,
    }}>
      <Card
        kind="map"
        title="Map Viewer"
        sub="2D / 3D web map for GIS layers, basemaps, and georeferenced models."
        chips={[
          { label: 'MapLibre GL', logo: <MapLibreLogo size={14} /> },
        ]}
      />
      <Card
        kind="unstruct"
        title="BIM Viewer"
        sub="IFC engine for building models, property sets, IDS, BCF, and DXF."
        chips={[
          { label: 'That Open Engine', logo: <TocLogo size={14} /> },
          { label: 'Three.js', logo: <ThreeLogo size={14} /> },
        ]}
      />
      <Card
        kind="open"
        title="Point Cloud Viewer"
        sub="LiDAR / photogrammetry rendering with octree LOD streaming."
        chips={[
          { label: 'Potree', logo: <PotreeLogo size={14} /> },
          { label: 'Three.js', logo: <ThreeLogo size={14} /> },
        ]}
      />
    </div>
  );

  const storage = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: isMobile ? 10 : 14,
    }}>
      <Card
        kind="map"
        title="PostgreSQL + PostGIS"
        sub="Structured records — buildings, sites, users, BCF, comments, sensor metadata."
        chips={[
          { label: 'PostgreSQL', logo: <PostgresLogo size={14} /> },
          { label: 'PostGIS', logo: <PostGisLogo size={14} /> },
        ]}
      />
      <Card
        kind="unstruct"
        title="MinIO"
        sub="Binary files — IFC, Fragments, point clouds, media."
        chips={[
          { label: 'MinIO', logo: <MinioLogo size={14} /> },
        ]}
      />
    </div>
  );

  return (
    <div style={{
      ...(themeVars as any),
      color: 'var(--text)',
      fontFamily: 'Geist, system-ui, sans-serif',
      marginBottom: 8,
    }}>
      <div style={{
        position: 'relative',
        border: '1px solid var(--stroke)',
        borderRadius: 14,
        background:
          'repeating-linear-gradient(0deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
          'repeating-linear-gradient(90deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
          'var(--bg-2)',
        padding: isMobile ? '20px 16px 20px' : '24px 24px 24px',
        overflow: 'hidden',
      }}>
        {viewers}
        {isMobile ? <SimpleArrow /> : <BranchArrows columns={3} mode="merge" />}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? 10 : 14,
        }}>
          {!isMobile && <div />}
          <Card
            kind="core"
            centered
            title="Next.js API"
            chips={[{ label: 'Next.js', logo: <NextLogo size={14} /> }]}
          />
          {!isMobile && <div />}
        </div>
        {isMobile ? <SimpleArrow /> : <BranchArrows columns={2} mode="split" />}
        {storage}
      </div>
    </div>
  );
};

export default MultiViewerStack;
