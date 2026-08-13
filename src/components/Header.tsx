import React from 'react';
import { BusinessProfile } from '../types';
import { useFirebase } from '../context/FirebaseContext';
import { LogIn, LogOut, CloudCheck, Lock, Sparkles } from 'lucide-react';

interface HeaderProps {
  business: BusinessProfile;
  onOpenSettings: () => void;
  onOpenOnboarding: () => void;
  onOpenPricing?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  business,
  onOpenSettings,
  onOpenOnboarding,
  onOpenPricing,
}) => {
  const { user, signInGoogle, signOut } = useFirebase();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-100 px-4 py-3 sm:px-6">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenSettings}>
          <div className="w-9 h-9 rounded-full bg-zinc-900 text-white font-medium flex items-center justify-center text-sm shadow-xs">
            {business.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-sm font-semibold text-zinc-900 tracking-tight leading-none flex items-center gap-1.5">
              <span>{business.name}</span>
              {business.isPaid ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                  Active
                </span>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenPricing) onOpenPricing();
                  }}
                  className="text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full border border-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-2.5 h-2.5" />
                  <span>Unpaid</span>
                </button>
              )}
            </h1>
            <p className="text-xs text-zinc-500 font-normal mt-0.5">
              {business.location} · {business.category}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full border border-emerald-200">
              <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline truncate max-w-[100px]">{user.email}</span>
              <button
                onClick={signOut}
                title="Sign Out"
                className="ml-1 text-emerald-600 hover:text-emerald-800"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={signInGoogle}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-colors shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Firebase Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

