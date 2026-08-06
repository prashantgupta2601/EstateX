export interface PlanFeatureConfig {
  listingsLimit: number; // -1 for unlimited
  featuredListings: number;
  photoLimit: number;
  videoUpload: boolean;
  analyticsAccess: boolean;
  prioritySupport: boolean;
  verifiedBadge: boolean;
  phoneReveal: boolean;
  leadManagement: boolean;
}

export interface SubscriptionPlanData {
  id: string;
  name: string;
  description: string;
  badgeColor: 'amber' | 'indigo' | 'emerald' | 'sky' | 'rose' | 'violet';
  monthlyPrice: number;
  yearlyPrice: number;
  isPopular: boolean;
  isActive: boolean;
  activeSubscribers: number;
  revenueThisMonth: number;
  features: PlanFeatureConfig;
}

export interface PromoCodeData {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  currentUses: number;
  maxUses: number;
  expiryDate: string;
  isActive: boolean;
}

export const initialSubscriptionPlans: SubscriptionPlanData[] = [
  {
    id: 'plan-free',
    name: 'Free Tier',
    description: 'Basic access for individual property owners listing single properties.',
    badgeColor: 'sky',
    monthlyPrice: 0,
    yearlyPrice: 0,
    isPopular: false,
    isActive: true,
    activeSubscribers: 342,
    revenueThisMonth: 0,
    features: {
      listingsLimit: 1,
      featuredListings: 0,
      photoLimit: 5,
      videoUpload: false,
      analyticsAccess: false,
      prioritySupport: false,
      verifiedBadge: false,
      phoneReveal: true,
      leadManagement: false,
    },
  },
  {
    id: 'plan-basic',
    name: 'Basic Seller Plan',
    description: 'Designed for active property owners and solo brokers with multiple listings.',
    badgeColor: 'indigo',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    isPopular: false,
    isActive: true,
    activeSubscribers: 89,
    revenueThisMonth: 88911,
    features: {
      listingsLimit: 10,
      featuredListings: 2,
      photoLimit: 15,
      videoUpload: false,
      analyticsAccess: true,
      prioritySupport: false,
      verifiedBadge: true,
      phoneReveal: true,
      leadManagement: true,
    },
  },
  {
    id: 'plan-pro',
    name: 'Pro Seller Plan',
    description: 'Full-featured package for established real estate agencies and high-volume brokers.',
    badgeColor: 'amber',
    monthlyPrice: 7499,
    yearlyPrice: 74990,
    isPopular: true,
    isActive: true,
    activeSubscribers: 34,
    revenueThisMonth: 254966,
    features: {
      listingsLimit: 50,
      featuredListings: 10,
      photoLimit: 30,
      videoUpload: true,
      analyticsAccess: true,
      prioritySupport: true,
      verifiedBadge: true,
      phoneReveal: true,
      leadManagement: true,
    },
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise Broker Plan',
    description: 'Unlimited capacity, dedicated account manager, and custom API integrations.',
    badgeColor: 'emerald',
    monthlyPrice: 19999,
    yearlyPrice: 199990,
    isPopular: false,
    isActive: false,
    activeSubscribers: 0,
    revenueThisMonth: 0,
    features: {
      listingsLimit: -1,
      featuredListings: 25,
      photoLimit: 50,
      videoUpload: true,
      analyticsAccess: true,
      prioritySupport: true,
      verifiedBadge: true,
      phoneReveal: true,
      leadManagement: true,
    },
  },
];

export const initialPromoCodes: PromoCodeData[] = [
  {
    id: 'promo-1',
    code: 'ESTATE50',
    discountType: 'percentage',
    discountValue: 50,
    currentUses: 42,
    maxUses: 100,
    expiryDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'promo-2',
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    currentUses: 88,
    maxUses: 200,
    expiryDate: '2026-10-15',
    isActive: true,
  },
  {
    id: 'promo-3',
    code: 'FESTIVE1000',
    discountType: 'fixed',
    discountValue: 1000,
    currentUses: 15,
    maxUses: 50,
    expiryDate: '2026-11-05',
    isActive: true,
  },
  {
    id: 'promo-4',
    code: 'DIWALI2026',
    discountType: 'percentage',
    discountValue: 30,
    currentUses: 0,
    maxUses: 500,
    expiryDate: '2026-11-20',
    isActive: true,
  },
  {
    id: 'promo-5',
    code: 'EARLYBIRD',
    discountType: 'fixed',
    discountValue: 2500,
    currentUses: 50,
    maxUses: 50,
    expiryDate: '2026-06-30',
    isActive: false,
  },
];
