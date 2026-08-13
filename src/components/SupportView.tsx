import React from 'react';
import { ArrowLeft, MessageCircle, HelpCircle, Mail, ExternalLink } from 'lucide-react';

interface SupportViewProps {
  onBack: () => void;
}

export const SupportView: React.FC<SupportViewProps> = ({ onBack }) => {
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
          Support & Help
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4 shadow-xs">
        <h3 className="text-xs font-semibold text-zinc-900 tracking-tight uppercase">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3 text-xs divide-y divide-zinc-100">
          <div className="pt-2 space-y-1">
            <p className="font-semibold text-zinc-900">How do I get more reviews?</p>
            <p className="text-zinc-600 leading-relaxed">
              Click the black "Get More Reviews" button on the home screen to send a direct WhatsApp or SMS invite, or display your QR code at your checkout counter.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <p className="font-semibold text-zinc-900">How do automatic replies work?</p>
            <p className="text-zinc-600 leading-relaxed">
              When enabled under Automatic Replies, our system automatically monitors new Google reviews and crafts polite, personalized responses based on your business name and chosen tone.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <p className="font-semibold text-zinc-900">What are the pricing plans?</p>
            <p className="text-zinc-600 leading-relaxed">
              We offer a Founder Special for the first 1,000 businesses: <strong>999 Google Reviews for 99€</strong> (one-time fee). Alternatively, you can subscribe to our flexible <strong>29€/month</strong> plan for unlimited reviews.
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <p className="font-semibold text-zinc-900">Where do I find my printable QR code?</p>
            <p className="text-zinc-600 leading-relaxed">
              Go to More → QR Code to download or print a crisp vector QR code formatted for business cards, mirrors, or counter stands.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-50 rounded-2xl border border-zinc-200/60 p-4 flex items-center justify-between text-xs">
        <div>
          <p className="font-semibold text-zinc-900">Need personalized help?</p>
          <p className="text-zinc-500">Our local support team is here for you.</p>
        </div>
        <a
          href="mailto:support@auralokal.com"
          className="px-3 py-1.5 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
};
