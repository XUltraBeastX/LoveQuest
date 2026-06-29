# LoveQuest — Design System

> The single source of truth for colors, typography, spacing, motion, and component conventions.

---

## 1. Color Tokens

All tokens live in `src/index.css` under `@theme`. Use them as CSS variables everywhere.

### Player Theme (Dark Purple)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#130d2e` | Page background |
| `--color-surface` | `#1e1547` | Cards, nav bar surface |
| `--color-card` | `#261c56` | Quest cards, list items |
| `--color-border` | `#3d2f7a` | Card borders, dividers |
| `--color-border-dim` | `#2a2060` | Subtle separators |

### Accent — Purple

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent` | `#7c5cbf` | Primary actions, level badge |
| `--color-accent-lit` | `#9d7fe0` | Active states, XP bar fill, highlights |
| `--color-accent-dim` | `#4a3880` | Avatar gradient start |

### Accent — Gold

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gold` | `#f0c040` | XP rewards, legendary items |
| `--color-gold-dim` | `#c89a20` | Gold button gradient start |

### Status Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-green` | `#4caf72` | Completed quests, GM approvals |
| `--color-green-dark` | `#1a3d28` | Green card background |
| `--color-green-dim` | `#2a5c38` | Green button gradient start |
| `--color-heart` | `#e05070` | HP hearts filled |
| `--color-heart-off` | `#3d2040` | HP hearts empty |
| `--color-warn` | `#c84030` | Danger border |
| `--color-warn-bg` | `#3a1010` | Danger card background |

### Difficulty Palette

| Token | Value | Difficulty |
|-------|-------|------------|
| `--color-easy` | `#4caf72` | Easy |
| `--color-medium` | `#f0c040` | Medium |
| `--color-hard` | `#e07830` | Hard |
| `--color-legendary` | `#e040b0` | Legendary |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `--color-text` | `#e8deff` | Primary body text |
| `--color-text-muted` | `#8878b8` | Labels, captions, secondary info |
| `--color-text-dim` | `#5a4f88` | Placeholder text, empty states |

### GM Theme (Dark Green)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-gm-bg` | `#0a0f14` | GM page background |
| `--color-gm-card` | `#111820` | GM card surface |
| `--color-gm-border` | `#1e3028` | GM card borders |
| `--color-gm-green` | `#4caf72` | GM accent green |
| `--color-gm-text` | `#a0c8a8` | GM body text |

### Login Theme (Light Purple)

The login page uses a separate palette via CSS custom properties scoped inline:

| Variable | Value |
|----------|-------|
| `--color-p-accent` | approx `#7b5ea7` |
| `--color-p-border` | light lilac |
| `--color-p-text` | dark purple |
| `--color-p-muted` | medium purple-gray |
| `--color-p-warn` | warm red |

**Action:** These should be moved into the global `@theme` block with a `login-` prefix for maintainability.

---

## 2. Typography

Font stack (currently set in `body`):
```
-apple-system, "SF Pro Rounded", BlinkMacSystemFont, "Segoe UI", sans-serif
```

On iPhone this renders as **SF Pro Rounded** — the ideal choice for a playful, warm RPG app.

### Scale

| Role | Size | Weight | Token |
|------|------|--------|-------|
| Page title | 28px | 800 | — |
| Section heading | 18px | 700 | — |
| Card title | 14–16px | 600–700 | — |
| Body | 13–14px | 400–500 | — |
| Label / badge | 10–11px | 600–700 | — |
| Micro / caption | 9–10px | 500–700 | — |

**Action:** Formalize these as `@theme` font-size tokens (`--text-xs`, `--text-sm`, etc.) so sizes are consistent across components.

### Letter Spacing

- Section labels: `letter-spacing: 1.5px` + `text-transform: uppercase` — used consistently, keep it.
- Badges: `letter-spacing: 0.5px`
- Page title: `letter-spacing: -1px` — used on login, makes large text feel premium.

---

## 3. Spacing Scale

Currently ad-hoc (16px, 20px, 24px, 12px used interchangeably). Proposed base-8 scale:

| Name | Value | Usage |
|------|-------|-------|
| `space-1` | 4px | Micro gaps (icon + label) |
| `space-2` | 8px | Tight gaps between grouped items |
| `space-3` | 12px | Standard gap |
| `space-4` | 16px | Section padding |
| `space-5` | 20px | Page horizontal padding |
| `space-6` | 24px | Between sections |
| `space-8` | 32px | Large section breaks |

---

## 4. Border Radius

| Name | Value | Usage |
|------|-------|-------|
| `radius-sm` | 8px | Thumbnails, small badges |
| `radius-md` | 12px | Buttons, inputs |
| `radius-lg` | 16px | Cards |
| `radius-xl` | 24px | Bottom sheets, modals |
| `radius-full` | 9999px | Pill badges, avatar circles |

---

## 5. Shadows & Elevation

| Level | Value | Usage |
|-------|-------|-------|
| Button primary | `0 2px 12px rgba(124,92,191,0.4)` | Purple buttons |
| Button gold | `0 2px 12px rgba(240,192,64,0.3)` | Gold buttons |
| XP bar glow | `0 0 8px rgba(157,127,224,0.6)` | Progress fill |
| Login button | `0 4px 16px rgba(123,94,167,0.4)` | CTA on login |

---

## 6. Animation Vocabulary

Defined in `src/index.css`:

| Name | Keyframe | Usage |
|------|----------|-------|
| `spin` | rotate 360deg | Loading spinner |
| `pop` | scale 0.8→1.05→1 + fade | Modals, toasts |
| `shimmer` | background-position sweep | Skeleton loaders |
| `pulse-glow` | gold box-shadow pulse | Legendary item highlight |

Classes: `.animate-pop`, `.animate-glow`

**Planned additions:**
- `breathe` — 3s ease-in-out scale(1→1.02) for character avatar
- `slide-up` — for bottom sheet entrance
- `fade-in` — for page transitions
- `bounce-in` — for XP reward celebration

### Motion Principles

1. **Spring on interactive elements** — buttons scale 0.96 on press, release with `cubic-bezier(0.34,1.56,0.64,1)`
2. **XP bar** — `0.8s cubic-bezier(0.34,1.56,0.64,1)` for satisfying fill animation
3. **Modals** — slide up from bottom (`align-items: flex-end`), `pop` animation
4. **Transitions** — keep at 0.2s for hover states, 0.3s for structural changes

---

## 7. Component Inventory

All shared components live in `src/components/ui/index.tsx`.

| Component | Purpose | Variants |
|-----------|---------|----------|
| `Spinner` | Loading state | — |
| `XPBar` | XP progress display | — |
| `HPHearts` | HP display | Configurable max |
| `DiffBadge` | Quest difficulty chip | easy, medium, hard, legendary |
| `Card` | Content container | clickable, static |
| `Btn` | Button | primary, secondary, danger, ghost, gold, green — sm/md/lg |
| `SectionLabel` | Section heading | — |
| `Modal` | Bottom sheet overlay | — |
| `Input` | Text field | With optional label |
| `Textarea` | Multi-line field | With optional label |
| `Thumbnail` | Image/placeholder | Configurable size + radius |

---

## 8. iPhone-Specific Conventions

- **Viewport**: `width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover`
- **Status bar**: `black-translucent` — content extends under status bar
- **Safe areas**: Always use `env(safe-area-inset-bottom)` for bottom nav padding
- **Height units**: `100dvh` for reliable full-screen (not `100vh`)
- **Scroll**: `-webkit-overflow-scrolling: touch` on `.scroll` class
- **Tap highlight**: Disabled globally (`-webkit-tap-highlight-color: transparent`)
- **Min tap target**: 44×44px (Apple HIG minimum) — all buttons must meet this
- **Overflow**: `overflow: hidden` on `html, body, #root` — each screen manages its own scroll

---

## 9. Known Issues / Debt

| Issue | Impact | Fix |
|-------|--------|-----|
| Tailwind installed but not used — all styling is inline | High maintenance burden, no responsive utilities | Migrate to Tailwind utility classes |
| Login theme variables not in global `@theme` | Duplicate token management | Consolidate |
| No formal spacing scale | Inconsistent padding/gap values | Add `@theme` space tokens |
| Inline `style={{...}}` objects recreated every render | Minor perf | Move to className-based Tailwind |
| No skeleton/loading states for async screens | Jarring UX on slow connections | Add shimmer skeletons |
| No error boundary | Unhandled crashes | Wrap pages in ErrorBoundary |
