import React from 'react';
import EMICalculator from '@/components/tools/emi-calculator';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home Loan EMI Calculator',
  description: 'Calculate your home loan Equated Monthly Installment (EMI) with our interactive tool.',
};

export default function EMICalculatorPage() {
  return (
    <div className="w-full min-h-screen bg-muted/20 py-12 md:py-16 flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl text-left mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Home Loan EMI Calculator
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xl">
          Plan your home buying budget. Estimate your monthly loan payments, total interest payable, and view a visual breakdown.
        </p>
      </div>
      <EMICalculator />
    </div>
  );
}
