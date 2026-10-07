import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './styles.module.css';

type TabCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  tab: string;
  title: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  emphasis?: 'default' | 'key';
  /** CSS colour that tints a `key` card; defaults to the site terracotta. */
  accent?: string;
  size?: 'md' | 'sm';
  /** `header` stretches the tab across the card and drops the icon frame. */
  variant?: 'tab' | 'header';
  to?: string;
  ref?: Ref<HTMLDivElement>;
};

export default function TabCard({
  tab, title, subtitle, icon, emphasis = 'default', accent, size = 'md', variant = 'tab', to,
  className, style, children, ref, ...rest
}: TabCardProps) {
  const cls = clsx(
    styles.card,
    emphasis === 'key' && styles.key,
    size === 'sm' && styles.sm,
    variant === 'header' && styles.header,
    to && styles.link,
    className,
  );
  const rootStyle = accent ? ({ '--tc-accent': accent, ...style } as CSSProperties) : style;

  const body = (
    <>
      <span className={styles.tab}>{tab}</span>
      <div className={styles.head}>
        {icon && <span className={styles.glyph} aria-hidden="true">{icon}</span>}
        <div className={styles.headText}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.sub}>{subtitle}</div>}
        </div>
      </div>
      {children}
    </>
  );

  return to ? (
    <Link to={to} className={cls} style={rootStyle}>{body}</Link>
  ) : (
    <div ref={ref} className={cls} style={rootStyle} {...rest}>{body}</div>
  );
}
