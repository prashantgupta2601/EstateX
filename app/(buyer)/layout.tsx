import React from 'react';
import ComparisonBar from '@/components/property/comparison-bar';
import { Toaster } from '@/components/ui/toast';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ComparisonBar />
      <Toaster />
    </>
  );
}
