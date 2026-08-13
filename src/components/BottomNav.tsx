import React from 'react';
import { TabType } from '../types';
import { Home, Star, MoreHorizontal } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unrepliedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unrepliedCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200/80 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-zinc-900 font-semibold'
              : 'text-zinc-400 hover:text-zinc-600 font-normal'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] tracking-tight">Home</span>
        </button>

        <button
          onClick={() => onTabChange('reviews')}
          className={`relative flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'text-zinc-900 font-semibold'
              : 'text-zinc-400 hover:text-zinc-600 font-normal'
          }`}
        >
          <div className="relative">
            <Star className="w-5 h-5" />
            {unrepliedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unrepliedCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Reviews</span>
        </button>

        <button
          onClick={() => onTabChange('more')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'more'
              ? 'text-zinc-900 font-semibold'
              : 'text-zinc-400 hover:text-zinc-600 font-normal'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[11px] tracking-tight">More</span>
        </button>
      </div>
    </nav>
  );
};
