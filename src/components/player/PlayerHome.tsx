import { useRef, useState, useEffect } from 'react';
import { CharacterSVG } from './CharacterSVG';
import { XPBar, HPHearts, Card, SectionLabel } from '../ui';
import { QuestCard } from './QuestCard';
import type { PlayerState, Quest, QuestCompletion, Skin, Title } from '../../types';

interface Props {
  state: PlayerState;
  quests: Quest[];
  completions: QuestCompletion[];
  activeSkin: Skin | null;
  activeTitle: Title | null;
  onQuestDone: (id: string) => void;
}

interface XPFloat { delta: number; key: number; }

const STARS = [
  { x: '8%',  y: '14%', s: 2,   delay: '0s',    dur: '2.3s' },
  { x: '91%', y: '9%',  s: 1.5, delay: '0.6s',  dur: '3.1s' },
  { x: '74%', y: '28%', s: 2.5, delay: '1.2s',  dur: '2.7s' },
  { x: '16%', y: '62%', s: 1.5, delay: '0.3s',  dur: '3.5s' },
  { x: '87%', y: '55%', s: 2,   delay: '1.9s',  dur: '2.1s' },
  { x: '44%', y: '6%',  s: 1,   delay: '0.9s',  dur: '4.0s' },
  { x: '60%', y: '72%', s: 1.5, delay: '2.3s',  dur: '2.8s' },
  { x: '26%', y: '82%', s: 2,   delay: '1.5s',  dur: '3.3s' },
  { x: '6%',  y: '46%', s: 1,   delay: '0.7s',  dur: '2.5s' },
  { x: '69%', y: '41%', s: 1.5, delay: '2.9s',  dur: '3.8s' },
  { x: '50%', y: '88%', s: 1,   delay: '1.1s',  dur: '3.0s' },
  { x: '33%', y: '35%', s: 1.5, delay: '3.4s',  dur: '2.2s' },
];

export function PlayerHome({ state, quests, completions, activeSkin, activeTitle, onQuestDone }: Props) {
  const daily = quests.filter(q => q.type === 'daily');
  const prevXP = useRef<number>(state.current_xp);
  const [xpFloat, setXPFloat] = useState<XPFloat | null>(null);

  useEffect(() => {
    const prev = prevXP.current;
    const curr = state.current_xp;
    if (curr > prev) {
      setXPFloat({ delta: curr - prev, key: Date.now() });
      const t = setTimeout(() => setXPFloat(null), 700);
      prevXP.current = curr;
      return () => clearTimeout(t);
    }
    prevXP.current = curr;
  }, [state.current_xp]);

  return (
    <div style={{ padding: '0 0 16px' }}>
      {/* ── Hero ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-bg) 100%)',
        borderBottom: '1px solid var(--color-border-dim)',
        padding: '12px 20px 20px',
      }}>
        {/* Aurora orbs */}
        <div className="aurora-orb" style={{
          position: 'absolute', top: '-40%', left: '-15%',
          width: '65%', height: '160%', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,92,191,0.22) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
          '--dur': '9s',
        } as React.CSSProperties}/>
        <div className="aurora-orb" style={{
          position: 'absolute', top: '10%', right: '-25%',
          width: '75%', height: '130%', borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(157,127,224,0.15) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0,
          '--dur': '12s', animationDelay: '-5s',
        } as React.CSSProperties}/>

        {/* Stars */}
        {STARS.map((s, i) => (
          <div key={i} className="star-twinkle" style={{
            position: 'absolute', left: s.x, top: s.y,
            width: s.s, height: s.s, borderRadius: '50%',
            background: 'white', pointerEvents: 'none', zIndex: 0,
            '--dur': s.dur, animationDelay: s.delay,
          } as React.CSSProperties}/>
        ))}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          {/* Avatar circle */}
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent-dim), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--color-accent)',
            boxShadow: '0 0 12px rgba(124,92,191,0.5)',
            fontSize: 20, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            E
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 18, fontWeight: 700,
                background: 'linear-gradient(135deg, var(--color-text) 0%, var(--color-accent-lit) 55%, var(--color-gold) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                The Princess
              </span>
              <span style={{
                background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-lit))',
                color: 'white',
                fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '2px 9px',
                boxShadow: '0 1px 6px rgba(124,92,191,0.4)',
              }}>
                LVL {state.current_level}
              </span>
            </div>
            {activeTitle && (
              <span style={{ fontSize: 11, color: 'var(--color-accent-lit)' }}>
                {activeTitle.name}
              </span>
            )}
          </div>

          {/* Character SVG - right aligned */}
          <CharacterSVG skinType={activeSkin?.type} size={80}/>
        </div>

        {/* XP */}
        <div style={{ position: 'relative' }}>
          {xpFloat && (
            <span
              key={xpFloat.key}
              className="xp-float"
              style={{
                position: 'absolute', top: -4, right: 2,
                fontSize: 13, fontWeight: 800,
                color: 'var(--color-gold)',
                pointerEvents: 'none', userSelect: 'none',
                textShadow: '0 0 8px rgba(240,192,64,0.6)',
              }}
            >
              +{xpFloat.delta} XP
            </span>
          )}
          <XPBar current={state.current_xp} max={state.xp_to_next_level} level={state.current_level}/>
        </div>

        {/* HP */}
        <div style={{ marginTop: 10 }}>
          <HPHearts hp={state.hp}/>
        </div>
        </div>{/* /content */}
      </div>{/* /hero */}

      <div style={{ padding: '16px 16px 0' }}>
        {/* Active Skin */}
        {activeSkin && (
          <>
            <SectionLabel>Active Skin</SectionLabel>
            <Card style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 3 }}>
                    {activeSkin.name}
                  </div>
              {Object.entries(activeSkin.stat_bonuses).map(([k]) => (
                    <div key={k} style={{ fontSize: 11, color: 'var(--color-accent-lit)' }}>
                      +{String(k).replace(/_/g, ' ')} boost on removal
                    </div>
                  ))}
                </div>
                {activeSkin.warning_threshold_days && (
                  <div style={{
                    background: 'var(--color-warn-bg)', border: '1px solid var(--color-warn)',
                    borderRadius: 8, padding: '4px 8px', fontSize: 10, color: '#ff8070',
                  }}>
                    Long wear warning — HP decreasing
                  </div>
                )}
              </div>
            </Card>
          </>
        )}

        {/* Stats */}
        {activeTitle && Object.keys(activeTitle.attributes).length > 0 && (
          <>
            <SectionLabel>Stats</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {Object.entries(activeTitle.attributes).map(([k, v]) => (
                <Card key={k} style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: 'var(--color-text-muted)', marginBottom: 3 }}>
                    {k.replace(/_/g, ' ')}
                  </div>
                  <div style={{
                    fontSize: 16, fontWeight: 700,
                    color: k === 'is_she_poop' ? 'var(--color-legendary)' : 'var(--color-accent-lit)',
                  }}>
                    {String(v)}
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Daily quests */}
        <SectionLabel>Daily quests</SectionLabel>
        {daily.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-dim)', fontSize: 13 }}>
            No quests yet ✦
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {daily.map(q => (
              <QuestCard
                key={q.id}
                quest={q}
                completion={completions.find(c => c.quest_id === q.id)}
                onQuestDone={onQuestDone}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
