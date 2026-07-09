import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function LeadAnalyticsPage() {
  return (
    <div className="flex flex-col gap-6 text-left">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Lead Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Vetting leads conversion rate and response analytics.</p>
      </div>

      <Card className="rounded-2xl border-border/40 shadow-xs">
        <CardContent className="py-20 flex flex-col items-center justify-center text-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-foreground">Lead Performance Analytics coming soon</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Detailed reports on lead acquisition sources, monthly growth trends, and average response times will be shown here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
