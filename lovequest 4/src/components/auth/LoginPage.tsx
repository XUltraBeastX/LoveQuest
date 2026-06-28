import { useState } from 'react';
import { CharacterSVG } from '../player/CharacterSVG';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string, role: 'gm' | 'player') => Promise<void>;
}

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [role, setRole]         = useState<'gm' | 'player'>('player');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) await onSignup(email, password, name, role);
      else          await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.85)',
    border: '1.5px solid var(--color-p-border)',
    borderRadius: 16,
    padding: '13px 16px',
    fontSize: 14,
    color: 'var(--color-p-text)',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{
      minHeight: '100svh',
      background: 'linear-gradient(160deg, #F0E0FF 0%, #EDE0FF 40%, #FAF5FF 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px 24px',
    }}>
      {/* Decorative stars */}
      {['10% 15%','85% 10%','5% 75%','90% 80%','50% 5%'].map((pos, i) => (
        <span key={i} style={{
          position: 'fixed', fontSize: [12,10,14,10,12][i],
          opacity: 0.35, pointerEvents: 'none',
          top: pos.split(' ')[1], left: pos.split(' ')[0],
        }}>✦</span>
      ))}

      <div style={{ width: '100%', maxWidth: 320 }}>
        {/* Character */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
          <CharacterSVG size={110}/>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-p-accent)', letterSpacing: -1 }}>
            LoveQuest
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-p-muted)', marginTop: 4 }}>
            Your adventure begins here ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {isSignup && (
            <>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Display name" required style={inputStyle}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                {(['player', 'gm'] as const).map(r => (
                  <button
                    key={r} type="button" onClick={() => setRole(r)}
                    style={{
                      flex: 1, padding: '11px', borderRadius: 16, cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                      border: `1.5px solid ${role === r ? 'var(--color-p-accent)' : 'var(--color-p-border)'}`,
                      background: role === r ? 'var(--color-p-accent)' : 'rgba(255,255,255,0.7)',
                      color: role === r ? 'white' : 'var(--color-p-muted)',
                    }}
                  >
                    {r === 'player' ? '👸 Player' : '🎮 Game Master'}
                  </button>
                ))}
              </div>
            </>
          )}

          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required style={inputStyle}
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required minLength={6} style={inputStyle}
          />

          {error && (
            <p style={{ fontSize: 12, color: 'var(--color-p-warn)', textAlign: 'center', padding: '4px 0' }}>
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 4,
              background: 'linear-gradient(135deg, var(--color-p-accent), #9966CC)',
              color: 'white', border: 'none', borderRadius: 18,
              padding: '14px', fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(123,94,167,0.4)',
              transition: 'transform 0.1s, opacity 0.2s',
            }}
            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = 'scale(0.98)'; }}
            onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {loading ? 'Loading…' : isSignup ? 'Start your quest ✦' : 'Log in'}
          </button>

          <button
            type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--color-p-muted)', padding: '8px', textDecoration: 'underline',
            }}
          >
            {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
