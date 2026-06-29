# LoveQuest — Redesign Principles

> The "why" behind every design decision. Read this before touching any component.

---

## The App's Emotional Core

LoveQuest is a two-person game built on intimacy and motivation. The Player (The Princess) should feel:
- **Seen** — her progress is celebrated, her character is hers
- **Motivated** — quests feel achievable, rewards feel earned
- **Delighted** — small moments of joy scattered throughout (animations, sparkles, surprises)

The GM (Roee) should feel:
- **In control** — clear, fast tools to manage quests, rewards, approvals
- **Connected** — can see his partner's state at a glance
- **Powerful but warm** — GM interface is dark and purposeful, not cold

---

## Principle 1: Every Interaction Earns Its Feel

**Bad:** Tap a button, something changes, move on.  
**Good:** Tap a button → button shrinks (0.96 scale) → releases with spring → XP number floats up → bar fills with glow.

Every meaningful action needs a physical, satisfying response. The app runs on a phone held in hand — use that.

### Implementation:
- All `Btn` components already have `onPointerDown/Up` scale. Keep this everywhere.
- Quest completion → hold-to-confirm (0.8s) with progress ring, then burst animation
- XP gain → floating `+N XP` text that rises and fades over 0.6s
- Level up → full-screen celebration (stars, pulse, level number zooms in)
- HP drop → subtle red pulse on the hearts

---

## Principle 2: Tailwind Over Inline Styles

**Current state:** Every component has `style={{ ... }}` objects. Tailwind is installed but unused.

**Target state:** All layout, color, and spacing uses Tailwind utility classes. Inline styles only for dynamic values (e.g., `style={{ width: `${pct}%` }}`).

### Why this matters:
- Inline style objects are recreated on every render (minor perf)
- Inconsistent spacing — `padding: '12px 20px'` vs `padding: '16px 20px'` in adjacent components
- Tailwind enforces the design system scale automatically
- Much easier to see layout intent at a glance

### Migration strategy:
1. Start with new components — write them in Tailwind from day one
2. When touching an existing component for any reason, migrate its styles
3. Do NOT do a mass find-replace without testing on device

### Tailwind class reference for this project:
```
bg-[--color-bg]             → main background
bg-[--color-surface]        → nav, header surface
bg-[--color-card]           → card backgrounds
border-[--color-border]     → standard borders
text-[--color-text]         → primary text
text-[--color-text-muted]   → secondary text
text-[--color-accent-lit]   → highlighted/active text
rounded-2xl                 → 16px (cards)
rounded-3xl                 → 24px (modals)
rounded-full                → pills, avatars
p-4                         → 16px padding
px-5                        → 20px horizontal
gap-3                       → 12px gap
```

---

## Principle 3: The Player's Screen Is a Stage

The home tab is where the player spends most of her time. It should feel like opening a storybook — not a dashboard.

### Hero section rules:
- Character SVG must breathe (subtle 3s animation, scale 1→1.02)
- Enough vertical space that the character feels present, not cramped
- XP bar has a glow at its leading edge — progress feels alive
- HP hearts have weight — losing one should feel significant, gaining one should feel good
- Level badge is a celebration, not just a label

### Quest list rules:
- Quest cards have left-border accent (color = difficulty color)
- Completed quests get a green shimmer sweep
- "Report done" is not a casual tap — it's a commitment, so hold-to-confirm
- Pending state has a subtle pulse animation to communicate "waiting"

---

## Principle 4: The GM Interface Is Efficient, Not Pretty

Roee uses the GM view to manage, approve, and control. His needs:
- Fast approval of pending quests (max 2 taps)
- Quick overview of his partner's current state
- No friction when creating quests

GM interface should feel like a professional tool with warmth — the dark green palette is right. Keep it, but make it cleaner and faster.

### GM rules:
- Pending approvals always visible first on dashboard — never buried
- One-tap approve/reject (confirm via haptic, not alert dialog)
- Quest creation form auto-focuses first field
- GM can see real-time when player is active (future)

---

## Principle 5: iPhone-Native Patterns Only

This is a PWA installed on iPhone home screen. It must feel like a native app.

### Do:
- Bottom tab navigation (already correct)
- Bottom sheets for modals (already correct)
- Safe area insets everywhere (mostly correct — audit all screens)
- `100dvh` for height (already correct)
- Hold/press-and-hold gestures for destructive or important actions
- Haptic feedback: `navigator.vibrate(10)` on meaningful actions
- iOS-style spring physics on animations: `cubic-bezier(0.34, 1.56, 0.64, 1)`

### Don't:
- Top-center modals (feels like web)
- Hover states (pointless on touch)
- Horizontal scroll for navigation
- Alert/confirm dialogs from the browser (use inline confirm patterns instead)
- Underlined links (use buttons or chips)

---

## Principle 6: Performance Is Non-Negotiable

The app is loaded daily, probably first thing in the morning. It must feel instant.

### Rules:
- No layout shift on load — skeleton screens for async content
- Supabase queries should be pre-fetched in hooks, not on render
- Images lazy-load with `Thumbnail` placeholder shown until loaded
- No heavy animation libraries — CSS only
- Character SVG is inline (already is) — no network request

---

## Priority Queue for Redesign Work

In order of player-visible impact:

| Priority | Work | Effort |
|----------|------|--------|
| 1 | Hold-to-complete gesture on QuestCard | M |
| 2 | XP float animation (`+N XP` on approve) | S |
| 3 | Level up celebration screen | M |
| 4 | CharacterSVG breathing animation | S |
| 5 | Hero section padding + radial glow | S |
| 6 | Skeleton loading states for quest list | M |
| 7 | NotificationBell in header (replace tab) | M |
| 8 | HP hearts pulse animation on change | S |
| 9 | Empty state illustrations | M |
| 10 | Tailwind migration (start new components) | L (ongoing) |

S = Small (< 2h), M = Medium (2–4h), L = Large (days, ongoing)
