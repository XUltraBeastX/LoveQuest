import { Check, Users, Heart, Star, Swords } from 'lucide-react';
import type { Quest, QuestCompletion } from '../../types';

interface QuestListProps {
  quests: Quest[];
  completions: QuestCompletion[];
  onComplete: (questId: string) => void;
}

const questIcons = [Users, Heart, Star, Swords];

export function QuestList({ quests, completions, onComplete }: QuestListProps) {
  function getStatus(questId: string): QuestCompletion | undefined {
    return completions.find(c => c.quest_id === questId);
  }

  if (quests.length === 0) {
    return (
      <div className="text-center py-8 text-purple-300 text-sm">
        No quests yet — your GM will add some soon!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {quests.map((quest, i) => {
        const completion = getStatus(quest.id);
        const isDone = completion?.status === 'approved';
        const isPending = completion?.status === 'pending';
        const Icon = questIcons[i % questIcons.length];

        return (
          <div
            key={quest.id}
            className={`
              flex items-center gap-3 px-3 py-3 rounded-xl border transition-all
              ${isDone
                ? 'bg-green-50 border-green-200'
                : 'bg-purple-50/50 border-purple-200/60 hover:border-purple-300'
              }
            `}
          >
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center shrink-0
              ${isDone ? 'bg-green-100 text-success' : 'bg-purple-200 text-purple-600'}
            `}>
              {isDone ? <Check size={14} /> : <Icon size={14} />}
            </div>

            <span className={`
              flex-1 text-[13px] leading-snug
              ${isDone ? 'text-success' : 'text-purple-800'}
            `}>
              {quest.name}
            </span>

            {isDone ? (
              <span className="text-[11px] font-medium text-success whitespace-nowrap">
                +{quest.xp_reward} XP
              </span>
            ) : isPending ? (
              <span className="text-[10px] text-purple-400 whitespace-nowrap px-2 py-1 bg-purple-100 rounded-full">
                Pending...
              </span>
            ) : (
              <button
                onClick={() => onComplete(quest.id)}
                className="text-[11px] font-medium text-purple-700 bg-purple-200 hover:bg-purple-300 px-3 py-1.5 rounded-full transition-colors active:scale-95"
              >
                Done
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
