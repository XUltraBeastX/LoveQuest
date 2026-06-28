-- ============================================
-- LoveQuest Database Schema
-- Run this in Supabase SQL Editor (supabase.com → your project → SQL Editor)
-- ============================================

-- 1. Users table
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null check (role in ('gm', 'player')),
  display_name text not null,
  created_at timestamptz default now()
);

-- 2. Player state (XP, level, HP, active skin/title)
create table public.player_state (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade not null,
  current_xp int default 0,
  current_level int default 1,
  xp_to_next_level int default 1000,
  hp int default 5 check (hp >= 0 and hp <= 5),
  active_skin_id uuid,
  active_title_id uuid,
  skin_equipped_at timestamptz,
  created_at timestamptz default now()
);

-- 3. Quests
create table public.quests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  xp_reward int not null default 50,
  type text not null check (type in ('daily', 'challenge')) default 'daily',
  deadline date,
  active boolean default true,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- 4. Quest completions
create table public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid references public.quests(id) on delete cascade not null,
  player_id uuid references public.users(id) on delete cascade not null,
  status text not null check (status in ('pending', 'approved', 'rejected')) default 'pending',
  reported_at timestamptz default now(),
  approved_at timestamptz,
  xp_granted int
);

-- 5. Skins
create table public.skins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('ld', 'princess', 'nature', 'healing', 'combat', 'custom')) default 'custom',
  stat_bonuses jsonb default '{}',
  flavor_text text,
  warning_threshold_days int,
  hp_effect_per_day numeric default 0,
  unlock_condition text check (unlock_condition in ('gm_gift', 'lvl_up', 'shop_purchase')) default 'gm_gift',
  equippable_by text check (equippable_by in ('player', 'gm', 'both')) default 'both',
  owned_by_player boolean default false,
  created_at timestamptz default now()
);

-- 6. Titles
create table public.titles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  attributes jsonb default '{}',
  flavor_text text,
  unlock_condition text check (unlock_condition in ('gm_grant', 'lvl_up')) default 'gm_grant',
  granted_at_level int,
  owned_by_player boolean default false,
  created_at timestamptz default now()
);

-- 7. Shop items
create table public.shop_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  xp_price int not null,
  type text not null check (type in ('real_reward', 'cosmetic', 'ability')) default 'real_reward',
  stock int,
  active boolean default true,
  created_at timestamptz default now()
);

-- 8. Purchases
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade not null,
  item_id uuid references public.shop_items(id) on delete cascade not null,
  xp_spent int not null,
  purchased_at timestamptz default now()
);

-- 9. Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid references public.users(id) on delete cascade not null,
  type text not null check (type in ('lvl_up', 'quest_assigned', 'gm_message', 'skin_warning', 'purchase_confirmed')),
  title text not null,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- 10. XP log
create table public.xp_log (
  id uuid primary key default gen_random_uuid(),
  player_id uuid references public.users(id) on delete cascade not null,
  amount int not null,
  reason text not null,
  reference_id uuid,
  created_at timestamptz default now()
);


-- ============================================
-- Row Level Security (RLS)
-- ============================================

alter table public.users enable row level security;
alter table public.player_state enable row level security;
alter table public.quests enable row level security;
alter table public.quest_completions enable row level security;
alter table public.skins enable row level security;
alter table public.titles enable row level security;
alter table public.shop_items enable row level security;
alter table public.purchases enable row level security;
alter table public.notifications enable row level security;
alter table public.xp_log enable row level security;

-- Helper function: is this user a GM?
create or replace function public.is_gm()
returns boolean as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'gm'
  );
$$ language sql security definer;

-- Users: read own row, GMs read all
create policy "Users read own" on public.users for select using (id = auth.uid() or public.is_gm());
create policy "Users insert own" on public.users for insert with check (id = auth.uid());

-- Player state
create policy "Player read own state" on public.player_state for select using (player_id = auth.uid() or public.is_gm());
create policy "GM manage state" on public.player_state for all using (public.is_gm());
create policy "Player insert own state" on public.player_state for insert with check (player_id = auth.uid());

-- Quests
create policy "Player read active quests" on public.quests for select using (active = true or public.is_gm());
create policy "GM manage quests" on public.quests for all using (public.is_gm());

-- Quest completions
create policy "Player read own completions" on public.quest_completions for select using (player_id = auth.uid() or public.is_gm());
create policy "Player report completion" on public.quest_completions for insert with check (player_id = auth.uid());
create policy "GM manage completions" on public.quest_completions for all using (public.is_gm());

-- Skins
create policy "Player read owned skins" on public.skins for select using (owned_by_player = true or public.is_gm());
create policy "GM manage skins" on public.skins for all using (public.is_gm());

-- Titles
create policy "Player read owned titles" on public.titles for select using (owned_by_player = true or public.is_gm());
create policy "GM manage titles" on public.titles for all using (public.is_gm());

-- Shop items
create policy "Player read active items" on public.shop_items for select using (active = true or public.is_gm());
create policy "GM manage shop" on public.shop_items for all using (public.is_gm());

-- Purchases
create policy "Player own purchases" on public.purchases for select using (player_id = auth.uid() or public.is_gm());
create policy "Player buy" on public.purchases for insert with check (player_id = auth.uid());
create policy "GM manage purchases" on public.purchases for all using (public.is_gm());

-- Notifications
create policy "Read own notifications" on public.notifications for select using (recipient_id = auth.uid() or public.is_gm());
create policy "Update own notifications" on public.notifications for update using (recipient_id = auth.uid());
create policy "GM send notifications" on public.notifications for insert with check (public.is_gm());

-- XP log
create policy "Player read own xp" on public.xp_log for select using (player_id = auth.uid() or public.is_gm());
create policy "GM manage xp log" on public.xp_log for all using (public.is_gm());


-- ============================================
-- Enable Realtime
-- ============================================
alter publication supabase_realtime add table player_state;
alter publication supabase_realtime add table quest_completions;
alter publication supabase_realtime add table notifications;
