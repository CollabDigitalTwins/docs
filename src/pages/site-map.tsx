import React from 'react';
import Layout from '@theme/Layout';
import SiteMap from '@site/src/components/SiteMap';
import styles from './site-map.module.css';

export default function SiteMapPage() {
  return (
    <Layout
      title="Site Map"
      description="A visual map of CDT's documentation across the Users, Developers, and Deployment sections."
    >
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>Site Map</h1>
          <p className={styles.subtitle}>
            CDT's documentation is organised into three sections by audience.
            Some pages live in more than one — they're highlighted below.
          </p>
        </header>
        <SiteMap />
      </main>
    </Layout>
  );
}
