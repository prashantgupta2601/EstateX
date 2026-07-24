export type NotificationType =
  | 'new_lead'
  | 'lead_update'
  | 'listing_approved'
  | 'listing_rejected'
  | 'plan_expiring'
  | 'plan_expired'
  | 'price_alert'
  | 'system';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // e.g. "10 mins ago"
  actionUrl: string;
}

export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'new_lead',
    title: 'New High Intent Buyer Lead',
    message: 'Aarav Mehta submitted a contact enquiry for "Luxury 3 BHK Villa in DLF Phase 5, Gurgaon".',
    isRead: false,
    createdAt: '12 mins ago',
    actionUrl: '/seller/leads',
  },
  {
    id: 'notif-2',
    type: 'listing_approved',
    title: 'Property Listing Approved',
    message: 'Your listing "4 BHK Duplex Penthouse in Golf Course Road" has passed verification and is now live.',
    isRead: false,
    createdAt: '45 mins ago',
    actionUrl: '/listings',
  },
  {
    id: 'notif-3',
    type: 'plan_expiring',
    title: 'Pro Plan Expiring Soon',
    message: 'Your annual Pro Seller Plan will expire in 7 days. Renew now to maintain unlimited listing benefits.',
    isRead: false,
    createdAt: '2 hours ago',
    actionUrl: '/seller/subscription',
  },
  {
    id: 'notif-4',
    type: 'lead_update',
    title: 'Lead Status Changed to Site Visit',
    message: 'Priya Sharma has scheduled a physical site visit for tomorrow at 3:00 PM for Bandra West Apartment.',
    isRead: false,
    createdAt: '3 hours ago',
    actionUrl: '/seller/leads',
  },
  {
    id: 'notif-5',
    type: 'price_alert',
    title: 'Locality Price Index Updated',
    message: 'Average price per sq.ft in Golf Course Road increased by +4.2% this month.',
    isRead: false,
    createdAt: '5 hours ago',
    actionUrl: '/seller/analytics',
  },
  {
    id: 'notif-6',
    type: 'system',
    title: 'KYC Document Verified',
    message: 'Your GST registration certificate and PAN details have been successfully verified.',
    isRead: true,
    createdAt: '1 day ago',
    actionUrl: '/seller/profile',
  },
  {
    id: 'notif-7',
    type: 'new_lead',
    title: 'New WhatsApp Inquiry',
    message: 'Rohan Gupta requested a callback regarding "Modern 2 BHK Builder Floor in Sushant Lok 1".',
    isRead: true,
    createdAt: '1 day ago',
    actionUrl: '/seller/leads',
  },
  {
    id: 'notif-8',
    type: 'listing_rejected',
    title: 'Listing Action Required',
    message: 'Your property "Commercial Office Space in Sohna Road" requires clearer ownership documentation before approval.',
    isRead: true,
    createdAt: '2 days ago',
    actionUrl: '/listings',
  },
  {
    id: 'notif-9',
    type: 'lead_update',
    title: 'Negotiation Note Added',
    message: 'Vikram Malhotra made an offer of ₹3.45 Cr for your Cyber City Penthouse.',
    isRead: true,
    createdAt: '2 days ago',
    actionUrl: '/seller/leads',
  },
  {
    id: 'notif-10',
    type: 'system',
    title: 'Monthly Performance Summary Ready',
    message: 'Your July 2026 seller analytics report is ready. You received 47 total buyer leads this month.',
    isRead: true,
    createdAt: '3 days ago',
    actionUrl: '/seller/analytics',
  },
  {
    id: 'notif-11',
    type: 'new_lead',
    title: 'Exclusive Buyer Enquiry',
    message: 'Kavita Reddy viewed your featured listing 4 times and requested brochure download.',
    isRead: true,
    createdAt: '4 days ago',
    actionUrl: '/seller/leads',
  },
  {
    id: 'notif-12',
    type: 'listing_approved',
    title: 'Featured Listing Boost Activated',
    message: 'Your property "3 BHK Sea View Apartment, Worli" is now featured on the top search results.',
    isRead: true,
    createdAt: '5 days ago',
    actionUrl: '/listings',
  },
  {
    id: 'notif-13',
    type: 'price_alert',
    title: 'Competitor Price Reduction',
    message: '3 similar properties in Sector 54, Gurgaon reduced prices by an average of ₹15 Lakhs.',
    isRead: true,
    createdAt: '6 days ago',
    actionUrl: '/seller/analytics',
  },
  {
    id: 'notif-14',
    type: 'plan_expired',
    title: 'Add-on Featured Pack Expired',
    message: 'Your 30-day Featured Add-on Boost for DLF Phase 5 listing has expired.',
    isRead: true,
    createdAt: '1 week ago',
    actionUrl: '/seller/subscription',
  },
  {
    id: 'notif-15',
    type: 'system',
    title: 'Security Login Alert',
    message: 'New login detected from Chrome browser on Windows 11 (Gurgaon, India).',
    isRead: true,
    createdAt: '1 week ago',
    actionUrl: '/seller/profile',
  },
  {
    id: 'notif-16',
    type: 'lead_update',
    title: 'Lead Closed & Deal Converted',
    message: 'Congratulations! Buyer Ananya Roy marked deal as closed for ₹2.8 Cr.',
    isRead: true,
    createdAt: '2 weeks ago',
    actionUrl: '/seller/leads',
  },
];

export const notifications = mockNotifications;
