'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Search, Trash2 } from 'lucide-react';
import { useWishlist } from '@/lib/hooks/use-wishlist';
import { mockProperties } from '@/lib/mock-data/properties';
import PropertyCard from '@/components/property/property-card';
import EmptyState from '@/components/property/empty-state';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // Sync mount status
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Filter properties in the wishlist
  const wishlistedProperties = mockProperties.filter((property) =>
    wishlist.includes(property.id)
  );

  if (!isMounted) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-pulse">
        <div className="pb-6 border-b border-border/40">
          <div className="h-9 w-48 bg-muted rounded-xl mb-2" />
          <div className="h-4 w-64 bg-muted rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4 border border-border/40 rounded-2xl p-4 bg-card/20">
              <div className="h-48 w-full bg-muted rounded-xl" />
              <div className="flex flex-col gap-2">
                <div className="h-5 w-5/6 bg-muted rounded-md" />
                <div className="h-4 w-2/3 bg-muted rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-border/40 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            My Wishlist
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {wishlistedProperties.length} {wishlistedProperties.length === 1 ? 'property' : 'properties'} saved.
          </p>
        </div>

        {wishlistedProperties.length > 0 && (
          <Dialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
            <DialogTrigger render={
              <Button 
                variant="destructive" 
                size="sm" 
                className="rounded-xl flex items-center gap-1.5 font-semibold h-10 shadow-xs cursor-pointer sm:self-start"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </Button>
            } />
            <DialogContent className="max-w-md rounded-2xl bg-card border border-border/80 shadow-2xl p-6 text-left">
              <DialogHeader className="text-left mb-4">
                <DialogTitle className="text-lg font-black text-foreground">Clear Wishlist?</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to remove all {wishlistedProperties.length} saved properties from your wishlist? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
                <DialogClose render={
                  <Button variant="outline" className="rounded-xl">
                    Cancel
                  </Button>
                } />
                <Button 
                  variant="destructive" 
                  className="rounded-xl font-semibold cursor-pointer"
                  onClick={() => {
                    clearWishlist();
                    setIsClearConfirmOpen(false);
                    toast("Wishlist cleared successfully");
                  }}
                >
                  Clear Wishlist
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {wishlistedProperties.length > 0 ? (
        /* Wishlist Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {wishlistedProperties.map((property) => (
            <div key={property.id} className="h-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <EmptyState
          icon={
            <div className="relative group">
              <Heart className="h-8 w-8 stroke-[2] group-hover:scale-110 transition-transform duration-300 fill-red-500/10 text-red-500" />
              <Search className="h-4 w-4 absolute -bottom-1 -right-1 text-primary bg-background dark:bg-black rounded-full p-0.5" />
            </div>
          }
          title="No saved properties yet"
          description="You haven't saved any properties yet. Explore our listings and click the heart icon on any property to save it here."
          actionLabel="Start Exploring"
          onAction={() => router.push('/properties')}
        />
      )}
    </div>
  );
}
