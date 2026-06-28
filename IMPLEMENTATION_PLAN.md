# LoveQuest Accessories System + UI Polish Implementation Plan

**Project:** Accessories system (earrings, necklaces, rings) with stat impacts, multiple equipment slots, and improved player page UX  
**Scope:** Database schema, backend functions, React components, GM controls, notifications system  
**Target:** Full integration end-to-end  

---

## 1. Architecture Overview

### Data Layer
```
accessories
├── id, name, type (earring/necklace/ring/etc)
├── style_id (predefined enum)
├── rarity (common/rare/epic/legendary)
├── stats (JSON: {str: 5, dex: 2, etc})
└── created_at

player_accessories
├── player_id, accessory_id
├── quantity (or just owned boolean)
└── created_at

equipped_accessories
├── player_id
├── earring_id (nullable)
├── necklace_id (nullable)
├── ring_id (nullable)
└── timestamp (updated_at)

notifications
├── id, player_id, type
├── title, message
├── read (boolean), created_at
└── Realtime enabled
```

### Component Tree
```
App
├── PlayerPage (improved UI + animations)
│   ├── CharacterSVG (with equipped accessories overlay)
│   ├── PlayerNav (new Accessories tab)
│   └── XPBar, HPHearts, QuestList
├── AccessoriesScreen (new)
│   └── InventoryList (grouped by type)
├── NotificationCenter (new)
│   ├── Bell icon (header)
│   └── Drawer/Modal
├── ShopPage (updated)
│   └── Accessories section
└── GMPage (enhanced)
    ├── AccessoryManager (new)
    └── Existing quest/xp controls
```

### Hook/Function Layer
```
useAccessories()
├── fetchPlayerAccessories()
├── fetchEquippedItems()
└── subscribeToAccessories() [Realtime]

equipAccessory(accessory_id, slot_type)
├── validate slot not already occupied (or replace)
├── update equipped_accessories
└── trigger notification (if GM granted)

grantAccessory(player_id, accessory_id)
├── add to player_accessories
├── create notification
└── trigger real-time toast (GM view)

useNotifications()
├── fetchNotifications()
├── subscribeToNotifications() [Realtime]
└── markAsRead()
```

---

## 2. Database Schema Changes

### New Tables

#### `accessories`
```sql
CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('earring', 'necklace', 'ring')),
  style_id TEXT NOT NULL, -- 'delicate_chain', 'chunky_pendant', etc
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  stats JSONB DEFAULT '{}', -- {str: 5, dex: 2, wis: 1}
  created_at TIMESTAMP DEFAULT now(),
  
  UNIQUE(name)
);

-- Predefined styles (seeded data)
-- earring: hoop, stud, chandelier
-- necklace: delicate_chain, chunky_pendant, choker, locket, beaded
-- ring: simple_band, gemstone, signet
```

#### `player_accessories`
```sql
CREATE TABLE player_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accessory_id UUID NOT NULL REFERENCES accessories(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT now(),
  
  UNIQUE(player_id, accessory_id)
);

-- RLS: Players can only see their own, GMs see all
```

#### `equipped_accessories`
```sql
CREATE TABLE equipped_accessories (
  player_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  earring_id UUID REFERENCES accessories(id) ON DELETE SET NULL,
  necklace_id UUID REFERENCES accessories(id) ON DELETE SET NULL,
  ring_id UUID REFERENCES accessories(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT now() ON UPDATE now()
);

-- RLS: Players can only see/edit their own
```

#### `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('quest_complete', 'level_up', 'item_received', 'gm_action')),
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- RLS: Players see own, GMs see all
-- Realtime enabled
```

### Seed Data

```sql
-- Hoop earrings (starter gift)
INSERT INTO accessories (name, type, style_id, rarity, stats)
VALUES ('Hoop Earrings', 'earring', 'hoop', 'common', '{"str": 2, "charm": 3}');

-- Optional: Pre-create a few necklace/ring examples for demonstration
```

### RLS Policies

```sql
-- player_accessories: Players see own, GMs see all
CREATE POLICY "Players see own accessories" ON player_accessories
  FOR SELECT USING (auth.uid() = player_id OR auth.jwt() ->> 'role' = 'gm');

CREATE POLICY "GMs can grant" ON player_accessories
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'gm');

-- equipped_accessories: Players see own, GMs see all
CREATE POLICY "Players see own equipped" ON equipped_accessories
  FOR SELECT USING (auth.uid() = player_id OR auth.jwt() ->> 'role' = 'gm');

CREATE POLICY "Players can equip own" ON equipped_accessories
  FOR UPDATE USING (auth.uid() = player_id);

-- notifications: Players see own, GMs see all
CREATE POLICY "Players see own notifications" ON notifications
  FOR SELECT USING (auth.uid() = player_id OR auth.jwt() ->> 'role' = 'gm');

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'gm');

-- accessories: Everyone reads, GM can update
CREATE POLICY "Anyone can read accessories" ON accessories
  FOR SELECT USING (true);

CREATE POLICY "GMs can manage accessories" ON accessories
  FOR ALL USING (auth.jwt() ->> 'role' = 'gm');
```

---

## 3. React Components

### CharacterSVG (Updated)
**File:** `src/components/player/CharacterSVG.tsx`

**Props:**
```typescript
interface CharacterSVGProps {
  theme?: string;
  equipped?: {
    earring?: Accessory;
    necklace?: Accessory;
    ring?: Accessory;
  };
  animate?: boolean; // breathing animation
}
```

**Implementation:**
- Add `animate` CSS class for breathing (opacity/scale)
- Define SVG coordinate systems for each slot:
  - Earring: `cx="20" cy="40"` (left ear) and `cx="180" cy="40"` (right ear)
  - Necklace: `cx="100" cy="80"` (neck center)
  - Ring: `cx="140" cy="160"` (hand)
- For each predefined style, create SVG path/element
- Layer equipped items on top (z-index)
- Ensure responsive scaling

### AccessoriesScreen (New)
**File:** `src/components/player/AccessoriesScreen.tsx`

**Structure:**
```typescript
export default function AccessoriesScreen() {
  const { accessories, equipped, equipAccessory, unequipAccessory } = useAccessories();
  
  // Group by type
  const grouped = groupBy(accessories, 'type');
  
  return (
    <div className="accessories-screen">
      {Object.entries(grouped).map(([type, items]) => (
        <div key={type} className="accessory-slot">
          <h3>{capitalize(type)}s</h3>
          {items.map(item => (
            <AccessoryCard
              key={item.id}
              item={item}
              isEquipped={equipped[type]?.id === item.id}
              onEquip={() => equipAccessory(item.id, type)}
              onUnequip={() => unequipAccessory(type)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### AccessoryCard (New)
**File:** `src/components/player/AccessoryCard.tsx`

**Features:**
- Display name, type, rarity badge, stats
- "Equip" or "Unequip" button
- Instant feedback on click
- Currently equipped items highlighted

### NotificationCenter (New)
**File:** `src/components/notifications/NotificationCenter.tsx`

**Components:**
- `NotificationBell` (header icon with unread count)
- `NotificationDrawer` (modal showing all notifications)
- `NotificationToast` (ephemeral pop-up for real-time GM actions)

**Real-time Logic:**
```typescript
useEffect(() => {
  const subscription = supabase
    .from('notifications')
    .on('*', payload => {
      if (payload.new.type === 'item_received') {
        // Show toast
        showToast(payload.new.message);
      }
      // Add to notification list
      setNotifications(prev => [payload.new, ...prev]);
    })
    .subscribe();
  
  return () => subscription.unsubscribe();
}, []);
```

### GMAccessoryManager (New)
**File:** `src/components/gm/GMAccessoryManager.tsx`

**Sections:**
1. **Accessory List** — all accessories, editable
2. **Create New** — form to add new accessory
3. **Grant to Player** — button to grant item to Ele

**Actions:**
- Edit name/stats/rarity (JSON editor for stats)
- Delete accessory
- Grant to player (creates notification)

---

## 4. Hooks/Functions

### useAccessories()
**File:** `src/hooks/useAccessories.ts`

```typescript
export function useAccessories() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [equipped, setEquipped] = useState<Record<string, Accessory | null>>({});
  const [loading, setLoading] = useState(true);
  
  // Fetch all owned accessories
  useEffect(() => {
    fetchAccessories();
  }, []);
  
  // Subscribe to real-time updates
  useEffect(() => {
    const sub = supabase
      .from('player_accessories')
      .on('*', payload => {
        refetch();
      })
      .subscribe();
    
    return () => sub.unsubscribe();
  }, []);
  
  async function equipAccessory(accessory_id: string, slot: string) {
    const { error } = await supabase
      .from('equipped_accessories')
      .update({ [`${slot}_id`]: accessory_id })
      .eq('player_id', user.id);
    
    if (error) console.error(error);
  }
  
  async function unequipAccessory(slot: string) {
    const { error } = await supabase
      .from('equipped_accessories')
      .update({ [`${slot}_id`]: null })
      .eq('player_id', user.id);
    
    if (error) console.error(error);
  }
  
  async function grantAccessory(player_id: string, accessory_id: string) {
    // Add to inventory
    await supabase.from('player_accessories').insert({
      player_id,
      accessory_id,
    });
    
    // Create notification
    const accessory = accessories.find(a => a.id === accessory_id);
    await supabase.from('notifications').insert({
      player_id,
      type: 'item_received',
      title: 'New Item!',
      message: `You received ${accessory.name}!`,
    });
  }
  
  return { accessories, equipped, equipAccessory, unequipAccessory, grantAccessory, loading };
}
```

### useNotifications()
**File:** `src/hooks/useNotifications.ts`

```typescript
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    fetchNotifications();
    subscribeToNotifications();
  }, []);
  
  async function markAsRead(id: string) {
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
  }
  
  return { notifications, unreadCount, markAsRead };
}
```

---

## 5. Integration Points

### PlayerPage Updates
- Import `useAccessories()`
- Pass `equipped` accessories to `CharacterSVG`
- Add breathing animation CSS
- Display currently equipped items below avatar

### PlayerNav Updates
- Add "Accessories" tab (between Skins and Shop)
- Route to `AccessoriesScreen`

### ShopPage Updates
- Merge accessories into shop display
- Update purchase logic to handle accessories
- Display rarity badges and stats

### GMPage Updates
- Add "Accessory Manager" tab/section
- Use `GMAccessoryManager` component
- Allow create/edit/grant/delete

### App-level (Header)
- Add `NotificationCenter` (bell icon)
- Show unread count

---

## 6. Styling & Animations

### Breathing Animation (CSS)
```css
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.98;
  }
}

.character-breathing {
  animation: breathe 3s ease-in-out infinite;
}
```

### Accessory Rendering (SVG)
- Use Tailwind colors (white/gold/green palette)
- Ensure SVG strokes/fills match theme
- Test on mobile viewport

### Rarity Badges
```
Common: bg-gray-300, text-gray-900
Rare: bg-blue-400, text-white
Epic: bg-purple-500, text-white
Legendary: bg-yellow-500, text-black
```

---

## 7. Testing Checklist

### Unit Tests
- [ ] equipAccessory() updates DB correctly
- [ ] unequipAccessory() sets slot to null
- [ ] grantAccessory() creates notification
- [ ] useAccessories() subscription works

### Integration Tests
- [ ] Roee grants hoop earrings → Ele sees notification
- [ ] Ele equips earrings → avatar updates instantly
- [ ] Roee changes earring stats → Ele sees updated stats
- [ ] Multiple slots: equip earring + necklace simultaneously
- [ ] Unequip removes item from avatar
- [ ] Accessories persist across sessions

### E2E Tests
- [ ] Full flow on mobile (iPhone PWA)
- [ ] Realtime sync (both players have app open)
- [ ] Notifications work for all event types
- [ ] No performance issues with Realtime subscriptions

---

## 8. Predefined Accessory Styles

### Earrings
1. **Hoop** — circular outline
2. **Stud** — small circular dot
3. **Chandelier** — hanging with detail

### Necklaces
1. **Delicate Chain** — thin line
2. **Chunky Pendant** — thick with center gem/shape
3. **Choker** — close to neck
4. **Locket** — oval pendant with opening
5. **Beaded** — series of small circles

### Rings
1. **Simple Band** — plain band
2. **Gemstone** — band with center stone
3. **Signet** — band with flat top

---

## 9. Deployment & Env Vars

**No new env vars needed** — reuse existing Supabase connection.

**Deploy steps:**
1. Run migration script (schema.sql updates)
2. Seed accessories table
3. Push React components to GitHub
4. Vercel auto-deploys

---

## 10. Open Questions / Clarifications

1. **Accessories in Shop:** Are accessories auto-listed in the shop, or does GM need to manually add them?
   - *Assumption:* Same item can be purchased from shop or granted by GM (GM controls both)

2. **Real-time pop-ups:** Which GM actions trigger real-time toast notifications on GM's screen?
   - *Assumption:* Only item_received (when granting) shows toast; other notifications are in-app only

3. **Emoji/icons for types:** Should earring/necklace/ring have icons or just text labels?
   - *Assumption:* Text labels for now, can add icons later

4. **Stat JSON structure:** Do all accessories follow same stat schema (str, dex, wis, charm)?
   - *Assumption:* Yes, same flexible JSON format as other items

---

## 11. Success Criteria

✅ **Database:** Accessories, player_accessories, equipped_accessories, notifications tables created with RLS  
✅ **Backend:** useAccessories(), grantAccessory(), equipAccessory() functions work end-to-end  
✅ **UI:** AccessoriesScreen, NotificationCenter, CharacterSVG updates complete  
✅ **GM Controls:** GMAccessoryManager allows create/edit/grant  
✅ **Realtime:** Equipped items update instantly for both players  
✅ **Notifications:** In-app notifications work, real-time toasts for GM actions  
✅ **Testing:** E2E flow (Roee grants earrings → Ele equips → avatar updates) works on iPhone PWA  

---

**Status:** Ready to execute  
**Created:** 2026-06-28  
**Next Step:** Task #1 — Define schema
