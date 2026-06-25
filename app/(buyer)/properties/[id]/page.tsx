import React from 'react';

// Use dynamic route parameters type standard for Next.js App Router
interface PropertyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({ params }: PropertyDetailsPageProps) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight">Property Details</h1>
      <p className="mt-2 text-muted-foreground">Showing details for property ID: {id}</p>
    </div>
  );
}
