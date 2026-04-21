import type { FC } from 'react';
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
} from '../../HomepageFeatures/logos';
import {
  ShadcnLogo,
  MartinLogo,
  PointCloudFormatIcon,
} from './kindIcons';

/** Adapt a HomepageFeatures `LogoComp` (takes {size}) into the
 *  PlatformArchitecture's {s, fg} interface used by NodeCard/LogoChip. */
const adaptLogo = (Logo: LogoComp): FC<{ s?: number; fg?: string }> =>
  ({ s = 18 }) => <>{Logo({ size: s })}</>;

export const Node_     = adaptLogo(NodeLogo);
export const Next_     = adaptLogo(NextLogo);
export const React_    = adaptLogo(ReactLogo);
export const TS_       = adaptLogo(TsLogo);
export const Tailwind_ = adaptLogo(TailwindLogo);
export const NextAuth_ = adaptLogo(NextAuthLogo);
export const Prisma_   = adaptLogo(PrismaLogo);
export const CASL_     = adaptLogo(CaslLogo);
export const Firefox_  = adaptLogo(FirefoxLogo);
export const Chrome_   = adaptLogo(ChromeLogo);
export const Edge_     = adaptLogo(EdgeLogo);
export const Opera_    = adaptLogo(OperaLogo);
export const Safari_   = adaptLogo(SafariLogo);
export const MapLibre_ = adaptLogo(MapLibreLogo);
export const Deck_     = adaptLogo(DeckLogo);
export const Three_    = adaptLogo(ThreeLogo);
export const Potree_   = adaptLogo(PotreeLogo);
export const Postgres_ = adaptLogo(PostgresLogo);
export const PostGIS_  = adaptLogo(PostGisLogo);
export const MinIO_    = adaptLogo(MinioLogo);
export const Docker_   = adaptLogo(DockerLogo);
export const Fullhost_ = adaptLogo(FullhostLogo);
export const GLTF_     = adaptLogo(GltfLogo);
export const DXF_      = adaptLogo(DxfLogo);
export const IFC_      = adaptLogo(IfcLogo);

/* Local (non-asset-backed) logos */
export const Shadcn_   = ShadcnLogo;
export const Martin_   = MartinLogo;
export const LAS_      = PointCloudFormatIcon;
export const LAZ_      = PointCloudFormatIcon;
