import React from 'react';
import CompareDrawer from '@/components/property/compare-drawer';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CompareDrawer />
    </>
  );
}
