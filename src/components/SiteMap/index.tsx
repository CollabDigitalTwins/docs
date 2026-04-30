import React from 'react';
import Link from '@docusaurus/Link';
import siteMap from '@site/src/data/siteMap.json';
import styles from './styles.module.css';

type Page = {
  id: string;
  title: string;
  slug: string;
  primary: string | null;
};

type Dir = {
  name: string;
  label: string;
  pages: Page[];
  primary: string;
  sharedWith: string[];
};

type Audience = {
  key: string;
  label: string;
  rootDocs: Page[];
  dirs: Dir[];
};

type SiteMapData = {
  generatedAt: string;
  audiences: Audience[];
};

const data = siteMap as SiteMapData;

const AUDIENCE_LABEL: Record<string, string> = {
  userSidebar: 'Users',
  developerSidebar: 'Developers',
  deploymentSidebar: 'Deployment',
};

const AUDIENCE_KEY_BY_LABEL: Record<string, string> = {
  Users: 'userSidebar',
  Developers: 'developerSidebar',
  Deployment: 'deploymentSidebar',
};

function PageChip({ page, dirPrimary }: { page: Page; dirPrimary: string }) {
  const isCrossLinked = page.primary && page.primary !== dirPrimary;
  return (
    <Link to={page.slug} className={styles.pageChip} title={page.id}>
      <span className={styles.pageTitle}>{page.title}</span>
      {isCrossLinked && (
        <span className={styles.crossTag} title={`This page is hosted in the ${AUDIENCE_LABEL[page.primary!]} section`}>
          ↗ {AUDIENCE_LABEL[page.primary!]}
        </span>
      )}
    </Link>
  );
}

function DirCard({ dir }: { dir: Dir }) {
  const sharedLabels = dir.sharedWith.map(sb => AUDIENCE_LABEL[sb]).filter(Boolean);
  return (
    <section className={styles.dirCard} data-shared={sharedLabels.length > 0}>
      <header className={styles.dirHeader}>
        <h3 className={styles.dirLabel}>{dir.label}</h3>
        <span className={styles.dirCount}>{dir.pages.length}</span>
      </header>
      {sharedLabels.length > 0 && (
        <div className={styles.sharedBadge}>
          <span className={styles.sharedIcon}>⇄</span>
          <span>
            Shared with{' '}
            {sharedLabels.map((l, i) => (
              <React.Fragment key={l}>
                {i > 0 && ', '}
                <strong>{l}</strong>
              </React.Fragment>
            ))}
          </span>
        </div>
      )}
      <ul className={styles.pageList}>
        {dir.pages.map(p => (
          <li key={p.id}><PageChip page={p} dirPrimary={dir.primary} /></li>
        ))}
      </ul>
    </section>
  );
}

function AudienceColumn({ audience, entryPath }: { audience: Audience; entryPath?: string }) {
  return (
    <div className={styles.column} data-audience={audience.key}>
      <header className={styles.columnHeader}>
        <h2 className={styles.audienceLabel}>{audience.label}</h2>
        {entryPath && (
          <Link to={entryPath} className={styles.entryLink}>Open section →</Link>
        )}
      </header>
      {audience.rootDocs.length > 0 && (
        <div className={styles.rootDocs}>
          {audience.rootDocs.map(d => (
            <Link key={d.id} to={d.slug} className={styles.rootDocLink}>{d.title}</Link>
          ))}
        </div>
      )}
      <div className={styles.dirs}>
        {audience.dirs.map(d => <DirCard key={d.name} dir={d} />)}
      </div>
    </div>
  );
}

const ENTRY_PATHS: Record<string, string> = {
  userSidebar: '/docs/introduction',
  developerSidebar: '/docs/developer-introduction',
  deploymentSidebar: '/docs/deployment/overview',
};

export default function SiteMap() {
  return (
    <div className={styles.wrap}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: 'var(--hp-primary)' }} /> Primary section
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendIcon}>⇄</span> Shared across sections
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendIcon}>↗</span> Cross-linked page
        </span>
      </div>
      <div className={styles.grid}>
        {data.audiences.map(aud => (
          <AudienceColumn
            key={aud.key}
            audience={aud}
            entryPath={ENTRY_PATHS[aud.key]}
          />
        ))}
      </div>
      <p className={styles.footnote}>
        Generated on {new Date(data.generatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}.
      </p>
    </div>
  );
}
