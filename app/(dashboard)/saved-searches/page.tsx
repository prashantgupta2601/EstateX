'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, Bell, Trash2, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { formatIndianCurrencyShort } from '@/lib/utils/emi-calculator';
import { mockSavedSearches, SavedSearch } from '@/lib/mock-data/saved-searches';
import { cn } from '@/lib/utils';

export default function SavedSearchesPage() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(mockSavedSearches);
  const [searchToDelete, setSearchToDelete] = useState<SavedSearch | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const getFilterSummary = (filters: SavedSearch['filters']) => {
    const parts = [];

    if (filters.bhk) {
      parts.push(`${filters.bhk} BHK`);
    }

    if (filters.type) {
      const capitalizedType = filters.type.charAt(0).toUpperCase() + filters.type.slice(1);
      parts.push(capitalizedType);
    } else {
      parts.push('Property');
    }

    if (filters.city) {
      parts.push(`in ${filters.city}`);
    }

    const summaryStr = parts.join(' ');

    let priceStr = '';
    if (filters.minPrice && filters.maxPrice) {
      priceStr = `, ${formatIndianCurrencyShort(filters.minPrice)} - ${formatIndianCurrencyShort(filters.maxPrice)}`;
    } else if (filters.minPrice) {
      priceStr = `, Min ${formatIndianCurrencyShort(filters.minPrice)}`;
    } else if (filters.maxPrice) {
      priceStr = `, Max ${formatIndianCurrencyShort(filters.maxPrice)}`;
    }

    return `${summaryStr}${priceStr}`;
  };

  const generateUrl = (filters: SavedSearch['filters']) => {
    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.type) params.set('type', filters.type);
    if (filters.bhk) params.set('bhk', String(filters.bhk));
    if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
    if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
    if (filters.purpose) params.set('purpose', filters.purpose);
    return `/properties?${params.toString()}`;
  };

  const handleDeleteClick = (search: SavedSearch) => {
    setSearchToDelete(search);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (searchToDelete) {
      setSavedSearches((prev) => prev.filter((item) => item.id !== searchToDelete.id));
      toast('Saved search deleted successfully');
      setIsConfirmOpen(false);
      setSearchToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-foreground">Saved Searches</h1>
        <p className="text-xs text-muted-foreground mt-1 font-medium">
          Manage your saved property searches and automated email alerts.
        </p>
      </div>

      {savedSearches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedSearches.map((search) => (
            <Card 
              key={search.id} 
              className="border-border/80 bg-card/45 backdrop-blur-md rounded-2xl p-5 hover:scale-[1.01] transition-transform duration-300 flex flex-col gap-4"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-sm font-black text-foreground">{search.name}</h3>
                  <p className="text-xs text-muted-foreground font-semibold leading-relaxed">
                    {getFilterSummary(search.filters)}
                  </p>
                </div>
                
                {/* New listings badge */}
                {search.newListingsCount > 0 && (
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black shrink-0 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Bell className="h-3 w-3 stroke-[2.5]" />
                    {search.newListingsCount} New
                  </Badge>
                )}
              </div>

              {/* Bottom date and actions */}
              <div className="flex justify-between items-center mt-auto pt-2 border-t border-border/60">
                <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-bold">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Saved on {new Date(search.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Delete button */}
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteClick(search)}
                    className="h-8 rounded-xl px-2.5 cursor-pointer flex items-center justify-center gap-1"
                    title="Delete Search"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* View Results link button */}
                  <Link
                    href={generateUrl(search.filters)}
                    className={cn(
                      buttonVariants({ size: 'sm' }),
                      "h-8 rounded-xl px-3 font-semibold cursor-pointer flex items-center justify-center gap-1"
                    )}
                  >
                    <span>View Results</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-card/45 border border-border/80 rounded-2xl gap-4 min-h-[300px]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20">
            <Search className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <p className="text-xs font-black text-foreground">No Saved Searches Yet</p>
            <p className="text-[10px] font-semibold text-muted-foreground leading-relaxed">
              When searching for properties, click &quot;Save Search&quot; to receive instant updates when new listings match your criteria.
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-sm w-full p-6 rounded-3xl bg-card border border-border shadow-2xl">
          <DialogHeader className="flex flex-col gap-1.5 text-left">
            <DialogTitle className="text-base font-black text-foreground">Delete Saved Search</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-semibold">
              Are you sure you want to delete this saved search? You will stop receiving notifications for new listings matching these filters.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
            <DialogClose render={
              <Button variant="outline" className="h-10 rounded-xl text-xs font-bold flex-1 cursor-pointer">
                Cancel
              </Button>
            } />
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              className="h-10 rounded-xl text-xs font-bold flex-1 cursor-pointer"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
