export interface DailyViewData {
  date: string;
  views: number;
}

export interface DailyLeadData {
  date: string;
  leads: number;
}

export interface CombinedDailyData {
  date: string;
  views: number;
  leads: number;
}

export interface PropertyPerformanceData {
  propertyId: string;
  title: string;
  image: string;
  city: string;
  price: number;
  type: 'sale' | 'rent';
  status: 'active' | 'pending' | 'rejected' | 'paused' | 'expired';
  totalViews: number;
  totalLeads: number;
  conversionRate: number; // percentage (e.g. 5.8)
  avgResponseTime: string; // e.g. "1.5 hours"
  viewsTrend: 'up' | 'down' | 'neutral';
  leadsTrend: 'up' | 'down' | 'neutral';
  viewsTrendPercent: string; // e.g. "+14.2%"
  leadsTrendPercent: string; // e.g. "+8.5%"
  dailyViews: DailyViewData[];
  dailyLeads: DailyLeadData[];
  combinedDaily: CombinedDailyData[];
}

// Utility to generate dates for the last 30 days
function getLast30DaysDates(): string[] {
  const dates: string[] = [];
  const today = new Date('2026-07-23');
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const month = d.toLocaleString('en-US', { month: 'short' });
    const day = d.getDate();
    dates.push(`${month} ${day}`);
  }
  return dates;
}

const dates30 = getLast30DaysDates();

// Pre-generated realistic daily datasets
const generateDailySeries = (baseViews: number, baseLeads: number, viewVariance: number, leadVariance: number) => {
  const viewsSeries: DailyViewData[] = [];
  const leadsSeries: DailyLeadData[] = [];
  const combinedSeries: CombinedDailyData[] = [];

  dates30.forEach((date, idx) => {
    // Weekend boost
    const dayFactor = (idx % 7 === 5 || idx % 7 === 6) ? 1.4 : 1.0;
    const views = Math.max(2, Math.round((baseViews + Math.sin(idx * 0.5) * viewVariance) * dayFactor));
    const leads = Math.max(0, Math.round((baseLeads + Math.cos(idx * 0.7) * leadVariance) * (dayFactor * 0.8)));

    viewsSeries.push({ date, views });
    leadsSeries.push({ date, leads });
    combinedSeries.push({ date, views, leads });
  });

  return { viewsSeries, leadsSeries, combinedSeries };
};

const prop1Data = generateDailySeries(42, 3, 15, 2);
const prop2Data = generateDailySeries(28, 1, 10, 1);
const prop3Data = generateDailySeries(12, 1, 5, 1);
const prop4Data = generateDailySeries(54, 4, 18, 2);
const prop5Data = generateDailySeries(18, 1, 6, 1);
const prop6Data = generateDailySeries(82, 5, 25, 3);
const prop7Data = generateDailySeries(4, 0, 2, 0);
const prop8Data = generateDailySeries(22, 1, 8, 1);

export const mockPropertyPerformanceList: PropertyPerformanceData[] = [
  {
    propertyId: 's-prop-4',
    title: 'Luxury 3 BHK Apartment in Hiranandani Gardens',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    city: 'Mumbai',
    price: 180000,
    type: 'rent',
    status: 'active',
    totalViews: 1560,
    totalLeads: 97,
    conversionRate: 6.22, // > 5% (Green - TOP PERFORMER)
    avgResponseTime: '1.2 hours',
    viewsTrend: 'up',
    leadsTrend: 'up',
    viewsTrendPercent: '+18.4%',
    leadsTrendPercent: '+22.1%',
    dailyViews: prop4Data.viewsSeries,
    dailyLeads: prop4Data.leadsSeries,
    combinedDaily: prop4Data.combinedSeries,
  },
  {
    propertyId: 's-prop-1',
    title: 'Premium 3 BHK Apartment in DLF Phase 5',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    city: 'Gurugram',
    price: 24500000,
    type: 'sale',
    status: 'active',
    totalViews: 1240,
    totalLeads: 68,
    conversionRate: 5.48, // > 5% (Green)
    avgResponseTime: '1.8 hours',
    viewsTrend: 'up',
    leadsTrend: 'up',
    viewsTrendPercent: '+12.3%',
    leadsTrendPercent: '+14.6%',
    dailyViews: prop1Data.viewsSeries,
    dailyLeads: prop1Data.leadsSeries,
    combinedDaily: prop1Data.combinedSeries,
  },
  {
    propertyId: 's-prop-6',
    title: '1 BHK Semi-Furnished Flat in Whitefield',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
    city: 'Bengaluru',
    price: 25000,
    type: 'rent',
    status: 'expired',
    totalViews: 2430,
    totalLeads: 95,
    conversionRate: 3.91, // 2-5% (Yellow)
    avgResponseTime: '2.5 hours',
    viewsTrend: 'down',
    leadsTrend: 'down',
    viewsTrendPercent: '-4.1%',
    leadsTrendPercent: '-2.8%',
    dailyViews: prop6Data.viewsSeries,
    dailyLeads: prop6Data.leadsSeries,
    combinedDaily: prop6Data.combinedSeries,
  },
  {
    propertyId: 's-prop-2',
    title: 'Cozy 2 BHK Flat near Sector 62',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80',
    city: 'Noida',
    price: 7500000,
    type: 'sale',
    status: 'active',
    totalViews: 890,
    totalLeads: 31,
    conversionRate: 3.48, // 2-5% (Yellow)
    avgResponseTime: '2.3 hours',
    viewsTrend: 'up',
    leadsTrend: 'neutral',
    viewsTrendPercent: '+5.7%',
    leadsTrendPercent: '+0.0%',
    dailyViews: prop2Data.viewsSeries,
    dailyLeads: prop2Data.leadsSeries,
    combinedDaily: prop2Data.combinedSeries,
  },
  {
    propertyId: 's-prop-8',
    title: 'Modern 2 BHK Apartment in Gachibowli',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    city: 'Hyderabad',
    price: 45000,
    type: 'rent',
    status: 'active',
    totalViews: 670,
    totalLeads: 19,
    conversionRate: 2.84, // 2-5% (Yellow)
    avgResponseTime: '3.1 hours',
    viewsTrend: 'up',
    leadsTrend: 'up',
    viewsTrendPercent: '+8.1%',
    leadsTrendPercent: '+5.3%',
    dailyViews: prop8Data.viewsSeries,
    dailyLeads: prop8Data.leadsSeries,
    combinedDaily: prop8Data.combinedSeries,
  },
  {
    propertyId: 's-prop-5',
    title: 'Spacious 3 BHK Row House',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&auto=format&fit=crop&q=80',
    city: 'Pune',
    price: 13500000,
    type: 'sale',
    status: 'paused',
    totalViews: 520,
    totalLeads: 15,
    conversionRate: 2.88, // 2-5% (Yellow)
    avgResponseTime: '4.0 hours',
    viewsTrend: 'down',
    leadsTrend: 'down',
    viewsTrendPercent: '-11.2%',
    leadsTrendPercent: '-8.0%',
    dailyViews: prop5Data.viewsSeries,
    dailyLeads: prop5Data.leadsSeries,
    combinedDaily: prop5Data.combinedSeries,
  },
  {
    propertyId: 's-prop-3',
    title: '4 BHK Ultra Luxury Villa',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80',
    city: 'New Delhi',
    price: 58000000,
    type: 'sale',
    status: 'pending',
    totalViews: 480,
    totalLeads: 8,
    conversionRate: 1.67, // < 2% (Red)
    avgResponseTime: '4.8 hours',
    viewsTrend: 'up',
    leadsTrend: 'neutral',
    viewsTrendPercent: '+3.2%',
    leadsTrendPercent: '0.0%',
    dailyViews: prop3Data.viewsSeries,
    dailyLeads: prop3Data.leadsSeries,
    combinedDaily: prop3Data.combinedSeries,
  },
  {
    propertyId: 's-prop-7',
    title: 'Studio Apartment near Mumbai University',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80',
    city: 'Mumbai',
    price: 32000,
    type: 'rent',
    status: 'rejected',
    totalViews: 120,
    totalLeads: 1,
    conversionRate: 0.83, // < 2% (Red)
    avgResponseTime: '6.2 hours',
    viewsTrend: 'down',
    leadsTrend: 'down',
    viewsTrendPercent: '-22.0%',
    leadsTrendPercent: '-100%',
    dailyViews: prop7Data.viewsSeries,
    dailyLeads: prop7Data.leadsSeries,
    combinedDaily: prop7Data.combinedSeries,
  },
];

// Helper to get top performing property
export function getTopPerformingProperty(): PropertyPerformanceData {
  return mockPropertyPerformanceList.reduce((top, current) => {
    return current.conversionRate > top.conversionRate ? current : top;
  }, mockPropertyPerformanceList[0]);
}
