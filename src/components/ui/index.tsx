import { Heart } from 'lucide-react';
import type { Difficulty } from '../../types';

// ── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100dvh', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-accent-lit)', animation: 'spin 0.7s linear infinite' }}/>
      <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Loading…</span>
    </div>
  );
}

// ── XP Bar ──────────────────────────────────────────────────────────────────
export function XPBar({ current, max, level }: { current: number; max: number; level: number }) {
  const pct = Math.min(100, Math.round((current / max) * 100));
  return (
    <div style={{ padding: '0 2px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>XP to level {level + 1}</span>
        <span style={{ fontSize: 10, color: 'var(--color-accent-lit)', fontWeight: 600 }}>{current.toLocaleString()} / {max.toLocaleString()}</span>
      </div>
      <div style={{ height: 7, borderRadius: 8, background: 'var(--color-border)', overflow: 'visible', position: 'relative' }}>
        <div style={{
          height: '100%', borderRadius: 8, width: `${pct}%`,
          background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-lit))',
          boxShadow: '0 0 8px rgba(157,127,224,0.6)',
          transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
          position: 'relative', overflow: 'hidden',
        }}>
          {pct > 3 && (
            <div className="xp-glow-dot" style={{
              position: 'absolute', right: -3, top: '50%', transform: 'translateY(-50%)',
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--color-accent-lit)',
            }}/>
          )}
        </div>
      </div>
    </div>
  );
}

// ── HP Hearts ───────────────────────────────────────────────────────────────
export function HPHearts({ hp, max = 5 }: { hp: number; max?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>HP</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {Array.from({ length: max }).map((_, i) => (
          <Heart key={i} size={14} style={{
            color: i < hp ? 'var(--color-heart)' : 'var(--color-heart-off)',
            fill: i < hp ? 'var(--color-heart)' : 'var(--color-heart-off)',
            transition: 'all 0.3s',
          }}/>
        ))}
      </div>
    </div>
  );
}

// ── Difficulty Badge ─────────────────────────────────────────────────────────
export function DiffBadge({ diff }: { diff: Difficulty }) {
  const labels: Record<Difficulty, string> = {
    easy: 'Easy', medium: 'Medium', hard: 'Hard', legendary: '★ Legendary',
  };
  return (
    <span className={`diff-${diff}`} style={{
      fontSize: 9, fontWeight: 700, borderRadius: 6, padding: '2px 7px',
      border: '1px solid', textTransform: 'uppercase', letterSpacing: 0.5,
      whiteSpace: 'nowrap',
    }}>
      {labels[diff]}
    </span>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style = {}, onClick }: {
  children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(38,28,86,0.72)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--color-border)',
        borderRadius: 16, padding: '12px 14px',
        cursor: onClick ? 'pointer' : undefined,
        transition: 'border-color 0.2s',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Button ───────────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'primary', size = 'md', disabled = false, style = {} }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold' | 'green';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  const bg: Record<string, string> = {
    primary:   'linear-gradient(135deg, var(--color-accent), var(--color-accent-lit))',
    secondary: 'var(--color-card)',
    danger:    'rgba(200,64,48,0.2)',
    ghost:     'transparent',
    gold:      'linear-gradient(135deg, var(--color-gold-dim), var(--color-gold))',
    green:     'linear-gradient(135deg, #2a5c38, var(--color-green))',
  };
  const color: Record<string, string> = {
    primary: 'white', secondary: 'var(--color-text)', danger: '#ff7070',
    ghost: 'var(--color-text-muted)', gold: '#1a1000', green: 'white',
  };
  const pad: Record<string, string> = { sm: '5px 12px', md: '9px 18px', lg: '13px 28px' };
  const fs: Record<string, number> = { sm: 11, md: 13, lg: 15 };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg[variant], color: color[variant],
        border: variant === 'secondary' ? '1px solid var(--color-border)' :
                variant === 'danger'    ? '1px solid rgba(200,64,48,0.4)' : 'none',
        borderRadius: 12, padding: pad[size], fontSize: fs[size], fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.1s, opacity 0.2s',
        boxShadow: variant === 'primary' ? '0 2px 12px rgba(124,92,191,0.4)' :
                   variant === 'gold'    ? '0 2px 12px rgba(240,192,64,0.3)' : 'none',
        ...style,
      }}
      onPointerDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.96)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}

// ── Section Label ────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>
      {children}
    </p>
  );
}

// ── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10,8,30,0.85)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', background: 'var(--color-surface)', borderRadius: '24px 24px 0 0',
          padding: '20px 20px 32px', maxHeight: '85dvh', overflowY: 'auto',
          border: '1px solid var(--color-border)', borderBottom: 'none',
          animation: 'pop 0.25s ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text)' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>{label}</span>}
      <input
        {...props}
        style={{
          background: 'var(--color-bg)', border: '1px solid var(--color-border)',
          borderRadius: 12, padding: '11px 14px', fontSize: 14,
          color: 'var(--color-text)', outline: 'none', width: '100%',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      />
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
export function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>{label}</span>}
      <textarea
        {...props}
        style={{
          background: 'var(--color-bg)', border: '1px solid var(--color-border)',
          borderRadius: 12, padding: '11px 14px', fontSize: 14,
          color: 'var(--color-text)', outline: 'none', width: '100%',
          resize: 'vertical', minHeight: 80,
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-accent)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
      />
    </div>
  );
}

// ── Thumbnail ─────────────────────────────────────────────────────────────────
export function Thumbnail({ url, size = 48, radius = 10 }: { url?: string | null; size?: number; radius?: number }) {
  if (!url) return (
    <div style={{ width: size, height: size, borderRadius: radius, background: 'var(--color-border-dim)', flexShrink: 0 }}/>
  );
  return <img src={url} alt="" style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover', flexShrink: 0 }}/>;
}
