'use client';

import React, { useState, useEffect } from 'react';
import { 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Building2, 
  PhoneCall, 
  BarChart2, 
  Headphones,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/toast';
import { subscriptionPlans, SubscriptionPlan } from '@/lib/data/plans';

type BillingCycle = 'monthly' | 'yearly';

export default function SubscriptionPricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [currentPlanId, setCurrentPlanId] = useState<string>('basic'); // default active plan
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Sync current plan with localStorage if set
  useEffect(() => {
    const storedPlan = localStorage.getItem('estatex_current_plan');
    if (storedPlan) {
      setCurrentPlanId(storedPlan);
    }
  }, []);

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setIsProcessing(plan.id);
    setTimeout(() => {
      setIsProcessing(null);
      setCurrentPlanId(plan.id);
      try {
        localStorage.setItem('estatex_current_plan', plan.id);
      } catch (e) {
        console.error('Error saving current plan', e);
      }

      if (plan.id === currentPlanId) {
        toast(`Successfully renewed your ${plan.name} Plan!`, 'success');
      } else {
        toast(`Congratulations! You have upgraded to the ${plan.name} Plan.`, 'success');
      }
    }, 600);
  };

  return (
    <div className="flex flex-col gap-8 text-left w-full max-w-5xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col items-center text-center gap-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Flexible Seller Plans</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
          Choose Your Plan
        </h1>
        
        <p className="text-sm md:text-base text-muted-foreground max-w-xl">
          Grow your real estate business with the right plan. Unlock premium lead access, featured placements, and detailed analytics.
        </p>

        {/* Billing Cycle Toggle Switch */}
        <div className="mt-4 flex items-center gap-3 p-1.5 bg-muted/50 rounded-2xl border border-border/40">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-background text-foreground shadow-xs border border-border/40'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly Billing
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              billingCycle === 'yearly'
                ? 'bg-background text-foreground shadow-xs border border-border/40'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Yearly Billing</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-slate-950 uppercase tracking-wider">
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch mt-2">
        {subscriptionPlans.map((plan) => {
          const isCurrent = currentPlanId === plan.id;
          const isPopular = plan.isPopular;
          
          // Calculate price based on billing cycle (20% discount on yearly)
          const monthlyPrice = plan.price;
          const yearlyDiscountedMonthlyPrice = Math.round(plan.price * 0.8);
          const displayPrice = billingCycle === 'yearly' ? yearlyDiscountedMonthlyPrice : monthlyPrice;

          return (
            <Card
              key={plan.id}
              className={`relative rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg ${
                isPopular
                  ? 'border-amber-500/60 ring-2 ring-amber-500/30 bg-gradient-to-b from-amber-500/[0.04] via-card to-card md:-translate-y-2'
                  : isCurrent
                  ? 'border-primary/60 ring-1 ring-primary/20 bg-card'
                  : 'border-border/40 bg-card'
              }`}
            >
              {/* Most Popular Banner */}
              {isPopular && (
                <div className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[11px] font-black uppercase tracking-wider py-1.5 text-center flex items-center justify-center gap-1.5 shadow-xs">
                  <Crown className="h-3.5 w-3.5 fill-slate-950" />
                  <span>Most Popular Choice</span>
                </div>
              )}

              <div>
                {/* Header */}
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-black text-foreground">
                      {plan.name}
                    </CardTitle>

                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Current Plan
                      </span>
                    ) : isPopular ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Best Value
                      </span>
                    ) : null}
                  </div>

                  {/* Price Section */}
                  <div className="flex items-baseline gap-1.5 mt-4">
                    {billingCycle === 'yearly' && plan.price > 0 && (
                      <span className="text-sm line-through text-muted-foreground font-semibold">
                        ₹{plan.price.toLocaleString()}
                      </span>
                    )}
                    
                    <span className="text-4xl font-black text-foreground tracking-tight">
                      ₹{displayPrice.toLocaleString()}
                    </span>

                    <span className="text-xs font-bold text-muted-foreground">
                      {plan.price === 0 ? '' : billingCycle === 'yearly' ? '/ month (billed yearly)' : '/ month'}
                    </span>
                  </div>

                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    {plan.price === 0 
                      ? 'Free forever for standard individual sellers' 
                      : `Billed ${billingCycle} • Cancel anytime`}
                  </CardDescription>
                </CardHeader>

                {/* Features List */}
                <CardContent className="p-6 pt-2 flex flex-col gap-3.5 text-xs">
                  <div className="h-px w-full bg-border/40 mb-1" />

                  {/* Feature 1: Listings Limit */}
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-foreground">
                      <strong>{plan.listingsLimit === 999 ? 'Unlimited' : plan.listingsLimit}</strong> Active Listings
                    </span>
                  </div>

                  {/* Feature 2: Featured Listings */}
                  <div className="flex items-center gap-3">
                    {plan.featuredListings > 0 ? (
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-rose-500/10 text-rose-500 shrink-0">
                        <X className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                    <span className={`font-semibold ${plan.featuredListings > 0 ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                      <strong>{plan.featuredListings}</strong> Featured Boost Listings
                    </span>
                  </div>

                  {/* Feature 3: Photo Limit */}
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-foreground">
                      Up to <strong>{plan.photoLimit}</strong> photos per property
                    </span>
                  </div>

                  {/* Feature 4: Lead Access */}
                  <div className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-foreground capitalize">
                      {plan.leadAccess === 'full + phone reveal' ? (
                        <>Full Lead Access + <strong>Phone Reveal</strong></>
                      ) : (
                        <>{plan.leadAccess} Buyer Lead Access</>
                      )}
                    </span>
                  </div>

                  {/* Feature 5: Analytics */}
                  <div className="flex items-center gap-3">
                    {plan.analytics ? (
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-rose-500/10 text-rose-500 shrink-0">
                        <X className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                    <span className={`font-semibold ${plan.analytics ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                      Analytics Dashboard & Funnels
                    </span>
                  </div>

                  {/* Feature 6: Priority Support */}
                  <div className="flex items-center gap-3">
                    {plan.prioritySupport ? (
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-rose-500/10 text-rose-500 shrink-0">
                        <X className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                    <span className={`font-semibold ${plan.prioritySupport ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                      24/7 Priority Dedicated Support
                    </span>
                  </div>

                  {/* Feature 7: Verified Badge */}
                  <div className="flex items-center gap-3">
                    {plan.verifiedBadge ? (
                      <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-rose-500/10 text-rose-500 shrink-0">
                        <X className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                    <span className={`font-semibold ${plan.verifiedBadge ? 'text-foreground' : 'text-muted-foreground/70'}`}>
                      Verified Seller Trust Badge
                    </span>
                  </div>

                </CardContent>
              </div>

              {/* Action Footer */}
              <CardFooter className="p-6 pt-4 border-t border-border/40">
                {isCurrent ? (
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isProcessing === plan.id}
                    variant="outline"
                    className="w-full h-11 rounded-2xl font-extrabold text-xs border-primary/50 hover:bg-primary/5 text-primary cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isProcessing === plan.id ? 'Renewing...' : 'Renew Current Plan'}</span>
                  </Button>
                ) : plan.id === 'free' ? (
                  <Button
                    disabled
                    variant="outline"
                    className="w-full h-11 rounded-2xl font-extrabold text-xs text-muted-foreground border-border/60 bg-muted/20"
                  >
                    Free Plan
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isProcessing === plan.id}
                    className={`w-full h-11 rounded-2xl font-extrabold text-xs cursor-pointer shadow-md transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:scale-[1.01]'
                        : 'bg-primary hover:bg-primary/95 text-primary-foreground'
                    }`}
                  >
                    <Zap className="h-4 w-4 fill-current" />
                    <span>{isProcessing === plan.id ? 'Processing...' : `Upgrade to ${plan.name}`}</span>
                  </Button>
                )}
              </CardFooter>

            </Card>
          );
        })}
      </div>

    </div>
  );
}
