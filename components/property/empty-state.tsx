'use client';

import React from 'react';
import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  onClearFilters?: () => void;
}

export default function EmptyState({
  icon = <SearchX className="h-8 w-8 stroke-[2.5]" />,
  title = 'No Properties Found',
  description = 'Try adjusting your filters to see more results.',
  actionLabel = 'Clear Filters',
  onAction,
  onClearFilters,
}: EmptyStateProps) {
  const handleAction = onAction || onClearFilters;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-border/85 rounded-3xl bg-card/25 min-h-[400px] w-full animate-fade-in">
      <div className="p-4.5 rounded-full bg-primary/10 text-primary mb-5 relative flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
      {handleAction && actionLabel && (
        <Button
          onClick={handleAction}
          className="mt-6 rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] h-11"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
