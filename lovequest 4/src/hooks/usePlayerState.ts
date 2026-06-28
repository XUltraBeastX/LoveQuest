import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { PlayerState, Quest, QuestCompletion } from '../types';

export function usePlayerState(playerId: string | undefined) {
  const [state, setState] = useState<PlayerState | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completions, setCompletions] = useState<QuestCompletion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!playerId) return;

    // Fetch initial data
    fetchAll();

    // Subscribe to realtime changes on player_state
    const stateChannel = supabase
      .channel('player-state')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'player_state',
        filter: `player_id=eq.${playerId}`,
      }, (payload) => {
        if (payload.new) setState(payload.new as PlayerState);
      })
      .subscribe();

    // Subscribe to quest completions
    const completionChannel = supabase
      .channel('quest-completions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'quest_completions',
        filter: `player_id=eq.${playerId}`,
      }, () => {
        fetchCompletions();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(stateChannel);
      supabase.removeChannel(completionChannel);
    };
  }, [playerId]);

  async function fetchAll() {
    if (!playerId) return;
    await Promise.all([fetchState(), fetchQuests(), fetchCompletions()]);
    setLoading(false);
  }

  async function fetchState() {
    const { data } = await supabase
      .from('player_state')
      .select('*')
      .eq('player_id', playerId!)
      .single();
    if (data) setState(data as PlayerState);
  }

  async function fetchQuests() {
    const { data } = await supabase
      .from('quests')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    if (data) setQuests(data as Quest[]);
  }

  async function fetchCompletions() {
    const { data } = await supabase
      .from('quest_completions')
      .select('*')
      .eq('player_id', playerId!);
    if (data) setCompletions(data as QuestCompletion[]);
  }

  async function reportQuestDone(questId: string) {
    await supabase.from('quest_completions').insert({
      quest_id: questId,
      player_id: playerId,
      status: 'pending',
    });
    await fetchCompletions();
  }

  return { state, quests, completions, loading, reportQuestDone, refetch: fetchAll };
}
