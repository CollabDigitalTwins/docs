import type { ReactNode, SVGProps } from 'react';
import styles from './styles.module.css';

type IconComp = (props: SVGProps<SVGSVGElement>) => ReactNode;

type FeatureItem = {
  Icon: IconComp;
  title: string;
  description: string;
};

/* ── Inline Lucide-style icons ─────────────────────────── */
const baseIconProps: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const BookOpenIcon: IconComp = (p) => (
  <svg {...baseIconProps} {...p}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const RocketIcon: IconComp = (p) => (
  <svg {...baseIconProps} {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const GlobeIcon: IconComp = (p) => (
  <svg {...baseIconProps} {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const UsersIcon: IconComp = (p) => (
  <svg {...baseIconProps} {...p}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CodeIcon: IconComp = (p) => (
  <svg {...baseIconProps} {...p}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const GitBranchIcon: IconComp = (p) => (
  <svg {...baseIconProps} {...p}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </svg>
);

const EyeIcon: IconComp = (p) => (
  <svg {...baseIconProps} {...p}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const NetworkIcon: IconComp = (p) => (
  <svg {...baseIconProps} {...p}>
    <rect x="9" y="2" width="6" height="6" rx="1" />
    <rect x="2" y="16" width="6" height="6" rx="1" />
    <rect x="16" y="16" width="6" height="6" rx="1" />
    <path d="M12 8v4" />
    <path d="M5 16v-2h14v2" />
  </svg>
);

const FeatureList: FeatureItem[] = [
  {
    Icon: BookOpenIcon,
    title: 'Platform Overview',
    description:
      'Understand the CDT architecture — geospatial layers, BIM models, and the multi-scale data model.',
  },
  {
    Icon: RocketIcon,
    title: 'Getting Started',
    description:
      'Install dependencies, connect to a deployment, and load your first digital twin in minutes.',
  },
  {
    Icon: GlobeIcon,
    title: 'Open Standards',
    description:
      'Built on CityGML, IFC, and OGC APIs. No proprietary lock-in — your data stays yours.',
  },
  {
    Icon: UsersIcon,
    title: 'Collaboration',
    description:
      'Multi-user sessions, comments, and shared views — built for interdisciplinary teams.',
  },
  {
    Icon: CodeIcon,
    title: 'API Reference',
    description:
      'Full REST and WebSocket API surface for integrating CDT data into your own applications.',
  },
  {
    Icon: GitBranchIcon,
    title: 'Contributing',
    description:
      'CDT is stewarded as a Canadian not-for-profit. Learn how to contribute code, data, or feedback.',
  },
  {
    Icon: EyeIcon,
    title: 'Transparent',
    description:
      'Foster trust and collaborative development through fully open source code and public roadmaps.',
  },
  {
    Icon: NetworkIcon,
    title: 'Multidisciplinary',
    description:
      'Where we are today is evidence that we are stronger and smarter when we build together.',
  },
];

function FeatureCard({ Icon, title, description }: FeatureItem): ReactNode {
  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>
        <Icon />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardDesc}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  // Triplicate for seamless marquee loop
  const repeated = [...FeatureList, ...FeatureList, ...FeatureList];

  return (
    <>
      {/* ── Mission — Level 1 surface ───────────────────── */}
      <section className={styles.mission}>
        <div className={styles.missionInner}>
          <div className={styles.missionGrid}>
            <div className={styles.missionLeft}>
              <div className={styles.sectionLabel}>Documentation</div>
              <h2 className={styles.missionTitle}>
                Everything you need to{' '}
                <span className={styles.missionHighlight}>build</span> with CDT
              </h2>
            </div>
            <div className={styles.missionRight}>
              <p className={styles.missionDesc}>
                These docs cover the platform architecture, APIs, and workflows
                for visualizing multi-scale geospatial data and BIM models —
                all in the browser, on open standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core capabilities — marquee carousel ────────── */}
      <section className={styles.carousel}>
        <div className={styles.carouselHeader}>
          <div className={styles.sectionLabel}>What's inside</div>
        </div>

        <div className={styles.marqueeViewport}>
          <div className={styles.fadeLeft} />
          <div className={styles.fadeRight} />
          <div className={styles.marqueeTrack}>
            {repeated.map((item, i) => (
              <FeatureCard key={`${item.title}-${i}`} {...item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
