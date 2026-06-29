import { useRef, useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import { Card, Thumbnail, DiffBadge } from '../ui';
import type { Quest, QuestCompletion } from '../../types';

const DIFF_COLOR: Record<string, string> = {
  easy: 'var(--color-easy)', medium: 'var(--color-medium)',
  hard: 'var(--color-hard)', legendary: 'var(--color-legendary)',
};

const BURST_FLIES = [
  'translate(-22px,-22px)', 'translate(0px,-28px)', 'translate(22px,-22px)',
  'translate(26px,0px)',    'translate(22px,20px)', 'translate(-22px,20px)',
];

interface Props {
  quest: Quest;
  completion: QuestCompletion | undefined;
  onQuestDone: (id: string) => void;
}

const HOLD_MS = 800;
const RING_R = 16;
const RING_CIRC = 2 * Math.PI * RING_R; // 100.53

export function QuestCard({ quest, completion, onQuestDone }: Props) {
  const [holding, setHolding]   = useState(false);
  const [bursting, setBursting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const approved = completion?.status === 'approved';
  const pending  = completion?.status === 'pending';

  function startHold() {
    setHolding(true);
    timerRef.current = setTimeout(() => {
      setHolding(false);
      setBursting(true);
      navigator.vibrate?.(15);
      setTimeout(() => setBursting(false), 500);
      onQuestDone(quest.id);
    }, HOLD_MS);
  }

  function cancelHold() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
  }

  const leftBorder = approved
    ? '3px solid var(--color-green)'
    : pending
    ? '3px solid var(--color-gold-dim)'
    : `3px solid ${DIFF_COLOR[quest.difficulty] ?? 'var(--color-border)'}`;

  return (
    <div style={{ position: 'relative' }}>
      {bursting && BURST_FLIES.map((fly, i) => (
        <span
          key={i}
          className="burst-particle"
          style={{
            position: 'absolute', top: '50%', right: 20,
            fontSize: 11, color: 'var(--color-gold)', pointerEvents: 'none',
            '--fly': fly,
          } as React.CSSProperties}
        >✦</span>
      ))}
    <Card style={{
      padding: '10px 12px',
      borderLeft: leftBorder,
      transition: 'border-color 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Thumbnail url={quest.image_url} size={40} radius={8}/>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 600, marginBottom: 3,
            color: approved ? 'var(--color-green)' : 'var(--color-text)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {quest.name}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <DiffBadge diff={quest.difficulty}/>
            <span style={{ fontSize: 10, color: 'var(--color-gold)' }}>+{quest.xp_reward} XP</span>
          </div>
        </div>

        {approved ? (
          <CheckCircle2 size={18} style={{ color: 'var(--color-green)', flexShrink: 0 }}/>
        ) : pending ? (
          <span className="pending-pulse" style={{
            fontSize: 10, color: 'var(--color-gold)',
            display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0,
          }}>
            <Clock size={11}/> Pending
          </span>
        ) : (
          /* Hold-to-confirm ring button */
          <div
            style={{ position: 'relative', width: 40, height: 40, flexShrink: 0, touchAction: 'none' }}
            onPointerDown={startHold}
            onPointerUp={cancelHold}
            onPointerLeave={cancelHold}
            onPointerCancel={cancelHold}
            onContextMenu={e => e.preventDefault()}
          >
            <svg viewBox="0 0 40 40" style={{ position: 'absolute', inset: 0, width: 40, height: 40 }}>
              {/* Track */}
              <circle cx="20" cy="20" r={RING_R} fill="none" stroke="var(--color-border)" strokeWidth="2.5"/>
              {/* Progress */}
              {holding && (
                <circle
                  cx="20" cy="20" r={RING_R}
                  fill="none"
                  stroke="var(--color-accent-lit)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRC}
                  strokeDashoffset={RING_CIRC}
                  transform="rotate(-90 20 20)"
                  className="hold-ring-fill"
                />
              )}
            </svg>
            <div style={{
              position: 'absolute', inset: 5,
              borderRadius: '50%',
              background: holding ? 'var(--color-accent-dim)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.15s',
              cursor: 'pointer',
              userSelect: 'none',
            }}>
              <span style={{
                fontSize: 7, fontWeight: 800, letterSpacing: 0.3, textAlign: 'center', lineHeight: 1.2,
                color: holding ? 'var(--color-accent-lit)' : 'var(--color-text-muted)',
                pointerEvents: 'none',
                transition: 'color 0.15s',
              }}>
                {holding ? '✦' : 'HOLD'}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
    </div>
  );
}
