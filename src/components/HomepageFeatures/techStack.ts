import type { LogoComp } from './logos';
import {
  NextLogo, ReactLogo, TsLogo, TailwindLogo, NodeLogo,
  NextAuthLogo, PrismaLogo, PostgresLogo, PostGisLogo, MinioLogo,
  MapLibreLogo, MartinLogo, DeckLogo, ThreeLogo, PotreeLogo, DockerLogo,
  ShadcnLogo, TocLogo,
} from './logos';

export type TechId =
  | 'next' | 'react' | 'ts' | 'tailwind' | 'shadcn' | 'node'
  | 'nextauth' | 'prisma' | 'postgres' | 'postgis' | 'minio'
  | 'maplibre' | 'martin' | 'deck' | 'three' | 'toc' | 'potree' | 'docker';

export type Tech = {
  id: TechId;
  name: string;
  Logo: LogoComp;
  href: string;
  /** Position in the 1200×360 constellation viewBox (desktop). */
  x: number;
  y: number;
  /** Position in the 600×850 mobile viewBox (taller, vertically spread). */
  mx: number;
  my: number;
};

export const TECH_STACK: Tech[] = [
  // ── Frontend cluster (top on mobile, left on desktop) ────
  { id: 'next', name: 'Next.js', Logo: NextLogo, href: 'https://nextjs.org', x: 180, y: 90, mx: 240, my: 60 },
  { id: 'react', name: 'React', Logo: ReactLogo, href: 'https://react.dev', x: 120, y: 210, mx: 370, my: 140 },
  { id: 'ts', name: 'TypeScript', Logo: TsLogo, href: 'https://www.typescriptlang.org', x: 70, y: 90, mx: 80, my: 100 },
  { id: 'tailwind', name: 'Tailwind', Logo: TailwindLogo, href: 'https://tailwindcss.com', x: 260, y: 210, mx: 480, my: 200 },
  { id: 'shadcn', name: 'shadcn', Logo: ShadcnLogo, href: 'https://ui.shadcn.com', x: 200, y: 310, mx: 520, my: 70 },

  // ── Center bridge (runtime / auth / infra) ────────────
  { id: 'node', name: 'Node.js', Logo: NodeLogo, href: 'https://nodejs.org', x: 430, y: 150, mx: 210, my: 270 },
  { id: 'nextauth', name: 'NextAuth', Logo: NextAuthLogo, href: 'https://authjs.dev', x: 400, y: 280, mx: 70, my: 235 },
  { id: 'docker', name: 'Docker', Logo: DockerLogo, href: 'https://www.docker.com', x: 570, y: 320, mx: 535, my: 335 },

  // ── Data cluster ──────────────────────────────────────
  { id: 'prisma', name: 'Prisma', Logo: PrismaLogo, href: 'https://www.prisma.io', x: 570, y: 70, mx: 355, my: 290 },
  { id: 'postgres', name: 'PostgreSQL', Logo: PostgresLogo, href: 'https://www.postgresql.org', x: 600, y: 190, mx: 235, my: 410 },
  { id: 'minio', name: 'MinIO', Logo: MinioLogo, href: 'https://min.io', x: 700, y: 90, mx: 400, my: 440 },

  // ── Geo cluster ───────────────────────────────────────
  { id: 'postgis', name: 'PostGIS', Logo: PostGisLogo, href: 'https://postgis.net', x: 780, y: 250, mx: 95, my: 525 },
  { id: 'martin', name: 'Martin', Logo: MartinLogo, href: 'https://maplibre.org/martin/', x: 830, y: 150, mx: 255, my: 560 },
  { id: 'maplibre', name: 'MapLibre', Logo: MapLibreLogo, href: 'https://maplibre.org', x: 920, y: 230, mx: 525, my: 485 },
  { id: 'deck', name: 'deck.gl', Logo: DeckLogo, href: 'https://deck.gl', x: 950, y: 100, mx: 405, my: 615 },

  // ── 3D / rendering cluster ────────────────────────────
  { id: 'three', name: 'three.js', Logo: ThreeLogo, href: 'https://threejs.org', x: 1080, y: 190, mx: 165, my: 670 },
  { id: 'toc', name: 'That Open Company', Logo: TocLogo, href: 'https://thatopen.com', x: 1130, y: 80, mx: 310, my: 755 },
  { id: 'potree', name: 'Potree', Logo: PotreeLogo, href: 'https://github.com/potree/potree', x: 1110, y: 300, mx: 500, my: 745 },
];

/** Undirected edges expressing meaningful relationships in the stack.
    Each node has 2–4 connections. */
export const TECH_EDGES: Array<[TechId, TechId]> = [
  // Frontend
  ['next', 'react'],
  ['next', 'ts'],
  ['next', 'tailwind'],
  ['react', 'ts'],
  ['react', 'tailwind'],
  ['shadcn', 'react'],
  ['shadcn', 'tailwind'],
  // Runtime / auth
  ['next', 'node'],
  ['next', 'nextauth'],
  ['ts', 'node'],
  ['nextauth', 'prisma'],
  // Data
  ['ts', 'prisma'],
  ['node', 'prisma'],
  ['prisma', 'postgres'],
  ['postgres', 'postgis'],
  ['node', 'minio'],
  ['minio', 'potree'],
  // Geo
  ['postgis', 'martin'],
  ['martin', 'maplibre'],
  ['maplibre', 'deck'],
  ['deck', 'three'],
  // 3D
  ['three', 'toc'],
  ['three', 'potree'],
  ['toc', 'react'],
  // Infra
  ['docker', 'postgres'],
  ['docker', 'node'],
  ['docker', 'minio'],
];
