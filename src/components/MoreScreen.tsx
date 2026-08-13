import React from 'react';
import { BusinessProfile, MoreSubView } from '../types';
import {
  Users,
  Send,
  QrCode,
  BarChart3,
  Calendar,
  MessageSquareCode,
  Settings,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface MoreScreenProps {
  business: BusinessProfile;
  onSelectSubView: (view: MoreSubView) => void;
}

export const MoreScreen: React.FC<MoreScreenProps> = ({ business, onSelectSubView }) => {
  const menuItems: { id: MoreSubView; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: 'pricing',
      title: 'Plans & Pricing',
      subtitle: 'Founder Offer 99€ for 999 reviews · 29€/month plan',
      icon: <Sparkles className="w-4 h-4 text-amber-600" />,
    },
    {
      id: 'customers',
      title: 'Customers',
      subtitle: 'Customer request history and contacts',
      icon: <Users className="w-4 h-4 text-zinc-700" />,
    },
    {
      id: 'requests',
      title: 'Review Requests',
      subtitle: 'Batch requests and invitation templates',
      icon: <Send className="w-4 h-4 text-zinc-700" />,
    },
    {
      id: 'qrcode',
      title: 'QR Code',
      subtitle: 'Printable QR code for counter & business cards',
      icon: <QrCode className="w-4 h-4 text-zinc-700" />,
    },
    {
      id: 'analytics',
      title: 'Analytics',
      subtitle: 'Review count growth and response metrics',
      icon: <BarChart3 className="w-4 h-4 text-zinc-700" />,
    },
    {
      id: 'campaigns',
      title: 'Campaigns',
      subtitle: 'Automated post-visit timing settings',
      icon: <Calendar className="w-4 h-4 text-zinc-700" />,
    },
    {
      id: 'autoreplies',
      title: 'Automatic Replies',
      subtitle: 'Automatic reply monitoring & tone settings',
      icon: <MessageSquareCode className="w-4 h-4 text-zinc-700" />,
    },
    {
      id: 'settings',
      title: 'Business Settings',
      subtitle: 'Business name, Google link, target goal',
      icon: <Settings className="w-4 h-4 text-zinc-700" />,
    },
    {
      id: 'support',
      title: 'Support',
      subtitle: 'FAQ and instant support',
      icon: <HelpCircle className="w-4 h-4 text-zinc-700" />,
    },
  ];

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12">
      <div className="pt-2">
        <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">More</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Manage additional tools and configuration</p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 divide-y divide-zinc-100 overflow-hidden shadow-xs">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectSubView(item.id)}
            className="w-full p-4 flex items-center justify-between hover:bg-zinc-50/80 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 group-hover:text-zinc-900">
                  {item.title}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">{item.subtitle}</p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
          </button>
        ))}
      </div>

      <div className="text-center pt-2">
        <p className="text-[11px] text-zinc-400 font-medium">Aura Lokal v2.4 · Reputation System for Local Businesses</p>
      </div>
    </div>
  );
};
