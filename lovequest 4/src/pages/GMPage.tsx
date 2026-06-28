import { useState, useEffect } from 'react';
import { Plus, Coins, Trophy, LogOut, Check, X, Gift } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User, PlayerState, Quest, QuestCompletion, Accessory } from '../types';

interface GMPageProps {
  user: User;
  onLogout: () => void;
}

export function GMPage({ user, onLogout }: GMPageProps) {
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [pendingCompletions, setPendingCompletions] = useState<(QuestCompletion & { quest_name?: string })[]>([]);
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [showGrantXP, setShowGrantXP] = useState(false);
  const [showGrantItem, setShowGrantItem] = useState(false);
  const [newQuestName, setNewQuestName] = useState('');
  const [newQuestXP, setNewQuestXP] = useState('50');
  const [grantAmount, setGrantAmount] = useState('');
  const [grantReason, setGrantReason] = useState('');
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [selectedAccessoryId, setSelectedAccessoryId] = useState('');
  const [grantItemMessage, setGrantItemMessage] = useState('');
  const [grantItemStatus, setGrantItemStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchAccessories();
    fetchAll();

    const channel = supabase
      .channel('gm-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quest_completions' }, () => fetchPending())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'player_state' }, () => fetchPlayerState())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchAccessories() {
    const { data } = await supabase.from('accessories').select('*').order('type').order('name');
    if (data) setAccessories(data as Accessory[]);
  }

  async function fetchAll() {
    await Promise.all([fetchPlayerState(), fetchQuests(), fetchPending()]);
  }

  async function fetchPlayerState() {
    const { data } = await supabase.from('player_state').select('*').limit(1).single();
    if (data) setPlayerState(data as PlayerState);
  }

  async function fetchQuests() {
    const { data } = await supabase.from('quests').select('*').order('created_at', { ascending: false });
    if (data) setQuests(data as Quest[]);
  }

  async function fetchPending() {
    const { data } = await supabase
      .from('quest_completions')
      .select('*, quests(name)')
      .eq('status', 'pending');
    if (data) {
      setPendingCompletions(data.map((c: any) => ({ ...c, quest_name: c.quests?.name })));
    }
  }

  async function addQuest() {
    if (!newQuestName.trim()) return;
    await supabase.from('quests').insert({
      name: newQuestName,
      xp_reward: parseInt(newQuestXP) || 50,
      type: 'daily',
      created_by: user.id,
    });
    setNewQuestName('');
    setNewQuestXP('50');
    setShowAddQuest(false);
    fetchQuests();
  }

  async function approveCompletion(completion: QuestCompletion) {
    const quest = quests.find(q => q.id === completion.quest_id);
    const xp = quest?.xp_reward || 0;

    await supabase.from('quest_completions')
      .update({ status: 'approved', approved_at: new Date().toISOString(), xp_granted: xp })
      .eq('id', completion.id);

    if (playerState) {
      await supabase.from('player_state')
        .update({ current_xp: playerState.current_xp + xp })
        .eq('id', playerState.id);
    }

    fetchAll();
  }

  async function rejectCompletion(id: string) {
    await supabase.from('quest_completions').update({ status: 'rejected' }).eq('id', id);
    fetchPending();
  }

  async function grantXP() {
    const amount = parseInt(grantAmount);
    if (!amount || !playerState) return;

    await supabase.from('player_state')
      .update({ current_xp: playerState.current_xp + amount })
      .eq('id', playerState.id);

    setGrantAmount('');
    setGrantReason('');
    setShowGrantXP(false);
    fetchPlayerState();
  }

  async function grantItem() {
    if (!selectedAccessoryId || !playerState) return;
    setGrantItemStatus('idle');

    // Find the player to grant to
    const { data: players } = await supabase.from('users').select('id').eq('role', 'player').limit(1);
    const playerId = players?.[0]?.id;
    if (!playerId) { setGrantItemStatus('error'); return; }

    const acc = accessories.find(a => a.id === selectedAccessoryId);

    // Grant the accessory (upsert in case they already own it)
    const { error } = await supabase.from('player_accessories').upsert({
      player_id: playerId,
      accessory_id: selectedAccessoryId,
      equipped: false,
    }, { onConflict: 'player_id,accessory_id' });

    if (error) { setGrantItemStatus('error'); return; }

    // Send notification
    const body = grantItemMessage.trim()
      ? grantItemMessage.trim()
      : `Your GM gifted you: ${acc?.name ?? 'a new accessory'} ✨`;

    await supabase.from('notifications').insert({
      recipient_id: playerId,
      type: 'gm_gift',
      title: `New accessory: ${acc?.name ?? 'Gift'}`,
      body,
    });

    setGrantItemStatus('success');
    setSelectedAccessoryId('');
    setGrantItemMessage('');
    setTimeout(() => {
      setShowGrantItem(false);
      setGrantItemStatus('idle');
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gm-bg text-white">
      {/* Header */}
      <div className="bg-[#0d1f0d] px-5 pt-[env(safe-area-inset-top,12px)] pb-4">
        <div className="flex justify-between items-center pt-3 mb-3">
          <div>
            <span className="text-gm-green font-semibold text-[14px]">GM Dashboard</span>
            <span className="ml-2 text-[9px] bg-[#0a2a0a] border border-[#1a4a1a] text-[#4a9a4a] px-2 py-0.5 rounded-full">
              Game Master
            </span>
          </div>
          <button onClick={onLogout} className="text-[#4a7a4a] hover:text-gm-green">
            <LogOut size={16} />
          </button>
        </div>

        {playerState && (
          <>
            <p className="text-[11px] text-[#4a7a4a]">
              The Princess — LVL {playerState.current_level} — {playerState.current_xp}/{playerState.xp_to_next_level} XP
            </p>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[
                { val: `${quests.filter(q => q.active).length}`, label: 'Active quests' },
                { val: playerState.current_xp.toString(), label: 'Total XP' },
                { val: `${playerState.hp}/5`, label: 'HP' },
              ].map(s => (
                <div key={s.label} className="bg-[#0a180a] border border-[#1a3a1a] rounded-lg p-2 text-center">
                  <div className="text-gm-green text-[14px] font-semibold">{s.val}</div>
                  <div className="text-[#4a7a4a] text-[8px]">{s.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Pending approvals */}
        {pendingCompletions.length > 0 && (
          <div>
            <h3 className="text-[10px] font-semibold text-[#4a7a4a] uppercase tracking-wider mb-2">
              Pending approvals
            </h3>
            {pendingCompletions.map(c => (
              <div key={c.id} className="bg-gm-card border border-gm-border rounded-xl p-3 mb-2 flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-[12px] text-[#9acf9a]">{c.quest_name || 'Quest'}</div>
                  <div className="text-[9px] text-[#4a7a4a]">Reported {new Date(c.reported_at).toLocaleDateString()}</div>
                </div>
                <button
                  onClick={() => approveCompletion(c)}
                  className="w-8 h-8 rounded-lg bg-[#0a2a0a] border border-[#1a4a1a] flex items-center justify-center text-gm-green hover:bg-[#1a3a1a]"
                >
                  <Check size={14} />
                </button>
                <button
                  onClick={() => rejectCompletion(c.id)}
                  className="w-8 h-8 rounded-lg bg-[#2a0a0a] border border-[#4a1a1a] flex items-center justify-center text-gm-red hover:bg-[#3a1a1a]"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* GM Actions */}
        <div>
          <h3 className="text-[10px] font-semibold text-[#4a7a4a] uppercase tracking-wider mb-2">
            GM actions
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Plus, label: 'Add quest', action: () => setShowAddQuest(true) },
              { icon: Coins, label: 'Grant XP', action: () => setShowGrantXP(true) },
              { icon: Gift, label: 'Grant Item', action: () => setShowGrantItem(true) },
              { icon: Trophy, label: 'LVL UP', action: () => alert('Coming in Sprint 5') },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.action}
                className="bg-gm-card border border-gm-border rounded-xl p-4 flex flex-col items-center gap-2 hover:border-[#3a4a3a] transition-colors active:scale-95"
              >
                <btn.icon size={20} className="text-[#4a9a4a]" />
                <span className="text-gm-green text-[11px]">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Quest Modal */}
        {showAddQuest && (
          <div className="bg-gm-card border border-gm-border rounded-xl p-4 space-y-3">
            <h3 className="text-gm-green text-[13px] font-semibold">New quest</h3>
            <input
              type="text"
              value={newQuestName}
              onChange={e => setNewQuestName(e.target.value)}
              placeholder="Quest name"
              className="w-full bg-[#0a0a1e] border border-gm-border rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-[#4a4a6a] focus:outline-none focus:border-gm-green"
            />
            <input
              type="number"
              value={newQuestXP}
              onChange={e => setNewQuestXP(e.target.value)}
              placeholder="XP reward"
              className="w-full bg-[#0a0a1e] border border-gm-border rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-[#4a4a6a] focus:outline-none focus:border-gm-green"
            />
            <div className="flex gap-2">
              <button onClick={addQuest} className="flex-1 bg-[#1a3a1a] text-gm-green rounded-lg py-2 text-[12px] font-medium hover:bg-[#2a4a2a]">
                Create
              </button>
              <button onClick={() => setShowAddQuest(false)} className="px-4 text-[#4a4a6a] text-[12px] hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Grant XP Modal */}
        {showGrantXP && (
          <div className="bg-gm-card border border-gm-border rounded-xl p-4 space-y-3">
            <h3 className="text-gm-green text-[13px] font-semibold">Grant XP</h3>
            <input
              type="number"
              value={grantAmount}
              onChange={e => setGrantAmount(e.target.value)}
              placeholder="Amount"
              className="w-full bg-[#0a0a1e] border border-gm-border rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-[#4a4a6a] focus:outline-none focus:border-gm-green"
            />
            <input
              type="text"
              value={grantReason}
              onChange={e => setGrantReason(e.target.value)}
              placeholder="Reason (optional)"
              className="w-full bg-[#0a0a1e] border border-gm-border rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-[#4a4a6a] focus:outline-none focus:border-gm-green"
            />
            <div className="flex gap-2">
              <button onClick={grantXP} className="flex-1 bg-[#1a3a1a] text-gm-green rounded-lg py-2 text-[12px] font-medium hover:bg-[#2a4a2a]">
                Grant
              </button>
              <button onClick={() => setShowGrantXP(false)} className="px-4 text-[#4a4a6a] text-[12px] hover:text-white">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Grant Item Modal */}
        {showGrantItem && (
          <div className="bg-gm-card border border-gm-border rounded-xl p-4 space-y-3">
            <h3 className="text-gm-green text-[13px] font-semibold">Grant accessory</h3>
            {grantItemStatus === 'success' ? (
              <div className="text-center py-3 text-gm-green text-[13px]">✓ Gift sent!</div>
            ) : (
              <>
                <select
                  value={selectedAccessoryId}
                  onChange={e => setSelectedAccessoryId(e.target.value)}
                  className="w-full bg-[#0a0a1e] border border-gm-border rounded-lg px-3 py-2 text-[13px] text-white focus:outline-none focus:border-gm-green"
                >
                  <option value="">Select an accessory…</option>
                  {accessories.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.type} · {a.rarity})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={grantItemMessage}
                  onChange={e => setGrantItemMessage(e.target.value)}
                  placeholder="Personal message (optional)"
                  className="w-full bg-[#0a0a1e] border border-gm-border rounded-lg px-3 py-2 text-[13px] text-white placeholder:text-[#4a4a6a] focus:outline-none focus:border-gm-green"
                />
                {grantItemStatus === 'error' && (
                  <p className="text-[11px] text-red-400">Something went wrong. Try again.</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={grantItem}
                    disabled={!selectedAccessoryId}
                    className="flex-1 bg-[#1a3a1a] text-gm-green rounded-lg py-2 text-[12px] font-medium hover:bg-[#2a4a2a] disabled:opacity-40"
                  >
                    Grant ✨
                  </button>
                  <button onClick={() => { setShowGrantItem(false); setGrantItemStatus('idle'); }} className="px-4 text-[#4a4a6a] text-[12px] hover:text-white">
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Active quests list */}
        <div>
          <h3 className="text-[10px] font-semibold text-[#4a7a4a] uppercase tracking-wider mb-2">
            Active quests
          </h3>
          {quests.filter(q => q.active).map(q => (
            <div key={q.id} className="bg-gm-card border border-gm-border rounded-xl p-3 mb-2 flex items-center justify-between">
              <div>
                <div className="text-[12px] text-[#9acf9a]">{q.name}</div>
                <div className="text-[9px] text-[#4a7a4a]">{q.type} • {q.xp_reward} XP</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
