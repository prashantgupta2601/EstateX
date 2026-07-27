'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight, ShieldCheck, Sparkles, LayoutDashboard, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscriptionPlans } from '@/lib/data/plans';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId') || 'pay_mock_sample';
  const planId = searchParams.get('plan') || 'basic';

  const plan = subscriptionPlans.find((p) => p.id === planId) || subscriptionPlans[1];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <Card className="max-w-md w-full rounded-3xl border border-emerald-500/30 bg-card shadow-lg overflow-hidden relative">
        <div className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 h-3" />
        
        <CardHeader className="p-6 sm:p-8 pb-4 flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-8 ring-emerald-500/10">
            <CheckCircle2 className="h-12 w-12 stroke-[2.5]" />
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Payment Verified</span>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Subscription Activated!
          </CardTitle>

          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Thank you for upgrading to the <strong>{plan.name} Plan</strong>. Your account features have been instantly updated.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {/* Details Breakdown */}
          <div className="rounded-2xl bg-muted/40 border border-border/40 p-4 text-xs space-y-2.5 text-left">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Payment ID</span>
              <span className="font-mono font-bold text-foreground truncate max-w-[180px]">
                {paymentId}
              </span>
            </div>
            
            <div className="h-px bg-border/40 w-full" />

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Plan Subscribed</span>
              <Badge variant="outline" className="font-extrabold uppercase border-primary/30 text-primary bg-primary/5">
                {plan.name} Plan
              </Badge>
            </div>

            <div className="h-px bg-border/40 w-full" />

            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Status</span>
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Active
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col gap-2.5">
          <Link href="/seller/dashboard" className="w-full">
            <Button className="w-full h-11 rounded-2xl font-extrabold text-xs shadow-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer flex items-center justify-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Go to Seller Dashboard</span>
            </Button>
          </Link>

          <Link href="/seller/subscription" className="w-full">
            <Button variant="outline" className="w-full h-11 rounded-2xl font-extrabold text-xs border-border/60 hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Manage Subscription</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading payment confirmation...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
