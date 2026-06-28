import { Home, Sword, Shirt, ShoppingBag, Bell } from 'lucide-react';

interface Props { active: string; onChange: (t: string) => void; unread?: number; }

const TABS = [
  { id: 'home',    label: 'Home',    Icon: Home },
  { id: 'quests',  label: 'Quests',  Icon: Sword },
  { id: 'skins',   label: 'Skins',   Icon: Shirt },
  { id: 'shop',    label: 'Shop',    Icon: ShoppingBag },
  { id: 'notifs',  label: 'Alerts',  Icon: Bell },
];

export function PlayerNav({ active, onChange, unread = 0 }: Props) {
  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-around',
      background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)',
      paddingTop: 8,
      paddingBottom: 'max(env(safe-area-inset-bottom,8px),8px)',
    }}>
      {TABS.map(({ id, label, Icon }) => {
        const on = active === id;
        const hasBadge = id === 'notifs' && unread > 0;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '2px 12px', position: 'relative',
              color: on ? 'var(--color-accent-lit)' : 'var(--color-text-dim)',
              transition: 'color 0.2s',
            }}
          >
            <Icon size={20} strokeWidth={on ? 2.2 : 1.6}/>
            <span style={{ fontSize: 9, fontWeight: on ? 700 : 500 }}>{label}</span>
            {on && (
              <span style={{
                position: 'absolute', bottom: -1, width: 20, height: 2,
                borderRadius: 2, background: 'var(--color-accent-lit)',
              }}/>
            )}
            {hasBadge && (
              <span style={{
                position: 'absolute', top: 0, right: 8,
                background: 'var(--color-heart)', color: 'white',
                fontSize: 8, fontWeight: 700, borderRadius: 10,
                padding: '1px 4px', minWidth: 14, textAlign: 'center',
              }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
