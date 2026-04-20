import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';
import type { Capability } from './capabilities';
import type { Tech } from './techStack';

type Direction = 'left' | 'right';

interface MarqueeProps {
  direction?: Direction;
  children: ReactNode;
  /** Override edge-fade color (for alternating surfaces). */
  edgeFadeClass?: 'fadeLow' | 'fadeSurface';
}

export function Marquee({
  direction = 'left',
  children,
  edgeFadeClass = 'fadeLow',
}: MarqueeProps): ReactNode {
  const trackClass = direction === 'left'
    ? styles.marqueeTrack
    : styles.marqueeTrackReverse;

  const fadeLeftClass = edgeFadeClass === 'fadeLow'
    ? styles.fadeLeft
    : styles.fadeLeftLight;
  const fadeRightClass = edgeFadeClass === 'fadeLow'
    ? styles.fadeRight
    : styles.fadeRightLight;

  return (
    <div className={styles.marqueeViewport}>
      <div className={fadeLeftClass} />
      <div className={fadeRightClass} />
      <div className={trackClass}>{children}</div>
    </div>
  );
}

/* ── Capability card (internal link) ───────────────────── */
export function CapabilityCard({ Icon, title, description, href }: Capability): ReactNode {
  return (
    <Link to={href} className={styles.card}>
      <div className={styles.cardIcon}>
        <Icon />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>
      </div>
    </Link>
  );
}

/* ── Tech chip (external link) ─────────────────────────── */
export function TechChip({ name, Logo, href }: Tech): ReactNode {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.techChip}
    >
      <span className={styles.techLogo}>
        <Logo />
      </span>
      <span className={styles.techName}>{name}</span>
    </a>
  );
}
