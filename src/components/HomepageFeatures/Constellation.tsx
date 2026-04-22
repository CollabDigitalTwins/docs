import { useMemo, useState, type ReactNode } from 'react';
import styles from './styles.module.css';
import { TECH_STACK, TECH_EDGES, type TechId } from './techStack';

const VB_W = 1200;
const VB_H = 360;

export function TechConstellation(): ReactNode {
  const [hovered, setHovered] = useState<TechId | null>(null);

  // Adjacency map — for each node, the set of directly connected node ids.
  const neighbors = useMemo(() => {
    const m = new Map<TechId, Set<TechId>>();
    for (const t of TECH_STACK) m.set(t.id, new Set());
    for (const [a, b] of TECH_EDGES) {
      m.get(a)!.add(b);
      m.get(b)!.add(a);
    }
    return m;
  }, []);

  const isHighlighted = (id: TechId) =>
    hovered !== null && (hovered === id || neighbors.get(hovered)!.has(id));

  const edgeIsHighlighted = (a: TechId, b: TechId) =>
    hovered !== null && (hovered === a || hovered === b);

  const byId = useMemo(() => {
    const m = new Map<TechId, (typeof TECH_STACK)[number]>();
    for (const t of TECH_STACK) m.set(t.id, t);
    return m;
  }, []);

  return (
    <div
      className={styles.constellation}
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
      data-active={hovered ? 'true' : 'false'}
    >
      {/* Edge layer — SVG lines behind the nodes */}
      <svg
        className={styles.constellationEdges}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--constellation-accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--constellation-accent)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {TECH_EDGES.map(([a, b]) => {
          const na = byId.get(a);
          const nb = byId.get(b);
          if (!na || !nb) return null;
          const active = edgeIsHighlighted(a, b);
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              className={`${styles.constellationEdge} ${active ? styles.constellationEdgeActive : ''}`}
            />
          );
        })}
      </svg>

      {/* Node layer — absolutely positioned HTML anchors */}
      {TECH_STACK.map((t) => {
        const active = hovered === t.id;
        const highlighted = isHighlighted(t.id);
        const dimmed = hovered !== null && !highlighted;
        const classes = [
          styles.node,
          active && styles.nodeActive,
          highlighted && !active && styles.nodeHighlighted,
          dimmed && styles.nodeDimmed,
        ].filter(Boolean).join(' ');

        return (
          <a
            key={t.id}
            href={t.href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
            style={{
              left: `${(t.x / VB_W) * 100}%`,
              top: `${(t.y / VB_H) * 100}%`,
            }}
            onMouseEnter={() => setHovered(t.id)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(t.id)}
            onBlur={() => setHovered(null)}
            aria-label={t.name}
          >
            <span className={styles.nodeStar}>
              <span className={styles.nodeLogo}>
                <t.Logo />
              </span>
            </span>
            <span className={styles.nodeLabel}>{t.name}</span>
          </a>
        );
      })}
    </div>
  );
}
