import React, { useState } from 'react';
import { BusinessProfile, ReviewItem } from '../types';
import { Star, Sparkles, MessageCircle, Check, Loader2, Send } from 'lucide-react';

interface ReviewsScreenProps {
  business: BusinessProfile;
  reviews: ReviewItem[];
  onUpdateReply: (reviewId: string, replyText: string) => void;
}

export const ReviewsScreen: React.FC<ReviewsScreenProps> = ({
  business,
  reviews,
  onUpdateReply,
}) => {
  const [loadingReplyId, setLoadingReplyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<'all' | 'unreplied'>('all');

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'unreplied') return !r.replied;
    return true;
  });

  const handleGenerateAiReply = async (review: ReviewItem) => {
    setLoadingReplyId(review.id);
    try {
      const res = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewText: review.text,
          reviewerName: review.customerName,
          rating: review.rating,
          businessName: business.name,
          tone: business.autoReplyTone || 'friendly',
        }),
      });
      const data = await res.json();
      if (data.reply) {
        onUpdateReply(review.id, data.reply);
      }
    } catch (err) {
      console.error('Failed to generate reply:', err);
    } finally {
      setLoadingReplyId(null);
    }
  };

  const handleSaveEdit = (reviewId: string) => {
    if (editText.trim()) {
      onUpdateReply(reviewId, editText.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-12 max-w-xl mx-auto">
      {/* Header & Stats Banner */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">Reviews</h2>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            Automatic replies ON
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/80 p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold text-zinc-900">{business.googleRating.toFixed(1)}</span>
              <span className="text-amber-500 text-lg">★</span>
            </div>
            <p className="text-xs text-zinc-500">Google Rating</p>
          </div>

          <div className="h-8 w-px bg-zinc-200" />

          <div className="space-y-0.5 text-center">
            <p className="text-2xl font-bold text-zinc-900">{business.totalReviews}</p>
            <p className="text-xs text-zinc-500">Total Reviews</p>
          </div>

          <div className="h-8 w-px bg-zinc-200" />

          <div className="space-y-0.5 text-right">
            <p className="text-2xl font-bold text-emerald-600">+{business.monthlyReviewsCount}</p>
            <p className="text-xs text-zinc-500">This Month</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200/60 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-zinc-900 text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          All ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('unreplied')}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
            filter === 'unreplied'
              ? 'bg-zinc-900 text-white'
              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
          }`}
        >
          Needs Reply ({reviews.filter((r) => !r.replied).length})
        </button>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-10 text-zinc-400 text-xs">
            No reviews match your selected filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex text-amber-400 text-sm gap-0.5">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-zinc-900 mt-1">{rev.customerName}</p>
                </div>
                <span className="text-[11px] text-zinc-400 font-medium">{rev.timeAgo}</span>
              </div>

              <p className="text-xs text-zinc-800 leading-relaxed font-normal">
                "{rev.text}"
              </p>

              {/* Reply Section */}
              <div className="pt-2 border-t border-zinc-100 space-y-2">
                {rev.replied && rev.replyText ? (
                  <div className="bg-zinc-50 rounded-xl p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <Check className="w-3 h-3" /> Auto-Replied
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(rev.id);
                          setEditText(rev.replyText || '');
                        }}
                        className="text-zinc-500 hover:text-zinc-900 text-[11px] underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                    {editingId === rev.id ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full p-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                          rows={2}
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 text-[11px] text-zinc-600 hover:bg-zinc-200 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(rev.id)}
                            className="px-2.5 py-1 text-[11px] bg-zinc-900 text-white rounded-md font-medium"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-zinc-700 leading-relaxed font-normal">
                        {rev.replyText}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">Not replied yet</span>
                    <button
                      onClick={() => handleGenerateAiReply(rev)}
                      disabled={loadingReplyId === rev.id}
                      className="text-xs font-medium px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loadingReplyId === rev.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Generate Reply</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
