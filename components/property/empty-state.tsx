'use client';

import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/85 rounded-3xl bg-card/25 min-h-[400px]">
      <div className="p-4.5 rounded-full bg-primary/10 text-primary mb-5 animate-pulse">
        <SearchX className="h-8 w-8 stroke-[2.5]" />
      </div>
      <h3 className="text-xl font-bold text-foreground">No Properties Found</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
        Try adjusting your filters to see more results.
      </p>
      <Button
        onClick={onClearFilters}
        className="mt-6 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Clear Filters
      </Button>
    </div>
  );
}
