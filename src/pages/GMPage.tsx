import { useState } from 'react';
import { useGM } from '../hooks/useGM';
import { GMDashboard } from '../components/gm/GMDashboard';
import { GMQuests } from '../components/gm/GMQuests';
import { GMSkins, GMShop, GMGrantXP, GMSendMessage } from '../components/gm/GMScreens';
import { Spinner } from '../components/ui';
import type { User } from '../types';
import { LayoutDashboard, Sword, Shirt, ShoppingBag } from 'lucide-react';

interface Props { user: User; onLogout: () => void; }

const TABS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'quests',    label: 'Quests',    Icon: Sword },
  { id: 'skins',     label: 'Skins',     Icon: Shirt },
  { id: 'shop',      label: 'Shop',      Icon: ShoppingBag },
];

export function GMPage({ user, onLogout }: Props) {
  const [tab, setTab]         = useState('dashboard');
  const [modal, setModal]     = useState<string | null>(null);
  const gm = useGM();

  if (gm.loading) return <Spinner/>;

  function handleAction(id: string) {
    if (id === 'add-quest') { setTab('quests'); }
    else if (id === 'grant-xp') setModal('grant-xp');
    else if (id === 'send-msg') setModal('send-msg');
    else if (id === 'lvl-up') setModal('lvl-up');
    else if (id === 'quests') setTab('quests');
  }

  return (
    <div className="page" style={{ background: 'var(--color-gm-bg)', color: 'var(--color-gm-text)' }}>
      {/* Header */}
      <div className="safe-top" style={{
        background: 'var(--color-gm-card)', borderBottom: '1px solid var(--color-gm-border)',
        padding: '8px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-gm-green)' }}>GM Dashboard</span>
          <span style={{ marginLeft: 8, fontSize: 9, background: 'rgba(76,175,114,0.15)', border: '1px solid rgba(76,175,114,0.4)', color: 'var(--color-gm-green)', borderRadius: 6, padding: '2px 7px', fontWeight: 700 }}>
            Game Master
          </span>
        </div>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--color-gm-muted)', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      {/* Bottom nav */}
      <div className="scroll">
        {tab === 'dashboard' && (
          <GMDashboard
            playerUser={gm.playerUser}
            playerState={gm.playerState}
            pendingCount={gm.completions.length}
            onAction={handleAction}
          />
        )}
        {tab === 'quests' && (
          <GMQuests
            quests={gm.quests}
            completions={gm.completions}
            gmId={user.id}
            onApprove={gm.approveCompletion}
            onReject={gm.rejectCompletion}
            onRefetch={gm.refetch}
          />
        )}
        {tab === 'skins' && (
          <GMSkins skins={gm.skins} onRefetch={gm.refetch}/>
        )}
        {tab === 'shop' && (
          <GMShop items={gm.shopItems} onRefetch={gm.refetch}/>
        )}
      </div>

      {/* Tab nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-around',
        background: 'var(--color-gm-card)', borderTop: '1px solid var(--color-gm-border)',
        paddingTop: 8,
        paddingBottom: 'max(env(safe-area-inset-bottom,8px),8px)',
      }}>
        {TABS.map(({ id, label, Icon }) => {
          const on = tab === id;
          return (
            <button key={id} onClick={() => setTab(id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '2px 12px',
              color: on ? 'var(--color-gm-green)' : 'var(--color-gm-muted)',
              transition: 'color 0.2s', position: 'relative',
            }}>
              <Icon size={20} strokeWidth={on ? 2.2 : 1.6}/>
              <span style={{ fontSize: 9, fontWeight: on ? 700 : 500 }}>{label}</span>
              {on && <span style={{ position: 'absolute', bottom: -1, width: 20, height: 2, borderRadius: 2, background: 'var(--color-gm-green)' }}/>}
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      {modal === 'grant-xp' && (
        <GMGrantXP playerState={gm.playerState} onGrant={gm.grantXP} onClose={() => setModal(null)}/>
      )}
      {modal === 'send-msg' && gm.playerUser && (
        <GMSendMessage
          onSend={(t, b) => gm.sendNotification(gm.playerUser!.id, 'gm_message', t, b)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'lvl-up' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(10,8,30,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-gold)', marginBottom: 8 }}>
            Level Up — Coming soon
          </h2>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', textAlign: 'center', marginBottom: 20 }}>
            The LVL UP ceremony builder is next on the roadmap
          </p>
          <button onClick={() => setModal(null)} style={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 12, padding: '10px 24px', color: 'var(--color-text)', cursor: 'pointer', fontSize: 13 }}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
