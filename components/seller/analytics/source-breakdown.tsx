'use client';

import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Globe, MessageCircle, Phone, Mail, Sparkles, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';

interface SourceBreakdownProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

const SOURCES = [
  {
    id: 'website',
    name: 'Website Direct',
    icon: Globe,
    color: '#3b82f6', // blue-500
    baseCount: 18,
    avgResponse: '1.2 hrs',
    conversionRate: '16.7%',
    tag: 'Highest Volume',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: MessageCircle,
    color: '#10b981', // emerald-500
    baseCount: 15,
    avgResponse: '12 mins',
    conversionRate: '26.7%',
    tag: 'Fastest Response',
  },
  {
    id: 'phone',
    name: 'Phone Call',
    icon: Phone,
    color: '#f59e0b', // amber-500
    baseCount: 9,
    avgResponse: '25 mins',
    conversionRate: '22.2%',
    tag: 'High Intent',
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    color: '#8b5cf6', // violet-500
    baseCount: 5,
    avgResponse: '3.5 hrs',
    conversionRate: '20.0%',
    tag: 'Detailed Enquiries',
  },
];

const MULTIPLIERS: Record<string, number> = {
  '7d': 0.25,
  '30d': 1.0,
  '90d': 2.8,
  '1y': 11.2,
};

export function SourceBreakdown({ timeRange = '30d' }: SourceBreakdownProps) {
  const [mounted, setMounted] = useState(false);
  const [activeSource, setActiveSource] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const multiplier = MULTIPLIERS[timeRange] || 1.0;

  const data = SOURCES.map((src) => {
    const count = Math.max(1, Math.round(src.baseCount * multiplier));
    return {
      ...src,
      count,
    };
  });

  const totalLeads = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="rounded-2xl border-border/40 shadow-xs bg-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span>Lead Source Breakdown</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Acquisition Channels
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Distribution of incoming leads by communication platform
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border/30 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Top Channel: <strong className="text-foreground">Website Direct ({((data[0].count / totalLeads) * 100).toFixed(0)}%)</strong></span>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-6">
        {/* Upper Section: Donut Chart + Interactive Legend Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Donut PieChart */}
          <div className="lg:col-span-5 h-[260px] w-full relative flex items-center justify-center p-2 rounded-xl bg-muted/10 border border-border/30">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        const pct = ((item.count / totalLeads) * 100).toFixed(1);
                        const Icon = item.icon;

                        return (
                          <div className="bg-popover/95 backdrop-blur-md border border-border/60 text-popover-foreground p-3 rounded-xl shadow-lg text-xs space-y-1.5">
                            <div className="font-bold flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              <Icon className="h-3.5 w-3.5" />
                              {item.name}
                            </div>
                            <div className="text-foreground font-black text-sm">{item.count} leads ({pct}%)</div>
                            <div className="text-muted-foreground text-[11px] flex justify-between gap-4">
                              <span>Avg Response:</span>
                              <span className="font-semibold text-foreground">{item.avgResponse}</span>
                            </div>
                            <div className="text-muted-foreground text-[11px] flex justify-between gap-4">
                              <span>Conversion Rate:</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{item.conversionRate}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="count"
                    isAnimationActive
                    onMouseEnter={(_, index) => setActiveSource(data[index].id)}
                    onMouseLeave={() => setActiveSource(null)}
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.id}
                        fill={entry.color}
                        opacity={activeSource === null || activeSource === entry.id ? 1 : 0.45}
                        stroke="transparent"
                        className="transition-opacity duration-200 cursor-pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground text-xs animate-pulse">
                Loading source breakdown...
              </div>
            )}

            {/* Center Summary Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black tracking-tight text-foreground">{totalLeads}</span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">Total Leads</span>
            </div>
          </div>

          {/* Interactive Legend Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.map((src) => {
              const Icon = src.icon;
              const pct = ((src.count / totalLeads) * 100).toFixed(1);
              const isHovered = activeSource === src.id;

              return (
                <div
                  key={src.id}
                  onMouseEnter={() => setActiveSource(src.id)}
                  onMouseLeave={() => setActiveSource(null)}
                  className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                    isHovered 
                      ? 'bg-accent/60 border-primary/40 shadow-xs scale-[1.01]' 
                      : 'bg-muted/10 border-border/30 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                      <div className="p-1.5 rounded-lg bg-muted/60 text-foreground">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-foreground truncate">{src.name}</span>
                    </div>

                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {src.tag}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-border/20">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-foreground">{src.count}</span>
                      <span className="text-[11px] text-muted-foreground font-semibold">leads</span>
                    </div>
                    <span className="text-xs font-black text-primary">{pct}% share</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Detailed Summary Table */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">Channel Performance Table</h4>
            <span className="text-[11px] text-muted-foreground">Updated in real-time</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/40 bg-card">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-3.5">Source Channel</th>
                  <th className="py-2.5 px-3.5 text-right">Lead Count</th>
                  <th className="py-2.5 px-3.5 text-right">Share (%)</th>
                  <th className="py-2.5 px-3.5 text-right">Avg Response</th>
                  <th className="py-2.5 px-3.5 text-right">Conversion Rate</th>
                  <th className="py-2.5 px-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {data.map((src) => {
                  const Icon = src.icon;
                  const pct = ((src.count / totalLeads) * 100).toFixed(1);

                  return (
                    <tr 
                      key={src.id} 
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-2.5 px-3.5 font-bold text-foreground flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: src.color }} />
                        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{src.name}</span>
                      </td>

                      <td className="py-2.5 px-3.5 text-right font-extrabold text-foreground">
                        {src.count}
                      </td>

                      <td className="py-2.5 px-3.5 text-right font-bold text-muted-foreground">
                        {pct}%
                      </td>

                      <td className="py-2.5 px-3.5 text-right font-medium text-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {src.avgResponse}
                        </span>
                      </td>

                      <td className="py-2.5 px-3.5 text-right font-black text-emerald-600 dark:text-emerald-400">
                        {src.conversionRate}
                      </td>

                      <td className="py-2.5 px-3.5 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                          <CheckCircle className="h-2.5 w-2.5" />
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
