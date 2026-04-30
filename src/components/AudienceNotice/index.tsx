import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type Audience = 'users' | 'developers' | 'deployment';

const AUDIENCE_META: Record<Audience, { label: string; path: string }> = {
  users: { label: 'Users', path: '/docs/introduction' },
  developers: { label: 'Developers', path: '/docs/developer-introduction' },
  deployment: { label: 'Deployment', path: '/docs/deployment/overview' },
};

interface Props {
  home: Audience;
  also: Audience | Audience[];
}

function joinList(items: React.ReactNode[]): React.ReactNode {
  if (items.length === 0) return null;
  if (items.length === 1) return items[0];
  if (items.length === 2) return <>{items[0]} and {items[1]}</>;
  return (
    <>
      {items.slice(0, -1).map((item, i) => (
        <React.Fragment key={i}>{item}, </React.Fragment>
      ))}
      and {items[items.length - 1]}
    </>
  );
}

export default function AudienceNotice({ home, also }: Props) {
  const homeMeta = AUDIENCE_META[home];
  const otherList = Array.isArray(also) ? also : [also];
  const others = otherList.map(a => (
    <Link key={a} to={AUDIENCE_META[a].path}>{AUDIENCE_META[a].label}</Link>
  ));

  return (
    <div className={styles.notice}>
      <span className={styles.icon}>ℹ</span>
      <span>
        This page lives in the <Link to={homeMeta.path}><strong>{homeMeta.label}</strong></Link>{' '}
        section and is also referenced from{' '}
        {joinList(others)}. If you arrived from {otherList.length > 1 ? 'one of those' : 'there'},
        your sidebar has switched to {homeMeta.label}.
      </span>
    </div>
  );
}
