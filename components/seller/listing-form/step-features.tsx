'use client';

import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Check, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { ListingFormValues } from '@/lib/validations/listing-form';

interface StepFeaturesProps {
  register: UseFormRegister<ListingFormValues>;
  setValue: UseFormSetValue<ListingFormValues>;
  watch: UseFormWatch<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
  trigger: UseFormTrigger<ListingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFeatures({
  register,
  setValue,
  watch,
  errors,
  trigger,
  onNext,
  onBack
}: StepFeaturesProps) {
  // Watch values
  const furnishing = watch('featuresDetails.furnishing') || 'Semi-Furnished';
  const bathrooms = watch('featuresDetails.bathrooms') || 2;
  const selectedAmenities = watch('featuresDetails.amenities') || [];

  const furnishingOptions = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
  const bathroomOptions = [1, 2, 3, 4, 5];

  const amenitiesList = [
    { label: 'Gated Parking', value: 'parking' },
    { label: '24/7 Power Backup', value: 'power-backup' },
    { label: 'Society Lift', value: 'lift' },
    { label: 'Gym & Clubhouse', value: 'gym' },
    { label: 'Swimming Pool', value: 'pool' },
    { label: 'Intercom Facility', value: 'intercom' },
    { label: 'Security Guard', value: 'security' },
    { label: 'Water Purifier', value: 'water-purifier' }
  ];

  const handleFurnishingSelect = (val: string) => {
    setValue('featuresDetails.furnishing', val, { shouldValidate: true });
  };

  const handleBathroomsSelect = (val: number) => {
    setValue('featuresDetails.bathrooms', val, { shouldValidate: true });
  };

  const handleToggleAmenity = (val: string) => {
    const updated = selectedAmenities.includes(val)
      ? selectedAmenities.filter((item: string) => item !== val)
      : [...selectedAmenities, val];
    setValue('featuresDetails.amenities', updated, { shouldValidate: true });
  };

  const handleNext = async () => {
    const isValid = await trigger('featuresDetails');
    if (isValid) {
      onNext();
    } else {
      toast('Please enter valid property features before proceeding.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
        <Compass className="h-4.5 w-4.5 text-primary" />
        <span>Property Features & Specs</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Super Area */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Super Built-up Area (Sq. Ft.)</label>
          <Input 
            type="text"
            placeholder="e.g. 1850"
            {...register('featuresDetails.superArea')}
            className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
          />
          {errors.featuresDetails?.superArea && (
            <span className="text-[11px] text-destructive font-bold">{errors.featuresDetails.superArea.message}</span>
          )}
        </div>

        {/* Bathrooms */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bathrooms</label>
          <div className="flex gap-2 h-11 items-center">
            {bathroomOptions.map(val => {
              const isSelected = bathrooms === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleBathroomsSelect(val)}
                  className={`h-9 w-9 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center ${
                    isSelected 
                      ? 'border-primary bg-primary text-primary-foreground font-black' 
                      : 'border-border/80 hover:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{val}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Furnishing Status */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Furnishing Status</label>
        <div className="flex gap-2">
          {furnishingOptions.map(val => {
            const isSelected = furnishing === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleFurnishingSelect(val)}
                className={`px-4.5 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary text-primary-foreground font-black shadow-xs' 
                    : 'border-border/80 hover:border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{val}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Amenities Checklist */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Amenities Included</label>
        <div className="grid grid-cols-2 gap-2.5 mt-1">
          {amenitiesList.map(item => {
            const isChecked = selectedAmenities.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleToggleAmenity(item.value)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                  isChecked 
                    ? 'border-primary/50 bg-primary/5 text-primary' 
                    : 'border-border/50 hover:bg-muted/10 text-muted-foreground'
                }`}
              >
                <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center ${
                  isChecked ? 'border-primary bg-primary text-primary-foreground' : 'border-border/85 bg-background'
                }`}>
                  {isChecked && <Check className="h-3 w-3 stroke-[3.5]" />}
                </div>
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
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
