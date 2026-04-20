import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

function HeroVisual() {
  return (
    <div className={styles.heroVisual}>
      <div className={styles.heroVisualGlow} />
      <Link to="/docs/architecture/overview" className={styles.heroVisualCard}>
        <ArchitectureSketch />
        <div className={styles.heroVisualOverlay}>
          <span className={styles.heroVisualCta}>
            Explore platform architecture →
          </span>
        </div>
      </Link>
    </div>
  );
}

/**
 * Lightweight, purely-graphical architecture sketch for the hero.
 * Six layers of icon-nodes with orthogonal connectors.
 * Flow colors mirror PlatformArchitecture; surface tokens bind to --hp-*.
 */
function ArchitectureSketch() {
  // ── Layout ────────────────────────────────────────────────
  // viewBox is 720 × 520, the diagram sits centered with margins.
  const VW = 720;
  const VH = 520;
  const NODE_R = 16;

  // 4-column grid for services — gateway centered
  const xs = [180, 300, 420, 540];
  const cx = VW / 2; // 360 — used for wide center-aligned nodes
  const ys = { user: 60, frontend: 140, api: 220, backend: 310, data: 400, infra: 480 };

  // Flow-kind colors (identical to PlatformArchitecture)
  const C = {
    open:     '#EF9161',
    map:      '#7FC4C4',
    unstruct: '#B79CE0',
    core:     'var(--hp-on-surface-variant)',
    stroke:   'var(--hp-outline-variant)',
    panel:    'var(--hp-mid)',
    accent:   'var(--hp-primary-container)',
  };

  type Kind = 'open' | 'map' | 'unstruct' | 'core';

  // ── Orthogonal router ────────────────────────────────────
  // Build a 3-segment path: out-stub → corridor lane → in-stub,
  // with rounded corners via arcs (same approach as PlatformArchitecture).
  const routeOrtho = (ax: number, ay: number, bx: number, by: number, lane: number, r = 6) => {
    if (ax === bx) return `M ${ax} ${ay} L ${bx} ${by}`;
    const dirX = bx > ax ? 1 : -1;
    const dirY = lane > ay ? 1 : -1;
    const endDirY = by > lane ? 1 : -1;
    // Points: start → corner1 → corner2 → end
    return [
      `M ${ax} ${ay}`,
      `L ${ax} ${lane - r * dirY}`,
      `Q ${ax} ${lane} ${ax + r * dirX} ${lane}`,
      `L ${bx - r * dirX} ${lane}`,
      `Q ${bx} ${lane} ${bx} ${lane + r * endDirY}`,
      `L ${bx} ${by}`,
    ].join(' ');
  };

  const Node = ({
    x, y, w = 40, h = 32, kind = 'core', accent = false, icon,
  }: { x: number; y: number; w?: number; h?: number; kind?: Kind; accent?: boolean; icon: React.ReactNode }) => {
    const ringColor = accent ? C.accent : C[kind];
    const rx = 6;
    return (
      <g>
        {accent && (
          <rect x={x - w / 2 - 4} y={y - h / 2 - 4} width={w + 8} height={h + 8} rx={rx + 3}
            fill={C.accent} opacity={0.12} />
        )}
        <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={rx}
          fill={C.panel} stroke={ringColor} strokeWidth={accent ? 1.6 : 1.2} />
        {/* left accent bar — same motif as PlatformArchitecture NodeCard */}
        <rect x={x - w / 2} y={y - h / 2} width={2.5} height={h} rx={1}
          fill={C[kind]} opacity={0.9} />
        <g transform={`translate(${x - 8}, ${y - 8})`} color={ringColor}>
          {icon}
        </g>
      </g>
    );
  };

  const Edge = ({
    ax, ay, bx, by, kind, dashed = false, delay = 0,
  }: { ax: number; ay: number; bx: number; by: number; kind: Kind; dashed?: boolean; delay?: number }) => {
    const lane = (ay + by) / 2;
    const d = routeOrtho(ax, ay, bx, by, lane);
    return (
      <g>
        <path d={d} fill="none" stroke={C[kind]} strokeWidth={1.2}
          strokeDasharray={dashed ? '4 4' : undefined} opacity={0.85} />
        <circle r={2} fill={C[kind]}>
          <animateMotion dur="3.2s" repeatCount="indefinite" begin={`${delay}s`} path={d} />
        </circle>
      </g>
    );
  };

  // Horizontal dashed layer separator
  const sep = (y: number) => (
    <line x1={40} y1={y} x2={VW - 40} y2={y}
      stroke={C.stroke} strokeWidth={0.6} strokeDasharray="2 4" opacity={0.55} />
  );

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="xMidYMid meet"
      className={styles.heroSketch}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CDT platform architecture diagram"
    >
      <defs>
        <pattern id="sketchGrid" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none"
            stroke="var(--hp-outline-variant)" strokeWidth="0.5" opacity="0.35" />
        </pattern>
      </defs>
      <rect width={VW} height={VH} fill="url(#sketchGrid)" />

      {/* ── Layer separators ──────────────────────── */}
      {sep((ys.user + ys.frontend) / 2)}
      {sep((ys.frontend + ys.api) / 2)}
      {sep((ys.api + ys.backend) / 2)}
      {sep((ys.backend + ys.data) / 2)}
      {sep((ys.data + ys.infra) / 2)}

      {/* ── Layer labels ──────────────────────────── */}
      {[
        ['USER', ys.user],
        ['FRONT-END', ys.frontend],
        ['API', ys.api],
        ['BACKEND', ys.backend],
        ['DATA', ys.data],
        ['INFRA', ys.infra],
      ].map(([label, y]) => (
        <text key={label as string} x={52} y={(y as number) + 3}
          fontFamily="Geist Mono, monospace" fontSize="9"
          letterSpacing="0.16em"
          fill="var(--hp-on-surface-variant)" opacity={0.8}>
          {label as string}
        </text>
      ))}

      {/* ── Edges (drawn behind nodes) ────────────── */}
      {/* User → Frontend (core) */}
      <Edge ax={cx} ay={ys.user + NODE_R} bx={cx} by={ys.frontend - 18} kind="core" delay={0} />
      {/* Frontend → API Gateway (core) */}
      <Edge ax={cx} ay={ys.frontend + 18} bx={cx} by={ys.api - NODE_R} kind="core" delay={0.3} />
      {/* Open-data API → Gateway (open, dashed) */}
      <Edge ax={xs[0]} ay={ys.api} bx={cx - NODE_R} by={ys.api} kind="open" dashed delay={0.6} />
      {/* API → Backend core services */}
      <Edge ax={cx} ay={ys.api + NODE_R} bx={xs[0]} by={ys.backend - NODE_R} kind="core"     delay={0.9} />
      <Edge ax={cx} ay={ys.api + NODE_R} bx={xs[1]} by={ys.backend - NODE_R} kind="core"     delay={1.1} />
      <Edge ax={cx} ay={ys.api + NODE_R} bx={xs[2]} by={ys.backend - NODE_R} kind="map"      delay={1.3} />
      <Edge ax={cx} ay={ys.api + NODE_R} bx={xs[3]} by={ys.backend - NODE_R} kind="unstruct" delay={1.5} />
      {/* Backend → Data storage */}
      <Edge ax={xs[0]} ay={ys.backend + NODE_R} bx={xs[1]} by={ys.data - NODE_R} kind="core"     delay={1.7} />
      <Edge ax={xs[1]} ay={ys.backend + NODE_R} bx={xs[1]} by={ys.data - NODE_R} kind="core"     delay={1.8} />
      <Edge ax={xs[2]} ay={ys.backend + NODE_R} bx={xs[2]} by={ys.data - NODE_R} kind="map"      delay={1.9} />
      <Edge ax={xs[3]} ay={ys.backend + NODE_R} bx={xs[3]} by={ys.data - NODE_R} kind="unstruct" delay={2.0} />
      {/* Data → Infra (deployment, all dashed core) */}
      <Edge ax={xs[0]} ay={ys.data + NODE_R} bx={cx} by={ys.infra - 18} kind="core" dashed delay={2.3} />
      <Edge ax={xs[1]} ay={ys.data + NODE_R} bx={cx} by={ys.infra - 18} kind="core" dashed delay={2.4} />
      <Edge ax={xs[2]} ay={ys.data + NODE_R} bx={cx} by={ys.infra - 18} kind="core" dashed delay={2.5} />
      <Edge ax={xs[3]} ay={ys.data + NODE_R} bx={cx} by={ys.infra - 18} kind="core" dashed delay={2.6} />

      {/* ── Nodes ─────────────────────────────────── */}
      {/* User */}
      <Node x={cx} y={ys.user} accent icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="6" r="2.6" />
          <path d="M2 14 C3 11 5 10 8 10 C11 10 13 11 14 14" />
        </svg>
      } />

      {/* Frontend */}
      <Node x={cx} y={ys.frontend} w={120} h={36} accent icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <polygon points="8,2 14,5 8,8 2,5" />
          <polyline points="2,8 8,11 14,8" />
          <polyline points="2,11 8,14 14,11" />
        </svg>
      } />

      {/* API layer: open-data (left) + gateway (center) */}
      <Node x={xs[0]} y={ys.api} kind="open" icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6" />
          <ellipse cx="8" cy="8" rx="2.5" ry="6" />
          <line x1="2" y1="8" x2="14" y2="8" />
        </svg>
      } />
      <Node x={cx} y={ys.api} accent icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="6" width="12" height="7" rx="1.2" />
          <path d="M4.5 6 V3 H11.5 V6" fill="none" />
          <circle cx="5.5" cy="9.5" r="0.7" fill="currentColor" />
          <circle cx="8" cy="9.5" r="0.7" fill="currentColor" />
          <circle cx="10.5" cy="9.5" r="0.7" fill="currentColor" />
        </svg>
      } />

      {/* Backend services — one per kind */}
      <Node x={xs[0]} y={ys.backend} icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M8 2 L14 4.5 V10 C14 12.5 10.5 14.5 8 15 C5.5 14.5 2 12.5 2 10 V4.5 Z" />
          <polyline points="5.5,8 7.5,10 11,6.5" strokeLinecap="round" />
        </svg>
      } />
      <Node x={xs[1]} y={ys.backend} icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M8 2 L14 5.5 V10.5 L8 14 L2 10.5 V5.5 Z" />
          <path d="M2 5.5 L8 9 L14 5.5 M8 9 V14" />
        </svg>
      } />
      <Node x={xs[2]} y={ys.backend} kind="map" icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <polygon points="2,4 6,2.5 10,4 14,2.5 14,12 10,13.5 6,12 2,13.5" />
          <line x1="6" y1="2.5" x2="6" y2="12" />
          <line x1="10" y1="4" x2="10" y2="13.5" />
        </svg>
      } />
      <Node x={xs[3]} y={ys.backend} kind="unstruct" icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M4 2 H10 L14 6 V14 H4 Z" />
          <polyline points="10,2 10,6 14,6" />
        </svg>
      } />

      {/* Data storage */}
      <Node x={xs[0]} y={ys.data} kind="open" icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6" />
          <ellipse cx="8" cy="8" rx="2.5" ry="6" />
          <line x1="2" y1="8" x2="14" y2="8" />
        </svg>
      } />
      <Node x={xs[1]} y={ys.data} icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2.5" width="12" height="3" rx="0.6" />
          <rect x="2" y="6.5" width="12" height="3" rx="0.6" />
          <rect x="2" y="10.5" width="12" height="3" rx="0.6" />
        </svg>
      } />
      <Node x={xs[2]} y={ys.data} kind="map" icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="2" y="2.5" width="12" height="3" rx="0.6" />
          <rect x="2" y="6.5" width="12" height="3" rx="0.6" />
          <rect x="2" y="10.5" width="12" height="3" rx="0.6" />
        </svg>
      } />
      <Node x={xs[3]} y={ys.data} kind="unstruct" icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M8 2 L14 5.5 V10.5 L8 14 L2 10.5 V5.5 Z" />
          <path d="M2 5.5 L8 9 L14 5.5 M8 9 V14" />
        </svg>
      } />

      {/* Infrastructure */}
      <Node x={cx} y={ys.infra} w={160} h={36} accent icon={
        <svg width="16" height="14" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M6 12 C3 12 2 10 2 8 C2 5 5 4 7 5 C7.5 2 11 1 14 3 C16 1 20 2 20 5 C22 5 22 8 20 9 C20 11 17 12 15 12 Z" />
        </svg>
      } />
    </svg>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <BrowserOnly>
        {() => {
          const AnimatedBackground =
            require('@site/src/components/AnimatedBackground').default;
          return <AnimatedBackground />;
        }}
      </BrowserOnly>

      <div className={styles.heroInner}>
        <div className={styles.heroGrid}>
          {/* Left — text */}
          <div className={styles.heroLeft}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Documentation
            </div>

            <h1 className={styles.heroTitle}>
              <span className={styles.heroGradient}>Build</span>
              <br />
              with CDT
            </h1>

            <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>

            <div className={styles.buttons}>
              <Link className={styles.ctaButton} to="/docs/introduction">
                Get started
              </Link>
              <Link
                className={styles.ctaSecondary}
                to="/docs/getting-started/installation"
              >
                Installation guide
              </Link>
            </div>
          </div>

          {/* Right — visual */}
          <HeroVisual />
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Collab Digital Twins Documentation"
      description="Guides, references, and examples for building on the Collab Digital Twins platform."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
