import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, SectionLabel, Btn, Thumbnail } from '../ui';
import type { Skin, ShopItem, Notification, PlayerState } from '../../types';

// ── Skins Gallery ─────────────────────────────────────────────────────────────
interface SkinsProps { activeSkinId: string | null; onEquip: (id: string | null) => void; }

export function PlayerSkins({ activeSkinId, onEquip }: SkinsProps) {
  const [skins, setSkins] = useState<Skin[]>([]);

  useEffect(() => {
    supabase.from('skins').select('*').eq('owned_by_player', true).then(({ data }) => {
      if (data) setSkins(data as Skin[]);
    });
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <SectionLabel>My Skins</SectionLabel>
      {skins.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-dim)', fontSize: 13 }}>
          No skins yet — check the shop or wait for your GM ✦
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {skins.map(skin => {
            const active = skin.id === activeSkinId;
            return (
              <Card key={skin.id} style={{ border: active ? '1px solid var(--color-accent)' : undefined }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Thumbnail url={skin.image_url} size={52} radius={10}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)' }}>{skin.name}</span>
                      {active && (
                        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--color-accent-lit)', background: 'var(--color-accent-dim)', borderRadius: 8, padding: '2px 8px' }}>
                          EQUIPPED
                        </span>
                      )}
                    </div>
                    {skin.flavor_text && (
                      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 3 }}>{skin.flavor_text}</p>
                    )}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                      {Object.entries(skin.stat_bonuses).map(([k, v]) => (
                        <span key={k} style={{ fontSize: 10, color: 'var(--color-gold)', background: 'rgba(240,192,64,0.1)', borderRadius: 6, padding: '2px 7px', border: '1px solid rgba(240,192,64,0.3)' }}>
                          {k.replace(/_/g,' ')} +{v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Btn size="sm" variant={active ? 'ghost' : 'primary'} onClick={() => onEquip(active ? null : skin.id)}>
                    {active ? 'Remove' : 'Equip'}
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Shop ──────────────────────────────────────────────────────────────────────
interface ShopProps { state: PlayerState; }

export function PlayerShop({ state }: ShopProps) {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [buying, setBuying] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.from('shop_items').select('*').eq('active', true).then(({ data }) => {
      if (data) setItems(data as ShopItem[]);
    });
  }, []);

  async function buy(item: ShopItem) {
    if (state.current_xp < item.xp_price) { setMsg('Not enough XP!'); setTimeout(() => setMsg(''), 2000); return; }
    setBuying(item.id);
    const { error } = await supabase.from('purchases').insert({
      player_id: state.player_id, item_id: item.id, xp_spent: item.xp_price,
    });
    if (!error) {
      await supabase.from('player_state').update({ current_xp: state.current_xp - item.xp_price }).eq('id', state.id);
      setMsg(`Bought: ${item.name}!`);
    }
    setBuying(null);
    setTimeout(() => setMsg(''), 3000);
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SectionLabel>Shop</SectionLabel>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-gold)' }}>
          ✦ {state.current_xp.toLocaleString()} XP
        </span>
      </div>
      {msg && (
        <div style={{ background: 'var(--color-green-dark)', border: '1px solid var(--color-green)', borderRadius: 10, padding: '8px 12px', marginBottom: 12, fontSize: 12, color: 'var(--color-green)' }}>
          {msg}
        </div>
      )}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-dim)', fontSize: 13 }}>Shop is empty ✦</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {items.map(item => {
            const canBuy = state.current_xp >= item.xp_price;
            return (
              <Card key={item.id}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Thumbnail url={item.image_url} size={52} radius={10}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', marginBottom: 3 }}>{item.name}</div>
                    {item.description && <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{item.description}</p>}
                    <div style={{ fontSize: 12, fontWeight: 700, color: canBuy ? 'var(--color-gold)' : 'var(--color-text-dim)', marginTop: 4 }}>
                      ✦ {item.xp_price} XP
                    </div>
                  </div>
                  <Btn
                    size="sm"
                    variant={canBuy ? 'gold' : 'ghost'}
                    disabled={!canBuy || buying === item.id}
                    onClick={() => buy(item)}
                  >
                    {buying === item.id ? '…' : 'Buy'}
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────
interface NotifProps { notifications: Notification[]; onRead: (id: string) => void; }

export function PlayerNotifications({ notifications, onRead }: NotifProps) {
  const icons: Record<string, string> = {
    lvl_up: '🏆', quest_assigned: '⚔️', gm_message: '💌',
    skin_warning: '⚠️', purchase_confirmed: '✦', hp_drop: '❤️', quest_expired: '⏰',
  };
  return (
    <div style={{ padding: 16 }}>
      <SectionLabel>Notifications</SectionLabel>
      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-dim)', fontSize: 13 }}>
          No notifications yet ✦
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {notifications.map(n => (
            <Card key={n.id} style={{ opacity: n.read ? 0.6 : 1, cursor: 'pointer', border: n.read ? '1px solid var(--color-border-dim)' : '1px solid var(--color-accent-dim)' }} onClick={() => onRead(n.id)}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>{icons[n.type] || '✦'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)', marginBottom: 3 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{n.body}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 4 }}>
                    {new Date(n.created_at).toLocaleDateString()} {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {!n.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--color-accent)', flexShrink: 0, marginTop: 4 }}/>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
