import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Accessory, PlayerAccessory } from '../types';

export function useAccessories(playerId: string | undefined) {
  const [catalog, setCatalog] = useState<Accessory[]>([]);
  const [playerAccessories, setPlayerAccessories] = useState<PlayerAccessory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCatalog = useCallback(async () => {
    const { data } = await supabase.from('accessories').select('*').order('type').order('rarity');
    if (data) setCatalog(data as Accessory[]);
  }, []);

  const fetchPlayerAccessories = useCallback(async () => {
    if (!playerId) return;
    const { data } = await supabase
      .from('player_accessories')
      .select('*, accessory:accessories(*)')
      .eq('player_id', playerId);
    if (data) setPlayerAccessories(data as PlayerAccessory[]);
  }, [playerId]);

  useEffect(() => {
    if (!playerId) return;

    Promise.all([fetchCatalog(), fetchPlayerAccessories()]).then(() => setLoading(false));

    // Live updates when GM grants or player equips
    const channel = supabase
      .channel('player-accessories')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'player_accessories',
        filter: `player_id=eq.${playerId}`,
      }, () => fetchPlayerAccessories())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [playerId, fetchCatalog, fetchPlayerAccessories]);

  // Equip an accessory (unequips any existing of same type first)
  async function equip(playerAccessoryId: string, type: Accessory['type']) {
    // Unequip all of same type first
    const sameType = playerAccessories.filter(
      pa => pa.accessory?.type === type && pa.equipped
    );
    for (const pa of sameType) {
      await supabase
        .from('player_accessories')
        .update({ equipped: false, equipped_at: null })
        .eq('id', pa.id);
    }
    // Equip the new one
    await supabase
      .from('player_accessories')
      .update({ equipped: true, equipped_at: new Date().toISOString() })
      .eq('id', playerAccessoryId);

    await fetchPlayerAccessories();
  }

  async function unequip(playerAccessoryId: string) {
    await supabase
      .from('player_accessories')
      .update({ equipped: false, equipped_at: null })
      .eq('id', playerAccessoryId);
    await fetchPlayerAccessories();
  }

  // Derived: accessories currently equipped (one per type max)
  const equipped = playerAccessories.filter(pa => pa.equipped);

  return { catalog, playerAccessories, equipped, loading, equip, unequip, refetch: fetchPlayerAccessories };
}
