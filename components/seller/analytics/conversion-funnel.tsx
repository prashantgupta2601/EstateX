'use client';

import React, { useState, useEffect } from 'react';
import { 
  FunnelChart, 
  Funnel, 
  LabelList, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Eye, User, MessageSquare, PhoneCall, CheckCircle2, TrendingDown, ArrowRight } from 'lucide-react';

interface ConversionFunnelProps {
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

const STAGE_CONFIGS = [
  { 
    name: 'Property Views', 
    key: 'views',
    icon: Eye, 
    fill: '#3b82f6', // blue-500
    bgLight: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
  },
  { 
    name: 'Profile Views', 
    key: 'profile',
    icon: User, 
    fill: '#6366f1', // indigo-500
    bgLight: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
  },
  { 
    name: 'Enquiries Sent', 
    key: 'enquiries',
    icon: MessageSquare, 
    fill: '#8b5cf6', // violet-500
    bgLight: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20'
  },
  { 
    name: 'Leads Received', 
    key: 'leads',
    icon: PhoneCall, 
    fill: '#ec4899', // pink-500
    bgLight: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20'
  },
  { 
    name: 'Converted', 
    key: 'converted',
    icon: CheckCircle2, 
    fill: '#10b981', // emerald-500
    bgLight: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  },
];

const MULTIPLIERS: Record<string, number> = {
  '7d': 0.25,
  '30d': 1.0,
  '90d': 2.8,
  '1y': 11.2,
};

const BASE_DATA = [
  { name: 'Property Views', value: 1000, stage: 0 },
  { name: 'Profile Views', value: 234, stage: 1 },
  { name: 'Enquiries Sent', value: 89, stage: 2 },
  { name: 'Leads Received', value: 47, stage: 3 },
  { name: 'Converted', value: 8, stage: 4 },
];

export function ConversionFunnel({ timeRange = '30d' }: ConversionFunnelProps) {
  const [mounted, setMounted] = useState(false);
  const [activeStage, setActiveStage] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const multiplier = MULTIPLIERS[timeRange] || 1.0;

  const funnelData = BASE_DATA.map((item, idx) => {
    const rawVal = Math.round(item.value * multiplier);
    return {
      ...item,
      value: rawVal,
      fill: STAGE_CONFIGS[idx].fill,
    };
  });

  const topValue = funnelData[0].value;
  const leadValue = funnelData[3].value;
  const convertedValue = funnelData[4].value;

  const overallConversionFromViews = ((convertedValue / topValue) * 100).toFixed(1);
  const overallConversionFromLeads = ((convertedValue / leadValue) * 100).toFixed(1);

  return (
    <Card className="rounded-2xl border-border/40 shadow-xs bg-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <CardTitle className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <span>Conversion Funnel</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              End-to-End Flow
            </span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            Visualizing buyer drop-off from initial property view to closed deal
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overall Win Rate</span>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
              <span>{overallConversionFromLeads}%</span>
              <span className="text-[10px] font-normal text-muted-foreground">(Lead → Deal)</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex flex-col gap-6">
        {/* Main Content Grid: Recharts Funnel + Stage Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Funnel Chart Area */}
          <div className="lg:col-span-7 h-[320px] w-full relative flex items-center justify-center p-2 rounded-xl bg-muted/20 border border-border/30">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const pctOfTotal = ((data.value / topValue) * 100).toFixed(1);
                        const prevVal = data.stage > 0 ? funnelData[data.stage - 1].value : null;
                        const stepConv = prevVal ? ((data.value / prevVal) * 100).toFixed(1) : '100';

                        return (
                          <div className="bg-popover/95 backdrop-blur-md border border-border/60 text-popover-foreground p-3 rounded-xl shadow-lg text-xs space-y-1">
                            <div className="font-bold flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
                              {data.name}
                            </div>
                            <div className="text-foreground font-black text-sm">{data.value.toLocaleString()} count</div>
                            <div className="text-muted-foreground flex justify-between gap-4">
                              <span>% of Views:</span>
                              <span className="font-bold text-foreground">{pctOfTotal}%</span>
                            </div>
                            {data.stage > 0 && (
                              <div className="text-muted-foreground flex justify-between gap-4">
                                <span>Step Conversion:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stepConv}%</span>
                              </div>
                            )}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Funnel
                    dataKey="value"
                    data={funnelData}
                    isAnimationActive
                    onMouseEnter={(_, index) => setActiveStage(index)}
                    onMouseLeave={() => setActiveStage(null)}
                  >
                    <LabelList
                      position="right"
                      fill="currentColor"
                      stroke="none"
                      dataKey="name"
                      className="text-[11px] font-bold text-foreground fill-foreground"
                      formatter={(val: unknown) => String(val || '')}
                    />
                    {funnelData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        opacity={activeStage === null || activeStage === index ? 1 : 0.45}
                        className="transition-opacity duration-200 cursor-pointer"
                      />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center text-muted-foreground text-xs animate-pulse">
                Loading conversion funnel...
              </div>
            )}
          </div>

          {/* Stage Cards & Metrics Breakdown */}
          <div className="lg:col-span-5 flex flex-col gap-2.5">
            {funnelData.map((stage, idx) => {
              const config = STAGE_CONFIGS[idx];
              const Icon = config.icon;
              const pctOfTotal = ((stage.value / topValue) * 100).toFixed(1);

              // Step drop-off rate from previous stage
              const prevVal = idx > 0 ? funnelData[idx - 1].value : null;
              const stepConversion = prevVal ? ((stage.value / prevVal) * 100).toFixed(1) : '100';
              const stepDrop = prevVal ? (100 - parseFloat(stepConversion)).toFixed(1) : '0';

              const isHovered = activeStage === idx;

              return (
                <div
                  key={stage.name}
                  onMouseEnter={() => setActiveStage(idx)}
                  onMouseLeave={() => setActiveStage(null)}
                  className={`p-3 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                    isHovered 
                      ? 'bg-accent/60 border-primary/40 shadow-xs scale-[1.01]' 
                      : 'bg-muted/10 border-border/30 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg border ${config.bgLight} shrink-0`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground truncate">{stage.name}</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                          {pctOfTotal}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        {idx === 0 ? (
                          <span>Top of funnel</span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <ArrowRight className="h-2.5 w-2.5" />
                            {stepConversion}% step pass
                            <span className="text-muted-foreground/60">({stepDrop}% drop)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-foreground">{stage.value.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Funnel Insight Summary Footer */}
        <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-900/30 flex items-start gap-3">
          <TrendingDown className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-indigo-900 dark:text-indigo-200">Funnel Insight: </span>
            The biggest drop-off occurs between <span className="font-semibold text-foreground">Property Views → Profile Views</span> ({((1 - 234/1000)*100).toFixed(0)}% drop). High enquiry retention ({((89/234)*100).toFixed(0)}%) indicates interested visitors have strong buyer intent.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
