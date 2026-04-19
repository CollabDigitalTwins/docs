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
      <div className={styles.heroVisualCard}>
        {/* Mock toolbar */}
        <div className={styles.heroVisualToolbar}>
          <span className={styles.heroDot} />
          <span className={styles.heroDot} />
          <span className={styles.heroDot} />
          <div className={styles.heroSearchPill}>docs.collabdt.org</div>
        </div>

        {/* Mock doc panel */}
        <div className={styles.heroVisualBody}>
          <div className={styles.heroSidebar}>
            <div className={styles.heroSidebarItem} />
            <div className={`${styles.heroSidebarItem} ${styles.heroSidebarItemActive}`} />
            <div className={styles.heroSidebarItem} />
            <div className={styles.heroSidebarItem} />
            <div className={styles.heroSidebarItem} />
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroContentHeading} />
            <div className={styles.heroContentLine} />
            <div className={`${styles.heroContentLine} ${styles.heroContentLineShort}`} />
            <div className={styles.heroContentCode}>
              <span className={styles.heroCodeDot} style={{ background: '#ef9161' }} />
              <span className={styles.heroCodeDot} style={{ background: '#96c0d5' }} />
              <span className={styles.heroCodeDot} style={{ background: '#ffdbcb' }} />
            </div>
            <div className={styles.heroContentLine} />
            <div className={`${styles.heroContentLine} ${styles.heroContentLineMed}`} />
          </div>
        </div>
      </div>
    </div>
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
