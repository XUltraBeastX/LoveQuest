# LoveQuest — User Flows

> Complete flow diagrams for both roles: Player (The Princess) and GM (Game Master / Roee).

---

## 1. Auth Flow

```
App Load
    │
    ▼
useAuth() resolves
    │
    ├─── loading=true ──────────────► Spinner (full screen)
    │
    ├─── user=null ─────────────────► LoginPage
    │        │
    │        ├─── "Log in" tab ──────► onLogin(email, pw)
    │        │                              │
    │        │                    success ──┤── App re-renders with user
    │        │                    error ────┤── Error message inline
    │        │
    │        └─── "Sign up" tab ────► onSignup(email, pw, name, role)
    │                                       │
    │                               success ┤── App re-renders with user
    │                               error ──┤── Error message inline
    │
    ├─── user.role='gm' ────────────► GMPage
    │
    └─── user.role='player' ────────► PlayerPage
```

---

## 2. Player Flow (The Princess)

### 2a. Tab Navigation

```
PlayerPage
    │
    ├─── [Home]    ──► PlayerHome
    │                      │
    │                      ├─── Hero section (avatar, name, level, XP, HP)
    │                      ├─── Active Skin display
    │                      ├─── Stats grid (from active Title)
    │                      └─── Daily Quests list
    │                               │
    │                               └─── Quest Card
    │                                       │
    │                                       ├─── status=none ────► [Report done] button
    │                                       ├─── status=pending ─► Clock icon + "Pending"
    │                                       └─── status=approved ► Green checkmark
    │
    ├─── [Quests]  ──► PlayerQuests
    │                      │
    │                      ├─── Daily quests tab
    │                      └─── Challenge quests tab
    │
    ├─── [Skins]   ──► PlayerScreens (skins tab)
    │                      │
    │                      ├─── Owned skins inventory
    │                      └─── Equip / unequip action
    │
    ├─── [Shop]    ──► PlayerScreens (shop tab)
    │                      │
    │                      ├─── Available items list
    │                      └─── Purchase with XP
    │
    └─── [Alerts]  ──► Notifications list
                           │
                           └─── Mark as read
```

### 2b. Quest Completion Flow

```
Player taps [Report done] on a Quest
    │
    ▼
onQuestDone(quest_id) called
    │
    ▼
QuestCompletion inserted → status='pending'
    │
    ▼
UI updates quest card → shows Clock + "Pending"
    │
    ▼
GM receives notification (real-time)
    │
    ├─── GM approves ──► status='approved'
    │                       │
    │                       ├─── XP credited to player
    │                       ├─── Player sees green checkmark
    │                       └─── Player receives notification
    │
    └─── GM rejects ───► status='rejected'
                            │
                            └─── Quest resets to claimable
```

### 2c. Level Up Flow

```
XP credited (from quest approval)
    │
    ▼
current_xp >= xp_to_next_level
    │
    ▼
current_level++, xp resets
    │
    ├─── Notification: type='lvl_up' ──► Player sees level up toast
    │
    └─── New Title unlocked? ─────────► Title granted, notification sent
```

---

## 3. GM Flow (Roee)

### 3a. GM Dashboard

```
GMPage
    │
    ├─── [Dashboard]  ──► GMDashboard
    │                         │
    │                         ├─── Player overview (level, XP, HP)
    │                         ├─── Pending quest approvals list
    │                         │         │
    │                         │         └─── [Approve] / [Reject] per quest
    │                         └─── Recent activity feed
    │
    ├─── [Quests]     ──► GMQuests
    │                         │
    │                         ├─── Active quests list
    │                         ├─── [+ Create Quest] ──► Quest creation form
    │                         └─── Quest management (edit, delete, toggle active)
    │
    └─── [Screens]    ──► GMScreens
                              │
                              ├─── Skins management
                              ├─── Shop management
                              ├─── Titles management
                              └─── Player state override (XP, HP adjustments)
```

### 3b. Quest Creation Flow

```
GM taps [+ Create Quest]
    │
    ▼
Quest form opens (modal or inline)
    ├─── name (required)
    ├─── description
    ├─── type: daily | challenge
    ├─── difficulty: easy | medium | hard | legendary
    ├─── xp_reward
    ├─── deadline (optional)
    └─── image (optional, AI-generated via aiImages.ts)
    │
    ▼
Submit → Quest inserted to DB
    │
    ▼
Player receives notification: type='quest_assigned'
    │
    ▼
Quest appears in Player's quest list immediately (real-time)
```

### 3c. Skin Grant Flow

```
GM opens Skins tab
    │
    ▼
GM creates or selects a Skin
    │
    ▼
[Grant to Player] action
    │
    ▼
Skin added to player's inventory
    │
    ▼
Notification sent: type='quest_assigned' (or skin-specific type)
    │
    ▼
Player sees skin in their Skins tab
```

---

## 4. Real-Time Events Matrix

| Trigger | Who acts | Who receives notification | Notification type |
|---------|----------|--------------------------|-------------------|
| Player reports quest done | Player | GM (pending approval badge) | — |
| GM approves quest | GM | Player | `quest_assigned` (XP granted) |
| GM rejects quest | GM | Player | — |
| Player levels up | System | Player | `lvl_up` |
| GM grants skin | GM | Player | `quest_assigned` |
| GM grants item | GM | Player | `purchase_confirmed` |
| Skin worn too long | System timer | Player | `skin_warning` |
| HP drops | System | Player | `hp_drop` |
| Quest deadline passes | System | Player | `quest_expired` |

---

## 5. Desired UX Improvements (Flow Layer)

### Current Pain Points

1. **No onboarding** — first-time user lands directly on empty quest list with no guidance.
2. **No offline state handling** — Supabase errors surface as silent failures.
3. **Quest report is one-tap with no confirmation** — easy to misfire on mobile.
4. **Notification tab is passive** — no way to act on notifications from within the list.
5. **Shop has no cart** — single-tap purchase with no review step.

### Proposed Flow Enhancements

| Enhancement | Impact | Priority |
|-------------|--------|----------|
| Add press-and-hold confirm on "Report done" | Prevents accidental triggers | High |
| Add empty state illustrations with guidance text | New user orientation | Medium |
| Add success micro-animation on quest completion | Satisfying feedback loop | High |
| Actionable notifications (tap → navigate to relevant screen) | Reduce steps | Medium |
| XP gain floating number animation (+50 XP pops up, floats away) | Delight | High |
| Level up full-screen celebration moment | Delight / milestone feeling | High |
| HP drop alert banner | Urgency, emotional weight | Medium |
