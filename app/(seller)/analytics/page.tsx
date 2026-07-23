'use client';

import React, { useState } from 'react';
import { 
  BarChart2, 
  Calendar, 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConversionFunnel } from '@/components/seller/analytics/conversion-funnel';
import { SourceBreakdown } from '@/components/seller/analytics/source-breakdown';
import { LeadsOverTime } from '@/components/seller/analytics/leads-over-time';
import { PropertyPerformance } from '@/components/seller/analytics/property-performance';

type TimeRange = '7d' | '30d' | '90d' | '1y';

const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 3 Months' },
  { value: '1y', label: 'Last Year' },
];

// Scaled top-level stats based on time range
const STATS_BY_RANGE: Record<TimeRange, { views: string; enquiries: string; leads: string; deals: string; viewsChange: string; leadsChange: string }> = {
  '7d': {
    views: '250',
    enquiries: '24',
    leads: '13',
    deals: '2',
    viewsChange: '+8.2%',
    leadsChange: '+12.5%',
  },
  '30d': {
    views: '1,000',
    enquiries: '89',
    leads: '47',
    deals: '8',
    viewsChange: '+14.6%',
    leadsChange: '+18.3%',
  },
  '90d': {
    views: '2,800',
    enquiries: '256',
    leads: '138',
    deals: '24',
    viewsChange: '+22.1%',
    leadsChange: '+24.0%',
  },
  '1y': {
    views: '11,500',
    enquiries: '1,040',
    leads: '560',
    deals: '96',
    viewsChange: '+35.4%',
    leadsChange: '+41.2%',
  },
};

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentStats = STATS_BY_RANGE[timeRange];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex flex-col gap-6 text-left pb-10">
      
      {/* Top Page Header + Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Analytics Dashboard
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 ml-0.5">
            Comprehensive conversion funnel, acquisition sources, and lead performance metrics.
          </p>
        </div>

        {/* Action Controls & Date Range Selector */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="h-9 px-3 rounded-xl text-xs font-semibold border-border/60 hover:bg-muted/50 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* Date Range Selector Pill Tabs / Select */}
          <div className="hidden lg:flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/40">
            {TIME_RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTimeRange(opt.value)}
                className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                  timeRange === opt.value
                    ? 'bg-background text-foreground shadow-xs border border-border/30'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Fallback Select for smaller screens */}
          <div className="lg:hidden">
            <Select value={timeRange} onValueChange={(val) => setTimeRange(val as TimeRange)}>
              <SelectTrigger size="sm" className="h-9 rounded-xl text-xs font-bold border-border/60 bg-card min-w-[140px]">
                <Calendar className="h-3.5 w-3.5 mr-1 text-primary" />
                <SelectValue placeholder="Select Date Range" />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Top Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Property Views */}
        <Card className="rounded-2xl border-border/40 shadow-xs bg-card hover:border-border/80 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Property Views</span>
              <span className="text-2xl font-black text-foreground mt-1">{currentStats.views}</span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>{currentStats.viewsChange} vs prev period</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Eye className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Enquiries */}
        <Card className="rounded-2xl border-border/40 shadow-xs bg-card hover:border-border/80 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Enquiries Sent</span>
              <span className="text-2xl font-black text-foreground mt-1">{currentStats.enquiries}</span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>+9.4% vs prev period</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Leads */}
        <Card className="rounded-2xl border-border/40 shadow-xs bg-card hover:border-border/80 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Leads Received</span>
              <span className="text-2xl font-black text-foreground mt-1">{currentStats.leads}</span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>{currentStats.leadsChange} vs prev period</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Users className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Deals Converted */}
        <Card className="rounded-2xl border-border/40 shadow-xs bg-card hover:border-border/80 transition-colors">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Deals Converted</span>
              <span className="text-2xl font-black text-foreground mt-1">{currentStats.deals}</span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>17.0% lead conversion</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <TrendingUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requirement 2: Conversion Funnel Chart */}
      <ConversionFunnel timeRange={timeRange} />

      {/* Requirement 3 & 4: Grid with Source Breakdown and Leads Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SourceBreakdown timeRange={timeRange} />
        <LeadsOverTime timeRange={timeRange} />
      </div>

      {/* Per-Property Performance Analytics Section */}
      <PropertyPerformance />

    </div>
  );
}
