import type { FC } from 'react';

/* ── Node kind icons ───────────────────────────────────── */
export const UserIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <circle cx="16" cy="12" r="5" fill="none" stroke={fg} strokeWidth="1.8" />
    <path d="M6 27 C7 21 12 19 16 19 C20 19 25 21 26 27" fill="none" stroke={fg} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const GlobeIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <circle cx="16" cy="16" r="12" fill="none" stroke={fg} strokeWidth="1.6" />
    <ellipse cx="16" cy="16" rx="5" ry="12" fill="none" stroke={fg} strokeWidth="1.4" />
    <line x1="4" y1="16" x2="28" y2="16" stroke={fg} strokeWidth="1.4" />
  </svg>
);

export const GatewayIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <rect x="4" y="10" width="24" height="12" rx="2" fill="none" stroke={fg} strokeWidth="1.6" />
    <path d="M9 10 V5 C9 4 10 4 11 4 H21 C22 4 23 4 23 5 V10" fill="none" stroke={fg} strokeWidth="1.6" />
    <circle cx="11" cy="16" r="1.3" fill={fg} />
    <circle cx="16" cy="16" r="1.3" fill={fg} />
    <circle cx="21" cy="16" r="1.3" fill={fg} />
  </svg>
);

export const ShieldIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <path d="M16 3 L27 7 V16 C27 22 22 27 16 29 C10 27 5 22 5 16 V7 Z" fill="none" stroke={fg} strokeWidth="1.6" />
    <path d="M11 16 L15 20 L22 12" stroke={fg} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LayersIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <polygon points="16,4 28,11 16,18 4,11" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <polyline points="4,16 16,23 28,16" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <polyline points="4,21 16,28 28,21" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const BoxIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <path d="M16 4 L28 10 V22 L16 28 L4 22 V10 Z" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M4 10 L16 16 L28 10 M16 16 V28" fill="none" stroke={fg} strokeWidth="1.6" />
  </svg>
);

export const CloudIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s * 0.8} viewBox="0 0 40 32" aria-hidden>
    <path d="M10 24 C5 24 3 20 3 17 C3 13 7 11 10 12 C11 7 16 5 20 7 C23 4 29 5 30 10 C34 10 37 13 37 17 C37 21 33 24 29 24 Z" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const MapIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <polygon points="4,8 12,5 20,8 28,5 28,24 20,27 12,24 4,27" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <line x1="12" y1="5" x2="12" y2="24" stroke={fg} strokeWidth="1.4" />
    <line x1="20" y1="8" x2="20" y2="27" stroke={fg} strokeWidth="1.4" />
  </svg>
);

export const FilesIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <path d="M8 6 H18 L24 12 V26 H8 Z" fill="none" stroke={fg} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M18 6 V12 H24" fill="none" stroke={fg} strokeWidth="1.6" />
  </svg>
);

export const StackIcon: FC<{ s?: number; fg?: string }> = ({ s = 18, fg = 'currentColor' }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <rect x="4" y="6" width="24" height="5" rx="1" fill="none" stroke={fg} strokeWidth="1.6" />
    <rect x="4" y="13.5" width="24" height="5" rx="1" fill="none" stroke={fg} strokeWidth="1.6" />
    <rect x="4" y="21" width="24" height="5" rx="1" fill="none" stroke={fg} strokeWidth="1.6" />
  </svg>
);

/* ── Inline logos kept local (not bundled in HomepageFeatures/logos) ── */
export const ShadcnLogo: FC<{ s?: number }> = ({ s = 18 }) => (
  <img
    src="/img/logos/shadcn-ui-seeklogo.svg"
    alt="shadcn/ui"
    width={s}
    height={s}
    style={{ display: 'block' }}
  />
);

export const MartinLogo: FC<{ s?: number }> = ({ s = 18 }) => (
  <img
    src="/img/logos/martin-logo.svg"
    alt="Martin"
    width={s}
    height={s}
    style={{ display: 'block' }}
  />
);

/** LAS / LAZ point-cloud format marker — shared cloud glyph.
 *  Uses a solid dark stroke so it reads clearly on the white logo chip
 *  (currentColor resolves to the light text color and is barely visible). */
export const PointCloudFormatIcon: FC<{ s?: number; fg?: string }> = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 32 32" aria-hidden>
    <path
      d="M10 24 C5 24 3 20 3 17 C3 13 7 11 10 12 C11 7 16 5 20 7 C23 4 29 5 30 10 C34 10 37 13 37 17 C37 21 33 24 29 24 Z"
      fill="none"
      stroke="#111"
      strokeWidth="2.4"
      strokeLinejoin="round"
      strokeLinecap="round"
      transform="translate(-3 -2) scale(0.9)"
    />
  </svg>
);
