'use client';

import React from 'react';
import { EstateProvider } from '@/lib/context/estate-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <EstateProvider>
      {children}
    </EstateProvider>
  );
}
