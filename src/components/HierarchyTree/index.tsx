import { useEffect, useState, type CSSProperties, type FC } from 'react';
import type { Theme } from '../PlatformArchitecture/src/types';
import { THEMES } from '../PlatformArchitecture/src/theme';

export type TreeNode = {
  label: string;
  children?: TreeNode[];
};

type HierarchyTreeProps = {
  data: TreeNode;
};

/* ── A single row: indentation guides + label pill ───────────── */
const Row: FC<{
  node: TreeNode;
  depth: number;
  isLast: boolean;
  ancestorsLast: boolean[];
}> = ({ node, depth, isLast, ancestorsLast }) => {
  const hasChildren = !!node.children?.length;
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', padding: '3px 0' }}>
        {/* indentation columns from ancestors — vertical line where the
            ancestor still has siblings below it */}
        {ancestorsLast.map((wasLast, i) => (
          <span
            key={i}
            style={{
              width: 20,
              alignSelf: 'stretch',
              borderLeft: wasLast ? '1px solid transparent' : '1px solid var(--stroke)',
              flexShrink: 0,
            }}
          />
        ))}

        {/* connector for this row: vertical down to mid + horizontal to label */}
        {depth > 0 && (
          <span style={{ width: 20, position: 'relative', alignSelf: 'stretch', flexShrink: 0 }}>
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: isLast ? '50%' : 0,
                borderLeft: '1px solid var(--stroke)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                left: 0,
                top: '50%',
                width: 14,
                borderTop: '1px solid var(--stroke)',
              }}
            />
          </span>
        )}

        {/* label box */}
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '5px 12px',
            borderRadius: 6,
            background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
            border: '1px solid var(--stroke)',
            fontFamily: 'Geist Mono, ui-monospace, monospace',
            fontSize: 11.5,
            fontWeight: hasChildren ? 600 : 500,
            color: 'var(--text)',
            letterSpacing: '-0.005em',
          }}
        >
          {node.label}
        </span>
      </div>

      {hasChildren &&
        node.children!.map((child, i) => (
          <Row
            key={i}
            node={child}
            depth={depth + 1}
            isLast={i === node.children!.length - 1}
            ancestorsLast={[...ancestorsLast, isLast]}
          />
        ))}
    </>
  );
};

const HierarchyTree: FC<HierarchyTreeProps> = ({ data }) => {
  const [detectedTheme, setDetectedTheme] = useState<Theme>('dark');
  useEffect(() => {
    const sync = () =>
      setDetectedTheme(
        document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
      );
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  const themeVars = THEMES[detectedTheme] as CSSProperties;

  return (
    <div
      style={{
        ...(themeVars as any),
        color: 'var(--text)',
        fontFamily: 'Geist, system-ui, sans-serif',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          border: '1px solid var(--stroke)',
          borderRadius: 14,
          background:
            'repeating-linear-gradient(0deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
            'repeating-linear-gradient(90deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
            'var(--bg-2)',
          padding: '20px 22px',
          overflow: 'auto',
        }}
      >
        <div style={{ minWidth: 'fit-content' }}>
          <Row node={data} depth={0} isLast={true} ancestorsLast={[]} />
        </div>
      </div>
    </div>
  );
};

export default HierarchyTree;
