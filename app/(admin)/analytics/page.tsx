'use client';

import React, { useState, useMemo } from 'react';
import { 
  mockTrafficData, 
  mockTopPages, 
  mockDeviceBreakdown, 
  mockCityWiseListings, 
  mockSearchTrends, 
  DailyTraffic 
} from '@/lib/mock-data/platform-analytics';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Eye, 
  Users, 
  Clock, 
  Activity, 
  Smartphone, 
  Laptop, 
  Tablet, 
  MapPin, 
  Search, 
  Download, 
  Calendar, 
  ChevronRight, 
  Filter, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/toast';

type DateRangeOption = '7d' | '30d' | '90d' | 'custom';
type TimeGranularity = 'daily' | 'weekly' | 'monthly';

export default function PlatformAnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
  const [granularity, setGranularity] = useState<TimeGranularity>('daily');
  const [customStart, setCustomStart] = useState('2026-07-01');
  const [customEnd, setCustomEnd] = useState('2026-08-06');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter traffic data based on selected date range
  const filteredTrafficData = useMemo(() => {
    let sliceDays = 30;
    if (dateRange === '7d') sliceDays = 7;
    else if (dateRange === '30d') sliceDays = 30;
    else if (dateRange === '90d') sliceDays = 90;

    if (dateRange === 'custom') {
      return mockTrafficData.filter((item) => {
        return item.fullDate >= customStart && item.fullDate <= customEnd;
      });
    }

    return mockTrafficData.slice(-sliceDays);
  }, [dateRange, customStart, customEnd]);

  // Aggregate chart data based on granularity (Daily, Weekly, Monthly)
  const chartData = useMemo(() => {
    if (granularity === 'daily') {
      return filteredTrafficData;
    }

    if (granularity === 'weekly') {
      const weeks: DailyTraffic[] = [];
      for (let i = 0; i < filteredTrafficData.length; i += 7) {
        const chunk = filteredTrafficData.slice(i, i + 7);
        if (chunk.length === 0) continue;
        const totalPV = chunk.reduce((acc, curr) => acc + curr.pageViews, 0);
        const totalUV = chunk.reduce((acc, curr) => acc + curr.uniqueVisitors, 0);
        const avgBounce = Math.round(
          chunk.reduce((acc, curr) => acc + curr.bounceRate, 0) / chunk.length
        );
        weeks.push({
          date: `Week ${Math.floor(i / 7) + 1} (${chunk[0].date})`,
          fullDate: chunk[0].fullDate,
          pageViews: totalPV,
          uniqueVisitors: totalUV,
          sessions: Math.round(totalUV * 1.25),
          bounceRate: avgBounce,
        });
      }
      return weeks;
    }

    // Monthly
    const monthsMap: { [key: string]: { pv: number; uv: number; count: number; date: string } } = {};
    filteredTrafficData.forEach((item) => {
      const monthKey = item.date.split(' ')[0]; // e.g. "May", "Jun", "Jul", "Aug"
      if (!monthsMap[monthKey]) {
        monthsMap[monthKey] = { pv: 0, uv: 0, count: 0, date: monthKey };
      }
      monthsMap[monthKey].pv += item.pageViews;
      monthsMap[monthKey].uv += item.uniqueVisitors;
      monthsMap[monthKey].count += 1;
    });

    return Object.keys(monthsMap).map((key) => ({
      date: monthsMap[key].date,
      fullDate: key,
      pageViews: monthsMap[key].pv,
      uniqueVisitors: monthsMap[key].uv,
      sessions: Math.round(monthsMap[key].uv * 1.25),
      bounceRate: 41,
    }));
  }, [filteredTrafficData, granularity]);

  // Aggregate KPI summary metrics
  const summaryMetrics = useMemo(() => {
    const totalPV = filteredTrafficData.reduce((acc, curr) => acc + curr.pageViews, 0);
    const totalUV = filteredTrafficData.reduce((acc, curr) => acc + curr.uniqueVisitors, 0);
    const avgBounce = Math.round(
      filteredTrafficData.reduce((acc, curr) => acc + curr.bounceRate, 0) /
        (filteredTrafficData.length || 1)
    );

    return {
      totalPV,
      totalUV,
      avgSessionDuration: '3m 24s',
      bounceRate: `${avgBounce}%`,
    };
  }, [filteredTrafficData]);

  // Format large numbers (e.g. 1420000 -> 1.42M, 425000 -> 425K)
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString('en-IN');
  };

  // Format price (e.g. 24500000 -> ₹2.45 Cr, 9500000 -> ₹95.00 L)
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast('Analytics data refreshed.', 'success');
    }, 600);
  };

  const handleExportCSV = () => {
    toast(`Exported traffic analytics report for ${dateRange.toUpperCase()}.`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="h-6 w-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Platform Analytics & Insights
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time traffic trends, visitor engagement, top pages, and geographic distribution across EstateX.
          </p>
        </div>

        {/* Date Range Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDateRange('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateRange === '7d'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Last 7D
            </button>
            <button
              type="button"
              onClick={() => setDateRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateRange === '30d'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Last 30D
            </button>
            <button
              type="button"
              onClick={() => setDateRange('90d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateRange === '90d'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Last 90D
            </button>
            <button
              type="button"
              onClick={() => setDateRange('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateRange === 'custom'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              Custom
            </button>
          </div>

          {/* Custom Date Pickers */}
          {dateRange === 'custom' && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-300 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={handleExportCSV}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
          >
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Row 1 — Traffic Metrics (4 KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Page Views
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
                {formatNumber(summaryMetrics.totalPV)}
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+14.8% vs prev period</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Eye className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Unique Visitors
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
                {formatNumber(summaryMetrics.totalUV)}
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+9.2% vs prev period</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Avg Session Duration
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
                {summaryMetrics.avgSessionDuration}
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+18s longer retention</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/60 border-slate-800/80 backdrop-blur-sm relative overflow-hidden">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Bounce Rate
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mt-1">
                {summaryMetrics.bounceRate}
              </h3>
              <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-1">
                <ArrowDownRight className="h-3.5 w-3.5" />
                <span>-3.1% (Healthy lower)</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — Traffic Chart (Recharts AreaChart) */}
      <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Traffic Growth & Visitor Volume
            </CardTitle>
            <CardDescription className="text-xs text-slate-400 mt-0.5">
              Comparative visualization of total page views vs unique visitors over time ({dateRange.toUpperCase()}).
            </CardDescription>
          </div>

          {/* Time Granularity Toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setGranularity('daily')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                granularity === 'daily'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily
            </button>
            <button
              type="button"
              onClick={() => setGranularity('weekly')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                granularity === 'weekly'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Weekly
            </button>
            <button
              type="button"
              onClick={() => setGranularity('monthly')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                granularity === 'monthly'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Recharts AreaChart Container */}
        <div className="h-[360px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="pageViewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="uniqueVisitorsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => formatNumber(val)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                  fontSize: '12px',
                  color: '#f8fafc',
                }}
                itemStyle={{ color: '#f8fafc', padding: '2px 0' }}
                labelStyle={{ fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px' }}
                formatter={(value: any, name: any) => [
                  typeof value === 'number' ? value.toLocaleString('en-IN') : value,
                  name === 'pageViews' ? 'Page Views' : 'Unique Visitors',
                ]}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                height={36} 
                formatter={(val) => (
                  <span className="text-xs font-semibold text-slate-300">
                    {val === 'pageViews' ? 'Page Views' : 'Unique Visitors'}
                  </span>
                )}
              />

              <Area
                type="monotone"
                dataKey="pageViews"
                stroke="#6366f1"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#pageViewsGradient)"
              />
              <Area
                type="monotone"
                dataKey="uniqueVisitors"
                stroke="#06b6d4"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#uniqueVisitorsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Row 3 — Content & Geographic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages Table (2 cols) */}
        <Card className="lg:col-span-2 bg-slate-900/80 border-slate-800 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="h-5 w-5 text-indigo-400" />
                  Most Visited Pages
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Ranking top URL routes by page views, user duration, and exit rates.
                </CardDescription>
              </div>
              <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-xs">
                Top 8 URLs
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-2">Page Route</th>
                    <th className="py-3 px-2 text-right">Page Views</th>
                    <th className="py-3 px-2 text-right">Unique Views</th>
                    <th className="py-3 px-2 text-right">Avg Time</th>
                    <th className="py-3 px-2 text-right">Exit Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-200">
                  {mockTopPages.map((item, idx) => (
                    <tr key={item.page} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 font-mono font-medium text-slate-100 flex items-center gap-2">
                        <span className="text-slate-500 text-[10px] w-4">{idx + 1}.</span>
                        <span className="text-indigo-400">{item.page}</span>
                      </td>
                      <td className="py-3 px-2 text-right font-bold text-white">
                        {item.views.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2 text-right text-slate-400">
                        {item.uniqueViews.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-2 text-right font-medium text-emerald-400">
                        {item.avgTimeOnPage}
                      </td>
                      <td className="py-3 px-2 text-right text-slate-400">
                        {item.exitRate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Device Breakdown Card (1 col) */}
        <Card className="bg-slate-900/80 border-slate-800 p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-sky-400" />
                  Device Breakdown
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Distribution of users across mobile, desktop, and tablet.
                </CardDescription>
              </div>
            </div>

            {/* Visual Bars */}
            <div className="space-y-5 mt-6">
              {/* Mobile */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Smartphone className="h-4 w-4 text-indigo-400" /> Mobile Phones
                  </span>
                  <span className="text-indigo-400 font-bold">{mockDeviceBreakdown.mobile}%</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${mockDeviceBreakdown.mobile}%` }}
                  />
                </div>
              </div>

              {/* Desktop */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Laptop className="h-4 w-4 text-sky-400" /> Desktop / Laptops
                  </span>
                  <span className="text-sky-400 font-bold">{mockDeviceBreakdown.desktop}%</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-sky-500 rounded-full transition-all duration-500"
                    style={{ width: `${mockDeviceBreakdown.desktop}%` }}
                  />
                </div>
              </div>

              {/* Tablet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2 text-slate-200">
                    <Tablet className="h-4 w-4 text-emerald-400" /> Tablets
                  </span>
                  <span className="text-emerald-400 font-bold">{mockDeviceBreakdown.tablet}%</span>
                </div>
                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${mockDeviceBreakdown.tablet}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Highlights Box */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
            <span className="font-bold block text-indigo-400">Mobile-First Audience</span>
            <p className="text-indigo-200/90 leading-relaxed">
              65% of EstateX property buyers & sellers access listings via smartphone web browsers.
            </p>
          </div>
        </Card>
      </div>

      {/* Row 4 — City-wise Listings & Search Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* City-wise Performance Table (2 cols) */}
        <Card className="lg:col-span-2 bg-slate-900/80 border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400" />
                City-wise Property & Lead Performance
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Breakdown of active listings, buyer leads generated, and median price by city.
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-300 border-emerald-500/20 text-xs">
              Top 8 Metro Hubs
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-3">City</th>
                  <th className="py-3 px-3 text-right">Active Listings</th>
                  <th className="py-3 px-3 text-right">Leads Generated</th>
                  <th className="py-3 px-3 text-right">Median Price</th>
                  <th className="py-3 px-3 text-right">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-200">
                {mockCityWiseListings.map((city) => (
                  <tr key={city.city} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {city.city}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-slate-300">
                      {city.listings.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-indigo-400">
                      {city.leads.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-emerald-400">
                      {formatPrice(city.avgPrice)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-emerald-400">
                      {city.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Search Trends Card (1 col) */}
        <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Search className="h-5 w-5 text-amber-400" />
                Popular Search Trends
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Highest volume property query keywords typed by buyers.
              </CardDescription>
            </div>
          </div>

          <div className="space-y-3">
            {mockSearchTrends.map((trend) => (
              <div
                key={trend.keyword}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-100 line-clamp-1">
                    {trend.keyword}
                  </p>
                  <span className="text-[10px] text-slate-500">
                    {trend.searches.toLocaleString('en-IN')} searches
                  </span>
                </div>

                <Badge
                  className={`text-[10px] font-semibold gap-1 ${
                    trend.trend === 'up'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : trend.trend === 'down'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {trend.trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-400" />}
                  {trend.trend === 'down' && <TrendingDown className="h-3 w-3 text-rose-400" />}
                  {trend.trend === 'stable' && <Minus className="h-3 w-3 text-slate-400" />}
                  {trend.changePercentage}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
