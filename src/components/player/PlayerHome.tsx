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
        background: 'linear-gradient(180deg, var(--color-surface) 0%, var(--color-bg) 100%)',
        borderBottom: '1px solid var(--color-border-dim)',
        padding: '12px 20px 20px',
      }}>
        {/* Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          {/* Avatar circle */}
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-accent-dim), var(--color-accent))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--color-accent)',
            fontSize: 20, fontWeight: 700, color: 'white', flexShrink: 0,
          }}>
            {/* Placeholder until photo avatar */}
            E
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>
                The Princess
              </span>
              <span style={{
                background: 'var(--color-accent)', color: 'white',
                fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '2px 9px',
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
      </div>

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
