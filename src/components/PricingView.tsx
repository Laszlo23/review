import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Zap, Shield, CreditCard } from 'lucide-react';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';

interface PricingViewProps {
  onBack: () => void;
  onGetMoreReviews?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onBack, onGetMoreReviews }) => {
  const [selectedPlan, setSelectedPlan] = useState<'founder' | 'monthly'>('founder');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [claimedCount] = useState(742); // 742 / 1000 claimed

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Plans & Pricing
          </h2>
          <p className="text-xs text-zinc-500">Transparent pricing for local business growth</p>
        </div>
      </div>

      {/* Founder Special Offer Banner */}
      <div className="bg-gradient-to-br from-amber-50 via-amber-100/60 to-orange-50 border border-amber-200/80 rounded-3xl p-5 space-y-4 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-[11px] uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            Founder Special Offer
          </span>
          <span className="text-xs font-semibold text-amber-900 bg-white/80 px-2.5 py-1 rounded-full border border-amber-200">
            First 1,000 Users
          </span>
        </div>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-zinc-900">99€</span>
            <span className="text-xs text-zinc-600 font-medium">einmalig / one-time</span>
          </div>
          <h3 className="text-base font-bold text-zinc-900 mt-1">
            999 Reviews Package
          </h3>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
            Get 999 Google reviews for a flat 99€ one-time fee. Strictly limited to the first 1,000 local business partners.
          </p>
        </div>

        {/* Claimed Spots Progress */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-amber-950">
            <span>{claimedCount} of 1,000 spots claimed</span>
            <span>{1000 - claimedCount} remaining</span>
          </div>
          <div className="w-full bg-amber-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(claimedCount / 1000) * 100}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedPlan('founder');
            if (onGetMoreReviews) onGetMoreReviews();
          }}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Claim 999 Reviews for 99€</span>
        </button>
      </div>

      {/* Pricing Comparison Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Select Your Plan
        </h3>

        {/* Plan 1: Founder Offer */}
        <div
          onClick={() => setSelectedPlan('founder')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
            selectedPlan === 'founder'
              ? 'border-amber-500 bg-amber-50/30 ring-1 ring-amber-500 shadow-2xs'
              : 'border-zinc-200/80 bg-white hover:bg-zinc-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-900">Founder Pass</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  99€ One-Time
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">999 Reviews · First 1,000 Businesses</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedPlan === 'founder'
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-zinc-300 bg-white'
              }`}
            >
              {selectedPlan === 'founder' && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          <ul className="text-xs text-zinc-600 space-y-1.5 pt-1 border-t border-zinc-100">
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>999 Google Review</strong> invitations included</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>No monthly subscription required</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>AI Auto-Reply Generator included</span>
            </li>
          </ul>
        </div>

        {/* Plan 2: Monthly Subscription */}
        <div
          onClick={() => setSelectedPlan('monthly')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
            selectedPlan === 'monthly'
              ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900 shadow-2xs'
              : 'border-zinc-200/80 bg-white hover:bg-zinc-50'
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-900">Monthly Pro</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800">
                  29€ / month
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Flexible monthly subscription · Cancel anytime</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                selectedPlan === 'monthly'
                  ? 'border-zinc-900 bg-zinc-900 text-white'
                  : 'border-zinc-300 bg-white'
              }`}
            >
              {selectedPlan === 'monthly' && <Check className="w-3.5 h-3.5" />}
            </div>
          </div>

          <ul className="text-xs text-zinc-600 space-y-1.5 pt-1 border-t border-zinc-100">
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Unlimited</strong> review requests every month</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Full WhatsApp, SMS, QR & Email integration</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>Cancel or pause subscription anytime</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Checkout Button */}
      <button
        onClick={() => setIsPaymentOpen(true)}
        className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <CreditCard className="w-4 h-4 text-amber-400" />
        <span>Proceed to Payment ({selectedPlan === 'founder' ? '99€' : '29€/mo'})</span>
      </button>

      {/* Feature Guarantee */}
      <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/60 p-4 space-y-2 text-xs text-zinc-600">
        <div className="flex items-center gap-2 font-semibold text-zinc-900">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Local Business Guarantee</span>
        </div>
        <p className="leading-relaxed">
          Both plans include automated Google Business sync, Google Contacts import, printable QR code templates, and automated AI review responses.
        </p>
      </div>

      <PaymentCheckoutModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />
    </div>
  );
};
