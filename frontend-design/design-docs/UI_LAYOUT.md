# LoveQuest — UI Layout

> Screen-by-screen layout breakdown for every view in the app. All dimensions assume iPhone viewport (~390px wide).

---

## 1. Login Screen

**Current state:** Charming, good aesthetic. Minor polish needed.

```
┌──────────────────────────┐  ← 100svh
│  ✦        ✦      ✦      │  ← decorative sparkles (fixed, pointer-events:none)
│                          │
│                          │
│       [CharacterSVG]     │  ← 110px, centered
│                          │
│       LoveQuest          │  ← 28px, weight 800, letter-spacing -1
│  Your adventure begins ✨│  ← 13px muted
│                          │
│  ┌──────────────────┐    │
│  │  email           │    │  ← pill input, radius 16
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │  password        │    │
│  └──────────────────┘    │
│                          │
│  ┌──────────────────────┐│
│  │   Log in             ││  ← gradient purple, radius 18, shadow
│  └──────────────────────┘│
│                          │
│  Don't have an account?  │  ← toggle link
│                          │
│  ✦                  ✦   │
└──────────────────────────┘

Background: linear-gradient(160deg, #F0E0FF 0%, #EDE0FF 40%, #FAF5FF 100%)
```

**Redesign targets:**
- Add subtle particle/sparkle animation (CSS only, no library)
- Input fields: add focus ring with purple glow (currently just border color change)
- Button: add subtle shimmer sweep on mount to draw eye
- Error state: shake animation on form, not just red text

---

## 2. Player — Home Tab

**Current state:** Functional. Hero section needs more visual weight. Quest list is clean.

```
┌──────────────────────────┐  ← status bar (safe-area-inset-top)
│                          │
│  ╔══════════════════════╗│
│  ║  HERO SECTION        ║│  ← gradient bg: surface→bg
│  ║                      ║│
│  ║  [E]  The Princess   ║│  ← 48px avatar, 18px name, level badge
│  ║       Radiant Warrior ║│  ← 11px title, accent-lit
│  ║                 [SVG]║│  ← 80px CharacterSVG, right-aligned
│  ║                      ║│
│  ║  XP ▓▓▓▓▓░░░  62%   ║│  ← XPBar
│  ║  HP ♥♥♥♥♡            ║│  ← HPHearts
│  ╚══════════════════════╝│
│                          │
│  ACTIVE SKIN             │  ← SectionLabel
│  ┌──────────────────┐    │
│  │ Healing Aura     │    │  ← Card
│  │ +vitality boost  │    │
│  └──────────────────┘    │
│                          │
│  STATS                   │  ← SectionLabel
│  ┌────────┐ ┌────────┐  │
│  │ str 12 │ │ dex 8  │  │  ← 2-column grid Cards
│  └────────┘ └────────┘  │
│  ┌────────┐ ┌────────┐  │
│  │ wis 15 │ │ charm ★│  │
│  └────────┘ └────────┘  │
│                          │
│  DAILY QUESTS            │  ← SectionLabel
│  ┌──────────────────────┐│
│  │[IMG] Quest Name      ││  ← QuestCard
│  │      [EASY] +50 XP   ││
│  │                [DONE]││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │[IMG] Quest Name      ││
│  │      [HARD] +200 XP  ││
│  │            [REPORT]  ││  ← hold-to-confirm
│  └──────────────────────┘│
│                          │
│  ══════════════════════  │  ← bottom nav
│  🏠  ⚔️  👗  🛍️  🔔(3) │
└──────────────────────────┘
```

**Redesign targets:**
- Hero section: increase vertical padding, add radial glow behind character SVG
- Level badge: make it a proper pill with XP sub-label
- XP fill: add particles/sparkles at fill edge (CSS pseudo-element)
- Quest card "Report done" → replace with hold-to-complete (progress ring fills on hold)
- Approved quests: green glow on card left border, not just icon
- Empty quest state: illustrated empty state ("No quests yet — check back soon ✦")

---

## 3. Player — Quests Tab

```
┌──────────────────────────┐
│  Quests                  │  ← 16px header
│  ┌────────┐ ┌──────────┐ │
│  │ Daily  │ │Challenge │ │  ← segmented control
│  └────────┘ └──────────┘ │
│                          │
│  [Quest cards list]      │
│                          │
│  ── Bottom Nav ──────── │
└──────────────────────────┘
```

Same `QuestCard` as Home. Challenge quests may have deadline countdown.

---

## 4. Player — Skins Tab

```
┌──────────────────────────┐
│  My Skins                │
│                          │
│  ┌──────────────────────┐│  ← SkinCard (equipped)
│  │  Healing Aura  ✓ ON  ││  ← green "equipped" indicator
│  │  +vitality bonus     ││
│  │  [Unequip]           ││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│  ← SkinCard (owned, not equipped)
│  │  Combat Form         ││
│  │  +strength bonus     ││
│  │  [Equip]             ││
│  └──────────────────────┘│
│                          │
│  ── Bottom Nav ─────── │
└──────────────────────────┘
```

---

## 5. Player — Shop Tab

```
┌──────────────────────────┐
│  Shop                    │
│  💰 Balance: 1,240 XP   │  ← sticky balance display
│                          │
│  ┌──────────────────────┐│  ← ShopItemCard
│  │[IMG] Item Name       ││
│  │      Some desc       ││
│  │      500 XP  [Buy]   ││
│  └──────────────────────┘│
│                          │
│  ── Bottom Nav ──────── │
└──────────────────────────┘
```

**Redesign target:** Add XP balance sticky header so player always knows spending power.

---

## 6. Player — Notifications Tab

```
┌──────────────────────────┐
│  Notifications           │
│                          │
│  ┌──────────────────────┐│  ← NotificationItem (unread, accent-lit border)
│  │ ★ You leveled up!   ││
│  │   Reached Level 8   ││
│  │              2m ago ││
│  └──────────────────────┘│
│  ┌──────────────────────┐│  ← NotificationItem (read, dimmed)
│  │ ✦ New quest assigned ││
│  │   Morning Walk       ││
│  │             15m ago  ││
│  └──────────────────────┘│
│                          │
│  ── Bottom Nav ──────── │
└──────────────────────────┘
```

---

## 7. GM — Dashboard

**Theme:** Dark green (`--color-gm-*` tokens). Feels like a command center, not a game.

```
┌──────────────────────────┐
│  LoveQuest GM  ☰        │  ← GM header, hamburger or tab control
│  ─────────────────────── │
│                          │
│  PLAYER OVERVIEW         │
│  ┌──────────────────────┐│  ← PlayerSummaryCard
│  │  The Princess  Lv 7  ││
│  │  ▓▓▓▓░░ 1,240 XP     ││
│  │  ♥♥♥♥♡  HP: 4/5      ││
│  └──────────────────────┘│
│                          │
│  PENDING APPROVALS (2)   │
│  ┌──────────────────────┐│  ← PendingQuestCard
│  │ Morning Walk         ││
│  │ reported 5m ago      ││
│  │ [✓ Approve][✗ Reject]││
│  └──────────────────────┘│
│  ┌──────────────────────┐│
│  │ Evening Run          ││
│  │ reported 23m ago     ││
│  │ [✓ Approve][✗ Reject]││
│  └──────────────────────┘│
│                          │
└──────────────────────────┘
```

---

## 8. GM — Quest Management

```
┌──────────────────────────┐
│  Quests          [+ New] │  ← create button top right
│  ─────────────────────── │
│                          │
│  ┌──────────────────────┐│  ← GMQuestCard (active)
│  │ ● Morning Walk  EASY ││  ← green dot = active
│  │   +50 XP · Daily     ││
│  │   [Edit] [Deactivate]││
│  └──────────────────────┘│
│                          │
│  ┌──────────────────────┐│  ← GMQuestCard (inactive)
│  │ ○ Old Challenge HARD ││  ← gray dot = inactive
│  │   +400 XP · Challenge││
│  │   [Edit] [Activate]  ││
│  └──────────────────────┘│
│                          │
└──────────────────────────┘
```

Quest creation form (bottom sheet):

```
┌──────────────────────────┐
│  New Quest           ✕   │
│  ─────────────────────── │
│  Name __________________ │
│  Description ____________│
│  ______________________ │
│  Type:  [Daily] [Chall]  │
│  Diff:  [E][M][H][★]    │
│  XP:   [___________]    │
│  Deadline: [date picker] │
│  Image: [Generate AI]    │
│                          │
│  [Create Quest]          │
└──────────────────────────┘
```

---

## 9. Modal / Bottom Sheet

Shared pattern for all overlays.

```
╔══════════════════════════╗  ← backdrop: rgba(10,8,30,0.85) blur(6px)
║                          ║
║                          ║
║                          ║
╠══════════════════════════╣  ← sheet starts here, slide up
║  Title              ✕   ║  ← header
║  ─────────────────────  ║
║                          ║
║  [content]               ║
║                          ║
║                          ║
║     (safe area bottom)   ║
╚══════════════════════════╝
```

Border-radius: `24px 24px 0 0` on the sheet.
Max-height: `85dvh`.
Animation: `pop` (scale + fade) on mount.

---

## 10. Bottom Navigation Bar

```
┌──────────────────────────┐
│  🏠   ⚔️   👗   🛍️  🔔  │  ← 5 tabs
│  Home Q  Skin Shop Alert │  ← 9px labels
│       ─                  │  ← active underline indicator (2px, accent-lit)
└──────────────────────────┘
```

Height: `~56px + safe-area-inset-bottom`
Background: `--color-surface`
Border-top: `1px solid --color-border`

**Redesign target:** Replace text labels with icon-only on small phones. Add haptic feedback (navigator.vibrate) on tab change.

---

## 11. Overlay States (Toast Notifications)

Real-time GM actions trigger a toast at the top of the screen.

```
┌──────────────────────────┐
│  ╔════════════════════╗  │  ← toast, slides down from top
│  ║ ✦ Item Received!  ║  │
│  ║ Hoop Earrings ✨   ║  │
│  ╚════════════════════╝  │
│                          │
│  [screen content below]  │
└──────────────────────────┘
```

Auto-dismiss after 3s. Tap to dismiss early.
Animation: `slide-down` in, `fade-out` on dismiss.
