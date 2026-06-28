import { useState } from 'react';
import { LogOut, CheckCircle2, Clock, Star, Users, Heart, Swords } from 'lucide-react';
import { CharacterSVG } from '../components/player/CharacterSVG';
import { AccessoriesScreen } from '../components/player/AccessoriesScreen';
import { NotificationBell, NotificationCenter } from '../components/player/NotificationCenter';
import { usePlayerState } from '../hooks/usePlayerState';
import { useAccessories } from '../hooks/useAccessories';
import { useNotifications } from '../hooks/useNotifications';
import type { User, Quest, QuestCompletion } from '../types';

interface PlayerPageProps { user: User; onLogout: () => void; }

function HeroSection({ level, xp, xpMax, hp, skinType, equippedAccessories, onBellClick, unreadCount }: {
  level: number; xp: number; xpMax: number; hp: number; skinType: string | null;
  equippedAccessories: any[]; onBellClick: () => void; unreadCount: number;
}) {
  const pct = Math.min(Math.round((xp / xpMax) * 100), 100);

  const equippedNames = equippedAccessories
    .map(pa => pa.accessory?.name)
    .filter(Boolean)
    .join(' · ');

  return (
    <div className="relative" style={{ background: 'var(--color-p-hero)', borderRadius: '0 0 36px 36px', paddingBottom: '20px' }}>
      <div style={{
        position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)',
        width: 200, height: 200, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180,140,240,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}/>
      <div className="safe-top" style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, paddingBottom: 4 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-p-accent)', letterSpacing: -0.5 }}>
            LoveQuest
          </span>
          <NotificationBell unreadCount={unreadCount} onClick={onBellClick}/>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
        <CharacterSVG skinType={skinType} size={138} equippedAccessories={equippedAccessories} animate/>
        {equippedNames && (
          <div style={{
            marginTop: 6,
            background: 'rgba(123,94,167,0.1)',
            border: '1px solid rgba(123,94,167,0.2)',
            borderRadius: 16, padding: '2px 12px',
            fontSize: 10, color: 'var(--color-p-accent)', opacity: 0.85,
          }}>
            {equippedNames}
          </div>
        )}
        <div style={{
          marginTop: equippedNames ? 4 : 6,
          background: 'rgba(123,94,167,0.12)',
          border: '1px solid rgba(123,94,167,0.25)',
          borderRadius: 20, padding: '3px 14px',
          fontSize: 10, fontWeight: 600, color: 'var(--color-p-accent)',
          letterSpacing: 0.5, textTransform: 'uppercase',
        }}>
          LD-Coordinator
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-p-text)' }}>
            The Princess
          </span>
          <span style={{
            background: 'var(--color-p-accent)', color: 'white',
            fontSize: 10, fontWeight: 700, borderRadius: 12, padding: '2px 10px',
          }}>
            LVL {level}
          </span>
        </div>
      </div>
      <div style={{ padding: '14px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: 'var(--color-p-muted)', fontWeight: 500 }}>
            XP to level {level + 1}
          </span>
          <span style={{ fontSize: 10, color: 'var(--color-p-accent)', fontWeight: 600 }}>
            {xp.toLocaleString()} / {xpMax.toLocaleString()}
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 8, background: 'var(--color-p-xptrack)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 8,
            background: 'linear-gradient(90deg, var(--color-p-xp), #C09AF0)',
            width: `${pct}%`,
            transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 0 8px rgba(160,123,212,0.5)',
          }}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          <span style={{ fontSize: 10, color: 'var(--color-p-muted)', fontWeight: 500 }}>HP</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart key={i} size={15} style={{
                color: i < hp ? 'var(--color-p-heart)' : 'var(--color-p-heartempty)',
                fill: i < hp ? 'var(--color-p-heart)' : 'none',
                transition: 'all 0.3s',
              }}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const QUEST_ICONS = [Star, Users, Heart, Swords];

function QuestCard({ quest, completion, onDone }: {
  quest: Quest; completion?: QuestCompletion; onDone: () => void;
}) {
  const Icon = QUEST_ICONS[quest.name.length % QUEST_ICONS.length];
  const isDone = completion?.status === 'approved';
  const isPending = completion?.status === 'pending';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: isDone ? 'rgba(91,170,66,0.08)' : 'var(--color-p-card)',
      border: `1px solid ${isDone ? 'rgba(91,170,66,0.25)' : 'var(--color-p-border)'}`,
      borderRadius: 16, padding: '12px 14px',
      transition: 'border-color 0.2s, transform 0.15s',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 12, flexShrink: 0,
        background: isDone ? 'rgba(91,170,66,0.15)' : 'var(--color-p-hero)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: isDone ? 'var(--color-p-done)' : 'var(--color-p-accent)',
      }}>
        {isDone ? <CheckCircle2 size={16}/> : <Icon size={15}/>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          color: isDone ? 'var(--color-p-done)' : 'var(--color-p-text)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {quest.name}
        </div>
        <div style={{ fontSize: 10, color: 'var(--color-p-muted)', marginTop: 1 }}>
          +{quest.xp_reward} XP
        </div>
      </div>
      {isDone ? (
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-p-done)', whiteSpace: 'nowrap' }}>✓ Done</span>
      ) : isPending ? (
        <span style={{
          fontSize: 10, color: 'var(--color-p-pending)', fontWeight: 600,
          background: 'rgba(196,154,48,0.12)', borderRadius: 10, padding: '3px 9px',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Clock size={10}/> Pending
        </span>
      ) : (
        <button
          onClick={onDone}
          style={{
            background: 'var(--color-p-accent)', color: 'white',
            border: 'none', borderRadius: 12, padding: '6px 14px',
            fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(123,94,167,0.35)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Done ✓
        </button>
      )}
    </div>
  );
}

function BottomNav({ active, onChange }: { active: string; onChange: (t: string) => void }) {
  const tabs = [
    { id: 'home',        label: 'Home',        emoji: '🏠' },
    { id: 'quests',      label: 'Quests',      emoji: '⚔️' },
    { id: 'accessories', label: 'Accessories', emoji: '💎' },
    { id: 'skins',       label: 'Skins',       emoji: '👗' },
    { id: 'shop',        label: 'Shop',        emoji: '🛍️' },
  ];
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: 'rgba(250,245,255,0.92)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--color-p-border)',
      display: 'flex', justifyContent: 'space-around',
      paddingTop: 8,
      paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)',
      zIndex: 100,
    }}>
      {tabs.map(tab => {
        const isOn = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '4px 10px', borderRadius: 14,
              color: isOn ? 'var(--color-p-accent)' : 'var(--color-p-muted)',
              transition: 'color 0.2s', position: 'relative',
            }}
          >
            <span style={{ fontSize: 18 }}>{tab.emoji}</span>
            <span style={{ fontSize: 9, fontWeight: isOn ? 700 : 500 }}>{tab.label}</span>
            {isOn && (
              <span style={{
                position: 'absolute', bottom: -1, left: '50%', transform: 'translateX(-50%)',
                width: 24, height: 3, borderRadius: 2, background: 'var(--color-p-accent)',
              }}/>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export function PlayerPage({ user, onLogout }: PlayerPageProps) {
  const [tab, setTab] = useState('home');
  const [notifOpen, setNotifOpen] = useState(false);

  const { state, quests, completions, loading, reportQuestDone } = usePlayerState(user.id);
  const { playerAccessories, equipped, equip, unequip } = useAccessories(user.id);
  const { notifications, unreadCount, markAllRead } = useNotifications(user.id);

  if (loading) {
    return (
      <div style={{ minHeight: '100svh', background: 'var(--color-p-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', margin: '0 auto 12px',
            border: '3px solid var(--color-p-border)',
            borderTopColor: 'var(--color-p-accent)',
            animation: 'spin 0.8s linear infinite',
          }}/>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ fontSize: 13, color: 'var(--color-p-muted)' }}>Loading your adventure…</span>
        </div>
      </div>
    );
  }

  const dailyQuests = quests.filter(q => q.type === 'daily');
  const challenges  = quests.filter(q => q.type === 'challenge');

  function handleBellOpen() {
    setNotifOpen(true);
  }

  function handleNotifClose() {
    setNotifOpen(false);
    markAllRead();
  }

  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-p-bg)', paddingBottom: 90 }}>
      <HeroSection
        level={state?.current_level ?? 1}
        xp={state?.current_xp ?? 0}
        xpMax={state?.xp_to_next_level ?? 1000}
        hp={state?.hp ?? 5}
        skinType={null}
        equippedAccessories={equipped}
        onBellClick={handleBellOpen}
        unreadCount={unreadCount}
      />

      <div style={{ padding: '20px 16px 0' }}>
        {(tab === 'home' || tab === 'quests') && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-p-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                Daily quests
              </span>
              <span style={{ fontSize: 10, color: 'var(--color-p-muted)' }}>
                {dailyQuests.filter(q => completions.find(c => c.quest_id === q.id && c.status === 'approved')).length}/{dailyQuests.length} done
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dailyQuests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--color-p-muted)', fontSize: 13 }}>
                  No quests yet — your GM will add some ✨
                </div>
              ) : dailyQuests.map(q => (
                <QuestCard
                  key={q.id} quest={q}
                  completion={completions.find(c => c.quest_id === q.id)}
                  onDone={() => reportQuestDone(q.id)}
                />
              ))}
            </div>
            {challenges.length > 0 && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 10px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-p-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Special challenges
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {challenges.map(q => (
                    <QuestCard key={q.id} quest={q}
                      completion={completions.find(c => c.quest_id === q.id)}
                      onDone={() => reportQuestDone(q.id)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {tab === 'accessories' && (
          <AccessoriesScreen
            playerAccessories={playerAccessories}
            onEquip={equip}
            onUnequip={unequip}
          />
        )}

        {tab === 'skins' && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-p-muted)' }}>
            <span style={{ fontSize: 36 }}>👗</span>
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>Skins Gallery</div>
            <div style={{ marginTop: 4, fontSize: 12 }}>Coming in Sprint 4</div>
          </div>
        )}

        {tab === 'shop' && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-p-muted)' }}>
            <span style={{ fontSize: 36 }}>🛍️</span>
            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>Shop</div>
            <div style={{ marginTop: 4, fontSize: 12 }}>Coming in Sprint 6</div>
          </div>
        )}
      </div>

      <button
        onClick={onLogout}
        style={{
          position: 'fixed', top: 'calc(env(safe-area-inset-top, 0px) + 52px)', right: 16,
          background: 'rgba(180,140,240,0.12)', border: 'none', borderRadius: 8,
          padding: '4px 8px', fontSize: 10, color: 'var(--color-p-muted)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 4, zIndex: 50,
        }}
      >
        <LogOut size={11}/> logout
      </button>

      <BottomNav active={tab} onChange={setTab}/>

      <NotificationCenter
        notifications={notifications}
        unreadCount={unreadCount}
        open={notifOpen}
        onClose={handleNotifClose}
        onMarkAllRead={markAllRead}
      />
    </div>
  );
}
