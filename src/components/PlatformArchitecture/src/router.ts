import type { Edge } from './types';

/* ── ORTHOGONAL PATH BUILDER ───────────────────────────── */
/** Build an SVG path from a list of orthogonal points with rounded corners. */
export function buildRoundedOrthogonal(
  pts: { x: number; y: number }[],
  r: number,
): string {
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

/* ── ROUTING ───────────────────────────────────────────── */
const ARROW_INSET = 8;
const CORNER_R = 6;
const MIN_SEP = 16;
const STRAIGHT_TOL = 12;
const OBSTRUCTION_PAD = 10;

export type RoutedEdge = Edge & { d: string; id: string };

/**
 * Compute SVG paths for every edge.
 * - Resolves each edge to its source/target rects.
 * - Distributes out-anchors (fan-out) and in-anchors (cluster at target center).
 * - Snaps to a straight vertical when source/target x-ranges overlap.
 * - Picks an L-corner y that never overlaps an unrelated node rect.
 * - Supports an explicit per-edge `corner` fraction (0 = near source, 1 = near target).
 */
export function computePaths(
  edges: Edge[],
  nodeRefs: Record<string, HTMLDivElement | null>,
  container: DOMRect,
): RoutedEdge[] {
  type Info = {
    e: Edge;
    idx: number;
    ar: DOMRect;
    br: DOMRect;
    goingDown: boolean;
  };

  /* 1. Gather edges, compute direction. */
  const infos: Info[] = [];
  edges.forEach((e, idx) => {
    const a = nodeRefs[e.from];
    const b = nodeRefs[e.to];
    if (!a || !b) return;
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    const goingDown = br.top >= ar.bottom;
    infos.push({ e, idx, ar, br, goingDown });
  });

  /* Snapshot every node rect so edges can dodge unrelated cards. */
  const allRects: Array<{ id: string; r: DOMRect }> = [];
  Object.entries(nodeRefs).forEach(([id, el]) => {
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
      Math.max(minX, Math.min(maxX, info.br.left + info.br.width / 2)),
    );
    // De-collide left→right, then right→left.
    const pos = [...tentative];
    for (let i = 1; i < pos.length; i++) {
      if (pos[i] - pos[i - 1] < MIN_SEP) pos[i] = pos[i - 1] + MIN_SEP;
    }
    for (let i = pos.length - 2; i >= 0; i--) {
      if (pos[i + 1] - pos[i] < MIN_SEP) pos[i] = pos[i + 1] - MIN_SEP;
    }
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

  /* 2b. Snap-to-straight: align both anchors to a shared x inside the
     overlap so the edge renders as a single vertical line with no bend.
     Skip for edges with srcXBetween — they route themselves. */
  infos.forEach(info => {
    if (info.e.srcXBetween) return;
    const { ar, br } = info;
    const aPad = Math.min(24, ar.width * 0.14);
    const bPad = Math.min(24, br.width * 0.14);
    const lo = Math.max(ar.left + aPad, br.left + bPad);
    const hi = Math.min(ar.right - aPad, br.right - bPad);
    if (lo > hi) return;

    const targetCx = br.left + br.width / 2;
    const sourceCx = ar.left + ar.width / 2;
    const preferred = (sourceCx + targetCx) / 2;
    const shared = Math.max(lo, Math.min(hi, preferred));
    anchors[`${info.idx}_out`] = shared;
    anchors[`${info.idx}_in`] = shared;
  });

  /* 3. Build every path. Corner (horizontal segment) must never overlap
     an unrelated node rect. */
  const toLocal = (r: DOMRect) => ({
    left: r.left - container.left,
    right: r.right - container.left,
    top: r.top - container.top,
    bottom: r.bottom - container.top,
  });
  const localRects = allRects.map(({ id, r }) => ({ id, ...toLocal(r) }));

  /* Helper: does a vertical line at x, spanning [yTop, yBot], clip any
     unrelated node rect (with padding)? Returns the minimum right-edge
     x we'd need to clear it, or null if unobstructed. */
  const verticalClearance = (
    x: number, yTop: number, yBot: number,
    excludeIds: string[],
  ): number | null => {
    let nudge: number | null = null;
    for (const r of localRects) {
      if (excludeIds.includes(r.id)) continue;
      if (x < r.left - OBSTRUCTION_PAD || x > r.right + OBSTRUCTION_PAD) continue;
      if (yTop > r.bottom + OBSTRUCTION_PAD || yBot < r.top - OBSTRUCTION_PAD) continue;
      const candidate = r.right + OBSTRUCTION_PAD;
      if (nudge === null || candidate > nudge) nudge = candidate;
    }
    return nudge;
  };

  const out: RoutedEdge[] = [];
  infos.forEach(info => {
    let sx = anchors[`${info.idx}_out`] - container.left;
    let ex = anchors[`${info.idx}_in`] - container.left;
    const sy = (info.goingDown ? info.ar.bottom : info.ar.top) - container.top;
    const eyRaw = (info.goingDown ? info.br.top : info.br.bottom) - container.top;
    const dir = info.goingDown ? 1 : -1;
    const ey = eyRaw - dir * ARROW_INSET;

    /* srcXBetween: draw a straight vertical through the midpoint of the gap
       between two named nodes, bypassing all fan-out and snap logic. */
    if (info.e.srcXBetween) {
      const [idA, idB] = info.e.srcXBetween;
      const rA = nodeRefs[idA]?.getBoundingClientRect();
      const rB = nodeRefs[idB]?.getBoundingClientRect();
      if (rA && rB) {
        const absX = ((rA.right + rB.left) / 2) - container.left;
        out.push({
          ...info.e,
          d: `M ${absX} ${sy} L ${absX} ${ey}`,
          id: `${info.e.from}__${info.e.to}__${info.idx}`,
        });
        return;
      }
    }

    /* Short-circuit: truly vertical → single straight line. */
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

    const yBlocked = (y: number): boolean => {
      for (const r of localRects) {
        if (r.id === info.e.from || r.id === info.e.to) continue;
        if (y < r.top - OBSTRUCTION_PAD || y > r.bottom + OBSTRUCTION_PAD) continue;
        if (r.right <= hLo || r.left >= hHi) continue;
        return true;
      }
      return false;
    };

    /* Per-edge `corner` fraction biases the naive position along the
       corridor (0 = near source, 0.5 = middle, 1 = near target). */
    const cornerFrac = typeof info.e.corner === 'number'
      ? Math.max(0, Math.min(1, info.e.corner))
      : 0.5;
    const naive = info.goingDown
      ? corridorTop + (corridorBot - corridorTop) * cornerFrac
      : corridorBot - (corridorBot - corridorTop) * cornerFrac;

    const candidates = new Set<number>([naive]);
    for (const r of localRects) {
      if (r.id === info.e.from || r.id === info.e.to) continue;
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
        valid.sort((a, b) => b - a);
      } else {
        valid.sort((a, b) => a - b);
      }
      midY = valid[0];
    }

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

  return out;
}
