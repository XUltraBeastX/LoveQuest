import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PlayerState, Quest, QuestCompletion, Skin, ShopItem, User } from '../types';

export function useGM() {
  const [playerUser,   setPlayerUser]   = useState<User | null>(null);
  const [playerState,  setPlayerState]  = useState<PlayerState | null>(null);
  const [quests,       setQuests]       = useState<Quest[]>([]);
  const [completions,  setCompletions]  = useState<(QuestCompletion & { quest_name?: string })[]>([]);
  const [skins,        setSkins]        = useState<Skin[]>([]);
  const [shopItems,    setShopItems]    = useState<ShopItem[]>([]);
  const [loading,      setLoading]      = useState(true);

  const fetchAll = useCallback(async () => {
    const [userRes, stateRes, questRes, compRes, skinRes, shopRes] = await Promise.all([
      supabase.from('users').select('*').eq('role', 'player').single(),
      supabase.from('player_state').select('*').limit(1).single(),
      supabase.from('quests').select('*').order('created_at', { ascending: false }),
      supabase.from('quest_completions').select('*, quests(name)').eq('status', 'pending'),
      supabase.from('skins').select('*').order('created_at', { ascending: false }),
      supabase.from('shop_items').select('*').order('created_at', { ascending: false }),
    ]);
    if (userRes.data)  setPlayerUser(userRes.data as User);
    if (stateRes.data) setPlayerState(stateRes.data as PlayerState);
    if (questRes.data) setQuests(questRes.data as Quest[]);
    if (compRes.data)  setCompletions(compRes.data.map((c: any) => ({ ...c, quest_name: c.quests?.name })));
    if (skinRes.data)  setSkins(skinRes.data as Skin[]);
    if (shopRes.data)  setShopItems(shopRes.data as ShopItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const ch = supabase.channel('gm-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quest_completions' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_state' }, fetchAll)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchAll]);

  async function approveCompletion(comp: QuestCompletion) {
    const quest = quests.find(q => q.id === comp.quest_id);
    const xp = quest?.xp_reward || 0;
    await supabase.from('quest_completions')
      .update({ status: 'approved', approved_at: new Date().toISOString(), xp_granted: xp })
      .eq('id', comp.id);
    if (playerState) {
      const newXP = playerState.current_xp + xp;
      const levelUp = newXP >= playerState.xp_to_next_level;
      await supabase.from('player_state')
        .update({
          current_xp: levelUp ? newXP - playerState.xp_to_next_level : newXP,
          ...(levelUp ? {
            current_level: playerState.current_level + 1,
            xp_to_next_level: Math.round(playerState.xp_to_next_level * 1.2),
          } : {}),
        })
        .eq('id', playerState.id);
    }
    fetchAll();
  }

  async function rejectCompletion(id: string) {
    await supabase.from('quest_completions').update({ status: 'rejected' }).eq('id', id);
    fetchAll();
  }

  async function grantXP(amount: number) {
    if (!playerState) return;
    await supabase.from('player_state')
      .update({ current_xp: playerState.current_xp + amount })
      .eq('id', playerState.id);
    await supabase.from('xp_log').insert({
      player_id: playerState.player_id, amount, reason: 'gm_grant',
    });
    fetchAll();
  }

  async function sendNotification(recipientId: string, type: string, title: string, body: string) {
    await supabase.from('notifications').insert({ recipient_id: recipientId, type, title, body });
  }

  async function updatePlayerHP(delta: number) {
    if (!playerState) return;
    const hp = Math.max(0, Math.min(5, playerState.hp + delta));
    await supabase.from('player_state').update({ hp }).eq('id', playerState.id);
    fetchAll();
  }

  return {
    playerUser, playerState, quests, completions, skins, shopItems, loading,
    approveCompletion, rejectCompletion, grantXP, sendNotification, updatePlayerHP,
    refetch: fetchAll,
  };
}
