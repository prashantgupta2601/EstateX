export interface SellerListing {
  id: string;
  title: string;
  price: number;
  type: 'rent' | 'sale';
  bhk: number;
  city: string;
  status: 'active' | 'pending' | 'rejected' | 'paused' | 'expired';
  views: number;
  leads: number;
  postedDate: string;
  expiryDate: string;
  isFeatured: boolean;
  images: string[];
}

export const mockSellerListings: SellerListing[] = [
  {
    id: 's-prop-1',
    title: 'Premium 3 BHK Apartment in DLF Phase 5',
    price: 24500000, // 2.45 Cr
    type: 'sale',
    bhk: 3,
    city: 'Gurugram',
    status: 'active',
    views: 1240,
    leads: 48,
    postedDate: '2026-05-15',
    expiryDate: '2026-11-15',
    isFeatured: true,
    images: [
      'https://placehold.co/800x600/1e293b/ffffff?text=DLF+Phase+5+Apartment',
      'https://placehold.co/800x600/0f172a/ffffff?text=Living+Room',
    ],
  },
  {
    id: 's-prop-2',
    title: 'Cozy 2 BHK Flat near Sector 62',
    price: 7500000, // 75 L
    type: 'sale',
    bhk: 2,
    city: 'Noida',
    status: 'active',
    views: 890,
    leads: 24,
    postedDate: '2026-06-01',
    expiryDate: '2026-12-01',
    isFeatured: false,
    images: [
      'https://placehold.co/800x600/334155/ffffff?text=Sector+62+Flat',
    ],
  },
  {
    id: 's-prop-3',
    title: '4 BHK Ultra Luxury Villa',
    price: 58000000, // 5.8 Cr
    type: 'sale',
    bhk: 4,
    city: 'New Delhi',
    status: 'pending',
    views: 310,
    leads: 8,
    postedDate: '2026-07-05',
    expiryDate: '2027-01-05',
    isFeatured: true,
    images: [
      'https://placehold.co/800x600/475569/ffffff?text=Luxury+Villa',
    ],
  },
  {
    id: 's-prop-4',
    title: 'Luxury 3 BHK Apartment in Hiranandani Gardens',
    price: 180000, // 1.8 L/month
    type: 'rent',
    bhk: 3,
    city: 'Mumbai',
    status: 'active',
    views: 1560,
    leads: 62,
    postedDate: '2026-04-10',
    expiryDate: '2026-10-10',
    isFeatured: true,
    images: [
      'https://placehold.co/800x600/64748b/ffffff?text=Hiranandani+Gardens',
    ],
  },
  {
    id: 's-prop-5',
    title: 'Spacious 3 BHK Row House',
    price: 13500000, // 1.35 Cr
    type: 'sale',
    bhk: 3,
    city: 'Pune',
    status: 'paused',
    views: 520,
    leads: 15,
    postedDate: '2026-03-20',
    expiryDate: '2026-09-20',
    isFeatured: false,
    images: [
      'https://placehold.co/800x600/0284c7/ffffff?text=Pune+Row+House',
    ],
  },
  {
    id: 's-prop-6',
    title: '1 BHK Semi-Furnished Flat in Whitefield',
    price: 25000, // 25k/month
    type: 'rent',
    bhk: 1,
    city: 'Bengaluru',
    status: 'expired',
    views: 2430,
    leads: 95,
    postedDate: '2025-12-01',
    expiryDate: '2026-06-01',
    isFeatured: false,
    images: [
      'https://placehold.co/800x600/0d9488/ffffff?text=Whitefield+Flat',
    ],
  },
  {
    id: 's-prop-7',
    title: 'Studio Apartment near Mumbai University',
    price: 32000, // 32k/month
    type: 'rent',
    bhk: 1,
    city: 'Mumbai',
    status: 'rejected',
    views: 120,
    leads: 0,
    postedDate: '2026-06-25',
    expiryDate: '2026-12-25',
    isFeatured: false,
    images: [
      'https://placehold.co/800x600/4f46e5/ffffff?text=Studio+Apartment',
    ],
  },
  {
    id: 's-prop-8',
    title: 'Modern 2 BHK Apartment in Gachibowli',
    price: 45000, // 45k/month
    type: 'rent',
    bhk: 2,
    city: 'Hyderabad',
    status: 'active',
    views: 670,
    leads: 19,
    postedDate: '2026-06-12',
    expiryDate: '2026-12-12',
    isFeatured: false,
    images: [
      'https://placehold.co/800x600/0891b2/ffffff?text=Gachibowli+Apartment',
    ],
  },
  {
    id: 's-prop-9',
    title: '5 BHK Penthouse overlooking Powai Lake',
    price: 85000000, // 8.5 Cr
    type: 'sale',
    bhk: 5,
    city: 'Mumbai',
    status: 'pending',
    views: 450,
    leads: 12,
    postedDate: '2026-07-08',
    expiryDate: '2027-01-08',
    isFeatured: true,
    images: [
      'https://placehold.co/800x600/7c3aed/ffffff?text=Powai+Lake+Penthouse',
    ],
  },
  {
    id: 's-prop-10',
    title: '3 BHK Apartment in Salt Lake Sector 5',
    price: 11000000, // 1.1 Cr
    type: 'sale',
    bhk: 3,
    city: 'Kolkata',
    status: 'active',
    views: 430,
    leads: 11,
    postedDate: '2026-06-20',
    expiryDate: '2026-12-20',
    isFeatured: false,
    images: [
      'https://placehold.co/800x600/db2777/ffffff?text=Salt+Lake+Apartment',
    ],
  }
];
