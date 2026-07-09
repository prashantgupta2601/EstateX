'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, GitCompare } from 'lucide-react';
import { useComparison } from '@/lib/hooks/use-comparison';
import { mockProperties } from '@/lib/mock-data/properties';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/property/empty-state';

const ComparisonTable = dynamic(
  () => import('@/components/property/comparison-table'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] border border-dashed border-border/80 rounded-3xl bg-card/25 flex items-center justify-center animate-pulse">
        <span className="text-sm font-semibold text-muted-foreground">Loading Comparison Table...</span>
      </div>
    )
  }
);

export default function ComparePage() {
  const { comparison, removeFromCompare, clearComparison, isMounted } = useComparison();
  const router = useRouter();

  const compareList = useMemo(() => {
    return mockProperties.filter((property) => comparison.includes(property.id));
  }, [comparison]);

  if (!isMounted) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-pulse">
        <div className="pb-6 border-b border-border/40">
          <div className="h-9 w-48 bg-muted rounded-xl mb-2" />
          <div className="h-4 w-64 bg-muted rounded-md" />
        </div>
        <div className="h-96 w-full bg-card/25 rounded-3xl border border-border/40" />
      </div>
    );
  }

  // State: Less than 2 properties selected (renders empty state prompt)
  if (compareList.length < 2) {
    return (
      <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
        <div className="pb-6 border-b border-border/40">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Compare Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">Compare details and pricing side-by-side.</p>
        </div>
        
        <EmptyState
          icon={<GitCompare className="h-8 w-8 stroke-[2]" />}
          title="Select at least 2 properties to compare"
          description={
            compareList.length === 1 
              ? `You have selected 1 property ("${compareList[0].title}"). Select at least one more property from our listings to view their side-by-side comparison.`
              : "You haven't added any properties to compare yet. Go back to listings and click the compare checkbox on any property."
          }
          actionLabel="Browse Properties"
          onAction={() => router.push('/properties')}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 md:py-12 flex flex-col gap-6 text-left animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Compare Properties</h1>
          <p className="mt-1 text-sm text-muted-foreground">Compare details and specifications side-by-side.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/properties">
            <Button variant="outline" size="sm" className="rounded-xl font-semibold border-border text-foreground hover:bg-muted cursor-pointer flex items-center gap-1.5 h-10 text-xs">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Listings</span>
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={clearComparison}
            className="text-xs font-bold text-muted-foreground hover:text-red-500 cursor-pointer h-10 px-3 rounded-xl hover:bg-red-500/5 transition-colors"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Comparison Presentation Table */}
      <ComparisonTable compareList={compareList} removeFromCompare={removeFromCompare} />

    </div>
  );
}
