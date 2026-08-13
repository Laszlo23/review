import React from 'react';
import { BusinessProfile, ReviewItem } from '../types';
import { Star, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface HomeScreenProps {
  business: BusinessProfile;
  recentReviews: ReviewItem[];
  onGetMoreReviews: () => void;
  onViewAllReviews: () => void;
  onOpenPricing?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  business,
  recentReviews,
  onGetMoreReviews,
  onViewAllReviews,
  onOpenPricing,
}) => {
  const goalPercent = Math.min(
    100,
    Math.round((business.totalReviews / business.reviewGoal) * 100)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Business Header & Primary Reputation Metric */}
      <div className="text-center space-y-3 pt-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900">
            {business.name}
          </h2>
          <p className="text-sm text-zinc-500 font-normal mt-0.5">
            {business.location} · {business.category}
          </p>
        </div>

        <div className="pt-2 pb-1">
          <div className="inline-flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900">
              {business.googleRating.toFixed(1)}
            </span>
            <span className="text-amber-500 text-2xl sm:text-3xl font-semibold">★</span>
          </div>

          <div className="mt-1 flex items-center justify-center gap-2 text-sm text-zinc-600">
            <span className="font-semibold text-zinc-900">{business.totalReviews} Google Reviews</span>
            <span className="text-zinc-300">·</span>
            <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
              +{business.monthlyReviewsCount} this month
            </span>
          </div>
        </div>
      </div>

      {/* Founder Offer Badge Card */}
      <div
        onClick={onOpenPricing}
        className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-orange-500/10 border border-amber-500/30 rounded-2xl p-4 max-w-md mx-auto flex items-center justify-between cursor-pointer hover:border-amber-500/60 transition-all shadow-2xs group"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-white font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Founder Pass
            </span>
            <span className="text-[11px] font-semibold text-amber-900">999 Reviews for 99€</span>
          </div>
          <p className="text-[11px] text-zinc-600">
            Special offer for the first 1,000 businesses · Regular 29€/month plan available
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform shrink-0" />
      </div>

      {/* 2. Review Goal */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-xs max-w-md mx-auto space-y-3">
        <div className="flex items-center justify-between text-xs font-medium text-zinc-600">
          <span className="uppercase tracking-wider text-[11px] font-semibold text-zinc-500">Review Goal</span>
          <span className="font-semibold text-zinc-900">
            {business.totalReviews} / {business.reviewGoal}
          </span>
        </div>
        
        <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-zinc-900 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${goalPercent}%` }}
          />
        </div>
      </div>

      {/* 3. PRIMARY ACTION - The ONE dominant button */}
      <div className="max-w-md mx-auto pt-1">
        <button
          onClick={onGetMoreReviews}
          className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-base rounded-2xl shadow-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
        >
          <span>Get More Reviews</span>
          <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* 4. SYSTEM STATUS */}
      <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/60 p-5 max-w-md mx-auto space-y-3">
        <p className="text-xs font-semibold text-zinc-900 tracking-tight flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Your reputation system is active</span>
        </p>

        <div className="space-y-2 text-xs text-zinc-600 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Review requests active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>QR code active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>Automatic replies active</span>
          </div>
        </div>
      </div>

      {/* 5. RECENT REVIEWS PREVIEW */}
      <div className="max-w-md mx-auto space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Recent reviews
          </h3>
          <button
            onClick={onViewAllReviews}
            className="text-xs font-medium text-zinc-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-3">
          {recentReviews.slice(0, 2).map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-zinc-200/70 p-4 space-y-2 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex text-amber-400 text-xs gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-[11px] text-zinc-400">{rev.timeAgo}</span>
              </div>
              <p className="text-xs text-zinc-700 font-normal leading-relaxed">
                "{rev.text}"
              </p>
              <p className="text-[11px] font-medium text-zinc-900">{rev.customerName}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
