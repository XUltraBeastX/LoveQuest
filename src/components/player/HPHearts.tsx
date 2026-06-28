import { Heart } from 'lucide-react';

interface HPHeartsProps {
  hp: number;
  max?: number;
}

export function HPHearts({ hp, max = 5 }: HPHeartsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-purple-400">HP</span>
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <Heart
            key={i}
            size={14}
            className={i < hp ? 'text-heart-pink fill-heart-pink' : 'text-heart-empty'}
          />
        ))}
      </div>
    </div>
  );
}
