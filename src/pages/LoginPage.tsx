import { useState } from 'react';
import { Input, Btn } from '../components/ui';

interface Props {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string, role: 'gm' | 'player') => Promise<void>;
}

export function LoginPage({ onLogin, onSignup }: Props) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [role, setRole]         = useState<'gm' | 'player'>('player');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignup) await onSignup(email, password, name, role);
      else await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'linear-gradient(160deg, #1a1035 0%, #130d2e 60%, #0a0820 100%)',
    }}>
      {/* Stars */}
      {['12% 10%','88% 15%','5% 70%','92% 75%','50% 5%','30% 85%','70% 90%'].map((pos, i) => (
        <span key={i} style={{ position: 'fixed', fontSize: [10,8,12,8,10,9,11][i], opacity: 0.3, top: pos.split(' ')[1], left: pos.split(' ')[0], color: 'var(--color-gold)', pointerEvents: 'none' }}>✦</span>
      ))}

      <div style={{ width: '100%', maxWidth: 340 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚔️</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-text)', letterSpacing: -1 }}>
            LoveQuest
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
            Your adventure begins here ✦
          </p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {isSignup && (
            <>
              <Input label="Display name" value={name} onChange={e => setName(e.target.value)} placeholder="The Princess" required/>
              <div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>Role</span>
                <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                  {(['player','gm'] as const).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)} style={{
                      flex: 1, padding: '10px', borderRadius: 12, cursor: 'pointer',
                      fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                      background: role === r ? 'var(--color-accent)' : 'var(--color-card)',
                      color: role === r ? 'white' : 'var(--color-text-muted)',
                      border: `1px solid ${role === r ? 'var(--color-accent)' : 'var(--color-border)'}`,
                    }}>
                      {r === 'player' ? '👸 Player' : '🎮 GM'}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ele@example.com" required/>
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required/>

          {error && (
            <div style={{ fontSize: 12, color: 'var(--color-heart)', background: 'var(--color-warn-bg)', borderRadius: 8, padding: '8px 12px', border: '1px solid var(--color-warn)' }}>
              {error}
            </div>
          )}

          <Btn size="lg" onClick={() => {}} disabled={loading} style={{ width: '100%', marginTop: 4 }}>
            {loading ? 'Loading…' : isSignup ? 'Start your quest ✦' : 'Log in'}
          </Btn>

          <button type="button" onClick={() => { setIsSignup(!isSignup); setError(''); }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 12, color: 'var(--color-text-muted)', padding: '6px', textDecoration: 'underline',
          }}>
            {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
