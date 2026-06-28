import { XPBar, HPHearts, Card, SectionLabel } from '../ui';
import type { PlayerState, User } from '../../types';
import { Plus, Coins, Trophy, Send } from 'lucide-react';

interface Props {
  playerUser: User | null;
  playerState: PlayerState | null;
  pendingCount: number;
  onAction: (a: string) => void;
}

export function GMDashboard({ playerUser, playerState, pendingCount, onAction }: Props) {
  const s = playerState;

  return (
    <div style={{ padding: 16 }}>
      {/* Player status card */}
      <Card style={{ marginBottom: 16, background: 'var(--color-gm-card)', borderColor: 'var(--color-gm-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-gm-text)' }}>
              {playerUser?.display_name || 'The Princess'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-gm-text)', opacity: 0.6 }}>
              {playerUser?.email}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--color-gm-text)', opacity: 0.7 }}>Level</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-gm-green)', lineHeight: 1 }}>
              {s?.current_level || 1}
            </div>
          </div>
        </div>
        {s && <XPBar current={s.current_xp} max={s.xp_to_next_level} level={s.current_level}/>}
        {s && <div style={{ marginTop: 8 }}><HPHearts hp={s.hp}/></div>}
      </Card>

      {/* Stat row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {[
          { label: 'Quests done', val: '—' },
          { label: 'Total XP', val: s?.current_xp.toLocaleString() || '0' },
          { label: 'HP', val: `${s?.hp ?? 0}/5` },
        ].map(({ label, val }) => (
          <div key={label} style={{
            background: 'var(--color-gm-card)', border: '1px solid var(--color-gm-border)',
            borderRadius: 12, padding: '10px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-gm-green)' }}>{val}</div>
            <div style={{ fontSize: 9, color: 'var(--color-gm-text)', opacity: 0.6, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Pending approvals alert */}
      {pendingCount > 0 && (
        <div onClick={() => onAction('quests')} style={{
          background: 'rgba(76,175,114,0.1)', border: '1px solid var(--color-gm-green)',
          borderRadius: 12, padding: '10px 14px', marginBottom: 14,
          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-gm-green)' }}>
            ⚔️ {pendingCount} quest{pendingCount > 1 ? 's' : ''} waiting for approval
          </span>
          <span style={{ fontSize: 11, color: 'var(--color-gm-green)' }}>Review →</span>
        </div>
      )}

      {/* GM Actions */}
      <SectionLabel>GM Actions</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        {[
          { icon: Plus,   label: 'Add quest',    id: 'add-quest',   color: 'var(--color-gm-green)' },
          { icon: Coins,  label: 'Grant XP',     id: 'grant-xp',    color: 'var(--color-gold)' },
          { icon: Trophy, label: 'LVL UP',       id: 'lvl-up',      color: 'var(--color-accent-lit)' },
          { icon: Send,   label: 'Send message', id: 'send-msg',    color: '#7abbf0' },
        ].map(({ icon: Icon, label, id, color }) => (
          <button key={id} onClick={() => onAction(id)} style={{
            background: 'var(--color-gm-card)', border: `1px solid ${color}44`,
            borderRadius: 14, padding: '14px 10px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            cursor: 'pointer', transition: 'border-color 0.2s',
          }}>
            <Icon size={22} style={{ color }}/>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-gm-text)' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
