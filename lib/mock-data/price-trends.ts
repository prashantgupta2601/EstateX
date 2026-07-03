export interface PriceTrendPoint {
  month: string;
  pricePerSqft: number;
}

export const localityPriceTrends: Record<string, PriceTrendPoint[]> = {
  'Bandra': [
    { month: 'Jul 2025', pricePerSqft: 48500 },
    { month: 'Aug 2025', pricePerSqft: 49000 },
    { month: 'Sep 2025', pricePerSqft: 49200 },
    { month: 'Oct 2025', pricePerSqft: 49900 },
    { month: 'Nov 2025', pricePerSqft: 50500 },
    { month: 'Dec 2025', pricePerSqft: 51200 },
    { month: 'Jan 2026', pricePerSqft: 51000 },
    { month: 'Feb 2026', pricePerSqft: 51800 },
    { month: 'Mar 2026', pricePerSqft: 52400 },
    { month: 'Apr 2026', pricePerSqft: 53000 },
    { month: 'May 2026', pricePerSqft: 53900 },
    { month: 'Jun 2026', pricePerSqft: 54500 },
  ],
  'Koramangala': [
    { month: 'Jul 2025', pricePerSqft: 10200 },
    { month: 'Aug 2025', pricePerSqft: 10400 },
    { month: 'Sep 2025', pricePerSqft: 10500 },
    { month: 'Oct 2025', pricePerSqft: 10700 },
    { month: 'Nov 2025', pricePerSqft: 10900 },
    { month: 'Dec 2025', pricePerSqft: 11200 },
    { month: 'Jan 2026', pricePerSqft: 11100 },
    { month: 'Feb 2026', pricePerSqft: 11400 },
    { month: 'Mar 2026', pricePerSqft: 11600 },
    { month: 'Apr 2026', pricePerSqft: 11800 },
    { month: 'May 2026', pricePerSqft: 12200 },
    { month: 'Jun 2026', pricePerSqft: 12500 },
  ],
  'Golf Course Road': [
    { month: 'Jul 2025', pricePerSqft: 13200 },
    { month: 'Aug 2025', pricePerSqft: 13400 },
    { month: 'Sep 2025', pricePerSqft: 13700 },
    { month: 'Oct 2025', pricePerSqft: 14000 },
    { month: 'Nov 2025', pricePerSqft: 14200 },
    { month: 'Dec 2025', pricePerSqft: 14600 },
    { month: 'Jan 2026', pricePerSqft: 14500 },
    { month: 'Feb 2026', pricePerSqft: 14900 },
    { month: 'Mar 2026', pricePerSqft: 15200 },
    { month: 'Apr 2026', pricePerSqft: 15400 },
    { month: 'May 2026', pricePerSqft: 15800 },
    { month: 'Jun 2026', pricePerSqft: 16100 },
  ],
  'Jubilee Hills': [
    { month: 'Jul 2025', pricePerSqft: 11500 },
    { month: 'Aug 2025', pricePerSqft: 11700 },
    { month: 'Sep 2025', pricePerSqft: 11800 },
    { month: 'Oct 2025', pricePerSqft: 12100 },
    { month: 'Nov 2025', pricePerSqft: 12300 },
    { month: 'Dec 2025', pricePerSqft: 12600 },
    { month: 'Jan 2026', pricePerSqft: 12500 },
    { month: 'Feb 2026', pricePerSqft: 12800 },
    { month: 'Mar 2026', pricePerSqft: 13100 },
    { month: 'Apr 2026', pricePerSqft: 13200 },
    { month: 'May 2026', pricePerSqft: 13400 },
    { month: 'Jun 2026', pricePerSqft: 13600 },
  ],
  'Koregaon Park': [
    { month: 'Jul 2025', pricePerSqft: 9500 },
    { month: 'Aug 2025', pricePerSqft: 9600 },
    { month: 'Sep 2025', pricePerSqft: 9750 },
    { month: 'Oct 2025', pricePerSqft: 9900 },
    { month: 'Nov 2025', pricePerSqft: 10100 },
    { month: 'Dec 2025', pricePerSqft: 10300 },
    { month: 'Jan 2026', pricePerSqft: 10200 },
    { month: 'Feb 2026', pricePerSqft: 10450 },
    { month: 'Mar 2026', pricePerSqft: 10600 },
    { month: 'Apr 2026', pricePerSqft: 10700 },
    { month: 'May 2026', pricePerSqft: 10900 },
    { month: 'Jun 2026', pricePerSqft: 11100 },
  ],
  'Sainik Farms': [
    { month: 'Jul 2025', pricePerSqft: 14100 },
    { month: 'Aug 2025', pricePerSqft: 14300 },
    { month: 'Sep 2025', pricePerSqft: 14450 },
    { month: 'Oct 2025', pricePerSqft: 14800 },
    { month: 'Nov 2025', pricePerSqft: 15100 },
    { month: 'Dec 2025', pricePerSqft: 15400 },
    { month: 'Jan 2026', pricePerSqft: 15300 },
    { month: 'Feb 2026', pricePerSqft: 15600 },
    { month: 'Mar 2026', pricePerSqft: 15950 },
    { month: 'Apr 2026', pricePerSqft: 16100 },
    { month: 'May 2026', pricePerSqft: 16400 },
    { month: 'Jun 2026', pricePerSqft: 16800 },
  ],
  'Salt Lake': [
    { month: 'Jul 2025', pricePerSqft: 6500 },
    { month: 'Aug 2025', pricePerSqft: 6600 },
    { month: 'Sep 2025', pricePerSqft: 6650 },
    { month: 'Oct 2025', pricePerSqft: 6800 },
    { month: 'Nov 2025', pricePerSqft: 6900 },
    { month: 'Dec 2025', pricePerSqft: 7100 },
    { month: 'Jan 2026', pricePerSqft: 7050 },
    { month: 'Feb 2026', pricePerSqft: 7200 },
    { month: 'Mar 2026', pricePerSqft: 7350 },
    { month: 'Apr 2026', pricePerSqft: 7400 },
    { month: 'May 2026', pricePerSqft: 7600 },
    { month: 'Jun 2026', pricePerSqft: 7750 },
  ],
  'Besant Nagar': [
    { month: 'Jul 2025', pricePerSqft: 8100 },
    { month: 'Aug 2025', pricePerSqft: 8250 },
    { month: 'Sep 2025', pricePerSqft: 8300 },
    { month: 'Oct 2025', pricePerSqft: 8500 },
    { month: 'Nov 2025', pricePerSqft: 8700 },
    { month: 'Dec 2025', pricePerSqft: 8900 },
    { month: 'Jan 2026', pricePerSqft: 8800 },
    { month: 'Feb 2026', pricePerSqft: 9000 },
    { month: 'Mar 2026', pricePerSqft: 9250 },
    { month: 'Apr 2026', pricePerSqft: 9400 },
    { month: 'May 2026', pricePerSqft: 9700 },
    { month: 'Jun 2026', pricePerSqft: 9900 },
  ],
};

export function getLocalityKey(address: string, city: string): string {
  const addrLower = address.toLowerCase();
  const cityLower = city.toLowerCase();
  
  if (addrLower.includes('bandra') || addrLower.includes('worli') || addrLower.includes('andheri') || cityLower.includes('mumbai')) return 'Bandra';
  if (addrLower.includes('koramangala') || addrLower.includes('indiranagar') || addrLower.includes('electronic') || cityLower.includes('bengaluru')) return 'Koramangala';
  if (addrLower.includes('golf course') || addrLower.includes('dlf') || addrLower.includes('mg road') || cityLower.includes('gurugram')) return 'Golf Course Road';
  if (addrLower.includes('jubilee') || addrLower.includes('gachibowli') || cityLower.includes('hyderabad')) return 'Jubilee Hills';
  if (addrLower.includes('koregaon') || addrLower.includes('hadapsar') || cityLower.includes('pune')) return 'Koregaon Park';
  if (addrLower.includes('sainik') || addrLower.includes('connaught') || addrLower.includes('south ext') || addrLower.includes('dwarka') || cityLower.includes('delhi')) return 'Sainik Farms';
  if (addrLower.includes('salt lake') || addrLower.includes('alipore') || cityLower.includes('kolkata')) return 'Salt Lake';
  if (addrLower.includes('besant') || addrLower.includes('adyar') || cityLower.includes('chennai')) return 'Besant Nagar';
  
  return 'Golf Course Road'; // default
}
