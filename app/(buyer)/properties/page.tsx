import React from 'react';
import { Metadata } from 'next';
import PropertiesListClient from '@/components/property/properties-list-client';

export const metadata: Metadata = {
  title: 'Properties Listing | EstateX',
  description: 'Browse all verified and premium residential and commercial properties on EstateX.',
};

export default function PropertiesPage() {
  return <PropertiesListClient />;
}
