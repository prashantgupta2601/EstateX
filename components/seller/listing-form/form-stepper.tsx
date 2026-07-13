'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface FormStepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function FormStepper({ currentStep, totalSteps, steps }: FormStepperProps) {
  return (
    <div className="w-full flex flex-col gap-4 select-none">
      {/* Mobile Step Info */}
      <div className="md:hidden flex flex-col gap-1 text-center py-2 px-4 rounded-xl bg-primary/5 border border-primary/10">
        <span className="text-[10px] font-black uppercase text-primary tracking-wider">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm font-bold text-foreground">{steps[currentStep - 1]}</span>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between w-full relative px-2">
        {/* Background Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -translate-y-1/2 z-0" />
        
        {/* Active Connecting Line Progress */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isActive = currentStep === stepNumber;
          
          return (
            <div key={label} className="flex flex-col items-center gap-2.5 z-10">
              <div 
                className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-primary text-primary-foreground shadow-xs scale-100' 
                    : isActive 
                    ? 'bg-background border-2 border-primary text-primary ring-4 ring-primary/10 scale-105' 
                    : 'bg-background border-2 border-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Check className="h-4.5 w-4.5 stroke-[3]" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span 
                className={`text-[10px] font-black uppercase tracking-wider transition-colors duration-300 ${
                  isActive 
                    ? 'text-primary' 
                    : isCompleted 
                    ? 'text-foreground' 
                    : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
