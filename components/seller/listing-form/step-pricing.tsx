'use client';

import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
import { ChevronRight, ChevronLeft, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

interface StepPricingProps {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  errors: any;
  trigger: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPricing({
  register,
  watch,
  errors,
  trigger,
  onNext,
  onBack
}: StepPricingProps) {
  const price = watch('pricingDetails.price');

  const handleNext = async () => {
    const isValid = await trigger('pricingDetails');
    if (isValid) {
      onNext();
    } else {
      toast('Please enter a valid price before proceeding.', 'error');
    }
  };

  // Convert number price to readable format (Lakhs / Crores)
  const getReadablePrice = (priceVal: any) => {
    const num = Number(priceVal);
    if (!num || isNaN(num)) return '';
    if (num >= 10000000) {
      return `₹ ${(num / 10000000).toFixed(2)} Crore`;
    }
    if (num >= 100000) {
      return `₹ ${(num / 100000).toFixed(2)} Lakh`;
    }
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col gap-5 py-2 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 select-none">
        <IndianRupee className="h-4.5 w-4.5 text-primary" />
        <span>Pricing details</span>
      </div>

      {/* Price input */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Property Price (INR)</label>
        <div className="relative">
          <Input 
            type="number"
            placeholder="e.g. 7500000"
            {...register('pricingDetails.price')}
            className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold pl-8"
          />
          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        </div>
        {errors.pricingDetails?.price ? (
          <span className="text-[11px] text-destructive font-bold">{errors.pricingDetails.price.message}</span>
        ) : (
          price && <span className="text-xs font-black text-primary animate-fade-in">{getReadablePrice(price)}</span>
        )}
      </div>

      <div className="border border-border/40 bg-muted/20 p-4.5 rounded-2xl text-[11px] text-muted-foreground leading-relaxed mt-2 font-semibold select-none border-dashed">
        <strong>Price Guidance:</strong> Be transparent with pricing to attract verified buyers. Listings with prices matching local market trends receive up to 3x more views.
      </div>

      {/* Footer navigation */}
      <div className="flex justify-between pt-4 border-t border-border/25 mt-2">
        <Button 
          type="button" 
          variant="ghost"
          onClick={onBack}
          className="rounded-xl border border-border/80 h-10 font-bold text-xs cursor-pointer px-4"
        >
          <ChevronLeft className="h-4.5 w-4.5 mr-1" />
          <span>Back</span>
        </Button>
        <Button 
          type="button" 
          onClick={handleNext}
          className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 h-10 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span>Next Step</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </Button>
      </div>

    </div>
  );
}
