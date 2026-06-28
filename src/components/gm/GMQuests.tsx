import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, SectionLabel, Btn, DiffBadge, Input, Textarea, Modal, Thumbnail } from '../ui';
import { generateImageForName } from '../../lib/aiImages';
import type { Quest, QuestCompletion, Difficulty } from '../../types';
import { Check, X, Plus, Sparkles } from 'lucide-react';

interface Props {
  quests: Quest[];
  completions: (QuestCompletion & { quest_name?: string })[];
  gmId: string;
  onApprove: (c: QuestCompletion) => void;
  onReject: (id: string) => void;
  onRefetch: () => void;
}

const DIFF_OPTIONS: Difficulty[] = ['easy', 'medium', 'hard', 'legendary'];

export function GMQuests({ quests, completions, gmId, onApprove, onReject, onRefetch }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName]       = useState('');
  const [desc, setDesc]       = useState('');
  const [xp, setXP]           = useState('80');
  const [type, setType]       = useState<'daily' | 'challenge'>('daily');
  const [diff, setDiff]       = useState<Difficulty>('medium');
  const [genImg, setGenImg]   = useState(false);
  const [saving, setSaving]   = useState(false);

  async function addQuest() {
    if (!name.trim()) return;
    setSaving(true);
    let image_url: string | null = null;
    if (genImg) image_url = await generateImageForName(name, 'quest');
    await supabase.from('quests').insert({
      name, description: desc || null,
      xp_reward: parseInt(xp) || 80,
      type, difficulty: diff, image_url,
      active: true, created_by: gmId,
    });
    setSaving(false);
    setShowAdd(false);
    setName(''); setDesc(''); setXP('80');
    onRefetch();
  }

  async function deleteQuest(id: string) {
    await supabase.from('quests').update({ active: false }).eq('id', id);
    onRefetch();
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SectionLabel>Quests</SectionLabel>
        <Btn size="sm" variant="green" onClick={() => setShowAdd(true)}>
          <Plus size={13} style={{ display: 'inline', marginRight: 4 }}/> Add
        </Btn>
      </div>

      {/* Pending approvals */}
      {completions.length > 0 && (
        <>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-green)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Pending approval
          </p>
          {completions.map(c => (
            <Card key={c.id} style={{ marginBottom: 8, borderColor: 'rgba(76,175,114,0.4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gm-text)' }}>{c.quest_name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>
                    {new Date(c.reported_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Btn size="sm" variant="green" onClick={() => onApprove(c)}>
                    <Check size={13}/>
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => onReject(c.id)}>
                    <X size={13}/>
                  </Btn>
                </div>
              </div>
            </Card>
          ))}
          <div style={{ height: 1, background: 'var(--color-border)', margin: '12px 0' }}/>
        </>
      )}

      {/* Active quests */}
      {quests.filter(q => q.active).map(q => (
        <Card key={q.id} style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <Thumbnail url={q.image_url} size={44} radius={8}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-gm-text)' }}>{q.name}</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                <DiffBadge diff={q.difficulty}/>
                <span style={{ fontSize: 10, color: 'var(--color-gold)' }}>+{q.xp_reward} XP</span>
                <span style={{ fontSize: 10, color: 'var(--color-text-dim)' }}>{q.type}</span>
              </div>
            </div>
            <Btn size="sm" variant="danger" onClick={() => deleteQuest(q.id)}>Delete</Btn>
          </div>
        </Card>
      ))}

      {/* Add quest modal */}
      {showAdd && (
        <Modal title="New Quest" onClose={() => setShowAdd(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="Quest name" value={name} onChange={e => setName(e.target.value)} placeholder="The Princess Natural Habitat"/>
            <Textarea label="Description (optional)" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Flavor text…"/>
            <Input label="XP reward" type="number" value={xp} onChange={e => setXP(e.target.value)}/>

            <div>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>Type</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                {(['daily','challenge'] as const).map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: '8px', borderRadius: 10, cursor: 'pointer',
                    background: type === t ? 'var(--color-accent)' : 'var(--color-card)',
                    color: type === t ? 'white' : 'var(--color-text-muted)',
                    border: `1px solid ${type === t ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    fontSize: 12, fontWeight: 600,
                  }}>
                    {t === 'daily' ? '⚔️ Daily' : '🌟 Challenge'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>Difficulty</span>
              <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                {DIFF_OPTIONS.map(d => (
                  <button key={d} onClick={() => setDiff(d)} className={`diff-${d}`} style={{
                    padding: '5px 12px', borderRadius: 8, cursor: 'pointer',
                    fontSize: 11, fontWeight: 700,
                    opacity: diff === d ? 1 : 0.5,
                    border: '1px solid',
                  }}>
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setGenImg(!genImg)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: genImg ? 'rgba(157,127,224,0.15)' : 'transparent',
                border: `1px solid ${genImg ? 'var(--color-accent)' : 'var(--color-border)'}`,
                borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
                color: genImg ? 'var(--color-accent-lit)' : 'var(--color-text-muted)',
                fontSize: 12, fontWeight: 600,
              }}
            >
              <Sparkles size={14}/>
              {genImg ? 'AI image ON' : 'Generate AI image'}
            </button>

            <Btn variant="green" onClick={addQuest} disabled={saving || !name.trim()}>
              {saving ? 'Creating…' : 'Create quest'}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
