import { Home, ListChecks, Shirt, ShoppingCart } from 'lucide-react';

interface PlayerNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'quests', label: 'Quests', icon: ListChecks },
  { id: 'skins', label: 'Skins', icon: Shirt },
  { id: 'shop', label: 'Shop', icon: ShoppingCart },
];

export function PlayerNav({ active, onNavigate }: PlayerNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-purple-50/95 backdrop-blur-sm border-t border-purple-200/50 px-4 pb-[env(safe-area-inset-bottom,8px)] pt-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map(tab => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`
                flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors
                ${isActive ? 'text-purple-700' : 'text-purple-300 hover:text-purple-400'}
              `}
            >
              <tab.icon size={20} strokeWidth={isActive ? 2.2 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
