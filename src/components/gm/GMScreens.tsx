import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, SectionLabel, Btn, Input, Textarea, Thumbnail, Modal } from '../ui';
import { generateImageForName } from '../../lib/aiImages';
import type { Skin, ShopItem, PlayerState } from '../../types';
import { Plus, Sparkles } from 'lucide-react';

// ── GM Skins Manager ──────────────────────────────────────────────────────────
interface SkinsProps { skins: Skin[]; onRefetch: () => void; }

const SKIN_TYPES = ['ld','princess','nature','healing','combat','custom'] as const;

export function GMSkins({ skins, onRefetch }: SkinsProps) {
  const [show, setShow]     = useState(false);
  const [name, setName]     = useState('');
  const [type, setType]     = useState<typeof SKIN_TYPES[number]>('custom');
  const [flavor, setFlavor] = useState('');
  const [genImg, setGenImg] = useState(false);
  const [saving, setSaving] = useState(false);

  async function addSkin() {
    if (!name.trim()) return;
    setSaving(true);
    let image_url: string | null = null;
    if (genImg) image_url = await generateImageForName(name, 'skin');
    await supabase.from('skins').insert({
      name, type, flavor_text: flavor || null, image_url,
      stat_bonuses: {}, hp_effect_per_day: 0, owned_by_player: true,
      unlock_condition: 'gm_gift', equippable_by: 'both',
    });
    setSaving(false);
    setShow(false);
    setName(''); setFlavor('');
    onRefetch();
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SectionLabel>Skins & Wearables</SectionLabel>
        <Btn size="sm" variant="green" onClick={() => setShow(true)}>
          <Plus size={13} style={{ display: 'inline', marginRight: 4 }}/> Add
        </Btn>
      </div>

      {skins.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-dim)', fontSize: 13 }}>
          No skins yet ✦
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {skins.map(s => (
            <Card key={s.id}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Thumbnail url={s.image_url} size={44} radius={8}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-gm-text)' }}>{s.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-text-dim)', marginTop: 2 }}>
                    {s.type} · {s.owned_by_player ? 'Owned by Player' : 'Not owned'}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    await supabase.from('skins').update({ owned_by_player: !s.owned_by_player }).eq('id', s.id);
                    onRefetch();
                  }}
                  style={{
                    fontSize: 10, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                    background: s.owned_by_player ? 'rgba(200,64,48,0.15)' : 'rgba(76,175,114,0.15)',
                    color: s.owned_by_player ? '#ff7070' : 'var(--color-green)',
                    border: `1px solid ${s.owned_by_player ? 'rgba(200,64,48,0.4)' : 'rgba(76,175,114,0.4)'}`,
                  }}
                >
                  {s.owned_by_player ? 'Revoke' : 'Gift'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {show && (
        <Modal title="New Skin" onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="Skin name" value={name} onChange={e => setName(e.target.value)} placeholder="LD Type"/>
            <div>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>Type</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                {SKIN_TYPES.map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontWeight: 600,
                    background: type === t ? 'var(--color-accent)' : 'transparent',
                    color: type === t ? 'white' : 'var(--color-text-muted)',
                    border: `1px solid ${type === t ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <Textarea label="Flavor text" value={flavor} onChange={e => setFlavor(e.target.value)}/>
            <button onClick={() => setGenImg(!genImg)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: genImg ? 'rgba(157,127,224,0.15)' : 'transparent',
              border: `1px solid ${genImg ? 'var(--color-accent)' : 'var(--color-border)'}`,
              borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
              color: genImg ? 'var(--color-accent-lit)' : 'var(--color-text-muted)',
              fontSize: 12, fontWeight: 600,
            }}>
              <Sparkles size={14}/> {genImg ? 'AI image ON' : 'Generate AI image'}
            </button>
            <Btn variant="green" onClick={addSkin} disabled={saving || !name.trim()}>
              {saving ? 'Saving…' : 'Add skin'}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── GM Shop Manager ───────────────────────────────────────────────────────────
interface ShopProps { items: ShopItem[]; onRefetch: () => void; }

export function GMShop({ items, onRefetch }: ShopProps) {
  const [show, setShow]     = useState(false);
  const [name, setName]     = useState('');
  const [desc, setDesc]     = useState('');
  const [price, setPrice]   = useState('200');
  const [type, setType]     = useState<'real_reward'|'cosmetic'|'ability'>('real_reward');
  const [genImg, setGenImg] = useState(false);
  const [saving, setSaving] = useState(false);

  async function addItem() {
    if (!name.trim()) return;
    setSaving(true);
    let image_url: string | null = null;
    if (genImg) image_url = await generateImageForName(name, 'shop');
    await supabase.from('shop_items').insert({
      name, description: desc || null, xp_price: parseInt(price) || 200,
      type, image_url, active: true, purchases_count: 0,
    });
    setSaving(false);
    setShow(false);
    setName(''); setDesc('');
    onRefetch();
  }

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SectionLabel>Shop Items</SectionLabel>
        <Btn size="sm" variant="gold" onClick={() => setShow(true)}>
          <Plus size={13} style={{ display: 'inline', marginRight: 4 }}/> Add
        </Btn>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: 'var(--color-text-dim)', fontSize: 13 }}>
          No items yet ✦
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(item => (
            <Card key={item.id}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Thumbnail url={item.image_url} size={44} radius={8}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-gm-text)' }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--color-gold)', marginTop: 2 }}>✦ {item.xp_price} XP · {item.type}</div>
                </div>
                <button onClick={async () => {
                  await supabase.from('shop_items').update({ active: !item.active }).eq('id', item.id);
                  onRefetch();
                }} style={{
                  fontSize: 10, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                  background: item.active ? 'rgba(200,64,48,0.15)' : 'rgba(76,175,114,0.15)',
                  color: item.active ? '#ff7070' : 'var(--color-green)',
                  border: `1px solid ${item.active ? 'rgba(200,64,48,0.4)' : 'rgba(76,175,114,0.4)'}`,
                }}>
                  {item.active ? 'Hide' : 'Show'}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {show && (
        <Modal title="New Shop Item" onClose={() => setShow(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Input label="Item name" value={name} onChange={e => setName(e.target.value)} placeholder="Movie night pick"/>
            <Textarea label="Description" value={desc} onChange={e => setDesc(e.target.value)}/>
            <Input label="XP price" type="number" value={price} onChange={e => setPrice(e.target.value)}/>
            <div>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 600 }}>Type</span>
              <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                {(['real_reward','cosmetic','ability'] as const).map(t => (
                  <button key={t} onClick={() => setType(t)} style={{
                    flex: 1, padding: '6px', borderRadius: 8, cursor: 'pointer', fontSize: 10, fontWeight: 600,
                    background: type === t ? 'var(--color-gold-dim)' : 'transparent',
                    color: type === t ? '#1a1000' : 'var(--color-text-muted)',
                    border: `1px solid ${type === t ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  }}>
                    {t.replace('_',' ')}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setGenImg(!genImg)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: genImg ? 'rgba(240,192,64,0.1)' : 'transparent',
              border: `1px solid ${genImg ? 'var(--color-gold)' : 'var(--color-border)'}`,
              borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
              color: genImg ? 'var(--color-gold)' : 'var(--color-text-muted)',
              fontSize: 12, fontWeight: 600,
            }}>
              <Sparkles size={14}/> {genImg ? 'AI image ON' : 'Generate AI image'}
            </button>
            <Btn variant="gold" onClick={addItem} disabled={saving || !name.trim()}>
              {saving ? 'Saving…' : 'Add item'}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── GM Grant XP ───────────────────────────────────────────────────────────────
interface XPProps { playerState: PlayerState | null; onGrant: (n: number) => void; onClose: () => void; }
export function GMGrantXP({ playerState, onGrant, onClose }: XPProps) {
  const [amount, setAmount] = useState('');
  return (
    <Modal title="Grant XP" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Current XP: <strong style={{ color: 'var(--color-gold)' }}>{playerState?.current_xp || 0}</strong>
        </p>
        <Input label="Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="100"/>
        <div style={{ display: 'flex', gap: 8 }}>
          {[25,50,100,200].map(n => (
            <button key={n} onClick={() => setAmount(String(n))} style={{
              flex: 1, padding: '6px', borderRadius: 8, cursor: 'pointer',
              background: amount === String(n) ? 'var(--color-gold-dim)' : 'var(--color-card)',
              color: amount === String(n) ? '#1a1000' : 'var(--color-text-muted)',
              border: `1px solid ${amount === String(n) ? 'var(--color-gold)' : 'var(--color-border)'}`,
              fontSize: 11, fontWeight: 700,
            }}>+{n}</button>
          ))}
        </div>
        <Btn variant="gold" onClick={() => { if (amount) { onGrant(parseInt(amount)); onClose(); } }} disabled={!amount}>
          Grant {amount ? `+${amount} XP` : 'XP'}
        </Btn>
      </div>
    </Modal>
  );
}

// ── GM Send Message ───────────────────────────────────────────────────────────
interface MsgProps { onSend: (t: string, b: string) => void; onClose: () => void; }
export function GMSendMessage({ onSend, onClose }: MsgProps) {
  const [title, setTitle] = useState('');
  const [body, setBody]   = useState('');
  return (
    <Modal title="Send Message to Ele" onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Input label="Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="LORE DROP"/>
        <Textarea label="Message" value={body} onChange={e => setBody(e.target.value)} placeholder="Dear Ele…"/>
        <Btn variant="primary" onClick={() => { if (title && body) { onSend(title, body); onClose(); } }} disabled={!title || !body}>
          Send 💌
        </Btn>
      </div>
    </Modal>
  );
}
