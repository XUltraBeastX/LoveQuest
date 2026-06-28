interface XPBarProps {
  current: number;
  target: number;
}

export function XPBar({ current, target }: XPBarProps) {
  const pct = Math.min(Math.round((current / target) * 100), 100);

  return (
    <div className="w-full px-2">
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] text-purple-400 tracking-wide">XP to next level</span>
        <span className="text-[10px] font-medium text-purple-600">
          {current.toLocaleString()} / {target.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
