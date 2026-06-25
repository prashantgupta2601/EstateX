'use client';

import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // We can integrate React Query, next-themes, or other state providers here later.
  return <>{children}</>;
}
