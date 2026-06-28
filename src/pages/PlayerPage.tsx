import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { usePlayer } from '../hooks/usePlayer';
import { PlayerNav } from '../components/player/PlayerNav';
import { PlayerHome } from '../components/player/PlayerHome';
import { PlayerQuests } from '../components/player/PlayerQuests';
import { PlayerSkins, PlayerShop, PlayerNotifications } from '../components/player/PlayerScreens';
import { Spinner } from '../components/ui';
import type { User } from '../types';

interface Props { user: User; onLogout: () => void; }

export function PlayerPage({ user, onLogout }: Props) {
  const [tab, setTab] = useState('home');
  const p = usePlayer(user.id);

  if (p.loading) return <Spinner/>;

  async function equipSkin(skinId: string | null) {
    if (!p.state) return;
    await supabase.from('player_state').update({
      active_skin_id: skinId,
      skin_equipped_at: skinId ? new Date().toISOString() : null,
    }).eq('id', p.state.id);
    p.refetch();
  }

  return (
    <div className="page" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div className="safe-top" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-dim)', padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-text)', letterSpacing: -0.5 }}>
          ⚔️ LoveQuest
        </span>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--color-text-dim)', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Scrollable content */}
      <div className="scroll">
        {tab === 'home' && p.state && (
          <PlayerHome
            state={p.state}
            quests={p.quests}
            completions={p.completions}
            activeSkin={p.activeSkin}
            activeTitle={p.activeTitle}
            onQuestDone={p.reportQuestDone}
          />
        )}
        {tab === 'quests' && (
          <PlayerQuests quests={p.quests} completions={p.completions} onDone={p.reportQuestDone}/>
        )}
        {tab === 'skins' && p.state && (
          <PlayerSkins activeSkinId={p.state.active_skin_id} onEquip={equipSkin}/>
        )}
        {tab === 'shop' && p.state && (
          <PlayerShop state={p.state}/>
        )}
        {tab === 'notifs' && (
          <PlayerNotifications notifications={p.notifications} onRead={p.markNotificationRead}/>
        )}
      </div>

      <PlayerNav active={tab} onChange={setTab} unread={p.unreadCount}/>
    </div>
  );
}
