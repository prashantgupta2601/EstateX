'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockCurrentPlan, mockPaymentHistory } from '@/lib/mock-data/revenue';
import { 
  CreditCard, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Download, 
  ArrowUpRight, 
  Building2, 
  Zap,
  Calendar,
  ExternalLink
} from 'lucide-react';

export function SubscriptionStats() {
  const listingsPct = (mockCurrentPlan.listingsUsed / mockCurrentPlan.listingsLimit) * 100;
  const featuredPct = (mockCurrentPlan.featuredUsed / mockCurrentPlan.featuredLimit) * 100;
  const isNearLimit = listingsPct >= 80 || featuredPct >= 80;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left w-full">
      
      {/* Plan Usage Card (5 cols on lg) */}
      <Card className={`lg:col-span-5 rounded-2xl border shadow-xs bg-card flex flex-col justify-between ${
        isNearLimit ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/5 via-card to-card' : 'border-border/40'
      }`}>
        <CardHeader className="pb-3 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <CreditCard className="h-5 w-5" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Current Plan</span>
            </div>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
              {mockCurrentPlan.name}
            </span>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h3 className="text-2xl font-black text-foreground">₹{mockCurrentPlan.price.toLocaleString()}<span className="text-xs text-muted-foreground font-medium"> / year</span></h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Renews: <strong>{mockCurrentPlan.endDate}</strong></span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-6 flex flex-col gap-5">
          
          {/* Progress 1: Listings Used */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/20 border border-border/30">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-foreground">
                <Building2 className="h-4 w-4 text-blue-500" />
                Listings Used
              </span>
              <span className="text-foreground">
                <strong>{mockCurrentPlan.listingsUsed}</strong> / {mockCurrentPlan.listingsLimit} ({listingsPct.toFixed(0)}%)
              </span>
            </div>
            
            <Progress 
              value={mockCurrentPlan.listingsUsed} 
              max={mockCurrentPlan.listingsLimit} 
              indicatorClassName={listingsPct >= 80 ? 'bg-amber-500' : 'bg-primary'}
            />

            {listingsPct >= 80 && (
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 shrink-0" />
                You have used {listingsPct.toFixed(0)}% of your listing quota.
              </span>
            )}
          </div>

          {/* Progress 2: Featured Listings Used */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-muted/20 border border-border/30">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-foreground">
                <Zap className="h-4 w-4 text-amber-500" />
                Featured Listings Used
              </span>
              <span className="text-foreground">
                <strong>{mockCurrentPlan.featuredUsed}</strong> / {mockCurrentPlan.featuredLimit} ({featuredPct.toFixed(0)}%)
              </span>
            </div>

            <Progress 
              value={mockCurrentPlan.featuredUsed} 
              max={mockCurrentPlan.featuredLimit} 
              indicatorClassName={featuredPct >= 80 ? 'bg-amber-500' : 'bg-amber-500'}
            />
          </div>

          {/* Upgrade Plan Call To Action */}
          {isNearLimit && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Quota running low! Upgrade to post unlimited properties.
                </span>
              </div>
            </div>
          )}

          <Link href="/seller/subscription" className="w-full">
            <Button className={`w-full h-10 rounded-xl font-extrabold text-xs cursor-pointer flex items-center justify-center gap-2 ${
              isNearLimit 
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md' 
                : 'bg-primary hover:bg-primary/95 text-primary-foreground'
            }`}>
              <Sparkles className="h-4 w-4" />
              <span>Upgrade Plan to Pro Plus</span>
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>

        </CardContent>
      </Card>


      {/* Payment History Table (7 cols on lg) */}
      <Card className="lg:col-span-7 rounded-2xl border border-border/40 shadow-xs bg-card flex flex-col">
        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-extrabold text-foreground flex items-center gap-2">
              <span>Billing & Payment History</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-muted text-muted-foreground">
                Invoices
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Recent subscription payments, renewals, and feature add-ons
            </CardDescription>
          </div>

          <Link href="/seller/subscription">
            <Button variant="outline" size="sm" className="h-8 text-xs font-semibold rounded-xl border-border/60 cursor-pointer">
              <span>View All</span>
            </Button>
          </Link>
        </CardHeader>

        <CardContent className="pt-0 flex-1">
          <div className="overflow-x-auto rounded-xl border border-border/40 bg-card">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/40 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-3.5">Plan / Item</th>
                  <th className="py-3 px-3.5 text-right">Amount</th>
                  <th className="py-3 px-3.5 text-right">Date</th>
                  <th className="py-3 px-3.5 text-center">Status</th>
                  <th className="py-3 px-3.5 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {mockPaymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{item.plan}</span>
                        <span className="text-[10px] text-muted-foreground">{item.id} • {item.paymentMethod}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3.5 text-right font-black text-foreground">
                      ₹{item.amount.toLocaleString()}
                    </td>

                    <td className="py-3 px-3.5 text-right font-medium text-muted-foreground whitespace-nowrap">
                      {item.date}
                    </td>

                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      {item.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3.5 text-right">
                      {item.status === 'success' ? (
                        <a
                          href={item.invoiceUrl}
                          onClick={(e) => { e.preventDefault(); alert(`Downloading invoice ${item.id}`); }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>PDF</span>
                        </a>
                      ) : (
                        <span className="text-muted-foreground/50 text-[10px]">N/A</span>
                      )}
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
