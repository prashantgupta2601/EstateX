'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Crown, 
  Zap, 
  CheckCircle2, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ArrowLeft, 
  ArrowRight,
  ChevronRight, 
  Info, 
  X, 
  RefreshCw, 
  Gift, 
  AlertCircle, 
  Check,
  Building2,
  PhoneCall,
  BarChart2,
  Loader2,
  Percent
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { subscriptionPlans, SubscriptionPlan } from '@/lib/data/plans';
import { sellerProfile } from '@/lib/mock-data/seller';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function ManageSubscriptionPage() {
  const router = useRouter();

  // Subscription state
  const [currentPlanId, setCurrentPlanId] = useState<'free' | 'basic' | 'pro'>('pro');
  const [autoRenewal, setAutoRenewal] = useState<boolean>(true);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);
  const [discountClaimed, setDiscountClaimed] = useState<boolean>(false);
  const [pendingDowngrade, setPendingDowngrade] = useState<{ planId: 'free' | 'basic'; effectiveDate: string } | null>(null);

  // Modal dialog states
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  
  const [isDowngradeModalOpen, setIsDowngradeModalOpen] = useState(false);
  const [targetDowngradePlan, setTargetDowngradePlan] = useState<SubscriptionPlan | null>(null);

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelStep, setCancelStep] = useState<1 | 2 | 3>(1);
  const [cancelReason, setCancelReason] = useState<string>('');

  const [isProcessing, setIsProcessing] = useState(false);

  // Billing calculation constants (Mock billing cycle)
  const daysRemaining = 15;
  const totalDaysInPeriod = 30;
  const nextBillingDate = 'August 28, 2026';
  const paymentMethod = 'Visa ending in 4242';

  // Sync current plan from localStorage if available
  useEffect(() => {
    const storedPlan = localStorage.getItem('estatex_current_plan') as 'free' | 'basic' | 'pro' | null;
    if (storedPlan && ['free', 'basic', 'pro'].includes(storedPlan)) {
      setCurrentPlanId(storedPlan);
    }
  }, []);

  const currentPlan = subscriptionPlans.find((p) => p.id === currentPlanId) || subscriptionPlans[2]; // Default Pro

  // Usage statistics based on current plan limits
  const listingsUsed = 8;
  const listingsLimit = currentPlan.listingsLimit;
  const listingsPercentage = listingsLimit === 999 
    ? Math.min(100, Math.round((listingsUsed / 20) * 100)) 
    : Math.min(100, Math.round((listingsUsed / listingsLimit) * 100));

  const featuredUsed = currentPlan.id === 'pro' ? 4 : currentPlan.id === 'basic' ? 1 : 0;
  const featuredLimit = currentPlan.featuredListings;
  const featuredPercentage = featuredLimit === 0 ? 0 : Math.min(100, Math.round((featuredUsed / featuredLimit) * 100));

  // Razorpay Loader Helper
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Trigger Upgrade / Early Renewal Razorpay Flow
  const handleUpgradeCheckout = async (targetPlan: SubscriptionPlan, customAmount?: number) => {
    try {
      setIsProcessing(true);
      
      const amountToPay = customAmount !== undefined ? customAmount : targetPlan.price;

      // 1. Call Order API
      const orderRes = await fetch('/api/subscription/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: targetPlan.id,
          billingCycle: 'monthly',
        }),
      });

      const orderData = await orderRes.json().catch(() => ({}));
      const orderId = orderData.orderId || `order_mock_${Date.now()}`;
      const isMock = orderData.isMock || !orderRes.ok;

      const verifyAndComplete = (paymentId: string) => {
        setCurrentPlanId(targetPlan.id as 'free' | 'basic' | 'pro');
        setPendingDowngrade(null);
        setIsCancelled(false);
        setAutoRenewal(true);
        try {
          localStorage.setItem('estatex_current_plan', targetPlan.id);
        } catch (e) {
          console.error('Failed to update local storage', e);
        }
        setIsProcessing(false);
        setIsPlanModalOpen(false);

        if (targetPlan.id === currentPlanId) {
          toast(`Successfully renewed your ${targetPlan.name} Plan!`, 'success');
        } else {
          toast(`Congratulations! You have upgraded to the ${targetPlan.name} Plan!`, 'success');
        }
      };

      if (isMock) {
        toast('Processing upgrade checkout...', 'success');
        setTimeout(() => {
          verifyAndComplete(`pay_mock_${Date.now()}`);
        }, 1200);
        return;
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast('Failed to load Razorpay checkout script.', 'error');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.keyId || 'rzp_test_xxxxxxxxxxxx',
        amount: amountToPay * 100,
        currency: 'INR',
        name: 'EstateX',
        description: `Upgrade to ${targetPlan.name} Plan (${daysRemaining} days prorated)`,
        order_id: orderId,
        prefill: {
          name: sellerProfile.name,
          email: sellerProfile.email,
          contact: sellerProfile.phone,
        },
        theme: { color: '#1E40AF' },
        handler: () => {
          verifyAndComplete(`pay_rzp_${Date.now()}`);
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast('Payment process cancelled.', 'error');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp: any) => {
        setIsProcessing(false);
        toast(resp.error?.description || 'Payment failed.', 'error');
      });
      rzp.open();

    } catch (err: any) {
      console.error('Upgrade checkout error', err);
      toast(err.message || 'Upgrade checkout failed.', 'error');
      setIsProcessing(false);
    }
  };

  // Downgrade handler
  const handleConfirmDowngrade = () => {
    if (!targetDowngradePlan) return;
    setPendingDowngrade({
      planId: targetDowngradePlan.id as 'free' | 'basic',
      effectiveDate: nextBillingDate,
    });
    setIsDowngradeModalOpen(false);
    setIsPlanModalOpen(false);
    toast('Downgrade scheduled.', 'success');
  };

  // Cancellation step handlers
  const handleNextCancelStep = () => {
    if (cancelStep === 1) {
      if (!cancelReason) {
        toast('Please select a reason for cancelling', 'error');
        return;
      }
      setCancelStep(2);
    } else if (cancelStep === 2) {
      setCancelStep(3);
    }
  };

  const handleClaimRetentionOffer = () => {
    setDiscountClaimed(true);
    setIsCancelModalOpen(false);
    setCancelStep(1);
    toast('20% discount applied to your next renewal!', 'success');
  };

  const handleFinalizeCancellation = () => {
    setIsCancelled(true);
    setAutoRenewal(false);
    setIsCancelModalOpen(false);
    setCancelStep(1);
    toast(`Subscription cancelled. Your plan remains active until ${nextBillingDate}.`, 'success');
  };

  // Toggle Auto Renewal Switch
  const handleAutoRenewalToggle = (checked: boolean) => {
    if (!checked) {
      setAutoRenewal(false);
      toast('Auto-renewal disabled.', 'success');
    } else {
      setAutoRenewal(true);
      setIsCancelled(false);
      toast('Auto-renewal enabled.', 'success');
    }
  };

  // Higher tiers available for upgrade
  const higherTiers = subscriptionPlans.filter((p) => {
    if (currentPlanId === 'free') return p.id === 'basic' || p.id === 'pro';
    if (currentPlanId === 'basic') return p.id === 'pro';
    return false;
  });

  // Lower tiers available for downgrade
  const lowerTiers = subscriptionPlans.filter((p) => {
    if (currentPlanId === 'pro') return p.id === 'basic' || p.id === 'free';
    if (currentPlanId === 'basic') return p.id === 'free';
    return false;
  });

  return (
    <div className="flex flex-col gap-8 text-left w-full max-w-5xl mx-auto pb-16 animate-in fade-in duration-300">
      
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mb-1">
            <Link href="/subscription" className="hover:text-primary transition-colors">
              Subscription
            </Link>
            <span>/</span>
            <span className="text-foreground">Manage Plan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            Manage Subscription
          </h1>
        </div>

        <Link href="/subscription">
          <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold gap-2 cursor-pointer">
            <ArrowLeft className="h-4 w-4" />
            <span>View All Plans & Features</span>
          </Button>
        </Link>
      </div>

      {/* Auto-Renewal / Cancellation Warning Banner */}
      {(!autoRenewal || isCancelled) && (
        <div className="flex items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-300 shadow-xs animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold">
                Auto-renewal is off. Your plan will expire on {nextBillingDate}.
              </span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400/80">
                Turn auto-renewal back on to ensure uninterrupted lead access and listing visibility.
              </span>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => handleAutoRenewalToggle(true)}
            className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            Re-enable Auto-Renewal
          </Button>
        </div>
      )}

      {/* Scheduled Downgrade Notice Banner */}
      {pendingDowngrade && (
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-300 shadow-xs">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">
              Downgrade to {pendingDowngrade.planId.toUpperCase()} scheduled for {pendingDowngrade.effectiveDate}. You retain {currentPlan.name} features until then.
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setPendingDowngrade(null);
              toast('Scheduled downgrade cancelled.', 'success');
            }}
            className="text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 cursor-pointer"
          >
            Keep {currentPlan.name}
          </Button>
        </div>
      )}

      {/* Main Grid: Current Plan & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Current Plan Overview & Usage */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Current Plan Card */}
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card overflow-hidden">
            <CardHeader className="p-6 pb-4 bg-gradient-to-r from-primary/5 via-card to-card border-b border-border/40">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <Crown className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl font-black text-foreground">
                        {currentPlan.name} Plan
                      </CardTitle>
                      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-black uppercase text-[10px] tracking-wider px-2.5 py-0.5">
                        Active
                      </Badge>
                      {discountClaimed && (
                        <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-black text-[10px]">
                          20% Next Renewal Off
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground mt-0.5">
                      {isCancelled 
                        ? `Expires on ${nextBillingDate}` 
                        : autoRenewal 
                        ? `Renews automatically on ${nextBillingDate}` 
                        : `Valid until ${nextBillingDate}`}
                    </CardDescription>
                  </div>
                </div>

                {/* Auto renewal switch */}
                <div className="flex items-center gap-3 p-2 rounded-2xl bg-muted/40 border border-border/40">
                  <div className="flex flex-col text-right">
                    <span className="text-[11px] font-black text-foreground">Auto-Renew</span>
                    <span className="text-[9px] font-bold text-muted-foreground">
                      {autoRenewal && !isCancelled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <Switch
                    checked={autoRenewal && !isCancelled}
                    onCheckedChange={handleAutoRenewalToggle}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 flex flex-col gap-6">
              
              {/* Usage Stats Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Usage Statistics
                </h3>

                {/* Listing Limit Progress */}
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-foreground flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-primary" />
                      Listings Used
                    </span>
                    <span className="font-black text-foreground">
                      {listingsUsed} / {listingsLimit === 999 ? 'Unlimited' : listingsLimit}
                    </span>
                  </div>
                  <Progress value={listingsPercentage} className="h-2.5 bg-muted" />
                  <span className="text-[10px] font-semibold text-muted-foreground text-right">
                    {listingsLimit === 999 
                      ? `${listingsUsed} active properties on market` 
                      : `${listingsLimit - listingsUsed} listing slots remaining`}
                  </span>
                </div>

                {/* Featured Listings Boost Progress */}
                <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-foreground flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                      Featured Boost Placements
                    </span>
                    <span className="font-black text-foreground">
                      {featuredUsed} / {featuredLimit} used
                    </span>
                  </div>
                  <Progress value={featuredPercentage} className="h-2.5 bg-muted" indicatorClassName="bg-amber-500" />
                  <span className="text-[10px] font-semibold text-muted-foreground text-right">
                    {featuredLimit === 0
                      ? 'No featured boosts in Free plan'
                      : `${featuredLimit - featuredUsed} boost credits available this cycle`}
                  </span>
                </div>
              </div>

              {/* Next Billing & Payment Method Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/40">
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/30 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-background border border-border/50 text-muted-foreground shrink-0">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Next Billing Date</span>
                    <span className="text-xs font-black text-foreground">{nextBillingDate}</span>
                    <span className="text-[11px] font-bold text-muted-foreground">
                      ₹{discountClaimed ? Math.round(currentPlan.price * 0.8).toLocaleString() : currentPlan.price.toLocaleString()} / month
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/30 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-background border border-border/50 text-muted-foreground shrink-0">
                    <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Payment Method</span>
                    <span className="text-xs font-black text-foreground">{paymentMethod}</span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Verified & Auto-Pay</span>
                  </div>
                </div>
              </div>

            </CardContent>

            {/* Action Buttons Footer */}
            <CardFooter className="p-6 pt-4 bg-muted/20 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                {/* Upgrade Plan Button */}
                {currentPlanId !== 'pro' && (
                  <Button
                    onClick={() => setIsPlanModalOpen(true)}
                    className="rounded-2xl bg-primary hover:bg-primary/95 text-primary-foreground font-extrabold text-xs h-11 px-5 cursor-pointer shadow-xs flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4 fill-current" />
                    <span>Upgrade Plan</span>
                  </Button>
                )}

                {/* Renew Early Button */}
                <Button
                  variant="outline"
                  onClick={() => handleUpgradeCheckout(currentPlan, currentPlan.price)}
                  disabled={isProcessing}
                  className="rounded-2xl border-border/80 font-extrabold text-xs h-11 px-4 cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Renew Early</span>
                </Button>
              </div>

              {/* Cancel Subscription Button */}
              {!isCancelled && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCancelStep(1);
                    setIsCancelModalOpen(true);
                  }}
                  className="rounded-2xl border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 font-extrabold text-xs h-11 px-4 cursor-pointer flex items-center gap-2 ml-auto"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel Subscription</span>
                </Button>
              )}
            </CardFooter>

          </Card>
        </div>

        {/* Right 1 Column: Plan Summary & Perks */}
        <div className="flex flex-col gap-6">
          <Card className="rounded-3xl border border-border/60 shadow-xs bg-card p-6 flex flex-col gap-4">
            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Included Perks ({currentPlan.name})</span>
            </h3>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-foreground">
                  {currentPlan.listingsLimit === 999 ? 'Unlimited' : currentPlan.listingsLimit} Active Property Listings
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-foreground">
                  {currentPlan.featuredListings} Featured Placement Boosts
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-foreground">
                  {currentPlan.photoLimit} HD Photos per Property
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="font-bold text-foreground capitalize">
                  {currentPlan.leadAccess} Lead Access
                </span>
              </div>

              {currentPlan.analytics && (
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-bold text-foreground">Advanced Buyer Analytics</span>
                </div>
              )}

              {currentPlan.verifiedBadge && (
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-bold text-foreground">Verified Seller Trust Badge</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border/40 flex flex-col gap-2 text-center">
              <span className="text-[11px] text-muted-foreground font-semibold">
                Need customized enterprise or multi-city team plans?
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-extrabold text-primary hover:bg-primary/5 cursor-pointer rounded-xl"
                onClick={() => toast('Support ticket created. Our team will contact you shortly.', 'success')}
              >
                Contact Sales Support
              </Button>
            </div>
          </Card>
        </div>

      </div>


      {/* ========================================================================= */}
      {/* 2. UPGRADE & PLAN SELECTION DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={isPlanModalOpen} onOpenChange={setIsPlanModalOpen}>
        <DialogContent className="sm:max-w-xl p-6 rounded-3xl">
          <DialogHeader className="text-left gap-1">
            <DialogTitle className="text-xl font-black text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span>Change Subscription Plan</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Select a tier to upgrade immediately with prorated billing, or schedule a downgrade for your next cycle.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 my-2">
            
            {/* Higher Tiers (Upgrade Options) */}
            {higherTiers.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                  Available Upgrades
                </span>
                
                {higherTiers.map((plan) => {
                  const proratedDiff = Math.round((plan.price - currentPlan.price) * (daysRemaining / totalDaysInPeriod));
                  
                  return (
                    <div
                      key={plan.id}
                      className="p-4 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/[0.04] to-card hover:border-primary transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex flex-col text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-foreground">{plan.name} Plan</span>
                          <Badge className="bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                            Recommended
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          ₹{plan.price.toLocaleString()} / month • {plan.listingsLimit === 999 ? 'Unlimited' : plan.listingsLimit} listings
                        </span>

                        {/* Proration Explanation */}
                        <div className="mt-2.5 p-2.5 rounded-xl bg-background border border-border/50 text-[11px] font-bold text-foreground">
                          You&apos;ll pay <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">₹{proratedDiff.toLocaleString()}</span> today for the remaining {daysRemaining} days, then ₹{plan.price.toLocaleString()}/month.
                        </div>
                      </div>

                      <Button
                        onClick={() => handleUpgradeCheckout(plan, proratedDiff)}
                        disabled={isProcessing}
                        className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-black text-xs h-10 px-4 shrink-0 cursor-pointer"
                      >
                        {isProcessing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          `Confirm Upgrade (₹${proratedDiff.toLocaleString()})`
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Lower Tiers (Downgrade Options) */}
            {lowerTiers.length > 0 && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider text-left">
                  Downgrade Options
                </span>

                {lowerTiers.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-3.5 rounded-2xl border border-border/60 bg-muted/20 flex items-center justify-between gap-3"
                  >
                    <div className="flex flex-col text-left">
                      <span className="font-extrabold text-xs text-foreground">Switch to {plan.name} Plan</span>
                      <span className="text-[11px] text-muted-foreground">
                        ₹{plan.price.toLocaleString()} / month ({plan.listingsLimit} listings)
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTargetDowngradePlan(plan);
                        setIsDowngradeModalOpen(true);
                      }}
                      className="rounded-xl border-border/80 font-bold text-xs cursor-pointer shrink-0"
                    >
                      Downgrade to {plan.name}
                    </Button>
                  </div>
                ))}
              </div>
            )}

          </div>

          <DialogFooter>
            <DialogClose render={
              <Button variant="ghost" className="rounded-xl text-xs font-bold cursor-pointer">
                Cancel
              </Button>
            } />
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ========================================================================= */}
      {/* 3. DOWNGRADE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={isDowngradeModalOpen} onOpenChange={setIsDowngradeModalOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl text-left">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <span>Confirm Scheduled Downgrade</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-2 leading-relaxed">
              Your plan will be downgraded to <strong className="text-foreground">{targetDowngradePlan?.name} Plan</strong> at the end of your current billing period on <strong className="text-foreground">{nextBillingDate}</strong>. You&apos;ll retain {currentPlan.name} features until then.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDowngradeModalOpen(false)}
              className="rounded-xl text-xs font-bold cursor-pointer"
            >
              Keep {currentPlan.name}
            </Button>

            <Button
              onClick={handleConfirmDowngrade}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs cursor-pointer"
            >
              Confirm Downgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* ========================================================================= */}
      {/* 4. MULTI-STEP CANCELLATION DIALOG */}
      {/* ========================================================================= */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl text-left">
          
          {/* STEP 1: REASON SELECTOR */}
          {cancelStep === 1 && (
            <>
              <DialogHeader className="gap-1">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-black text-foreground">
                    Cancel Subscription
                  </DialogTitle>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
                    Step 1 of 3
                  </span>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  We&apos;re sorry to see you go. Please let us know why you are cancelling:
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-2.5 my-3">
                {[
                  'Too expensive',
                  'Not enough leads',
                  'Switching to competitor',
                  'Other'
                ].map((reason) => (
                  <label
                    key={reason}
                    onClick={() => setCancelReason(reason)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all text-xs font-bold ${
                      cancelReason === reason
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border/60 hover:bg-muted/30 text-foreground'
                    }`}
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={() => setCancelReason(reason)}
                      className="accent-primary h-4 w-4"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="rounded-xl text-xs font-bold cursor-pointer"
                >
                  Keep Subscription
                </Button>
                <Button
                  onClick={handleNextCancelStep}
                  disabled={!cancelReason}
                  className="rounded-xl bg-primary text-primary-foreground font-extrabold text-xs cursor-pointer"
                >
                  Continue
                </Button>
              </DialogFooter>
            </>
          )}

          {/* STEP 2: RETENTION OFFER ("Before you go...") */}
          {cancelStep === 2 && (
            <>
              <DialogHeader className="gap-1">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
                    <Gift className="h-5 w-5 text-amber-500" />
                    <span>Before you go...</span>
                  </DialogTitle>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
                    Step 2 of 3
                  </span>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  We value your seller partnership. Here is an exclusive offer for your account:
                </DialogDescription>
              </DialogHeader>

              <div className="my-4 p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/[0.05] to-card border border-amber-500/30 flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Percent className="h-6 w-6 stroke-[2.5]" />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-lg font-black text-foreground tracking-tight">
                    Get 20% off your next renewal
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Continue growing your leads with a special discount applied directly to your next cycle.
                  </span>
                </div>

                <Button
                  onClick={handleClaimRetentionOffer}
                  className="w-full mt-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs h-10 cursor-pointer shadow-md"
                >
                  Claim Offer & Save 20%
                </Button>
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="ghost"
                  onClick={handleNextCancelStep}
                  className="w-full text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer rounded-xl"
                >
                  No thanks, continue cancellation
                </Button>
              </DialogFooter>
            </>
          )}

          {/* STEP 3: ARE YOU SURE? CONFIRMATION & CONSEQUENCES */}
          {cancelStep === 3 && (
            <>
              <DialogHeader className="gap-1">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-black text-rose-600 dark:text-rose-400 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>Are you sure?</span>
                  </DialogTitle>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase">
                    Final Step
                  </span>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  Cancelling your subscription will result in losing the following features at the end of your billing cycle:
                </DialogDescription>
              </DialogHeader>

              <div className="my-3 p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col gap-2.5 text-xs text-foreground font-semibold">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                  <X className="h-4 w-4 shrink-0 stroke-[3]" />
                  <span>Listings limit drops to 3 active properties (excess listings disabled).</span>
                </div>
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                  <X className="h-4 w-4 shrink-0 stroke-[3]" />
                  <span>All featured boost placements will be removed.</span>
                </div>
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                  <X className="h-4 w-4 shrink-0 stroke-[3]" />
                  <span>Verified seller trust badge will be removed from your listings.</span>
                </div>
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                  <X className="h-4 w-4 shrink-0 stroke-[3]" />
                  <span>Direct phone number access for buyer leads will be disabled.</span>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsCancelModalOpen(false)}
                  className="rounded-xl text-xs font-bold cursor-pointer"
                >
                  Keep My Subscription
                </Button>

                <Button
                  onClick={handleFinalizeCancellation}
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs cursor-pointer"
                >
                  Confirm Cancellation
                </Button>
              </DialogFooter>
            </>
          )}

        </DialogContent>
      </Dialog>

    </div>
  );
}
