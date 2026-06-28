export interface User {
  id: string;
  email: string;
  role: 'gm' | 'player';
  display_name: string;
}

export interface PlayerState {
  id: string;
  player_id: string;
  current_xp: number;
  current_level: number;
  xp_to_next_level: number;
  hp: number;
  active_skin_id: string | null;
  active_title_id: string | null;
  skin_equipped_at: string | null;
}

export interface Quest {
  id: string;
  name: string;
  description: string | null;
  xp_reward: number;
  type: 'daily' | 'challenge';
  deadline: string | null;
  active: boolean;
  created_by: string;
  created_at: string;
}

export interface QuestCompletion {
  id: string;
  quest_id: string;
  player_id: string;
  status: 'pending' | 'approved' | 'rejected';
  reported_at: string;
  approved_at: string | null;
  xp_granted: number | null;
}

export interface Skin {
  id: string;
  name: string;
  type: 'ld' | 'princess' | 'nature' | 'healing' | 'combat' | 'custom';
  stat_bonuses: Record<string, number>;
  flavor_text: string | null;
  warning_threshold_days: number | null;
  hp_effect_per_day: number;
  unlock_condition: 'gm_gift' | 'lvl_up' | 'shop_purchase';
  equippable_by: 'player' | 'gm' | 'both';
  owned_by_player: boolean;
}

export interface Title {
  id: string;
  name: string;
  attributes: Record<string, number | string>;
  flavor_text: string | null;
  unlock_condition: 'gm_grant' | 'lvl_up';
  granted_at_level: number | null;
  owned_by_player: boolean;
}

export interface Accessory {
  id: string;
  name: string;
  type: 'earring' | 'necklace' | 'ring';
  icon_style: 'style1' | 'style2' | 'style3' | 'style4' | 'style5' | 'style6' | 'style7';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: Record<string, number>;
  created_at: string;
}

export interface PlayerAccessory {
  id: string;
  player_id: string;
  accessory_id: string;
  equipped: boolean;
  granted_at: string;
  equipped_at: string | null;
  accessory?: Accessory; // joined
}

export interface Notification {
  id: string;
  recipient_id: string;
  type: 'lvl_up' | 'quest_assigned' | 'gm_message' | 'skin_warning' | 'purchase_confirmed' | 'gm_gift';
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}
