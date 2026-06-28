import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { PlayerState, Quest, QuestCompletion, Skin, Title, Notification } from '../types';

export function usePlayer(playerId: string | undefined) {
  const [state,         setState]         = useState<PlayerState | null>(null);
  const [quests,        setQuests]         = useState<Quest[]>([]);
  const [completions,   setCompletions]    = useState<QuestCompletion[]>([]);
  const [activeSkin,    setActiveSkin]     = useState<Skin | null>(null);
  const [activeTitle,   setActiveTitle]    = useState<Title | null>(null);
  const [notifications, setNotifications]  = useState<Notification[]>([]);
  const [loading,       setLoading]        = useState(true);

  const fetchAll = useCallback(async () => {
    if (!playerId) return;
    const [stateRes, questRes, compRes, notifRes] = await Promise.all([
      supabase.from('player_state').select('*').eq('player_id', playerId).single(),
      supabase.from('quests').select('*').eq('active', true).order('created_at', { ascending: false }),
      supabase.from('quest_completions').select('*').eq('player_id', playerId),
      supabase.from('notifications').select('*').eq('recipient_id', playerId).order('created_at', { ascending: false }).limit(30),
    ]);
    if (stateRes.data) {
      const s = stateRes.data as PlayerState;
      setState(s);
      if (s.active_skin_id) {
        const { data: skin } = await supabase.from('skins').select('*').eq('id', s.active_skin_id).single();
        setActiveSkin(skin as Skin);
      } else setActiveSkin(null);
      if (s.active_title_id) {
        const { data: title } = await supabase.from('titles').select('*').eq('id', s.active_title_id).single();
        setActiveTitle(title as Title);
      } else setActiveTitle(null);
    }
    if (questRes.data)  setQuests(questRes.data as Quest[]);
    if (compRes.data)   setCompletions(compRes.data as QuestCompletion[]);
    if (notifRes.data)  setNotifications(notifRes.data as Notification[]);
    setLoading(false);
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;
    fetchAll();

    const ch = supabase.channel('player-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_state', filter: `player_id=eq.${playerId}` }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quest_completions', filter: `player_id=eq.${playerId}` }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${playerId}` }, fetchAll)
      .subscribe();

    return () => { supabase.removeChannel(ch); };
  }, [playerId, fetchAll]);

  async function reportQuestDone(questId: string) {
    const already = completions.find(c => c.quest_id === questId && c.status === 'pending');
    if (already) return;
    await supabase.from('quest_completions').insert({
      quest_id: questId, player_id: playerId, status: 'pending',
    });
    fetchAll();
  }

  async function markNotificationRead(id: string) {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    state, quests, completions, activeSkin, activeTitle,
    notifications, unreadCount, loading,
    reportQuestDone, markNotificationRead, refetch: fetchAll,
  };
}
