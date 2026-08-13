import React, { useState } from 'react';
import { X, Lock, CheckCircle2, CreditCard, Sparkles, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { useFirebase } from '../context/FirebaseContext';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { business, updateBusiness } = useFirebase();

  const [selectedPlan, setSelectedPlan] = useState<'founder' | 'monthly'>('founder');
  const [cardName, setCardName] = useState('Körperglanz Shapeline');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const price = selectedPlan === 'founder' ? '99€' : '29€/mo';

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        await updateBusiness({
          isPaid: true,
          subscriptionPlan: selectedPlan,
        });
        setIsProcessing(false);
        setIsSuccess(true);

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      } catch (err) {
        console.error('Payment activation error:', err);
        setIsProcessing(false);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-zinc-200/80 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 tracking-tight">Activate Review System</h3>
              <p className="text-xs text-zinc-500">Payment required before asking for reviews</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-zinc-900">Payment Confirmed!</h4>
              <p className="text-xs text-zinc-600 mt-1">
                Your review system is now active with the {selectedPlan === 'founder' ? 'Founder 99€ Pass' : 'Monthly Pro Subscription'}.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4">
            {/* Plan Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-700 block">
                Choose Plan
              </label>

              {/* Founder Plan Option */}
              <div
                onClick={() => setSelectedPlan('founder')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedPlan === 'founder'
                    ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedPlan === 'founder' ? 'border-amber-500 bg-amber-500 text-white' : 'border-zinc-300'
                  }`}>
                    {selectedPlan === 'founder' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-zinc-900">Founder Package</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 uppercase">
                        POPULAR
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500">999 Reviews for 99€ (First 1,000 Users)</p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-zinc-900">99€</span>
              </div>

              {/* Monthly Plan Option */}
              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedPlan === 'monthly'
                    ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                    : 'border-zinc-200 bg-white hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    selectedPlan === 'monthly' ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300'
                  }`}>
                    {selectedPlan === 'monthly' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-zinc-900">Monthly Subscription</span>
                    <p className="text-[11px] text-zinc-500">Unlimited reviews · Cancel anytime</p>
                  </div>
                </div>
                <span className="font-extrabold text-sm text-zinc-900">29€/mo</span>
              </div>
            </div>

            {/* Simulated Payment Card Form */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Payment Details</span>
                </label>
                <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-600" /> SSL Encrypted
                </span>
              </div>

              <input
                type="text"
                placeholder="Cardholder Name"
                required
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium"
              />

              <input
                type="text"
                placeholder="Card Number"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                />
                <input
                  type="text"
                  placeholder="CVC"
                  required
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono"
                />
              </div>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Pay {price} & Unlock Review System</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-zinc-400 leading-normal">
              By activating, you confirm immediate access to your review request suite for {business.name}.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
