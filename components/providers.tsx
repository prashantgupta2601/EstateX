'use client';

import React from 'react';
import { EstateProvider } from '@/lib/context/estate-context';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <EstateProvider>
      {children}
      <ProgressBar
        height="3px"
        color="var(--primary, #3b82f6)"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </EstateProvider>
  );
}
