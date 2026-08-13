import React, { useRef } from 'react';
import { BusinessProfile } from '../types';
import { Download, Printer, Share2, ArrowLeft } from 'lucide-react';

interface QrCodeViewProps {
  business: BusinessProfile;
  onBack: () => void;
}

export const QrCodeView: React.FC<QrCodeViewProps> = ({ business, onBack }) => {
  const reviewUrl = business.googleReviewUrl || 'https://g.page/r/korperglanz-shapeline/review';

  // Quick printable window handler
  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${business.name} Google Review`,
          text: `Scan or click to leave a review for ${business.name}:`,
          url: reviewUrl,
        });
      } catch (e) {
        // Fallback copy
        navigator.clipboard.writeText(reviewUrl);
      }
    } else {
      navigator.clipboard.writeText(reviewUrl);
      alert('Review link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    // Generate simple SVG data URL download
    const svgElement = document.getElementById('review-qr-code-svg');
    if (!svgElement) return;
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${business.name.replace(/\s+/g, '-').toLowerCase()}-qr-code.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          Your Review QR Code
        </h2>
      </div>

      {/* QR Display Card */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 p-8 text-center space-y-6 shadow-xs">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-zinc-900">{business.name}</p>
          <p className="text-xs text-zinc-500">{business.location}</p>
        </div>

        {/* Clean SVG QR Representation */}
        <div className="inline-block p-4 bg-white rounded-2xl border border-zinc-200 shadow-2xs">
          <svg
            id="review-qr-code-svg"
            className="w-48 h-48 mx-auto"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="200" height="200" fill="white" />
            {/* Outer corner 1 */}
            <rect x="20" y="20" width="50" height="50" rx="8" fill="#18181b" />
            <rect x="30" y="30" width="30" height="30" rx="4" fill="white" />
            <rect x="38" y="38" width="14" height="14" rx="2" fill="#18181b" />

            {/* Outer corner 2 */}
            <rect x="130" y="20" width="50" height="50" rx="8" fill="#18181b" />
            <rect x="140" y="30" width="30" height="30" rx="4" fill="white" />
            <rect x="148" y="38" width="14" height="14" rx="2" fill="#18181b" />

            {/* Outer corner 3 */}
            <rect x="20" y="130" width="50" height="50" rx="8" fill="#18181b" />
            <rect x="30" y="140" width="30" height="30" rx="4" fill="white" />
            <rect x="38" y="148" width="14" height="14" rx="2" fill="#18181b" />

            {/* Pattern Data Dots */}
            <rect x="85" y="25" width="12" height="12" rx="2" fill="#18181b" />
            <rect x="102" y="25" width="12" height="12" rx="2" fill="#18181b" />
            <rect x="85" y="42" width="12" height="25" rx="2" fill="#18181b" />
            <rect x="102" y="55" width="12" height="12" rx="2" fill="#18181b" />

            <rect x="25" y="85" width="25" height="12" rx="2" fill="#18181b" />
            <rect x="55" y="85" width="12" height="25" rx="2" fill="#18181b" />
            <rect x="25" y="102" width="12" height="12" rx="2" fill="#18181b" />

            <rect x="85" y="85" width="30" height="30" rx="4" fill="#18181b" />
            <rect x="125" y="85" width="12" height="12" rx="2" fill="#18181b" />
            <rect x="142" y="85" width="33" height="12" rx="2" fill="#18181b" />

            <rect x="125" y="102" width="25" height="12" rx="2" fill="#18181b" />
            <rect x="155" y="102" width="20" height="25" rx="2" fill="#18181b" />

            <rect x="85" y="130" width="12" height="45" rx="2" fill="#18181b" />
            <rect x="102" y="145" width="25" height="12" rx="2" fill="#18181b" />
            <rect x="135" y="135" width="40" height="40" rx="6" fill="#18181b" />
            <circle cx="155" cy="155" r="10" fill="white" />
            <path d="M152 155L155 158L159 152" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <p className="text-xs text-zinc-600 font-medium">
          Scan to leave a Google review.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={handleDownload}
            className="py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            onClick={handlePrint}
            className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
