'use client';

import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer 
} from 'recharts';
import { localityPriceTrends, getLocalityKey } from '@/lib/mock-data/price-trends';
import { Card } from '@/components/ui/card';
import { TrendingUp, ArrowDown, ArrowUp } from 'lucide-react';

interface PriceTrendsProps {
  address: string;
  city: string;
}

export default function PriceTrends({ address, city }: PriceTrendsProps) {
  const [duration, setDuration] = useState<'6m' | '12m'>('12m');

  const localityKey = getLocalityKey(address, city);
  const allTrendData = localityPriceTrends[localityKey] || [];

  if (allTrendData.length === 0) {
    return null;
  }

  // Filter data based on selected duration
  const activeData = duration === '6m' 
    ? allTrendData.slice(-6) 
    : allTrendData;

  // Calculate summary stats
  const totalSum = activeData.reduce((acc, curr) => acc + curr.pricePerSqft, 0);
  const averagePrice = Math.round(totalSum / activeData.length);

  const minPrice = Math.min(...allTrendData.map((d) => d.pricePerSqft));
  const maxPrice = Math.max(...allTrendData.map((d) => d.pricePerSqft));

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Title & Duration Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Locality Price Trends</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Historical price per sqft trends in {localityKey}</p>
        </div>
        
        {/* Simple Tab Switcher */}
        <div className="flex p-1 bg-muted rounded-xl w-fit self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDuration('6m')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              duration === '6m' 
                ? 'bg-card text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            6 Months
          </button>
          <button
            type="button"
            onClick={() => setDuration('12m')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              duration === '12m' 
                ? 'bg-card text-foreground shadow-xs' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            12 Months
          </button>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-[260px] sm:h-[320px] bg-card/15 border border-border/50 rounded-3xl p-4 sm:p-6 relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.4)" />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10} 
              fontWeight={600}
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10} 
              fontWeight={600}
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(val) => `₹${val/1000}k`}
              dx={-5}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border) / 0.8)', 
                borderRadius: '16px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'hsl(var(--foreground))',
                boxShadow: 'var(--shadow-md)'
              }}
              formatter={(value) => [formatPrice(Number(value || 0)), 'Price/sqft']}
              labelStyle={{ color: 'hsl(var(--muted-foreground))', fontSize: '10px', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="pricePerSqft" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: 'hsl(var(--card))' }}
              activeDot={{ r: 6, strokeWidth: 0, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Average Price Card */}
        <Card className="p-4 bg-card/25 border border-border/80 rounded-2xl flex items-center gap-3.5 hover:bg-card/45 hover:border-border transition-colors shadow-xs">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Average Price ({duration === '6m' ? '6M' : '12M'})</span>
            <span className="text-sm font-black text-foreground mt-0.5">{formatPrice(averagePrice)} / sqft</span>
          </div>
        </Card>

        {/* Lowest Price Card */}
        <Card className="p-4 bg-card/25 border border-border/80 rounded-2xl flex items-center gap-3.5 hover:bg-card/45 hover:border-border transition-colors shadow-xs">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
            <ArrowDown className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Lowest Price (12M)</span>
            <span className="text-sm font-black text-foreground mt-0.5">{formatPrice(minPrice)} / sqft</span>
          </div>
        </Card>

        {/* Highest Price Card */}
        <Card className="p-4 bg-card/25 border border-border/80 rounded-2xl flex items-center gap-3.5 hover:bg-card/45 hover:border-border transition-colors shadow-xs">
          <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
            <ArrowUp className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Highest Price (12M)</span>
            <span className="text-sm font-black text-foreground mt-0.5">{formatPrice(maxPrice)} / sqft</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
