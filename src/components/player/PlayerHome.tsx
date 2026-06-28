import { CharacterSVG } from './CharacterSVG';
import { XPBar, HPHearts, Card, SectionLabel, DiffBadge, Btn, Thumbnail } from '../ui';
import type { PlayerState, Quest, QuestCompletion, Skin, Title } from '../../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface Props {
  state: PlayerState;
  quests: Quest[];
  completions: QuestCompletion[];
  activeSkin: Skin | null;
  activeTitle: Title | null;
  onQuestDone: (id: string) => void;
}

export function PlayerHome({ state, quests, completions, activeSkin, activeTitle, onQuestDone }: Props) {
  const daily = quests.filter(q => q.type === 'daily');

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
        <XPBar current={state.current_xp} max={state.xp_to_next_level} level={state.current_level}/>

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
            {daily.map(q => {
              const comp = completions.find(c => c.quest_id === q.id);
              const done = comp?.status === 'approved';
              const pending = comp?.status === 'pending';
              return (
                <Card key={q.id} style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Thumbnail url={q.image_url} size={40} radius={8}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: done ? 'var(--color-green)' : 'var(--color-text)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {q.name}
                      </div>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <DiffBadge diff={q.difficulty}/>
                        <span style={{ fontSize: 10, color: 'var(--color-gold)' }}>+{q.xp_reward} XP</span>
                      </div>
                    </div>
                    {done ? (
                      <CheckCircle2 size={18} style={{ color: 'var(--color-green)', flexShrink: 0 }}/>
                    ) : pending ? (
                      <span style={{ fontSize: 10, color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                        <Clock size={11}/> Pending
                      </span>
                    ) : (
                      <Btn size="sm" onClick={() => onQuestDone(q.id)} style={{ flexShrink: 0 }}>
                        Report done
                      </Btn>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
