import { useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { PlayerPage } from './pages/PlayerPage';
import { GMPage } from './pages/GMPage';
import { Spinner } from './components/ui';

export default function App() {
  const { user, loading, login, signup, logout } = useAuth();
  if (loading) return <Spinner/>;
  if (!user) return <LoginPage onLogin={login} onSignup={signup}/>;
  if (user.role === 'gm') return <GMPage user={user} onLogout={logout}/>;
  return <PlayerPage user={user} onLogout={logout}/>;
}
