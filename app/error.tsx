'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Next.js Global Boundary Error:', error);
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center select-none animate-in fade-in duration-300">
      <div className="relative mb-6">
        <div className="p-4 rounded-3xl bg-destructive/10 border-2 border-destructive/20 text-destructive shadow-lg">
          <AlertCircle className="h-10 w-10 stroke-[2]" />
        </div>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-3">
        Something went wrong!
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-8 leading-relaxed font-semibold">
        An unexpected error occurred. Please try refreshing the page or try again.
      </p>

      <Button
        onClick={() => reset()}
        className="h-11 px-6 rounded-xl font-bold text-sm shadow-md cursor-pointer flex items-center gap-2 justify-center"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}
