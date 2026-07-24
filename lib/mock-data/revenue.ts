export interface CurrentPlan {
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  listingsUsed: number;
  listingsLimit: number;
  featuredUsed: number;
  featuredLimit: number;
}

export interface PaymentRecord {
  id: string;
  plan: string;
  amount: number;
  date: string;
  status: 'success' | 'failed';
  invoiceUrl: string;
  paymentMethod: string;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number; // in ₹ (INR)
  deals: number;
  avgDealValue: number;
}

export const mockCurrentPlan: CurrentPlan = {
  name: 'Pro Seller Plan',
  price: 4999,
  billingCycle: 'yearly',
  startDate: '2026-01-15',
  endDate: '2026-12-31',
  listingsUsed: 8,
  listingsLimit: 10,
  featuredUsed: 2,
  featuredLimit: 3,
};

export const currentPlan = mockCurrentPlan;

export const mockPaymentHistory: PaymentRecord[] = [
  {
    id: 'INV-2026-006',
    plan: 'Pro Seller Plan (Yearly Renewal)',
    amount: 4999,
    date: '2026-01-15',
    status: 'success',
    invoiceUrl: '#',
    paymentMethod: 'UPI / GPay (•••• 4321)',
  },
  {
    id: 'INV-2025-012',
    plan: 'Featured Add-on (DLF Phase 5)',
    amount: 1499,
    date: '2025-11-20',
    status: 'success',
    invoiceUrl: '#',
    paymentMethod: 'Credit Card (•••• 8812)',
  },
  {
    id: 'INV-2025-009',
    plan: 'Featured Add-on Boost',
    amount: 1499,
    date: '2025-09-10',
    status: 'failed',
    invoiceUrl: '#',
    paymentMethod: 'NetBanking (HDFC)',
  },
  {
    id: 'INV-2025-001',
    plan: 'Pro Seller Plan (Yearly)',
    amount: 4999,
    date: '2025-01-15',
    status: 'success',
    invoiceUrl: '#',
    paymentMethod: 'UPI / PhonePe (•••• 1098)',
  },
  {
    id: 'INV-2024-008',
    plan: 'Basic Seller Plan (Monthly)',
    amount: 999,
    date: '2024-08-01',
    status: 'success',
    invoiceUrl: '#',
    paymentMethod: 'Credit Card (•••• 8812)',
  },
  {
    id: 'INV-2024-007',
    plan: 'Basic Seller Plan (Monthly)',
    amount: 999,
    date: '2024-07-01',
    status: 'success',
    invoiceUrl: '#',
    paymentMethod: 'Credit Card (•••• 8812)',
  },
];

export const paymentHistory = mockPaymentHistory;

export const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: 'Feb 2026', revenue: 450000, deals: 1, avgDealValue: 450000 },
  { month: 'Mar 2026', revenue: 780000, deals: 2, avgDealValue: 390000 },
  { month: 'Apr 2026', revenue: 1250000, deals: 3, avgDealValue: 416666 },
  { month: 'May 2026', revenue: 920000, deals: 2, avgDealValue: 460000 },
  { month: 'Jun 2026', revenue: 1680000, deals: 4, avgDealValue: 420000 },
  { month: 'Jul 2026', revenue: 1450000, deals: 3, avgDealValue: 483333 },
];

export const monthlyRevenue = mockMonthlyRevenue;
