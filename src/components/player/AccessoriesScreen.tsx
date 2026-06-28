import type { Accessory, PlayerAccessory } from '../../types';

interface AccessoriesScreenProps {
  playerAccessories: PlayerAccessory[];
  onEquip: (playerAccessoryId: string, type: Accessory['type']) => Promise<void>;
  onUnequip: (playerAccessoryId: string) => Promise<void>;
}

const RARITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  common:    { bg: 'rgba(180,180,200,0.12)', text: '#A0A0C0', border: 'rgba(180,180,200,0.25)' },
  rare:      { bg: 'rgba(80,140,255,0.12)',  text: '#80AAFF', border: 'rgba(80,140,255,0.3)'  },
  epic:      { bg: 'rgba(160,80,255,0.12)',  text: '#C080FF', border: 'rgba(160,80,255,0.35)' },
  legendary: { bg: 'rgba(255,180,40,0.12)',  text: '#FFB828', border: 'rgba(255,180,40,0.35)' },
};

const TYPE_EMOJI: Record<string, string> = {
  earring: '👂',
  necklace: '📿',
  ring: '💍',
};

const TYPE_LABEL: Record<string, string> = {
  earring: 'Earrings',
  necklace: 'Necklaces',
  ring: 'Rings',
};

function StatBadges({ stats }: { stats: Record<string, number> }) {
  const entries = Object.entries(stats);
  if (entries.length === 0) return null;
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4 }}>
      {entries.map(([key, val]) => (
        <span key={key} style={{
          fontSize: 9, fontWeight: 700,
          background: 'rgba(123,94,167,0.15)',
          color: 'var(--color-p-accent)',
          borderRadius: 6, padding: '2px 6px',
          textTransform: 'uppercase',
        }}>
          +{val} {key.toUpperCase()}
        </span>
      ))}
    </div>
  );
}

function AccessoryCard({ pa, onEquip, onUnequip }: {
  pa: PlayerAccessory;
  onEquip: () => void;
  onUnequip: () => void;
}) {
  const acc = pa.accessory!;
  const rc = RARITY_COLORS[acc.rarity];

  return (
    <div style={{
      background: pa.equipped ? 'rgba(123,94,167,0.12)' : 'var(--color-p-card)',
      border: `1px solid ${pa.equipped ? 'rgba(123,94,167,0.4)' : 'var(--color-p-border)'}`,
      borderRadius: 16, padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'border-color 0.2s, background 0.2s',
    }}>
      {/* Icon */}
      <div style={{
        width: 40, height: 40, borderRadius: 12, flexShrink: 0,
        background: rc.bg, border: `1px solid ${rc.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>
        {TYPE_EMOJI[acc.type]}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-p-text)' }}>
            {acc.name}
          </span>
          <span style={{
            fontSize: 9, fontWeight: 700,
            background: rc.bg, color: rc.text,
            border: `1px solid ${rc.border}`,
            borderRadius: 8, padding: '1px 6px',
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {acc.rarity}
          </span>
          {pa.equipped && (
            <span style={{
              fontSize: 9, fontWeight: 700,
              background: 'rgba(123,94,167,0.2)',
              color: 'var(--color-p-accent)',
              borderRadius: 8, padding: '1px 6px',
            }}>
              ✦ ON
            </span>
          )}
        </div>
        <StatBadges stats={acc.stats}/>
      </div>

      {/* Action */}
      {pa.equipped ? (
        <button
          onClick={onUnequip}
          style={{
            background: 'rgba(123,94,167,0.12)',
            border: '1px solid rgba(123,94,167,0.3)',
            borderRadius: 10, padding: '5px 12px',
            fontSize: 11, fontWeight: 600,
            color: 'var(--color-p-accent)', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Remove
        </button>
      ) : (
        <button
          onClick={onEquip}
          style={{
            background: 'var(--color-p-accent)', color: 'white',
            border: 'none', borderRadius: 10, padding: '6px 14px',
            fontSize: 11, fontWeight: 700, cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(123,94,167,0.35)',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Equip
        </button>
      )}
    </div>
  );
}

export function AccessoriesScreen({ playerAccessories, onEquip, onUnequip }: AccessoriesScreenProps) {
  const types: Accessory['type'][] = ['earring', 'necklace', 'ring'];

  if (playerAccessories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--color-p-muted)' }}>
        <span style={{ fontSize: 40 }}>💎</span>
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600, color: 'var(--color-p-text)' }}>
          No accessories yet
        </div>
        <div style={{ marginTop: 4, fontSize: 12 }}>
          Your GM will gift you something special ✨
        </div>
      </div>
    );
  }

  return (
    <div>
      {types.map(type => {
        const items = playerAccessories.filter(pa => pa.accessory?.type === type);
        if (items.length === 0) return null;
        return (
          <div key={type} style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'var(--color-p-muted)',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span>{TYPE_EMOJI[type]}</span>
              <span>{TYPE_LABEL[type]}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(pa => (
                <AccessoryCard
                  key={pa.id}
                  pa={pa}
                  onEquip={() => onEquip(pa.id, type)}
                  onUnequip={() => onUnequip(pa.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
