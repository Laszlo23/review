import React, { useState } from 'react';
import { CustomerRequest } from '../types';
import { ArrowLeft, Search, Plus, MessageSquare, Send, QrCode, CheckCircle2, Users } from 'lucide-react';
import { GoogleContactsPickerModal } from './GoogleContactsPickerModal';

interface CustomersViewProps {
  requests: CustomerRequest[];
  onBack: () => void;
  onOpenGetMoreReviews: () => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  requests,
  onBack,
  onOpenGetMoreReviews,
}) => {
  const [query, setQuery] = useState('');
  const [isContactsOpen, setIsContactsOpen] = useState(false);

  const filtered = requests.filter((r) =>
    r.customerName.toLowerCase().includes(query.toLowerCase()) ||
    r.phoneOrEmail.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Customers & Requests
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContactsOpen(true)}
            className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Google Contacts</span>
          </button>

          <button
            onClick={onOpenGetMoreReviews}
            className="text-xs font-semibold px-3 py-1.5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customer name or phone..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200/80 rounded-2xl text-xs text-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
        />
      </div>

      {/* Customer Request History Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-zinc-400 text-xs">No customer requests found.</div>
        ) : (
          filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl border border-zinc-200/80 p-4 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-700 flex items-center justify-center font-medium">
                  {req.channel === 'whatsapp' && <MessageSquare className="w-4 h-4 text-emerald-600" />}
                  {req.channel === 'sms' && <Send className="w-4 h-4 text-blue-600" />}
                  {req.channel === 'qr' && <QrCode className="w-4 h-4 text-zinc-800" />}
                  {req.channel === 'link' && <Send className="w-4 h-4 text-zinc-800" />}
                </div>

                <div>
                  <p className="font-semibold text-zinc-900">{req.customerName}</p>
                  <p className="text-[11px] text-zinc-500">{req.phoneOrEmail} · {req.sentAt}</p>
                </div>
              </div>

              <div>
                {req.status === 'reviewed' && (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Review Left
                  </span>
                )}
                {req.status === 'opened' && (
                  <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                    Link Opened
                  </span>
                )}
                {req.status === 'sent' && (
                  <span className="text-[11px] font-medium text-zinc-600 bg-zinc-100 px-2.5 py-1 rounded-full">
                    Sent
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <GoogleContactsPickerModal
        isOpen={isContactsOpen}
        onClose={() => setIsContactsOpen(false)}
        onSelectContact={(c) => {
          setIsContactsOpen(false);
          onOpenGetMoreReviews();
        }}
      />
    </div>
  );
};
