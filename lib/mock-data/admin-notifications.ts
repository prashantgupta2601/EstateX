export type AdminNotificationType =
  | 'broker_kyc'
  | 'listing_pending'
  | 'user_report'
  | 'payment_failed'
  | 'traffic_alert'
  | 'admin_registered';

export interface AdminNotificationItem {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string; // e.g. "10 mins ago"
  actionUrl: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
}

export const mockAdminNotifications: AdminNotificationItem[] = [
  {
    id: 'anotif-1',
    type: 'listing_pending',
    title: 'New Listing Pending Approval',
    message: 'DLF Crest 4BHK Penthouse submitted by Vikramaditya Sharma requires moderation.',
    isRead: false,
    createdAt: '10 mins ago',
    actionUrl: '/admin/listings',
    severity: 'warning',
  },
  {
    id: 'anotif-2',
    type: 'broker_kyc',
    title: 'New Broker KYC Submission',
    message: 'Rohan Mehta (Mumbai Prime Realty) submitted RERA certificate MH-2024-89012 for verification.',
    isRead: false,
    createdAt: '35 mins ago',
    actionUrl: '/admin/verifications',
    severity: 'info',
  },
  {
    id: 'anotif-3',
    type: 'user_report',
    title: 'Flagged Content Report Filed',
    message: 'Buyer reported listing #PROP-3312 "Fake Price & Blurry Photos" in Sector 62 Gurgaon.',
    isRead: false,
    createdAt: '1 hour ago',
    actionUrl: '/admin/reports',
    severity: 'critical',
  },
  {
    id: 'anotif-4',
    type: 'payment_failed',
    title: 'Seller Payment Transaction Failed',
    message: 'Payment of ₹8,849 failed for seller Deepak Verma (Noida Estates) via Razorpay.',
    isRead: false,
    createdAt: '2 hours ago',
    actionUrl: '/admin/revenue',
    severity: 'warning',
  },
  {
    id: 'anotif-5',
    type: 'traffic_alert',
    title: 'High Traffic Volume Spike',
    message: 'Platform page views surged by +340% over baseline following Delhi NCR real estate promo.',
    isRead: true,
    createdAt: '4 hours ago',
    actionUrl: '/admin/analytics',
    severity: 'info',
  },
  {
    id: 'anotif-6',
    type: 'admin_registered',
    title: 'New Sub-Admin Invited',
    message: 'Operations Manager Rajesh Kumar joined control center as Sub-Admin.',
    isRead: true,
    createdAt: '1 day ago',
    actionUrl: '/admin/users',
    severity: 'success',
  },
  {
    id: 'anotif-7',
    type: 'listing_pending',
    title: 'Commercial Property Review',
    message: 'Godrej Woods 2BHK Office Space submitted for approval by Ananya Deshmukh.',
    isRead: true,
    createdAt: '1 day ago',
    actionUrl: '/admin/listings',
    severity: 'info',
  },
  {
    id: 'anotif-8',
    type: 'broker_kyc',
    title: 'Broker Re-verification Requested',
    message: 'Karthik Menon (Kerala Real Estate) uploaded updated GST registration copy.',
    isRead: true,
    createdAt: '2 days ago',
    actionUrl: '/admin/verifications',
    severity: 'info',
  },
  {
    id: 'anotif-9',
    type: 'user_report',
    title: 'Multiple Spam Inquiries Reported',
    message: 'Account SpamLeadGen flagged by 4 sellers for automated phone scraping.',
    isRead: true,
    createdAt: '2 days ago',
    actionUrl: '/admin/reports',
    severity: 'critical',
  },
  {
    id: 'anotif-10',
    type: 'payment_failed',
    title: 'Subscription Renewal Warning',
    message: 'Pro Plan renewal for Rashmi Sawant failed 2 consecutive attempts.',
    isRead: true,
    createdAt: '3 days ago',
    actionUrl: '/admin/revenue',
    severity: 'warning',
  },
  {
    id: 'anotif-11',
    type: 'traffic_alert',
    title: 'Database Backup Completed',
    message: 'Automated 90-day compliance database snapshot completed successfully (1.4 GB).',
    isRead: true,
    createdAt: '4 days ago',
    actionUrl: '/admin/logs',
    severity: 'success',
  },
  {
    id: 'anotif-12',
    type: 'listing_pending',
    title: 'Luxury Villa Approval Required',
    message: 'Prestige Falcon City 4BHK Villa in Bengaluru submitted by Siddarth Oberoi.',
    isRead: true,
    createdAt: '5 days ago',
    actionUrl: '/admin/listings',
    severity: 'info',
  },
];
