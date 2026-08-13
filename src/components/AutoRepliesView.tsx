import React from 'react';
import { BusinessProfile } from '../types';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';

interface AutoRepliesViewProps {
  business: BusinessProfile;
  onUpdateBusiness: (updated: Partial<BusinessProfile>) => void;
  onBack: () => void;
}

export const AutoRepliesView: React.FC<AutoRepliesViewProps> = ({
  business,
  onUpdateBusiness,
  onBack,
}) => {
  return (
    <div className="space-y-6 max-w-md mx-auto pb-12">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
          Automatic Replies
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-5 shadow-xs">
        {/* Toggle Box */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div>
            <p className="text-sm font-semibold text-zinc-900">Automatic Replies</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Reviews are automatically monitored and answered.
            </p>
          </div>

          <button
            onClick={() => onUpdateBusiness({ autoReplyEnabled: !business.autoReplyEnabled })}
            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
              business.autoReplyEnabled ? 'bg-zinc-900' : 'bg-zinc-200'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 ${
                business.autoReplyEnabled ? 'left-6.5' : 'left-0.5'
              }`}
            />
          </button>
        </div>

        {/* Tone Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-zinc-700 block">
            Response Tone
          </label>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'friendly', label: 'Friendly & Warm' },
              { id: 'professional', label: 'Professional' },
              { id: 'concise', label: 'Short & Direct' },
            ].map((t) => {
              const active = business.autoReplyTone === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onUpdateBusiness({ autoReplyTone: t.id as any })}
                  className={`p-3 rounded-xl border text-xs font-medium text-center transition-all cursor-pointer ${
                    active
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Status indicator */}
        <div className="bg-zinc-50 rounded-xl p-3 text-xs text-zinc-600 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {business.autoReplyEnabled
              ? 'New Google reviews will receive polite, custom replies automatically.'
              : 'Automatic replies are paused.'}
          </span>
        </div>
      </div>
    </div>
  );
};
