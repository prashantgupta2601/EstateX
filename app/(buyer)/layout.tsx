import React from 'react';
import CompareDrawer from '@/components/property/compare-drawer';
import { Toaster } from '@/components/ui/toast';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CompareDrawer />
      <Toaster />
    </>
  );
}
