import React, { useState } from 'react';
import { BusinessProfile } from '../types';
import { X, MessageSquare, Send, QrCode, Copy, Check, Users, Lock, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { GoogleContactsPickerModal } from './GoogleContactsPickerModal';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';

interface GetReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  onLogRequest: (customerName: string, phone: string, channel: 'whatsapp' | 'sms' | 'link' | 'qr') => void;
  onSelectQrTab?: () => void;
}

export const GetReviewsModal: React.FC<GetReviewsModalProps> = ({
  isOpen,
  onClose,
  business,
  onLogRequest,
  onSelectQrTab,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'sms' | 'qr' | 'link' | null>(null);
  const [customerName, setCustomerName] = useState('Anna M.');
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!isOpen) return null;

  const isPaid = Boolean(business.isPaid);

  const reviewUrl = business.googleReviewUrl || 'https://g.page/r/korperglanz-shapeline/review';

  const defaultMessage = `Hi ${customerName.trim() || 'dort'} 👋
Vielen Dank für deinen Besuch bei ${business.name}!
Wir würden uns riesig über deine Bewertung freuen.

⭐ Hier Bewertung auf Google abgeben:
${reviewUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewUrl);
    setCopied(true);
    onLogRequest(customerName || 'Customer', phone || 'Link copied', 'link');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(defaultMessage);
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
    onLogRequest(customerName || 'Customer', phone || 'WhatsApp', 'whatsapp');
    window.open(url, '_blank');
    onClose();
  };

  const handleSendSms = () => {
    const encoded = encodeURIComponent(defaultMessage);
    const url = `sms:${phone}?body=${encoded}`;
    onLogRequest(customerName || 'Customer', phone || 'SMS', 'sms');
    window.open(url, '_self');
    onClose();
  };

  const handleOpenQr = () => {
    onLogRequest(customerName || 'Customer', 'In-studio QR', 'qr');
    onClose();
    if (onSelectQrTab) onSelectQrTab();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-xl border border-zinc-200/80 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Get More Reviews</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Choose how to ask your customer</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isPaid ? (
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/50 to-orange-50 rounded-2xl p-5 border border-amber-200/80 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-zinc-900">Payment Required Before Getting Reviews</h4>
              <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                To start sending Google review requests to your customers via WhatsApp, SMS, QR Code or Link, please choose a plan and complete payment.
              </p>
            </div>

            <div className="bg-white/90 border border-amber-200 rounded-xl p-3 text-xs text-zinc-700 space-y-1.5 text-left shadow-2xs">
              <p className="font-bold text-zinc-900 text-xs">Choose Your Plan to Activate:</p>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span><strong>Founder Special:</strong> 99€ one-time for 999 reviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-700 shrink-0" />
                <span><strong>Monthly Pro:</strong> 29€ / month (Unlimited reviews)</span>
              </div>
            </div>

            <button
              onClick={() => setIsPaymentOpen(true)}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Pay & Unlock Review System (99€ or 29€/mo)</span>
            </button>
          </div>
        ) : !selectedChannel ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedChannel('whatsapp')}
              className="p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 text-left transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">WhatsApp</p>
                <p className="text-[11px] text-zinc-500">Send direct chat message</p>
              </div>
            </button>

            <button
              onClick={() => setSelectedChannel('sms')}
              className="p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 text-left transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">SMS</p>
                <p className="text-[11px] text-zinc-500">Send text message</p>
              </div>
            </button>

            <button
              onClick={handleOpenQr}
              className="p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 text-left transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">QR Code</p>
                <p className="text-[11px] text-zinc-500">Show printable QR</p>
              </div>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-4 rounded-2xl border border-zinc-200 hover:border-zinc-900 bg-white hover:bg-zinc-50 text-left transition-all space-y-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center">
                {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {copied ? 'Copied!' : 'Copy Link'}
                </p>
                <p className="text-[11px] text-zinc-500">Copy direct review URL</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedChannel(null)}
              className="text-xs text-zinc-500 hover:text-zinc-900 font-medium cursor-pointer"
            >
              ← Choose another channel
            </button>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 block">
                  Customer Name
                </label>
                <button
                  type="button"
                  onClick={() => setIsContactsOpen(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <Users className="w-3 h-3" />
                  <span>Import Google Contact</span>
                </button>
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Anna M."
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+43 676 1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-sm text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-700 block mb-1">
                  Message Preview
                </label>
                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-700 whitespace-pre-line font-mono">
                  {defaultMessage}
                </div>
              </div>
            </div>

            <div className="pt-2">
              {selectedChannel === 'whatsapp' && (
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              )}

              {selectedChannel === 'sms' && (
                <button
                  onClick={handleSendSms}
                  className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via SMS</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <GoogleContactsPickerModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        onSelectContact={(c) => {
          if (c.name) setCustomerName(c.name);
          if (c.phone) setPhone(c.phone);
        }}
      />

      <PaymentCheckoutModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />
    </div>
  );
};
