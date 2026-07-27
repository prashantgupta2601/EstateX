'use client';

import React from 'react';
import Link from 'next/link';
import { XCircle, RefreshCw, HelpCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function SubscriptionFailedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center">
      <Card className="max-w-md w-full rounded-3xl border border-rose-500/30 bg-card shadow-lg overflow-hidden relative">
        <div className="w-full bg-gradient-to-r from-rose-500 to-red-600 h-3" />

        <CardHeader className="p-6 sm:p-8 pb-4 flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 ring-8 ring-rose-500/10">
            <XCircle className="h-12 w-12 stroke-[2.5]" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Transaction Unsuccessful</span>
          </div>

          <CardTitle className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Payment Cancelled or Failed
          </CardTitle>

          <CardDescription className="text-xs sm:text-sm text-muted-foreground">
            Your subscription payment could not be processed. No charges were made to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-3">
          <div className="rounded-2xl bg-muted/40 border border-border/40 p-4 text-xs text-left space-y-2">
            <p className="font-bold text-foreground">Common Reasons:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Checkout window was closed before completion</li>
              <li>Incorrect card details or insufficient funds</li>
              <li>Bank authentication failure or network timeout</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0 flex flex-col gap-2.5">
          <Link href="/seller/subscription" className="w-full">
            <Button className="w-full h-11 rounded-2xl font-extrabold text-xs shadow-md bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
          </Link>

          <Link href="/seller/dashboard" className="w-full">
            <Button variant="outline" className="w-full h-11 rounded-2xl font-extrabold text-xs border-border/60 hover:bg-muted/40 cursor-pointer flex items-center justify-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
