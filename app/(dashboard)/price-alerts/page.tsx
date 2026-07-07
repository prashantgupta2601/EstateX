'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, Trash2, ArrowDownRight, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { getPriceAlerts, PriceAlert } from '@/lib/mock-data/api-simulation';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';

export default function PriceDropAlertsPage() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertToDelete, setAlertToDelete] = useState<PriceAlert | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    getPriceAlerts().then((data) => {
      setAlerts(data);
      setIsLoading(false);
    });
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lac`;
    } else {
      return `₹${price.toLocaleString('en-IN')}`;
    }
  };

  const handleDeleteClick = (alert: PriceAlert) => {
    setAlertToDelete(alert);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (alertToDelete) {
      setAlerts((prev) => prev.filter((item) => item.id !== alertToDelete.id));
      toast('Price alert removed successfully');
      setIsConfirmOpen(false);
      setAlertToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
          <Bell className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-foreground">Price Drop Alerts</h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Get notified when property prices drop below your target price.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <Card 
              key={i} 
              className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl overflow-hidden p-5 flex flex-col gap-4"
            >
              <div className="flex gap-4 items-start w-full">
                <Skeleton className="w-20 h-16 rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <Skeleton className="h-4.5 w-5/6 rounded-md" />
                  <Skeleton className="h-3.5 w-1/3 rounded-md mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 border-y border-border/40 py-3.5 my-1">
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-12 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3 w-12 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
              </div>
              <div className="flex justify-between items-center mt-auto gap-4">
                <Skeleton className="h-5.5 w-14 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-xl" />
                  <Skeleton className="h-8 w-20 rounded-xl" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : alerts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {alerts.map((alert) => (
            <Card 
              key={alert.id} 
              className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl overflow-hidden shadow-xs hover:scale-[1.01] transition-transform duration-300 flex flex-col"
            >
              {/* Green dropped banner at top if triggered */}
              {alert.alertTriggered && (
                <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border-b border-emerald-500/10 px-4 py-2 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Price dropped! Current price is below your target.
                  </span>
                </div>
              )}

              <div className="p-5 flex flex-col gap-4 flex-1">
                {/* Property Detail Row */}
                <div className="flex gap-4 items-start">
                  <div className="relative w-20 h-16 shrink-0 bg-muted rounded-xl overflow-hidden border border-border/65">
                    <Image 
                      src={alert.propertyImage} 
                      alt={alert.propertyTitle} 
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/properties/${alert.propertyId}`}
                      className="text-xs font-black text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight"
                    >
                      {alert.propertyTitle}
                    </Link>
                    <span className="text-[9px] text-muted-foreground font-semibold mt-1 block">
                      Alert set on {new Date(alert.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Price Matrix */}
                <div className="grid grid-cols-2 gap-4 border-y border-border/40 py-3.5 my-1">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Current Price</span>
                    <span className={`text-sm font-black mt-1 ${alert.alertTriggered ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                      {formatPrice(alert.currentPrice)}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Target Price</span>
                    <span className="text-sm font-black text-primary mt-1">
                      {formatPrice(alert.targetPrice)}
                    </span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center mt-auto gap-4">
                  <div>
                    {alert.alertTriggered && alert.priceDropPercent > 0 && (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <ArrowDownRight className="h-3 w-3" />
                        <span>-{alert.priceDropPercent.toFixed(1)}% OFF</span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/properties/${alert.propertyId}`}>
                      <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold rounded-xl cursor-pointer flex items-center gap-1">
                        <span>View</span>
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteClick(alert)}
                      className="h-8 text-[10px] font-bold rounded-xl cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center text-center p-8 bg-card/45 border border-border/80 rounded-2xl gap-4 min-h-[300px]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <p className="text-xs font-black text-foreground">No Price Alerts Active</p>
            <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">
              No price alerts set. Visit a property page and click &apos;Set Price Alert&apos; to get started.
            </p>
          </div>
          <Link href="/properties">
            <Button className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-5 shadow-sm text-xs cursor-pointer h-9 mt-1">
              Browse Properties
            </Button>
          </Link>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-sm rounded-2xl bg-card border border-border/80 shadow-2xl p-6 text-left">
          <DialogHeader className="text-left mb-4">
            <DialogTitle className="text-base font-black text-foreground">Remove Price Alert?</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Are you sure you want to stop tracking price drops for this property? You will no longer receive notifications.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
            <DialogClose render={<Button variant="outline" className="rounded-xl text-xs" />}>
              Cancel
            </DialogClose>
            <Button 
              variant="destructive" 
              className="rounded-xl font-semibold text-xs cursor-pointer"
              onClick={handleConfirmDelete}
            >
              Remove Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
