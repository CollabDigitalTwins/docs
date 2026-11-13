/* ─────────────────────────────────────────────────────────
   CDT Digital Twin Maturity Model
   Docusaurus React component.

   Used from the Concepts page:

     import MaturityModel from '@site/src/components/MaturityModel';

     <MaturityModel />

   Theme: follows Docusaurus automatically. Docusaurus sets
   data-theme="dark" on <html>, and the .cdt-mm styles (merged
   into src/css/custom.css) key their tints off the site's CDT
   design tokens, so the component re-tints with the light/dark
   toggle.

   Edit copy freely. `capabilities` are ordered TOP → BOTTOM
   (highest tier first), matching the staircase stack.
   ───────────────────────────────────────────────────────── */

import React, { useState, useRef, useEffect, useCallback } from 'react';

const MM_LEVELS = [
  {
    num: '01',
    name: 'Descriptive',
    tagline: 'Map what exists.',
    summary:
      'A static digital representation of physical assets. The twin documents geometry, location, and metadata, but does not yet reflect real-world change.',
    capabilities: [
      {
        tier: 1,
        title: '3D Models, BIM & GIS Data',
        desc: 'Federated geometry and a geospatial baseline of the built environment.',
      },
    ],
  },
  {
    num: '02',
    name: 'Informative',
    tagline: 'See what is happening now.',
    summary:
      'The twin is connected to live data sources, giving right-time awareness of conditions across the asset in 4D.',
    capabilities: [
      {
        tier: 2,
        title: 'Asset Information Mgmt.',
        desc: 'A single source of truth linking documents, specs, and records to each asset.',
      },
      {
        tier: 1,
        title: 'Live Sensor Feeds',
        desc: 'IoT and telemetry streams keep the twin synchronized with the physical world.',
      },
    ],
  },
  {
    num: '03',
    name: 'Predictive',
    tagline: 'Anticipate what is next.',
    summary:
      'Analytics and models project future states, surfacing risk and degradation before they happen.',
    capabilities: [
      {
        tier: 3,
        title: 'Predictive Analytics',
        desc: 'Trend and anomaly detection across historical and live data.',
      },
      {
        tier: 2,
        title: 'Performance Mgmt.',
        desc: 'KPIs and condition scoring track asset health over time.',
      },
      {
        tier: 1,
        title: 'Predictive Maintenance',
        desc: 'Forecast component failure and intervene before downtime.',
      },
    ],
  },
  {
    num: '04',
    name: 'Prescriptive',
    tagline: 'Test what could be.',
    summary:
      'Simulation lets you explore interventions and trade-offs in a safe virtual environment before acting in the real world.',
    capabilities: [
      {
        tier: 4,
        title: 'What-if Simulation',
        desc: 'Run scenarios against the twin to compare outcomes side by side.',
      },
      {
        tier: 3,
        title: 'Optimization',
        desc: 'Solve for the best configuration under real-world constraints.',
      },
      {
        tier: 2,
        title: 'Remote Diagnosis',
        desc: 'Investigate and resolve issues without a site visit.',
      },
      {
        tier: 1,
        title: 'Scenario Modeling',
        desc: 'Stress-test plans against a range of plausible futures.',
      },
    ],
  },
  {
    num: '05',
    name: 'Autonomous',
    tagline: 'Let the system act.',
    summary:
      'The twin closes the loop by sensing, deciding, and acting with minimal human intervention as it interacts with its environment.',
    capabilities: [
      {
        tier: 5,
        title: 'Augmented Operations',
        desc: 'Operators work alongside AI-driven insight in real time.',
      },
      {
        tier: 4,
        title: 'AI Twins',
        desc: 'Self-learning models that improve with every cycle.',
      },
      {
        tier: 3,
        title: 'Self-Adaptive Control',
        desc: 'The system tunes itself to changing conditions.',
      },
      {
        tier: 2,
        title: 'Autonomous Decisions',
        desc: 'Pre-approved actions execute without manual sign-off.',
      },
      {
        tier: 1,
        title: 'Virtual–Physical Convergence',
        desc: 'Twin and asset operate as one continuous loop.',
      },
    ],
  },
];

const MM_FOUNDATION = [
  'Standards',
  'Data',
  'People',
  'Technology',
  'Data Governance & Sovereignty',
];

function MMCapability({ cap }) {
  const tierVar = `var(--mm-tier-${cap.tier})`;
  return (
    <div className="mm-cap">
      <span className="mm-swatch" style={{ background: tierVar }} aria-hidden="true"></span>
      <div>
        <div className="mm-cap-title">{cap.title}</div>
        <div className="mm-cap-desc">{cap.desc}</div>
      </div>
    </div>
  );
}

function MMDetailPanel({ level, onClose }) {
  return (
    <div className={'mm-panel' + (level ? ' is-open' : '')} aria-hidden={!level}>
      <div className="mm-panel-inner">
        {level && (
          <div className="mm-panel-card" role="region" aria-label={`Level ${level.num}: ${level.name}`}>
            <button className="mm-panel-close" onClick={onClose} aria-label="Close details">×</button>
            <div className="mm-panel-head">
              <span className="mm-pnum">Level {level.num}</span>
              <h3 className="mm-pname">{level.name}</h3>
              <p className="mm-ptag">{level.tagline}</p>
              <p className="mm-psum">{level.summary}</p>
            </div>
            <div className="mm-caps">
              <p className="mm-caps-label">Capabilities</p>
              {level.capabilities.map((cap) => (
                <MMCapability key={cap.title} cap={cap} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MMUseCases({ items, onSelect }) {
  return (
    <div className="mm-usecases">
      <span className="mm-usecases-label">Use cases</span>
      <div className="mm-usecases-list">
        {items.length === 0 ? (
          <span className="mm-usecase is-tbd">TBD</span>
        ) : (
          items.map((item) => {
            if (item.href) {
              return (
                <a key={item.id} className="mm-usecase" href={item.href}>
                  {item.label}
                </a>
              );
            }
            if (!onSelect) {
              return <span key={item.id} className="mm-usecase">{item.label}</span>;
            }
            return (
              <button key={item.id} type="button" className="mm-usecase" onClick={() => onSelect(item.id)}>
                {item.label}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function useCasesForLevel(useCases, num) {
  return useCases.filter((u) => Number(u.level) === Number(num));
}

/**
 * Pass `useCases` ({ id, label, level, href? }[]) to show the plugins variant:
 * use-case pills per level, TBD where a level has none. Defaults render the plain model.
 */
export default function MaturityModel({
  defaultLevel = null,
  useCases = null,
  onUseCaseSelect,
  yAxisLabel = 'Value →',
  kicker = 'Collab Digital Twins · Framework',
  title = null,
  lede = 'Five levels of capability, from a static map of what exists to a system that senses, decides, and acts on its own. Select a level to explore what it unlocks.',
}) {
  const [selected, setSelected] = useState(defaultLevel);
  const [hovered, setHovered] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const rootRef = useRef(null);
  const hasUseCases = Array.isArray(useCases);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      setIsMobile(w < 760);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggle = useCallback((num) => {
    setSelected((cur) => (cur === num ? null : num));
  }, []);

  const selectedLevel = MM_LEVELS.find((l) => l.num === selected) || null;
  const isDimming = hovered != null || selected != null;

  const renderTag = (level) => (
    <span className="mm-tag">
      <span className="mm-num">Level {level.num}</span>
      <span className="mm-name">{level.name}</span>
      <span className="mm-sub">{level.tagline}</span>
    </span>
  );

  const renderCells = (level) =>
    level.capabilities.map((cap) => (
      <span key={cap.title} className={'mm-cell t' + cap.tier}>
        {cap.title}
      </span>
    ));

  const columnProps = (level) => ({
    onMouseEnter: () => setHovered(level.num),
    onMouseLeave: () => setHovered(null),
    onFocus: () => setHovered(level.num),
    onBlur: () => setHovered(null),
  });

  const columnClass = (level) =>
    'mm-col' +
    (selected === level.num ? ' is-active' : '') +
    (hovered === level.num ? ' is-hot' : '');

  return (
    <div
      className={'cdt-mm' + (hasUseCases ? ' has-usecases' : '') + (isDimming && !isMobile ? ' is-dimming' : '')}
      ref={rootRef}
    >
      <header className="mm-head">
        <p className="mm-kicker">{kicker}</p>
        <h2 className="mm-title">
          {title ?? (
            <>
              Digital Twin <span className="mm-acc">Maturity Model</span>
            </>
          )}
        </h2>
        {lede && <p className="mm-lede">{lede}</p>}
      </header>

      {isMobile ? (
        <div className="mm-mobile">
          {MM_LEVELS.map((level) => {
            const active = selected === level.num;
            const spineTier = level.capabilities[0].tier;
            return (
              <div key={level.num} className={'mm-m-item' + (active ? ' is-active' : '')}>
                <button
                  className="mm-m-btn"
                  onClick={() => toggle(level.num)}
                  aria-expanded={active}
                >
                  <span className={'mm-m-spine t' + spineTier} aria-hidden="true"></span>
                  <span className="mm-m-label">
                    <span className="mm-num">Level {level.num}</span>
                    <span className="mm-name">{level.name}</span>
                    <span className="mm-sub">{level.tagline}</span>
                  </span>
                  <span className="mm-m-chev" aria-hidden="true">⌄</span>
                </button>
                {hasUseCases && (
                  <div className="mm-m-usecases">
                    <MMUseCases items={useCasesForLevel(useCases, level.num)} onSelect={onUseCaseSelect} />
                  </div>
                )}
                <div className="mm-m-body">
                  <div className="mm-m-body-inner">
                    <div className="mm-m-body-pad">
                      <p className="mm-psum">{level.summary}</p>
                      {level.capabilities.map((cap) => (
                        <div key={cap.title} className={'mm-m-cap t' + cap.tier}>
                          <div className="mm-cap-title">{cap.title}</div>
                          <div className="mm-cap-desc">{cap.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="mm-m-foundation">
            <span className="mm-fkicker">Foundation · spans every level</span>
            <span className="mm-fpillars">{MM_FOUNDATION.join('  ·  ')}</span>
          </div>
        </div>
      ) : (
        <React.Fragment>
          <div className="mm-chart">
            <div className="mm-yaxis">
              <div className="mm-axisline"></div>
              <span className="mm-axislabel">{yAxisLabel}</span>
            </div>
            <div className="mm-matrix">
              {MM_LEVELS.map((level) => {
                const active = selected === level.num;
                const label = `Level ${level.num}, ${level.name}. ${level.tagline}`;
                if (!hasUseCases) {
                  return (
                    <button
                      key={level.num}
                      className={columnClass(level)}
                      onClick={() => toggle(level.num)}
                      {...columnProps(level)}
                      aria-expanded={active}
                      aria-label={label}
                    >
                      {renderTag(level)}
                      {renderCells(level)}
                    </button>
                  );
                }
                return (
                  <div key={level.num} className={columnClass(level)} role="group" {...columnProps(level)}>
                    <button
                      type="button"
                      className="mm-col-toggle"
                      onClick={() => toggle(level.num)}
                      aria-expanded={active}
                      aria-label={label}
                    >
                      {renderTag(level)}
                    </button>
                    <MMUseCases items={useCasesForLevel(useCases, level.num)} onSelect={onUseCaseSelect} />
                    <button
                      type="button"
                      className="mm-col-toggle mm-col-cells"
                      onClick={() => toggle(level.num)}
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {renderCells(level)}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mm-xaxis">
              <div className="mm-axisline"></div>
              <span className="mm-axislabel">Level of Effort →</span>
            </div>
          </div>

          <div className="mm-foundation">
            <span className="mm-fkicker">Foundation</span>
            {MM_FOUNDATION.map((p) => (
              <span key={p} className="mm-pillar">{p}</span>
            ))}
          </div>

          <MMDetailPanel level={selectedLevel} onClose={() => setSelected(null)} />

          {!selectedLevel && (
            <p className="mm-hint">
              <span className="mm-dot" aria-hidden="true"></span>
              Hover to preview · click a level to expand its capabilities
            </p>
          )}
        </React.Fragment>
      )}
    </div>
  );
}
