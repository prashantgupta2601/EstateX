'use client';

import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { ChevronRight, ChevronLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

interface StepLocationProps {
  register: UseFormRegister<any>;
  errors: any;
  trigger: any;
  onNext: () => void;
  onBack: () => void;
}

export default function StepLocation({
  register,
  errors,
  trigger,
  onNext,
  onBack
}: StepLocationProps) {
  
  const handleNext = async () => {
    const isValid = await trigger('locationDetails');
    if (isValid) {
      onNext();
    } else {
      toast('Please enter a valid address before proceeding.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2 animate-in fade-in duration-300">
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
        <MapPin className="h-4.5 w-4.5 text-primary" />
        <span>Property Location</span>
      </div>

      {/* Street Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Street Address</label>
        <Input 
          type="text"
          placeholder="e.g. Apartment 405, Sector 54, Golf Course Road"
          {...register('locationDetails.streetAddress')}
          className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
        />
        {errors.locationDetails?.streetAddress && (
          <span className="text-[11px] text-destructive font-bold">{errors.locationDetails.streetAddress.message}</span>
        )}
      </div>

      {/* City & State Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* City */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">City</label>
          <Input 
            type="text"
            placeholder="e.g. Gurugram"
            {...register('locationDetails.city')}
            className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
          />
          {errors.locationDetails?.city && (
            <span className="text-[11px] text-destructive font-bold">{errors.locationDetails.city.message}</span>
          )}
        </div>

        {/* State */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">State</label>
          <Input 
            type="text"
            placeholder="e.g. Haryana"
            {...register('locationDetails.state')}
            className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
          />
          {errors.locationDetails?.state && (
            <span className="text-[11px] text-destructive font-bold">{errors.locationDetails.state.message}</span>
          )}
        </div>
      </div>

      {/* Map Placeholder Graphic */}
      <div className="border border-border/40 bg-muted/20 p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-2 select-none border-dashed mt-2">
        <MapPin className="h-6 w-6 text-muted-foreground animate-bounce" />
        <span className="text-xs font-bold text-foreground">Interactive Location Map</span>
        <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed">
          The property location will automatically map based on address details to help buyers find nearby amenities.
        </p>
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
