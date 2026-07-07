export interface SavedSearch {
  id: string;
  name: string;
  filters: {
    city?: string;
    type?: string;
    bhk?: number | string;
    minPrice?: number;
    maxPrice?: number;
    purpose?: string;
  };
  createdAt: string;
  newListingsCount: number;
}

export const mockSavedSearches: SavedSearch[] = [
  {
    id: 'ss-1',
    name: '2 BHK Apartments in Mumbai',
    filters: {
      city: 'Mumbai',
      type: 'apartment',
      bhk: 2,
      minPrice: 5000000,
      maxPrice: 15000000,
      purpose: 'buy',
    },
    createdAt: '2026-06-25T10:00:00Z',
    newListingsCount: 3,
  },
  {
    id: 'ss-2',
    name: 'Luxury Villas in Bengaluru',
    filters: {
      city: 'Bengaluru',
      type: 'villa',
      minPrice: 20000000,
      maxPrice: 50000000,
      purpose: 'buy',
    },
    createdAt: '2026-06-30T14:30:00Z',
    newListingsCount: 0,
  },
  {
    id: 'ss-3',
    name: 'Studio Apartment in New Delhi',
    filters: {
      city: 'New Delhi',
      type: 'apartment',
      bhk: 1,
      maxPrice: 6000000,
      purpose: 'buy',
    },
    createdAt: '2026-07-02T09:15:00Z',
    newListingsCount: 1,
  },
  {
    id: 'ss-4',
    name: 'Office Spaces in Gurugram',
    filters: {
      city: 'Gurugram',
      type: 'office',
      purpose: 'commercial',
    },
    createdAt: '2026-07-05T11:00:00Z',
    newListingsCount: 5,
  },
];
