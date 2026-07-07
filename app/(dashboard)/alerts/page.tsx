'use client';

import React from 'react';
import { Bell } from 'lucide-react';

export default function PriceDropAlertsPage() {
  return (
    <div className="flex flex-col gap-6 text-left w-full">
      <div>
        <h1 className="text-2xl font-black text-foreground">Price Drop Alerts</h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Get notified when prices change on your bookmarked properties.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center text-center p-8 bg-card/45 border border-border/80 rounded-2xl gap-4 min-h-[300px]">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20">
          <Bell className="h-5 w-5" />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <p className="text-xs font-black text-foreground">No Price Alerts Active</p>
          <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">
            You will automatically receive alerts here if there are price adjustments on properties you have added to your wishlist.
          </p>
        </div>
      </div>
    </div>
  );
}
