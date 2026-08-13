import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { X, Check, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  onUpdateBusiness: (updated: Partial<BusinessProfile>) => void;
  onGetFirstReview: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  business,
  onUpdateBusiness,
  onGetFirstReview,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState(business.name);
  const [location, setLocation] = useState(business.location);
  const [url, setUrl] = useState(business.googleReviewUrl);
  const [goal, setGoal] = useState(business.reviewGoal || 999);

  if (!isOpen) return null;

  const handleFinish = () => {
    onUpdateBusiness({
      name: name.trim() || 'My Business',
      location: location.trim() || 'Wien',
      googleReviewUrl: url.trim() || 'https://g.page/r/review',
      reviewGoal: goal || 999,
    });
    onClose();
    onGetFirstReview();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-xl border border-zinc-200/80 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Setup · Step {step} of 4
          </span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                What's your business?
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Enter your official business name and city.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Körperglanz Shapeline"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Wien"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                Where should customers leave reviews?
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Paste your Google Business Profile review link.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-700 block mb-1">
                Google Review URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://g.page/r/your-business/review"
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">
                Choose your review goal
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Target review goal for building strong local trust.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[250, 500, 999].map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className={`p-3 rounded-2xl border text-center font-bold text-sm transition-all cursor-pointer relative ${
                    goal === g
                      ? 'border-zinc-900 bg-zinc-900 text-white'
                      : 'border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                  }`}
                >
                  <div>{g}</div>
                  {g === 999 && (
                    <span className="text-[9px] font-bold block text-amber-400 mt-0.5 uppercase tracking-tighter">
                      99€ Founder
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-1">
              <p className="font-bold">🔥 Founder Offer: 999 Reviews for 99€</p>
              <p className="text-[11px] text-amber-800">
                Exclusive one-time deal for the first 1,000 users. Regular 29€/month subscription also available.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5 text-center pt-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-zinc-900 tracking-tight">
                You're ready.
              </h3>
              <p className="text-xs text-zinc-500">
                Your reputation system is active and ready to collect genuine Google reviews.
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Get Your First Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
