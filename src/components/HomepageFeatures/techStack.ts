import type { LogoComp } from './logos';
import {
  NextLogo, ReactLogo, TsLogo, TailwindLogo, NodeLogo,
  NextAuthLogo, PrismaLogo, PostgresLogo, PostGisLogo, MinioLogo,
  MapLibreLogo, MartinLogo, DeckLogo, ThreeLogo, PotreeLogo, DockerLogo,
} from './logos';

export type Tech = {
  name: string;
  Logo: LogoComp;
  href: string;
};

export const TECH_STACK: Tech[] = [
  { name: 'Next.js',    Logo: NextLogo,     href: 'https://nextjs.org' },
  { name: 'React',      Logo: ReactLogo,    href: 'https://react.dev' },
  { name: 'TypeScript', Logo: TsLogo,       href: 'https://www.typescriptlang.org' },
  { name: 'Tailwind',   Logo: TailwindLogo, href: 'https://tailwindcss.com' },
  { name: 'Node.js',    Logo: NodeLogo,     href: 'https://nodejs.org' },
  { name: 'NextAuth',   Logo: NextAuthLogo, href: 'https://authjs.dev' },
  { name: 'Prisma',     Logo: PrismaLogo,   href: 'https://www.prisma.io' },
  { name: 'PostgreSQL', Logo: PostgresLogo, href: 'https://www.postgresql.org' },
  { name: 'PostGIS',    Logo: PostGisLogo,  href: 'https://postgis.net' },
  { name: 'MinIO',      Logo: MinioLogo,    href: 'https://min.io' },
  { name: 'MapLibre',   Logo: MapLibreLogo, href: 'https://maplibre.org' },
  { name: 'Martin',     Logo: MartinLogo,   href: 'https://maplibre.org/martin/' },
  { name: 'deck.gl',    Logo: DeckLogo,     href: 'https://deck.gl' },
  { name: 'three.js',   Logo: ThreeLogo,    href: 'https://threejs.org' },
  { name: 'Potree',     Logo: PotreeLogo,   href: 'https://github.com/potree/potree' },
  { name: 'Docker',     Logo: DockerLogo,   href: 'https://www.docker.com' },
];
