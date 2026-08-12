'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Download, LayoutDashboard, Calendar, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscriptionPlans } from '@/lib/data/plans';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId') || `pay_mock_${Date.now()}`;
  const planId = searchParams.get('plan') || 'basic';
  const cycle = searchParams.get('cycle') || 'monthly';

  const plan = subscriptionPlans.find((p) => p.id === planId) || subscriptionPlans[1];
  
  // Calculate price and expiry date (30 days or 365 days)
  const isYearly = cycle === 'yearly';
  const amountPaid = isYearly ? Math.round(plan.price * 0.8) : plan.price;
  
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + (isYearly ? 365 : 30));
  const formattedExpiry = expiryDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Confetti effect on load
  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#10B981', '#3B82F6', '#F59E0B', '#EC4899'],
      });
    } catch (e) {
      console.error('Confetti trigger error:', e);
    }
  }, []);

  const handleDownloadInvoice = () => {
    const invoiceUrl = `/api/subscription/invoice/${paymentId}?plan=${plan.id}&cycle=${cycle}`;
    window.open(invoiceUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] p-4 text-center">
      <Card className="max-w-lg w-full rounded-3xl border border-emerald-500/30 bg-card shadow-xl overflow-hidden relative">
        
        {/* Top Accent Gradient */}
        <div className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 h-3.5" />

        <CardHeader className="p-6 sm:p-8 pb-4 flex flex-col items-center gap-4">
          
          {/* Pure CSS Animated Green Checkmark Circle */}
          <div className="relative flex items-center justify-center p-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-md">
            <svg className="w-16 h-16" viewBox="0 0 52 52">
              <circle
                className="circle-draw"
                cx="26"
                cy="26"
                r="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="check-draw"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l7 7 16-16"
              />
            </svg>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Transaction Complete</span>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Payment Successful! 🎉
          </CardTitle>

          <CardDescription className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Your <strong>{plan.name}</strong> plan is now active. Enjoy full access to all seller tools and buyer leads!
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {/* Receipt Summary Card */}
          <div className="rounded-2xl bg-muted/40 border border-border/50 p-4 sm:p-5 text-xs text-left space-y-3 shadow-2xs">
            
            {/* Plan & Amount */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Subscribed Plan</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-extrabold uppercase border-primary/30 text-primary bg-primary/5">
                  {plan.name} Plan
                </Badge>
                <span className="font-black text-foreground text-sm">
                  ₹{amountPaid.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="h-px bg-border/40 w-full" />

            {/* Validity Date */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-muted-foreground font-semibold">
                <Calendar className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Validity Period</span>
              </div>
              <span className="font-bold text-foreground">
                Valid until {formattedExpiry}
              </span>
            </div>

            <div className="h-px bg-border/40 w-full" />

            {/* Payment ID Reference */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Payment Reference</span>
              <span className="font-mono font-bold text-foreground text-[11px] bg-background px-2 py-0.5 rounded border border-border/40 truncate max-w-[160px]">
                {paymentId}
              </span>
            </div>

            <div className="h-px bg-border/40 w-full" />

            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-semibold">Payment Status</span>
              <span className="inline-flex items-center gap-1 font-extrabold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                Paid via Razorpay
              </span>
            </div>

          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Link href="/seller/dashboard" className="w-full sm:flex-1">
            <Button className="w-full h-11 rounded-2xl font-extrabold text-xs shadow-md bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer flex items-center justify-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>

          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            className="w-full sm:flex-1 h-11 rounded-2xl font-extrabold text-xs border-border/80 hover:bg-muted/50 text-foreground cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4 text-primary" />
            <span>Download Invoice</span>
          </Button>
        </CardFooter>

      </Card>

      {/* Embedded CSS Animations for Checkmark */}
      <style jsx>{`
        @keyframes circleAnim {
          0% { stroke-dasharray: 0 150; opacity: 0; }
          100% { stroke-dasharray: 150 0; opacity: 1; }
        }
        @keyframes checkAnim {
          0% { stroke-dashoffset: 50; }
          100% { stroke-dashoffset: 0; }
        }
        .circle-draw {
          animation: circleAnim 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .check-draw {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: checkAnim 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.25s forwards;
        }
      `}</style>

    </div>
  );
}

export default function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm font-semibold">Loading payment details...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}
