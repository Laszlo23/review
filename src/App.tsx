import React, { useState } from 'react';
import {
  TabType,
  MoreSubView,
  BusinessProfile,
  MonthlyMetric,
} from './types';
import {
  initialMonthlyMetrics,
} from './data/initialData';
import { useFirebase } from './context/FirebaseContext';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { ReviewsScreen } from './components/ReviewsScreen';
import { MoreScreen } from './components/MoreScreen';
import { GetReviewsModal } from './components/GetReviewsModal';
import { QrCodeView } from './components/QrCodeView';
import { AnalyticsView } from './components/AnalyticsView';
import { CustomersView } from './components/CustomersView';
import { AutoRepliesView } from './components/AutoRepliesView';
import { BusinessSettingsView } from './components/BusinessSettingsView';
import { SupportView } from './components/SupportView';
import { PricingView } from './components/PricingView';
import { OnboardingModal } from './components/OnboardingModal';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const {
    business,
    reviews,
    customerRequests,
    updateBusiness,
    updateReviewReply,
    logCustomerRequest,
  } = useFirebase();

  const [monthlyMetrics] = useState<MonthlyMetric[]>(initialMonthlyMetrics);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [subView, setSubView] = useState<MoreSubView>('none');

  const [isGetMoreModalOpen, setIsGetMoreModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  const handleUpdateBusiness = (updated: Partial<BusinessProfile>) => {
    updateBusiness(updated);
  };

  const handleLogRequest = (
    customerName: string,
    phone: string,
    channel: 'whatsapp' | 'sms' | 'link' | 'qr'
  ) => {
    logCustomerRequest(customerName, phone, channel);
  };

  const handleUpdateReply = (reviewId: string, replyText: string) => {
    updateReviewReply(reviewId, replyText);
  };

  const unrepliedCount = reviews.filter((r) => !r.replied).length;


  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white flex flex-col">
      {/* Top Navigation Header */}
      <Header
        business={business}
        onOpenSettings={() => {
          setActiveTab('more');
          setSubView('settings');
        }}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        onOpenPricing={() => {
          setActiveTab('more');
          setSubView('pricing');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-xl w-full mx-auto px-4 pt-6 pb-24">
        {activeTab === 'home' && (
          <HomeScreen
            business={business}
            recentReviews={reviews}
            onGetMoreReviews={() => setIsGetMoreModalOpen(true)}
            onViewAllReviews={() => {
              setActiveTab('reviews');
              setSubView('none');
            }}
            onOpenPricing={() => {
              setActiveTab('more');
              setSubView('pricing');
            }}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsScreen
            business={business}
            reviews={reviews}
            onUpdateReply={handleUpdateReply}
          />
        )}

        {activeTab === 'more' && (
          <>
            {subView === 'none' && (
              <MoreScreen
                business={business}
                onSelectSubView={(view) => setSubView(view)}
              />
            )}

            {subView === 'qrcode' && (
              <QrCodeView
                business={business}
                onBack={() => setSubView('none')}
              />
            )}

            {subView === 'analytics' && (
              <AnalyticsView
                business={business}
                metrics={monthlyMetrics}
                onBack={() => setSubView('none')}
              />
            )}

            {(subView === 'customers' || subView === 'requests' || subView === 'campaigns') && (
              <CustomersView
                requests={customerRequests}
                onBack={() => setSubView('none')}
                onOpenGetMoreReviews={() => setIsGetMoreModalOpen(true)}
              />
            )}

            {subView === 'autoreplies' && (
              <AutoRepliesView
                business={business}
                onUpdateBusiness={handleUpdateBusiness}
                onBack={() => setSubView('none')}
              />
            )}

            {subView === 'settings' && (
              <BusinessSettingsView
                business={business}
                onUpdateBusiness={handleUpdateBusiness}
                onBack={() => setSubView('none')}
                onOpenOnboarding={() => setIsOnboardingOpen(true)}
              />
            )}

            {subView === 'pricing' && (
              <PricingView
                onBack={() => setSubView('none')}
                onGetMoreReviews={() => setIsGetMoreModalOpen(true)}
              />
            )}

            {subView === 'support' && (
              <SupportView onBack={() => setSubView('none')} />
            )}
          </>
        )}
      </main>

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== 'more') {
            setSubView('none');
          }
        }}
        unrepliedCount={unrepliedCount}
      />

      {/* Primary Action Modal */}
      <GetReviewsModal
        isOpen={isGetMoreModalOpen}
        onClose={() => setIsGetMoreModalOpen(false)}
        business={business}
        onLogRequest={handleLogRequest}
        onSelectQrTab={() => {
          setActiveTab('more');
          setSubView('qrcode');
        }}
      />

      {/* Minimal Onboarding Setup Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        business={business}
        onUpdateBusiness={handleUpdateBusiness}
        onGetFirstReview={() => setIsGetMoreModalOpen(true)}
      />
    </div>
  );
}
