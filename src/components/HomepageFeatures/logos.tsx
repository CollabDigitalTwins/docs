import type { ReactNode } from 'react';

export type LogoComp = (props: { size?: number }) => ReactNode;

const assetLogoStyle = (size: number) => ({
  width: size,
  height: size,
  display: 'block',
});

/* Next.js */
export const NextLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/nextjs.svg" alt="Next.js" style={assetLogoStyle(size)} />
);

/* React */
export const ReactLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/React-icon.svg" alt="React" style={assetLogoStyle(size)} />
);

/* TypeScript */
export const TsLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/Typescript_logo_2020.svg" alt="TypeScript" style={assetLogoStyle(size)} />
);

/* Tailwind */
export const TailwindLogo: LogoComp = ({ size = 28 }) => (
  <img
    src="/img/logos/tailwindcss-logo_svgstack_com_31451778871419.svg"
    alt="Tailwind CSS"
    style={assetLogoStyle(size)}
  />
);

/* Node.js */
export const NodeLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/nodejs-icon.svg" alt="Node.js" style={assetLogoStyle(size)} />
);

/* PostgreSQL */
export const PostgresLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/postgresql-icon.svg" alt="PostgreSQL" style={assetLogoStyle(size)} />
);

/* PostGIS */
export const PostGisLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/postgis.svg" alt="PostGIS" style={assetLogoStyle(size)} />
);

/* Prisma — angled monolith */
export const PrismaLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/prisma_logo.svg" alt="Prisma" style={assetLogoStyle(size)} />
);

/* MinIO */
export const MinioLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/minio.svg" alt="MinIO" style={assetLogoStyle(size)} />
);

/* CASL */
export const CaslLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/casl.png" alt="CASL" style={assetLogoStyle(size)} />
);

/* Docker */
export const DockerLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/docker-mark-deep-blue.svg" alt="Docker" style={assetLogoStyle(size)} />
);

/* Fullhost */
export const FullhostLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/fg-logo.svg" alt="Fullhost" style={assetLogoStyle(size)} />
);

/* MapLibre */
export const MapLibreLogo: LogoComp = ({ size = 28 }) => (
  <img
    src="/img/logos/maplibre-logo-square-for-dark-bg.svg"
    alt="MapLibre"
    style={assetLogoStyle(size)}
  />
);

/* deck.gl */
export const DeckLogo: LogoComp = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
    <path d="M4 14 L16 6 L28 14 L16 22 Z" fill="#0EA5A4" />
    <path d="M4 20 L16 28 L28 20" fill="none" stroke="#0EA5A4" strokeWidth="2" />
  </svg>
);

/* three.js */
export const ThreeLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/three-logo.svg" alt="three.js" style={assetLogoStyle(size)} />
);

/* Martin — MapLibre vector tile server */
export const MartinLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/martin-logo.svg" alt="Martin" style={assetLogoStyle(size)} />
);

/* shadcn/ui */
export const ShadcnLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/shadcn-ui-seeklogo.svg" alt="shadcn/ui" style={assetLogoStyle(size)} />
);

/* That Open Engine */
export const TocLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/toc-logo.svg" alt="That Open Engine" style={assetLogoStyle(size)} />
);

/* Potree */
export const PotreeLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/potree-logo.png" alt="Potree" style={assetLogoStyle(size)} />
);

/* NextAuth */
export const NextAuthLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/nextauth.png" alt="NextAuth.js" style={assetLogoStyle(size)} />
);

/* ── Browser logos (asset-backed) ─────────────────────── */
export const FirefoxLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/firefox.svg" alt="Firefox" style={assetLogoStyle(size)} />
);

export const ChromeLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/chrome.svg" alt="Chrome" style={assetLogoStyle(size)} />
);

export const EdgeLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/edge.svg" alt="Edge" style={assetLogoStyle(size)} />
);

export const OperaLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/opera.svg" alt="Opera" style={assetLogoStyle(size)} />
);

export const SafariLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/safari.svg" alt="Safari" style={assetLogoStyle(size)} />
);

/* ── File-format logos (asset-backed) ─────────────────── */
export const IfcLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/ifclogo.svg" alt="IFC" style={assetLogoStyle(size)} />
);

export const GltfLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/GlTF_logo.svg" alt="glTF" style={assetLogoStyle(size)} />
);

export const DxfLogo: LogoComp = ({ size = 28 }) => (
  <img src="/img/logos/dxf-file-icon.svg" alt="DXF" style={assetLogoStyle(size)} />
);
