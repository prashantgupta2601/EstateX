'use client';

import React from 'react';
import { Check, X, Sparkles, Crown, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ComparisonFeature {
  name: string;
  category?: string;
  free: string | number | boolean;
  basic: string | number | boolean;
  pro: string | number | boolean;
  description?: string;
}

const comparisonFeatures: ComparisonFeature[] = [
  {
    name: 'Active Listings',
    free: 3,
    basic: 10,
    pro: 'Unlimited',
    description: 'Number of active property listings visible on the platform',
  },
  {
    name: 'Featured Listings',
    free: 0,
    basic: 2,
    pro: 10,
    description: 'Boosted visibility at top of search results and homepage',
  },
  {
    name: 'Photos per Listing',
    free: 5,
    basic: 15,
    pro: 30,
    description: 'Maximum high-res photos allowed per property',
  },
  {
    name: 'Video Upload',
    free: false,
    basic: true,
    pro: true,
    description: 'HD virtual tour and walk-through video uploads',
  },
  {
    name: 'Lead Management',
    free: 'Basic',
    basic: 'Full',
    pro: 'Full + Priority',
    description: 'Buyer lead capture, CRM inbox, and contact history',
  },
  {
    name: 'Phone Number Reveal',
    free: false,
    basic: false,
    pro: true,
    description: 'Direct access to unmasked buyer phone numbers',
  },
  {
    name: 'WhatsApp Integration',
    free: false,
    basic: true,
    pro: true,
    description: 'One-click buyer chat & instant WhatsApp lead alerts',
  },
  {
    name: 'Analytics Dashboard',
    free: false,
    basic: true,
    pro: true,
    description: 'Listing views, search impressions, and buyer interest breakdown',
  },
  {
    name: 'Performance Reports',
    free: false,
    basic: true,
    pro: true,
    description: 'Exportable monthly lead performance and ROI summaries',
  },
  {
    name: 'Priority Customer Support',
    free: false,
    basic: false,
    pro: true,
    description: '24/7 priority ticket response & dedicated phone support line',
  },
  {
    name: 'Verified Broker Badge',
    free: false,
    basic: true,
    pro: true,
    description: 'Trust badge displayed on seller profile and property listings',
  },
  {
    name: 'API Access (Pro only)',
    free: false,
    basic: false,
    pro: true,
    description: 'REST API for custom CRM & ERP integration',
  },
  {
    name: 'Dedicated Account Manager (Pro only)',
    free: false,
    basic: false,
    pro: true,
    description: 'Personalized onboarding, listing optimization, and strategy sessions',
  },
];

interface PlanComparisonTableProps {
  currentPlanId?: string;
  onSelectPlan?: (planId: 'free' | 'basic' | 'pro') => void;
}

export function PlanComparisonTable({ currentPlanId = 'basic', onSelectPlan }: PlanComparisonTableProps) {
  const renderCellContent = (val: string | number | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <div className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Check className="h-4 w-4 stroke-[2.5]" />
          <span className="sr-only">Included</span>
        </div>
      ) : (
        <div className="inline-flex items-center justify-center p-1 rounded-full bg-muted text-muted-foreground/50">
          <X className="h-4 w-4 stroke-[2.5]" />
          <span className="sr-only">Not Included</span>
        </div>
      );
    }

    if (val === 'Unlimited') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          Unlimited
        </span>
      );
    }

    return (
      <span className="font-extrabold text-foreground text-xs sm:text-sm">
        {val}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-8">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-1.5 mb-2">
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
          Compare All Features
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-lg">
          Detailed feature-by-feature breakdown to help you pick the perfect plan for your real estate business.
        </p>
      </div>

      {/* Comparison Table Container (Mobile Scrollable) */}
      <div className="w-full overflow-x-auto rounded-3xl border border-border/60 bg-card shadow-sm scrollbar-thin">
        <table className="w-full min-w-[650px] border-collapse text-left text-sm">
          {/* Table Header (Sticky on Scroll) */}
          <thead className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/60 shadow-2xs">
            <tr>
              {/* Feature Name Header (Sticky Left) */}
              <th className="sticky left-0 top-0 z-30 bg-card/95 backdrop-blur-md p-4 sm:p-5 text-xs font-extrabold uppercase tracking-wider text-muted-foreground border-r border-border/40 min-w-[220px] sm:min-w-[280px]">
                Features & Capabilities
              </th>

              {/* Free Header */}
              <th className="p-4 sm:p-5 text-center min-w-[130px] sm:min-w-[160px]">
                <div className="flex flex-col items-center gap-1">
                  <span className="font-black text-base text-foreground">Free</span>
                  <span className="text-xs font-extrabold text-muted-foreground">₹0</span>
                  {currentPlanId === 'free' && (
                    <Badge variant="outline" className="mt-1 text-[10px] font-black uppercase border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Current
                    </Badge>
                  )}
                </div>
              </th>

              {/* Basic Header (Popular) */}
              <th className="p-4 sm:p-5 text-center min-w-[130px] sm:min-w-[160px] bg-amber-500/[0.03]">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    <span className="font-black text-base text-foreground">Basic</span>
                  </div>
                  <span className="text-xs font-extrabold text-muted-foreground">₹999 / mo</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {currentPlanId === 'basic' ? (
                      <Badge variant="outline" className="text-[10px] font-black uppercase border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Current
                      </Badge>
                    ) : (
                      <Badge className="text-[10px] font-black uppercase bg-amber-500 text-slate-950 hover:bg-amber-500">
                        Popular
                      </Badge>
                    )}
                  </div>
                </div>
              </th>

              {/* Pro Header */}
              <th className="p-4 sm:p-5 text-center min-w-[130px] sm:min-w-[160px] bg-primary/[0.03]">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1 text-primary">
                    <Crown className="h-3.5 w-3.5" />
                    <span className="font-black text-base text-foreground">Pro</span>
                  </div>
                  <span className="text-xs font-extrabold text-muted-foreground">₹2,499 / mo</span>
                  {currentPlanId === 'pro' ? (
                    <Badge variant="outline" className="mt-1 text-[10px] font-black uppercase border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Current
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-1 text-[10px] font-black uppercase border-primary/30 bg-primary/10 text-primary">
                      Unlimited
                    </Badge>
                  )}
                </div>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/40">
            {comparisonFeatures.map((feat, idx) => {
              const isProOnly = feat.name.includes('(Pro only)');
              const isEven = idx % 2 === 0;

              return (
                <tr 
                  key={feat.name}
                  className={`transition-colors hover:bg-muted/30 ${isEven ? 'bg-background/40' : 'bg-card'}`}
                >
                  {/* Sticky Feature Name Column */}
                  <td className="sticky left-0 z-10 bg-card p-3.5 sm:p-4 border-r border-border/40 min-w-[220px] sm:min-w-[280px]">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-1.5">
                        {feat.name}
                        {isProOnly && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-primary/10 text-primary rounded-md border border-primary/20">
                            Pro
                          </span>
                        )}
                      </span>
                      {feat.description && (
                        <span className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {feat.description}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Free Column */}
                  <td className="p-3.5 sm:p-4 text-center">
                    {renderCellContent(feat.free)}
                  </td>

                  {/* Basic Column */}
                  <td className="p-3.5 sm:p-4 text-center bg-amber-500/[0.02]">
                    {renderCellContent(feat.basic)}
                  </td>

                  {/* Pro Column */}
                  <td className="p-3.5 sm:p-4 text-center bg-primary/[0.02]">
                    {renderCellContent(feat.pro)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
