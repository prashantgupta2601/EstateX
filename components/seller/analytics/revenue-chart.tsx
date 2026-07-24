'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { mockMonthlyRevenue } from '@/lib/mock-data/revenue';
import { TrendingUp, IndianRupee, Info, Sparkles, Building } from 'lucide-react';

export function RevenueChart() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalEstimatedRevenue = mockMonthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalDeals = mockMonthlyRevenue.reduce((acc, curr) => acc + curr.deals, 0);

  // Currency formatter helper: ₹14.5L or ₹1.45 Cr
  const formatCurrencyShort = (val: number) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    }
    return `₹${val.toLocaleString()}`;
  };

  return (
    <Card className="rounded-2xl border-border/40 shadow-xs bg-card w-full text-left">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span>Estimated Lead Value per Month</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Revenue Analytics
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Monthly gross lead value estimate based on converted buyer engagements
          </CardDescription>
        </div>

        {/* Summary Pill */}
        <div className="flex items-center gap-4 p-2 px-3 rounded-xl bg-muted/20 border border-border/30 self-start sm:self-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Est. Total Lead Value</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {formatCurrencyShort(totalEstimatedRevenue)}
            </span>
          </div>
          <div className="h-7 w-px bg-border/40" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Deals Closed</span>
            <span className="text-base font-black text-foreground">{totalDeals}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-4">
        {/* Recharts Bar Chart */}
        <div className="h-[280px] w-full relative flex items-center justify-center p-2 rounded-xl bg-muted/10 border border-border/30">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyRevenue} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />

                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11, fill: 'currentColor' }} 
                  className="text-muted-foreground font-semibold"
                  axisLine={{ stroke: 'var(--border)' }}
                  tickLine={false}
                />

                <YAxis 
                  tick={{ fontSize: 10, fill: 'currentColor' }} 
                  className="text-muted-foreground font-semibold"
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 100000).toFixed(0)}L`}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-popover/95 backdrop-blur-md border border-border/60 text-popover-foreground p-3 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[170px]">
                          <div className="font-bold text-foreground border-b border-border/40 pb-1">{item.month}</div>
                          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                            <span>Est. Value:</span>
                            <span>{formatCurrencyShort(item.revenue)}</span>
                          </div>
                          <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                            <span>Deals Converted:</span>
                            <span className="font-bold text-foreground">{item.deals}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground/80 pt-1 border-t border-border/20 flex items-center gap-1">
                            <Info className="h-3 w-3 text-primary shrink-0" />
                            <span>Based on average property deal value in your city.</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar 
                  dataKey="revenue" 
                  radius={[6, 6, 0, 0]}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {mockMonthlyRevenue.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={activeIndex === null || activeIndex === index ? '#10b981' : '#34d399'} 
                      opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                      className="transition-all duration-200 cursor-pointer"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center text-muted-foreground text-xs animate-pulse">
              Loading revenue chart...
            </div>
          )}
        </div>

        {/* Disclaimer Text below chart */}
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/20">
          <span className="flex items-center gap-1.5 font-medium">
            <Info className="h-3.5 w-3.5 text-muted-foreground/80 shrink-0" />
            Estimated figures for reference only.
          </span>

          <span className="hidden sm:inline-block italic text-[10px] text-muted-foreground/70">
            Calculated using average property transaction value per locality
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
