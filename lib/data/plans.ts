export interface SubscriptionPlan {
  id: 'free' | 'basic' | 'pro';
  name: string;
  price: number; // Monthly price in INR (₹)
  duration: string;
  listingsLimit: number;
  featuredListings: number;
  photoLimit: number;
  leadAccess: 'basic' | 'full' | 'full + phone reveal';
  analytics: boolean;
  prioritySupport: boolean;
  verifiedBadge: boolean;
  isPopular?: boolean;
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    duration: 'Forever',
    listingsLimit: 3,
    featuredListings: 0,
    photoLimit: 5,
    leadAccess: 'basic',
    analytics: false,
    prioritySupport: false,
    verifiedBadge: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 999,
    duration: '30 days',
    listingsLimit: 10,
    featuredListings: 2,
    photoLimit: 15,
    leadAccess: 'full',
    analytics: true,
    prioritySupport: false,
    verifiedBadge: true,
    isPopular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 2499,
    duration: '30 days',
    listingsLimit: 999, // unlimited
    featuredListings: 10,
    photoLimit: 30,
    leadAccess: 'full + phone reveal',
    analytics: true,
    prioritySupport: true,
    verifiedBadge: true,
  },
];

export const plans = subscriptionPlans;
