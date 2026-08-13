import React from 'react';
import { BusinessProfile, MonthlyMetric } from '../types';
import { ArrowLeft } from 'lucide-react';

interface AnalyticsViewProps {
  business: BusinessProfile;
  metrics: MonthlyMetric[];
  onBack: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ business, metrics, onBack }) => {
  const maxCount = Math.max(...metrics.map((m) => m.count), 25);

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
          Analytics
        </h2>
      </div>

      {/* 4 Core Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 space-y-1">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Reviews</p>
          <p className="text-2xl font-bold text-zinc-900">{business.totalReviews}</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 space-y-1">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Rating</p>
          <p className="text-2xl font-bold text-zinc-900 flex items-center gap-1">
            <span>{business.googleRating.toFixed(1)}</span>
            <span className="text-amber-500 text-xl">★</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 space-y-1">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">This Month</p>
          <p className="text-2xl font-bold text-emerald-600">+{business.monthlyReviewsCount}</p>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 space-y-1">
          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Response Rate</p>
          <p className="text-2xl font-bold text-zinc-900">100%</p>
        </div>
      </div>

      {/* Review Growth Chart */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-zinc-900 tracking-tight">Review Growth</h3>
          <span className="text-[11px] text-zinc-400 font-medium">Last 6 Months</span>
        </div>

        <div className="pt-2">
          <div className="h-36 flex items-end justify-between gap-2 border-b border-zinc-100 pb-2">
            {metrics.map((item, idx) => {
              const heightPercent = Math.round((item.count / maxCount) * 100);
              const isLatest = idx === metrics.length - 1;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-medium text-zinc-400">{item.count}</span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isLatest ? 'bg-zinc-900' : 'bg-zinc-200 hover:bg-zinc-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-medium text-zinc-500">{item.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
