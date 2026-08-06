export interface DailyTraffic {
  date: string; // ISO date YYYY-MM-DD or formatted "MMM DD"
  fullDate: string;
  pageViews: number;
  uniqueVisitors: number;
  sessions: number;
  bounceRate: number; // percentage
}

export interface TopPage {
  page: string;
  views: number;
  avgTimeOnPage: string;
  uniqueViews: number;
  exitRate: string;
}

export interface DeviceBreakdown {
  mobile: number; // percentage (e.g. 65)
  desktop: number; // percentage (e.g. 28)
  tablet: number; // percentage (e.g. 7)
}

export interface CityAnalytics {
  city: string;
  listings: number;
  leads: number;
  avgPrice: number; // in INR
  growth: string;
}

export interface SearchTrend {
  keyword: string;
  searches: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: string;
}

// Generate 90 days of realistic traffic data leading up to 2026-08-06
const generate90DaysTraffic = (): DailyTraffic[] => {
  const result: DailyTraffic[] = [];
  const startDate = new Date('2026-05-09');

  for (let i = 0; i < 90; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);

    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const baseFactor = isWeekend ? 1.3 : 1.0; // higher weekend real estate traffic
    const growthTrend = 1 + i * 0.005; // slight upward growth over 90 days

    // Random variance
    const variance = 0.9 + Math.sin(i * 0.5) * 0.15;

    const pageViews = Math.round(14500 * baseFactor * growthTrend * variance);
    const uniqueVisitors = Math.round(pageViews * (0.62 + (Math.random() * 0.05 - 0.025)));
    const sessions = Math.round(uniqueVisitors * 1.25);
    const bounceRate = Math.round(38 + (Math.random() * 8 - 4));

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${monthNames[d.getMonth()]} ${d.getDate()}`;
    const isoDate = d.toISOString().split('T')[0];

    result.push({
      date: formattedDate,
      fullDate: isoDate,
      pageViews,
      uniqueVisitors,
      sessions,
      bounceRate,
    });
  }

  return result;
};

export const mockTrafficData: DailyTraffic[] = generate90DaysTraffic();

export const mockTopPages: TopPage[] = [
  { page: '/properties', views: 342150, uniqueViews: 218400, avgTimeOnPage: '4m 12s', exitRate: '28%' },
  { page: '/search', views: 289400, uniqueViews: 195200, avgTimeOnPage: '3m 45s', exitRate: '22%' },
  { page: '/properties/[id]', views: 215800, uniqueViews: 148900, avgTimeOnPage: '5m 08s', exitRate: '35%' },
  { page: '/seller/dashboard', views: 98400, uniqueViews: 42100, avgTimeOnPage: '6m 30s', exitRate: '18%' },
  { page: '/emi-calculator', views: 84200, uniqueViews: 65100, avgTimeOnPage: '2m 50s', exitRate: '41%' },
  { page: '/seller/listings/new', views: 62900, uniqueViews: 28400, avgTimeOnPage: '7m 15s', exitRate: '15%' },
  { page: '/compare', views: 48300, uniqueViews: 34900, avgTimeOnPage: '3m 10s', exitRate: '32%' },
  { page: '/subscription', views: 39100, uniqueViews: 26800, avgTimeOnPage: '2m 18s', exitRate: '48%' },
];

export const mockDeviceBreakdown: DeviceBreakdown = {
  mobile: 65,
  desktop: 28,
  tablet: 7,
};

export const mockCityWiseListings: CityAnalytics[] = [
  { city: 'Gurugram', listings: 1420, leads: 8940, avgPrice: 24500000, growth: '+18.4%' },
  { city: 'Mumbai', listings: 2150, leads: 14200, avgPrice: 48500000, growth: '+12.1%' },
  { city: 'Bengaluru', listings: 1980, leads: 12650, avgPrice: 16500000, growth: '+22.5%' },
  { city: 'New Delhi', listings: 1120, leads: 6890, avgPrice: 38000000, growth: '+9.3%' },
  { city: 'Pune', listings: 980, leads: 5420, avgPrice: 12800000, growth: '+15.7%' },
  { city: 'Hyderabad', listings: 1340, leads: 9100, avgPrice: 19500000, growth: '+24.1%' },
  { city: 'Noida', listings: 890, leads: 4780, avgPrice: 9500000, growth: '+14.2%' },
  { city: 'Chennai', listings: 760, leads: 3950, avgPrice: 14200000, growth: '+8.6%' },
];

export const mockSearchTrends: SearchTrend[] = [
  { keyword: '3 BHK DLF Phase 5 Gurugram', searches: 42800, trend: 'up', changePercentage: '+34%' },
  { keyword: 'Sea facing flat Bandra', searches: 38900, trend: 'up', changePercentage: '+28%' },
  { keyword: 'Independent Villa Indiranagar', searches: 29400, trend: 'stable', changePercentage: '+2%' },
  { keyword: '2 BHK under 1 Cr Bengaluru', searches: 26100, trend: 'up', changePercentage: '+19%' },
  { keyword: 'Penthouse Vasant Kunj', searches: 18500, trend: 'down', changePercentage: '-8%' },
  { keyword: 'Gated Society HSR Layout', searches: 16200, trend: 'up', changePercentage: '+14%' },
  { keyword: 'Plot Sector 150 Noida', searches: 12400, trend: 'stable', changePercentage: '+1%' },
];
