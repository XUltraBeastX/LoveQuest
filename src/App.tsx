import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/auth/LoginPage';
import { PlayerPage } from './pages/PlayerPage';
import { GMPage } from './pages/GMPage';

function App() {
  const { user, loading, login, signup, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
          <span className="text-purple-400 text-sm">Loading LoveQuest...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={login} onSignup={signup} />;
  }

  if (user.role === 'gm') {
    return <GMPage user={user} onLogout={logout} />;
  }

  return <PlayerPage user={user} onLogout={logout} />;
}

export default App;
