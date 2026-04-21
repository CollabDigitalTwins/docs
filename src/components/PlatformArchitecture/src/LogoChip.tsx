import type { FC } from 'react';

export const LogoChip: FC<{
  Logo?: FC<{ s?: number; fg?: string }>;
  label: string;
  size?: number;
}> = ({ Logo, label, size = 16 }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '3px 7px 3px 4px',
    background: 'var(--chip)',
    border: '1px solid var(--stroke)',
    borderRadius: 5,
    fontSize: 11,
    color: 'var(--text)',
  }}>
    {Logo ? (
      <span style={{
        display: 'inline-flex',
        width: size + 4,
        height: size + 4,
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--logo-bg)',
        borderRadius: 3,
      }}>
        <Logo s={size} fg="currentColor" />
      </span>
    ) : (
      <span style={{ width: 6, height: 6, borderRadius: 2, background: 'var(--text-dim-2)' }} />
    )}
    <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
  </span>
);
