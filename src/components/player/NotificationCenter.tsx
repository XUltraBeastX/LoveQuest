import { Bell, X, Gift, Star, Swords, Heart } from 'lucide-react';
import type { Notification } from '../../types';

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  open: boolean;
  onClose: () => void;
  onMarkAllRead: () => void;
}

const TYPE_ICON: Record<Notification['type'], React.ElementType> = {
  gm_gift:            Gift,
  lvl_up:             Star,
  quest_assigned:     Swords,
  gm_message:         Bell,
  skin_warning:       Heart,
  purchase_confirmed: Star,
};

const TYPE_COLOR: Record<Notification['type'], string> = {
  gm_gift:            '#C080FF',
  lvl_up:             '#FFB828',
  quest_assigned:     '#80AAFF',
  gm_message:         '#A0A0C0',
  skin_warning:       '#FF8080',
  purchase_confirmed: '#80FF80',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell({ unreadCount, onClick }: { unreadCount: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'rgba(180,140,240,0.2)', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-p-accent)', cursor: 'pointer', position: 'relative',
      }}
    >
      <Bell size={16}/>
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute', top: 4, right: 4,
          minWidth: 16, height: 16, borderRadius: 8,
          background: 'var(--color-p-warn)',
          border: '2px solid var(--color-p-hero)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 8, fontWeight: 800, color: 'white',
          padding: '0 3px',
        }}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}

export function NotificationCenter({
  notifications, unreadCount, open, onClose, onMarkAllRead,
}: NotificationCenterProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          zIndex: 200, backdropFilter: 'blur(2px)',
        }}
      />
      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 'min(340px, 92vw)',
        background: 'var(--color-p-bg)',
        borderLeft: '1px solid var(--color-p-border)',
        zIndex: 201,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 16px 12px',
          paddingTop: 'max(20px, env(safe-area-inset-top, 20px))',
          borderBottom: '1px solid var(--color-p-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-p-text)' }}>
              Notifications
            </span>
            {unreadCount > 0 && (
              <span style={{
                marginLeft: 8, fontSize: 10, fontWeight: 700,
                background: 'rgba(160,80,255,0.15)', color: 'var(--color-p-accent)',
                borderRadius: 8, padding: '2px 7px',
              }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                style={{
                  fontSize: 10, color: 'var(--color-p-accent)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontWeight: 600, padding: '4px 8px',
                }}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(180,140,240,0.12)', border: 'none', borderRadius: '50%',
                width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-p-muted)', cursor: 'pointer',
              }}
            >
              <X size={14}/>
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 12px' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-p-muted)' }}>
              <Bell size={32} style={{ opacity: 0.3, marginBottom: 8 }}/>
              <div style={{ fontSize: 13 }}>No notifications yet</div>
            </div>
          ) : (
            notifications.map(n => {
              const Icon = TYPE_ICON[n.type] ?? Bell;
              const color = TYPE_COLOR[n.type] ?? '#A0A0C0';
              return (
                <div
                  key={n.id}
                  style={{
                    display: 'flex', gap: 10, padding: '10px 10px',
                    borderRadius: 14, marginBottom: 4,
                    background: n.read ? 'transparent' : 'rgba(123,94,167,0.07)',
                    border: `1px solid ${n.read ? 'transparent' : 'rgba(123,94,167,0.12)'}`,
                    transition: 'background 0.3s',
                  }}
                >
                  <div style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    background: `${color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color,
                  }}>
                    <Icon size={15}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: n.read ? 500 : 700,
                      color: 'var(--color-p-text)',
                    }}>
                      {n.title}
                    </div>
                    <div style={{
                      fontSize: 11, color: 'var(--color-p-muted)', marginTop: 2,
                      lineHeight: 1.4,
                    }}>
                      {n.body}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--color-p-muted)', marginTop: 4, opacity: 0.6 }}>
                      {timeAgo(n.created_at)}
                    </div>
                  </div>
                  {!n.read && (
                    <div style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--color-p-accent)',
                      flexShrink: 0, marginTop: 4,
                    }}/>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
