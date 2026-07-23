'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  mockPropertyPerformanceList, 
  getTopPerformingProperty, 
  PropertyPerformanceData 
} from '@/lib/mock-data/property-analytics';
import { 
  Trophy, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  PhoneCall, 
  Clock, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink,
  Zap,
  Building2
} from 'lucide-react';

type SortField = 'title' | 'totalViews' | 'totalLeads' | 'conversionRate';
type SortOrder = 'asc' | 'desc';

export function PropertyPerformance() {
  const [mounted, setMounted] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(mockPropertyPerformanceList[0].propertyId);
  const [sortField, setSortField] = useState<SortField>('conversionRate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    setMounted(true);
  }, []);

  const topProperty = getTopPerformingProperty();
  const selectedProperty = mockPropertyPerformanceList.find(p => p.propertyId === selectedPropertyId) || mockPropertyPerformanceList[0];

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedProperties = [...mockPropertyPerformanceList].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }

    const numA = Number(aVal);
    const numB = Number(bVal);

    return sortOrder === 'asc' ? numA - numB : numB - numA;
  });

  // Helper for conversion rate color-coding: > 5% green, 2-5% yellow, < 2% red
  const getConversionBadgeStyle = (rate: number) => {
    if (rate > 5.0) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
    if (rate >= 2.0) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
  };

  // Helper for status badge
  const getStatusBadgeStyle = (status: PropertyPerformanceData['status']) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'paused':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'expired':
        return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
      case 'rejected':
      default:
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      
      {/* 2. Top Performing Property Card */}
      <Card className="rounded-2xl border-amber-500/30 bg-gradient-to-r from-amber-500/5 via-primary/5 to-card shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
                <span>Top Performing Property</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Best Conversion
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Highest lead-to-view conversion rate across all your active listings
              </CardDescription>
            </div>
          </div>

          <Link href={`/seller/listings/${topProperty.propertyId}/edit`}>
            <Button size="sm" className="h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 text-xs shadow-xs cursor-pointer flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Boost Listing</span>
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="pt-1 pb-4">
          <div className="p-3.5 rounded-xl bg-card/80 border border-border/40 backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Property details */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-14 w-20 rounded-lg overflow-hidden border border-border/60 shrink-0 bg-muted">
                <Image 
                  src={topProperty.image} 
                  alt={topProperty.title} 
                  fill 
                  className="object-cover" 
                  sizes="80px"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <h4 className="text-sm font-bold text-foreground truncate">{topProperty.title}</h4>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="font-semibold">{topProperty.city}</span>
                  <span>•</span>
                  <span className="font-semibold text-foreground">
                    {topProperty.type === 'rent' ? `₹${topProperty.price.toLocaleString()}/mo` : `₹${(topProperty.price / 10000000).toFixed(2)} Cr`}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="flex flex-wrap items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-border/30 shrink-0">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Views</span>
                <span className="text-sm font-extrabold text-foreground">{topProperty.totalViews.toLocaleString()}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Leads</span>
                <span className="text-sm font-extrabold text-foreground">{topProperty.totalLeads}</span>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Conversion</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {topProperty.conversionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Banner text */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              <strong>This listing is your best performer!</strong> Consider boosting it for more leads.
            </span>
          </div>
        </CardContent>
      </Card>


      {/* 3. Views & Leads Over Time Chart per Property */}
      <Card className="rounded-2xl border-border/40 shadow-xs bg-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <CardTitle className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <span>Property Analytics Deep Dive</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                Daily Views vs Leads
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Select a property to analyze daily view traffic overlaid with lead acquisition over the last 30 days
            </CardDescription>
          </div>

          {/* Property Selector Dropdown */}
          <div className="w-full sm:w-[280px]">
            <Select value={selectedPropertyId} onValueChange={(val) => { if (val) setSelectedPropertyId(val); }}>
              <SelectTrigger size="sm" className="h-9 rounded-xl text-xs font-bold border-border/60 bg-card">
                <Building2 className="h-3.5 w-3.5 mr-1 text-primary shrink-0" />
                <SelectValue placeholder="Select Property" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {mockPropertyPerformanceList.map((p) => (
                  <SelectItem key={p.propertyId} value={p.propertyId} className="text-xs font-medium">
                    <span className="truncate max-w-[220px]">{p.title}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-4 flex flex-col gap-4">
          {/* Selected Property Header Summary */}
          <div className="p-3 rounded-xl bg-muted/20 border border-border/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-10 w-14 rounded-md overflow-hidden shrink-0 border border-border/50 bg-muted">
                <Image src={selectedProperty.image} alt={selectedProperty.title} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-foreground truncate">{selectedProperty.title}</span>
                <span className="text-[11px] text-muted-foreground">{selectedProperty.city}</span>
              </div>
            </div>

            <div className="flex items-center gap-5 shrink-0">
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">30-Day Views</span>
                <span className="font-black text-foreground">{selectedProperty.totalViews.toLocaleString()}</span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">30-Day Leads</span>
                <span className="font-black text-indigo-600 dark:text-indigo-400">{selectedProperty.totalLeads}</span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[10px] text-muted-foreground font-bold uppercase">Conversion</span>
                <span className={`font-black px-2 py-0.5 rounded-md border text-[11px] ${getConversionBadgeStyle(selectedProperty.conversionRate)}`}>
                  {selectedProperty.conversionRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Dual Y-Axis Recharts ComposedChart */}
          <div className="h-[300px] w-full relative flex items-center justify-center p-2 rounded-xl bg-muted/10 border border-border/30">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={selectedProperty.combinedDaily} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />

                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10, fill: 'currentColor' }} 
                    className="text-muted-foreground font-medium"
                    axisLine={{ stroke: 'var(--border)' }}
                    tickLine={false}
                  />

                  {/* Left Y-Axis for Views */}
                  <YAxis 
                    yAxisId="left"
                    tick={{ fontSize: 10, fill: 'currentColor' }} 
                    className="text-muted-foreground font-medium"
                    axisLine={false}
                    tickLine={false}
                  />

                  {/* Right Y-Axis for Leads */}
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tick={{ fontSize: 10, fill: 'currentColor' }} 
                    className="text-emerald-600 dark:text-emerald-400 font-bold"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />

                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover/95 backdrop-blur-md border border-border/60 text-popover-foreground p-3 rounded-xl shadow-lg text-xs space-y-1.5">
                            <div className="font-bold text-foreground border-b border-border/40 pb-1">{label}</div>
                            <div className="flex items-center justify-between gap-4 text-blue-600 dark:text-blue-400 font-semibold">
                              <span>Daily Views:</span>
                              <span className="font-extrabold">{payload[0]?.value}</span>
                            </div>
                            {payload[1] && (
                              <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400 font-extrabold">
                                <span>Daily Leads:</span>
                                <span>{payload[1]?.value}</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} 
                  />

                  {/* Daily Views Bar */}
                  <Bar 
                    yAxisId="left" 
                    dataKey="views" 
                    name="Property Views" 
                    fill="#3b82f6" 
                    radius={[4, 4, 0, 0]} 
                    opacity={0.8} 
                  />

                  {/* Daily Leads Overlay Line */}
                  <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="leads" 
                    name="Leads Received" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 3, fill: '#10b981' }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground text-xs animate-pulse">
                Loading property chart...
              </div>
            )}
          </div>
        </CardContent>
      </Card>


      {/* 1. Property Performance Table */}
      <Card className="rounded-2xl border-border/40 shadow-xs bg-card">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <CardTitle className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
              <span>Property Performance Table</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-muted text-muted-foreground">
                {mockPropertyPerformanceList.length} Properties
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Detailed performance metrics per listing. Click column headers to sort.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> &gt; 5% (High)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> 2-5% (Avg)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"/> &lt; 2% (Low)</span>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-card">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground select-none">
                  
                  {/* Property Column */}
                  <th 
                    onClick={() => handleSort('title')}
                    className="py-3 px-3.5 cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      <span>Property</span>
                      {sortField === 'title' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />
                      ) : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                    </div>
                  </th>

                  {/* Views Column */}
                  <th 
                    onClick={() => handleSort('totalViews')}
                    className="py-3 px-3.5 text-right cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Views</span>
                      {sortField === 'totalViews' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />
                      ) : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                    </div>
                  </th>

                  {/* Leads Column */}
                  <th 
                    onClick={() => handleSort('totalLeads')}
                    className="py-3 px-3.5 text-right cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Leads</span>
                      {sortField === 'totalLeads' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />
                      ) : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                    </div>
                  </th>

                  {/* Conversion Rate Column */}
                  <th 
                    onClick={() => handleSort('conversionRate')}
                    className="py-3 px-3.5 text-right cursor-pointer hover:text-foreground transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Conversion Rate</span>
                      {sortField === 'conversionRate' ? (
                        sortOrder === 'asc' ? <ChevronUp className="h-3 w-3 text-primary" /> : <ChevronDown className="h-3 w-3 text-primary" />
                      ) : <ArrowUpDown className="h-3 w-3 opacity-40" />}
                    </div>
                  </th>

                  {/* Avg Response Time */}
                  <th className="py-3 px-3.5 text-right">
                    Avg Response
                  </th>

                  {/* Status */}
                  <th className="py-3 px-3.5 text-center">
                    Status
                  </th>

                  {/* Action */}
                  <th className="py-3 px-3.5 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border/30">
                {sortedProperties.map((prop) => (
                  <tr key={prop.propertyId} className="hover:bg-muted/30 transition-colors">
                    
                    {/* Property Thumbnail & Title */}
                    <td className="py-3 px-3.5 max-w-[260px]">
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-14 rounded-lg overflow-hidden border border-border/50 shrink-0 bg-muted">
                          <Image 
                            src={prop.image} 
                            alt={prop.title} 
                            fill 
                            className="object-cover" 
                            sizes="56px"
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-foreground truncate">{prop.title}</span>
                          <span className="text-[11px] text-muted-foreground">{prop.city}</span>
                        </div>
                      </div>
                    </td>

                    {/* Views + Trend */}
                    <td className="py-3 px-3.5 text-right font-black text-foreground">
                      <div className="flex flex-col items-end">
                        <span>{prop.totalViews.toLocaleString()}</span>
                        <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                          prop.viewsTrend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                        }`}>
                          {prop.viewsTrend === 'up' ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                          {prop.viewsTrendPercent}
                        </span>
                      </div>
                    </td>

                    {/* Leads + Trend */}
                    <td className="py-3 px-3.5 text-right font-black text-foreground">
                      <div className="flex flex-col items-end">
                        <span>{prop.totalLeads}</span>
                        <span className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                          prop.leadsTrend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                        }`}>
                          {prop.leadsTrend === 'up' ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                          {prop.leadsTrendPercent}
                        </span>
                      </div>
                    </td>

                    {/* Conversion Rate Color-coded */}
                    <td className="py-3 px-3.5 text-right">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border ${getConversionBadgeStyle(prop.conversionRate)}`}>
                        {prop.conversionRate.toFixed(1)}%
                      </span>
                    </td>

                    {/* Avg Response Time */}
                    <td className="py-3 px-3.5 text-right font-medium text-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {prop.avgResponseTime}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusBadgeStyle(prop.status)}`}>
                        {prop.status}
                      </span>
                    </td>

                    {/* View Details */}
                    <td className="py-3 px-3.5 text-right">
                      <Link href={`/seller/listings/${prop.propertyId}/edit`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer">
                          <span>Details</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
