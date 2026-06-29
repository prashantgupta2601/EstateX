import React from 'react';
import EMICalculator from '@/components/tools/emi-calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EMI Calculator | EstateX',
  description: 'Calculate your monthly home loan installment with our interactive EMI calculator.',
};

export default function EMICalculatorPage() {
  return (
    <div className="w-full min-h-screen bg-muted/20 py-12 md:py-16 flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl text-left mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          EMI Calculator
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          Calculate your monthly home loan installment. Estimate your loan payments, total interest payable, and view a visual breakdown.
        </p>
      </div>
      <EMICalculator />
    </div>
  );
}
