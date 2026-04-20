import type { ReactNode } from 'react';
import styles from './styles.module.css';
import { CAPABILITIES } from './capabilities';
import { TECH_STACK } from './techStack';
import { Marquee, CapabilityCard, TechChip } from './Marquee';

export default function HomepageFeatures(): ReactNode {
  const capabilitiesRepeated = [...CAPABILITIES, ...CAPABILITIES, ...CAPABILITIES];
  const techRepeated = [...TECH_STACK, ...TECH_STACK, ...TECH_STACK];

  return (
    <>
      {/* ── Core capabilities — marquee carousel (left) ────────── */}
      <section className={styles.carousel}>
        <div className={styles.carouselHeader}>
          <div className={styles.sectionLabel}>What's inside</div>
        </div>
        <Marquee direction="left" edgeFadeClass="fadeLow">
          {capabilitiesRepeated.map((item, i) => (
            <CapabilityCard key={`${item.title}-${i}`} {...item} />
          ))}
        </Marquee>
      </section>

      {/* ── Mission — Level 1 surface ──────────────────────────── */}
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

      {/* ── Tech Stack — 100% Open Source (right) ──────────────── */}
      <section className={styles.techStack}>
        <div className={styles.carouselHeader}>
          <div className={styles.sectionLabel}>100% Open Source Stack</div>
        </div>
        <Marquee direction="right" edgeFadeClass="fadeSurface">
          {techRepeated.map((item, i) => (
            <TechChip key={`${item.name}-${i}`} {...item} />
          ))}
        </Marquee>
      </section>
    </>
  );
}
