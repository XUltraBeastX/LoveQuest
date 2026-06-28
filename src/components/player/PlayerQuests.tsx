import { useState } from 'react';
import { Card, DiffBadge, Btn, Thumbnail } from '../ui';
import type { Quest, QuestCompletion, Difficulty } from '../../types';
import { CheckCircle2, Clock } from 'lucide-react';

interface Props { quests: Quest[]; completions: QuestCompletion[]; onDone: (id: string) => void; }

const DIFFS: (Difficulty | 'all')[] = ['all', 'easy', 'medium', 'hard', 'legendary'];

export function PlayerQuests({ quests, completions, onDone }: Props) {
  const [filter, setFilter] = useState<Difficulty | 'all'>('all');
  const [tab, setTab] = useState<'daily' | 'challenge'>('daily');

  const filtered = quests
    .filter(q => q.type === tab)
    .filter(q => filter === 'all' || q.difficulty === filter);

  return (
    <div style={{ padding: 16 }}>
      {/* Type tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {(['daily', 'challenge'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: tab === t ? 'var(--color-accent)' : 'var(--color-card)',
            color: tab === t ? 'white' : 'var(--color-text-muted)',
            border: `1px solid ${tab === t ? 'var(--color-accent)' : 'var(--color-border)'}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            {t === 'daily' ? '⚔️ Daily' : '🌟 Challenges'}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 14 }}>
        {DIFFS.map(d => (
          <button key={d} onClick={() => setFilter(d)} style={{
            padding: '4px 12px', borderRadius: 20, fontSize: 10, fontWeight: 600,
            whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.2s',
            background: filter === d ? 'var(--color-accent-dim)' : 'transparent',
            color: filter === d ? 'white' : 'var(--color-text-muted)',
            border: `1px solid ${filter === d ? 'var(--color-accent)' : 'var(--color-border-dim)'}`,
          }}>
            {d === 'all' ? 'All' : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-dim)', fontSize: 13 }}>
          No quests here ✦
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(q => {
            const comp = completions.find(c => c.quest_id === q.id);
            const done = comp?.status === 'approved';
            const pending = comp?.status === 'pending';
            return (
              <Card key={q.id}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Thumbnail url={q.image_url} size={52} radius={10}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: done ? 'var(--color-green)' : 'var(--color-text)', lineHeight: 1.3 }}>
                        {q.name}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-gold)', flexShrink: 0 }}>
                        +{q.xp_reward}
                      </span>
                    </div>
                    {q.description && (
                      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3, lineHeight: 1.5 }}>
                        {q.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <DiffBadge diff={q.difficulty}/>
                      {done ? (
                        <span style={{ fontSize: 11, color: 'var(--color-green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <CheckCircle2 size={13}/> Done
                        </span>
                      ) : pending ? (
                        <span style={{ fontSize: 11, color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12}/> Pending GM
                        </span>
                      ) : (
                        <Btn size="sm" onClick={() => onDone(q.id)}>Report done</Btn>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
