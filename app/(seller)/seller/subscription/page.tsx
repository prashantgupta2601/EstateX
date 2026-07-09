import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function SubscriptionPage() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      features: ['Up to 2 active listings', 'Standard listing visibility', 'Basic buyer enquiry history', 'Email support'],
      active: false
    },
    {
      name: 'Basic',
      price: '₹999',
      period: 'month',
      features: ['Up to 10 active listings', 'Boosted visibility (1.5x)', 'Full buyer details & contact info', 'Priority email support'],
      active: false
    },
    {
      name: 'Pro',
      price: '₹2,499',
      period: 'month',
      features: ['Unlimited active listings', 'Maximum search priority (3x)', 'Verified seller badge', '24/7 dedicated support manager', 'Lead matching analytics'],
      active: true
    }
  ];

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Subscription Plan</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage and upgrade your seller tier plan</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`rounded-2xl border-border/40 overflow-hidden flex flex-col justify-between shadow-xs ${
              plan.active 
                ? 'ring-2 ring-primary border-primary bg-primary/[0.01]' 
                : ''
            }`}
          >
            <div>
              <CardHeader className="pb-4 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-foreground">{plan.name} Plan</span>
                  {plan.active && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-3xl font-black text-foreground">{plan.price}</span>
                  <span className="text-xs text-muted-foreground font-semibold">/ {plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="pt-6 flex flex-col gap-4 text-xs font-semibold text-muted-foreground">
                {plan.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-2.5">
                    <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{feat}</span>
                  </div>
                ))}
              </CardContent>
            </div>

            <div className="p-6 border-t border-border/40">
              <Button 
                variant={plan.active ? 'outline' : 'default'} 
                className="w-full rounded-xl text-xs font-bold h-10 cursor-pointer"
                disabled={plan.active}
              >
                {plan.active ? 'Current Plan' : `Upgrade to ${plan.name}`}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
