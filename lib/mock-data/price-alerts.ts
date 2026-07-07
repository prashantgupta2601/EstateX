export interface PriceAlert {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  targetPrice: number;
  currentPrice: number;
  priceDropPercent: number;
  alertTriggered: boolean;
  createdAt: string;
}

export const mockPriceAlerts: PriceAlert[] = [
  {
    id: 'pa-1',
    propertyId: 'prop-1',
    propertyTitle: '3 BHK Premium Apartment in DLF Phase 5',
    propertyImage: 'https://placehold.co/800x600/1e293b/ffffff?text=Property+1+-+Main+View',
    targetPrice: 25000000,
    currentPrice: 24500000,
    priceDropPercent: 2,
    alertTriggered: true,
    createdAt: '2026-07-01T10:00:00Z',
  },
  {
    id: 'pa-2',
    propertyId: 'prop-2',
    propertyTitle: '4 BHK Ultra Luxury Villa',
    propertyImage: 'https://placehold.co/800x600/1e293b/ffffff?text=Property+2+-+Main+View',
    targetPrice: 55000000,
    currentPrice: 58000000,
    priceDropPercent: 0,
    alertTriggered: false,
    createdAt: '2026-07-02T11:30:00Z',
  },
  {
    id: 'pa-3',
    propertyId: 'prop-3',
    propertyTitle: '2 BHK Modern Flat near Sector 62',
    propertyImage: 'https://placehold.co/800x600/1e293b/ffffff?text=Property+3+-+Main+View',
    targetPrice: 8000000,
    currentPrice: 7500000,
    priceDropPercent: 6.25,
    alertTriggered: true,
    createdAt: '2026-07-04T15:00:00Z',
  },
  {
    id: 'pa-4',
    propertyId: 'prop-5',
    propertyTitle: 'Residential Plot in Devanahalli',
    propertyImage: 'https://placehold.co/800x600/1e293b/ffffff?text=Property+5+-+Main+View',
    targetPrice: 7000000,
    currentPrice: 6500000,
    priceDropPercent: 7.1,
    alertTriggered: true,
    createdAt: '2026-07-05T09:00:00Z',
  },
];
