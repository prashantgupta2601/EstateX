'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function ErrorState({ title, description, actionLabel, onAction }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-destructive/20 bg-destructive/5 dark:bg-destructive/10/5 backdrop-blur-xs max-w-md mx-auto my-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="p-3 rounded-full bg-destructive/10 text-destructive mb-4 border border-destructive/20 shadow-xs">
        <AlertTriangle className="h-6 w-6 stroke-[2.5]" />
      </div>
      <h3 className="text-base font-extrabold text-foreground tracking-tight mb-1.5">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed mb-5 font-semibold px-4">{description}</p>
      {actionLabel && onAction && (
        <Button 
          variant="destructive" 
          onClick={onAction}
          className="h-9 px-5 rounded-xl font-bold text-xs shadow-md shadow-destructive/10 hover:shadow-lg transition-all cursor-pointer"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
