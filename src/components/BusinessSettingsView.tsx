import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { ArrowLeft, Save, Check } from 'lucide-react';

interface BusinessSettingsViewProps {
  business: BusinessProfile;
  onUpdateBusiness: (updated: Partial<BusinessProfile>) => void;
  onBack: () => void;
  onOpenOnboarding: () => void;
}

export const BusinessSettingsView: React.FC<BusinessSettingsViewProps> = ({
  business,
  onUpdateBusiness,
  onBack,
  onOpenOnboarding,
}) => {
  const [name, setName] = useState(business.name);
  const [location, setLocation] = useState(business.location);
  const [category, setCategory] = useState(business.category);
  const [url, setUrl] = useState(business.googleReviewUrl);
  const [goal, setGoal] = useState(business.reviewGoal.toString());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateBusiness({
      name: name.trim() || 'My Business',
      location: location.trim() || 'Vienna',
      category: category.trim() || 'Local Business',
      googleReviewUrl: url.trim() || 'https://g.page/r/review',
      reviewGoal: parseInt(goal) || 999,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Business Settings
          </h2>
        </div>

        <button
          onClick={handleSave}
          className="text-xs font-semibold px-3 py-1.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {saved ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Save className="w-3.5 h-3.5" />}
          <span>{saved ? 'Saved!' : 'Save'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4 shadow-xs">
        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Business Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Location / City
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Category / Industry
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Google Review URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-700 block mb-1">
            Target Review Goal
          </label>
          <input
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </div>

      <div className="pt-2 text-center">
        <button
          onClick={onOpenOnboarding}
          className="text-xs text-zinc-500 hover:text-zinc-900 font-medium underline cursor-pointer"
        >
          Re-run Setup Wizard
        </button>
      </div>
    </div>
  );
};
