export type TabType = 'home' | 'reviews' | 'more';

export type MoreSubView = 
  | 'none'
  | 'customers'
  | 'requests'
  | 'qrcode'
  | 'analytics'
  | 'campaigns'
  | 'autoreplies'
  | 'settings'
  | 'support'
  | 'pricing';

export interface BusinessProfile {
  id: string;
  name: string;
  location: string;
  category: string;
  googleRating: number;
  totalReviews: number;
  monthlyReviewsCount: number;
  reviewGoal: number;
  googleReviewUrl: string;
  autoReplyEnabled: boolean;
  autoReplyTone: 'friendly' | 'professional' | 'concise';
  isPaid?: boolean;
  subscriptionPlan?: 'founder' | 'monthly' | 'none';
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  timeAgo: string;
  replied: boolean;
  replyText?: string;
  replyDate?: string;
  isAutoReplied?: boolean;
}

export interface CustomerRequest {
  id: string;
  customerName: string;
  phoneOrEmail: string;
  channel: 'whatsapp' | 'sms' | 'link' | 'qr';
  sentAt: string;
  status: 'sent' | 'opened' | 'reviewed';
}

export interface MonthlyMetric {
  month: string;
  count: number;
}
