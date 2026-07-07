import React, { Suspense } from 'react';
import DashboardClient from '@/components/dashboard/dashboard-client';
import DashboardStatsSkeleton from '@/components/skeletons/dashboard-stats-skeleton';
import { getSavedSearches, getEnquiries, getPriceAlerts } from '@/lib/mock-data/api-simulation';

export default function DashboardPage() {
  const searchesPromise = getSavedSearches();
  const enquiriesPromise = getEnquiries();
  const alertsPromise = getPriceAlerts();

  return (
    <Suspense fallback={<DashboardStatsSkeleton />}>
      <DashboardClient
        searchesPromise={searchesPromise}
        enquiriesPromise={enquiriesPromise}
        alertsPromise={alertsPromise}
      />
    </Suspense>
  );
}
