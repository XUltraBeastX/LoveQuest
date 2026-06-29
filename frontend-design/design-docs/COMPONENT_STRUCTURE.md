# LoveQuest — Component Structure

> Current architecture + redesign targets. Every component listed, its file, its role, and what needs to change.

---

## 1. Current Tree

```
App                                     src/App.tsx
├── Spinner                             src/components/ui/index.tsx
│
├── LoginPage                           src/pages/LoginPage.tsx
│   └── CharacterSVG                   src/components/player/CharacterSVG.tsx
│
├── PlayerPage                          src/pages/PlayerPage.tsx
│   ├── PlayerNav                      src/components/player/PlayerNav.tsx
│   ├── PlayerHome        [tab=home]   src/components/player/PlayerHome.tsx
│   │   ├── CharacterSVG
│   │   ├── XPBar
│   │   ├── HPHearts
│   │   ├── Card (Active Skin)
│   │   ├── Card (Stats grid)
│   │   └── Card (Daily Quest) × N
│   │       └── Thumbnail, DiffBadge, Btn
│   ├── PlayerQuests      [tab=quests] src/components/player/PlayerQuests.tsx
│   └── PlayerScreens     [tab=...]   src/components/player/PlayerScreens.tsx
│
└── GMPage                              src/pages/GMPage.tsx
    ├── GMDashboard                    src/components/gm/GMDashboard.tsx
    ├── GMQuests                       src/components/gm/GMQuests.tsx
    └── GMScreens                      src/components/gm/GMScreens.tsx
```

### Shared UI Library (`src/components/ui/index.tsx`)

```
Spinner
XPBar
HPHearts
DiffBadge
Card
Btn        (primary | secondary | danger | ghost | gold | green) × (sm | md | lg)
SectionLabel
Modal      (bottom sheet)
Input
Textarea
Thumbnail
```

---

## 2. Target Tree (Redesigned)

Changes are marked: `[NEW]`, `[UPDATED]`, `[SPLIT]`, `[KEPT]`

```
App                                     src/App.tsx                [UPDATED]
├── ErrorBoundary                       src/components/ErrorBoundary.tsx  [NEW]
├── Spinner                             src/components/ui/Spinner.tsx      [SPLIT]
│
├── LoginPage                           src/pages/LoginPage.tsx            [UPDATED]
│   ├── CharacterSVG                   src/components/player/CharacterSVG.tsx
│   └── LoginForm                      src/components/auth/LoginForm.tsx   [NEW]
│
├── PlayerPage                          src/pages/PlayerPage.tsx           [UPDATED]
│   ├── PlayerHeader                   src/components/player/PlayerHeader.tsx  [NEW]
│   │   ├── AvatarCircle              (name initial or photo)
│   │   ├── LevelBadge
│   │   └── NotificationBell         src/components/notifications/NotificationBell.tsx [NEW]
│   ├── PlayerNav                      src/components/player/PlayerNav.tsx [UPDATED]
│   ├── PlayerHome        [tab=home]   src/components/player/PlayerHome.tsx [UPDATED]
│   │   ├── HeroSection              src/components/player/HeroSection.tsx  [NEW]
│   │   │   ├── CharacterSVG         (breathing animation)
│   │   │   ├── XPBar
│   │   │   └── HPHearts
│   │   ├── ActiveSkinCard           src/components/player/ActiveSkinCard.tsx [NEW]
│   │   ├── StatsGrid                src/components/player/StatsGrid.tsx   [NEW]
│   │   └── QuestList                src/components/player/QuestList.tsx   [NEW]
│   │       └── QuestCard            src/components/player/QuestCard.tsx   [NEW]
│   │           └── HoldToComplete   (press-hold confirm gesture)          [NEW]
│   ├── PlayerQuests      [tab=quests] src/components/player/PlayerQuests.tsx [KEPT]
│   ├── PlayerSkins       [tab=skins]  src/components/player/PlayerSkins.tsx  [SPLIT from PlayerScreens]
│   │   └── SkinCard                 src/components/player/SkinCard.tsx    [NEW]
│   ├── PlayerShop        [tab=shop]   src/components/player/PlayerShop.tsx   [SPLIT]
│   │   └── ShopItemCard             src/components/player/ShopItemCard.tsx [NEW]
│   ├── AccessoriesScreen [tab=items] src/components/player/AccessoriesScreen.tsx [NEW]
│   │   └── AccessoryCard            src/components/player/AccessoryCard.tsx [NEW]
│   └── NotificationsScreen [tab=notifs] src/components/notifications/NotificationsScreen.tsx [NEW]
│       └── NotificationItem         src/components/notifications/NotificationItem.tsx [NEW]
│
├── GMPage                              src/pages/GMPage.tsx               [UPDATED]
│   ├── GMHeader                       src/components/gm/GMHeader.tsx      [NEW]
│   ├── GMDashboard                    src/components/gm/GMDashboard.tsx   [UPDATED]
│   │   ├── PlayerSummaryCard         [NEW]
│   │   └── PendingApprovalList       [NEW]
│   │       └── PendingQuestCard      [NEW]
│   ├── GMQuests                       src/components/gm/GMQuests.tsx      [UPDATED]
│   │   ├── QuestCreationForm         [NEW]
│   │   └── GMQuestCard               [NEW]
│   ├── GMScreens                      src/components/gm/GMScreens.tsx     [UPDATED]
│   └── GMAccessoryManager             src/components/gm/GMAccessoryManager.tsx [NEW]
│
└── NotificationCenter                  src/components/notifications/NotificationCenter.tsx [NEW]
    ├── NotificationBell              (header icon + unread badge)
    ├── NotificationDrawer            (bottom sheet list)
    └── NotificationToast             (real-time pop-up)
```

---

## 3. Component Specs

### `HeroSection` [NEW]

The most emotionally important screen in the app. The player sees this first.

```
┌─────────────────────────────────┐
│  [E]  The Princess    LVL 7     │  ← name + level badge
│       Radiant Warrior           │  ← active title
│                        [SVG]    │  ← CharacterSVG right-aligned, breathing
│                                 │
│  ▓▓▓▓▓▓▓▓▓░░░░░░░░  1,240/2,000│  ← XPBar
│                                 │
│  HP: ♥♥♥♥♡              3/5    │  ← HPHearts
└─────────────────────────────────┘
```

Props:
- `state: PlayerState`
- `activeSkin: Skin | null`
- `activeTitle: Title | null`

### `QuestCard` [NEW]

Extracted from `PlayerHome`. Adds hold-to-complete gesture.

```
┌──────────────────────────────────┐
│  [IMG]  Quest Name               │
│         [EASY] +50 XP  ·  2h    │
│                        [REPORT]  │  ← hold 0.8s to confirm
└──────────────────────────────────┘
```

States: idle → holding (progress ring) → submitted → pending → approved/rejected

### `NotificationBell` [NEW]

```
🔔  (3)    ← red badge, top-right of icon
```

Tapping opens `NotificationDrawer` as a bottom sheet.

### `NotificationDrawer` [NEW]

Bottom sheet (`Modal` variant) listing all notifications, sorted by recency.

```
┌────────────────────────────────┐
│  Notifications           ✕    │
│  ─────────────────────────    │
│  ★ You leveled up! → Lvl 8   │  ← tap navigates to Home
│  ✦ New quest: Morning Walk   │  ← tap navigates to Quests
│  ♥ +120 XP received          │  ← tap navigates to Home
└────────────────────────────────┘
```

### `CharacterSVG` [UPDATED]

Add breathing animation and accessory overlay slots.

```typescript
interface CharacterSVGProps {
  skinType?: SkinType;
  size?: number;
  animate?: boolean;         // breathing
  equipped?: {               // future: accessory overlay
    earring?: Accessory;
    necklace?: Accessory;
    ring?: Accessory;
  };
}
```

---

## 4. UI Library Refactor Targets

Split `src/components/ui/index.tsx` (currently one 220-line mega-file) into:

```
src/components/ui/
├── index.ts            re-export barrel
├── Spinner.tsx
├── XPBar.tsx
├── HPHearts.tsx
├── DiffBadge.tsx
├── Card.tsx
├── Btn.tsx
├── SectionLabel.tsx
├── Modal.tsx
├── Input.tsx
├── Textarea.tsx
├── Thumbnail.tsx
├── Toast.tsx           [NEW] ephemeral notification pop-up
├── Skeleton.tsx        [NEW] shimmer loading placeholder
└── EmptyState.tsx      [NEW] empty list with illustration + message
```

---

## 5. Hook Inventory

```
src/hooks/
├── useAuth.ts          [KEPT]    Auth state + login/signup/logout
├── usePlayer.ts        [KEPT]    PlayerState, quests, completions, skins
├── useGM.ts            [KEPT]    GM-side data management
├── useAccessories.ts   [NEW]     Accessories inventory + equip/unequip
└── useNotifications.ts [NEW]     Notification list + real-time subscription
```

---

## 6. Page Layout Contract

Every page follows this shell:

```tsx
<div className="page">           // height: 100dvh, flex-col, overflow-hidden
  <Header />                     // optional fixed header
  <div className="scroll">       // flex:1, overflow-y:auto, -webkit-overflow-scrolling:touch
    {/* screen content */}
  </div>
  <BottomNav />                  // fixed bottom, safe-area-inset-bottom
</div>
```

This is already enforced by the `.page` and `.scroll` CSS classes. All new screens must follow this pattern.
