export interface SellerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  plan: 'free' | 'basic' | 'pro';
  isVerified: boolean;
  kycStatus: 'pending' | 'verified' | 'failed' | 'not_started';
  joinedDate: string;
  totalListings: number;
  activeListings: number;
}

export const sellerProfile: SellerProfile = {
  id: 'seller-123',
  name: 'Prashant Gupta',
  email: 'prashant.seller@estatex.com',
  phone: '+91 98765 43210',
  avatar: '', // Left empty so it falls back to initial-based Avatar component
  plan: 'pro',
  isVerified: true,
  kycStatus: 'verified',
  joinedDate: '2025-01-15',
  totalListings: 12,
  activeListings: 8,
};
