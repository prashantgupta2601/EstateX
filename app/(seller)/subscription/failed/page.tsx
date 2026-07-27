'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Headphones, AlertTriangle, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function SubscriptionFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] p-4 text-center">
      <Card className="max-w-lg w-full rounded-3xl border border-rose-500/30 bg-card shadow-xl overflow-hidden relative">
        
        {/* Top Accent Line */}
        <div className="w-full bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 h-3.5" />

        <CardHeader className="p-6 sm:p-8 pb-4 flex flex-col items-center gap-4">
          
          {/* Animated Red X Icon */}
          <div className="relative flex items-center justify-center p-3 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-md">
            <svg className="w-16 h-16" viewBox="0 0 52 52">
              <circle
                className="circle-draw-rose"
                cx="26"
                cy="26"
                r="23"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
              />
              <path
                className="cross-draw"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 16l20 20M36 16L16 36"
              />
            </svg>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Transaction Unsuccessful</span>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Payment Failed
          </CardTitle>

          <CardDescription className="text-xs sm:text-sm text-muted-foreground max-w-sm">
            Your payment could not be processed. No amount has been deducted from your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-4">
          {/* Common Reasons Card */}
          <div className="rounded-2xl bg-muted/40 border border-border/50 p-4 sm:p-5 text-xs text-left space-y-2.5">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <ShieldX className="h-4 w-4 text-rose-500 shrink-0" />
              <span>Common Reasons for Failed Transactions:</span>
            </div>
            
            <ul className="list-disc list-inside text-muted-foreground space-y-1.5 pl-1 leading-relaxed">
              <li>Checkout modal was closed or cancelled before completion</li>
              <li>Bank card authorization declined or insufficient funds</li>
              <li>Network connection interruption or OTP timeout</li>
              <li>Incorrect CVV or expiration date entered</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Link href="/seller/subscription" className="w-full sm:flex-1">
            <Button className="w-full h-11 rounded-2xl font-extrabold text-xs shadow-md bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
          </Link>

          <a href="mailto:support@estatehub.com" className="w-full sm:flex-1">
            <Button variant="outline" className="w-full h-11 rounded-2xl font-extrabold text-xs border-border/80 hover:bg-muted/50 text-foreground cursor-pointer flex items-center justify-center gap-2">
              <Headphones className="h-4 w-4 text-blue-500" />
              <span>Contact Support</span>
            </Button>
          </a>
        </CardFooter>

      </Card>

      {/* Embedded CSS Animations for Red X */}
      <style jsx>{`
        @keyframes circleRoseAnim {
          0% { stroke-dasharray: 0 150; opacity: 0; }
          100% { stroke-dasharray: 150 0; opacity: 1; }
        }
        @keyframes crossAnim {
          0% { stroke-dashoffset: 60; }
          100% { stroke-dashoffset: 0; }
        }
        .circle-draw-rose {
          animation: circleRoseAnim 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .cross-draw {
          stroke-dasharray: 60;
          stroke-dashoffset: 60;
          animation: crossAnim 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.25s forwards;
        }
      `}</style>

    </div>
  );
}
