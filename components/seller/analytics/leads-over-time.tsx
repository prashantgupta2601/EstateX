'use client';

import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, TrendingUp, Sparkles, Filter } from 'lucide-react';

interface LeadsOverTimeProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

type Granularity = 'day' | 'week' | 'month';

// Generate mock data according to selected date range and granularity
function generateTrendData(timeRange: '7d' | '30d' | '90d' | '1y', granularity: Granularity) {
  if (granularity === 'month') {
    return [
      { date: 'Jan 2026', leads: 32, views: 680, enquiries: 64 },
      { date: 'Feb 2026', leads: 38, views: 790, enquiries: 72 },
      { date: 'Mar 2026', leads: 42, views: 880, enquiries: 80 },
      { date: 'Apr 2026', leads: 45, views: 920, enquiries: 85 },
      { date: 'May 2026', leads: 51, views: 1040, enquiries: 96 },
      { date: 'Jun 2026', leads: 48, views: 980, enquiries: 91 },
      { date: 'Jul 2026', leads: 56, views: 1150, enquiries: 108 },
    ];
  }

  if (granularity === 'week') {
    return [
      { date: 'W1 (Jun)', leads: 11, views: 240, enquiries: 21 },
      { date: 'W2 (Jun)', leads: 14, views: 290, enquiries: 26 },
      { date: 'W3 (Jun)', leads: 10, views: 210, enquiries: 19 },
      { date: 'W4 (Jun)', leads: 15, views: 310, enquiries: 28 },
      { date: 'W1 (Jul)', leads: 12, views: 260, enquiries: 23 },
      { date: 'W2 (Jul)', leads: 18, views: 370, enquiries: 34 },
      { date: 'W3 (Jul)', leads: 16, views: 340, enquiries: 31 },
    ];
  }

  // Daily view
  if (timeRange === '7d') {
    return [
      { date: 'Jul 17', leads: 4, views: 90, enquiries: 8 },
      { date: 'Jul 18', leads: 7, views: 140, enquiries: 13 },
      { date: 'Jul 19', leads: 5, views: 110, enquiries: 9 },
      { date: 'Jul 20', leads: 9, views: 180, enquiries: 17 },
      { date: 'Jul 21', leads: 6, views: 130, enquiries: 11 },
      { date: 'Jul 22', leads: 11, views: 210, enquiries: 20 },
      { date: 'Jul 23', leads: 8, views: 160, enquiries: 15 },
    ];
  }

  // 30d daily data sampling (last 10 days for crisp chart readability)
  return [
    { date: 'Jul 14', leads: 3, views: 75, enquiries: 6 },
    { date: 'Jul 15', leads: 5, views: 105, enquiries: 9 },
    { date: 'Jul 16', leads: 4, views: 92, enquiries: 7 },
    { date: 'Jul 17', leads: 6, views: 125, enquiries: 11 },
    { date: 'Jul 18', leads: 8, views: 160, enquiries: 15 },
    { date: 'Jul 19', leads: 5, views: 110, enquiries: 10 },
    { date: 'Jul 20', leads: 9, views: 185, enquiries: 17 },
    { date: 'Jul 21', leads: 7, views: 145, enquiries: 13 },
    { date: 'Jul 22', leads: 11, views: 215, enquiries: 21 },
    { date: 'Jul 23', leads: 8, views: 165, enquiries: 15 },
  ];
}

export function LeadsOverTime({ timeRange = '30d' }: LeadsOverTimeProps) {
  const [granularity, setGranularity] = useState<Granularity>('day');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const data = generateTrendData(timeRange, granularity);

  const totalPeriodLeads = data.reduce((sum, item) => sum + item.leads, 0);
  const avgLeadsPerUnit = (totalPeriodLeads / data.length).toFixed(1);
  const maxLeadsItem = data.reduce((max, item) => (item.leads > max.leads ? item : max), data[0]);

  return (
    <Card className="rounded-2xl border-border/40 shadow-xs bg-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span>Leads Over Time</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Trend Analysis
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Tracking buyer lead volume progression and peak engagement periods
          </CardDescription>
        </div>

        {/* Toggle Granularity Buttons */}
        <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/30 self-start sm:self-center">
          <Button
            variant={granularity === 'day' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setGranularity('day')}
            className={`h-7 px-3 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              granularity === 'day' ? 'shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Day
          </Button>
          <Button
            variant={granularity === 'week' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setGranularity('week')}
            className={`h-7 px-3 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              granularity === 'week' ? 'shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Week
          </Button>
          <Button
            variant={granularity === 'month' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setGranularity('month')}
            className={`h-7 px-3 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              granularity === 'month' ? 'shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Month
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-6">
        {/* KPI Strip above chart */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Range Leads</span>
              <div className="text-xl font-black text-foreground mt-0.5">{totalPeriodLeads}</div>
            </div>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Average / {granularity.charAt(0).toUpperCase() + granularity.slice(1)}
              </span>
              <div className="text-xl font-black text-foreground mt-0.5">{avgLeadsPerUnit}</div>
            </div>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Peak Period</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                {maxLeadsItem.leads} <span className="text-xs font-normal text-muted-foreground">({maxLeadsItem.date})</span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-[300px] w-full relative flex items-center justify-center p-2 rounded-xl bg-muted/10 border border-border/30">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />

                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: 'currentColor' }} 
                  className="text-muted-foreground font-semibold"
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'currentColor' }} 
                  className="text-muted-foreground font-semibold"
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover/95 backdrop-blur-md border border-border/60 text-popover-foreground p-3 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[140px]">
                          <div className="font-bold text-foreground border-b border-border/40 pb-1">{label}</div>
                          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-extrabold">
                            <span>Leads:</span>
                            <span className="text-sm">{payload[0].value}</span>
                          </div>
                          {payload[1] && (
                            <div className="flex items-center justify-between text-blue-500 font-semibold">
                              <span>Property Views:</span>
                              <span>{payload[1].value}</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="views"
                  name="Property Views"
                  stroke="#3b82f6"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#viewsGradient)"
                />

                <Area
                  type="monotone"
                  dataKey="leads"
                  name="Leads"
                  stroke="#6366f1"
                  strokeWidth={3}
                  activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2, fill: '#ffffff' }}
                  fillOpacity={1}
                  fill="url(#leadGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center text-muted-foreground text-xs animate-pulse">
              Loading trend graph...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
