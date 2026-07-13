'use client';

import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Building, Trees, Home, Map, Briefcase, Store, Warehouse, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';

interface StepBasicProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  watch: UseFormWatch<any>;
  errors: any;
  trigger: any;
  onNext: () => void;
}

export default function StepBasic({
  register,
  setValue,
  watch,
  errors,
  trigger,
  onNext
}: StepBasicProps) {
  // Watch values for interactive state
  const listingType = watch('basicDetails.listingType');
  const propertyType = watch('basicDetails.propertyType');
  const selectedBhk = watch('basicDetails.bhk');
  const description = watch('basicDetails.description') || '';

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: Building },
    { value: 'villa', label: 'Villa', icon: Trees },
    { value: 'independent-house', label: 'Independent House', icon: Home },
    { value: 'plot', label: 'Plot', icon: Map },
    { value: 'office', label: 'Office', icon: Briefcase },
    { value: 'shop', label: 'Shop', icon: Store },
    { value: 'warehouse', label: 'Warehouse', icon: Warehouse }
  ];

  const bhkOptions = ['1', '2', '3', '4', '4+'];

  // Determine whether to show BHK selector (hidden for commercial / plot)
  const isResidential = ['apartment', 'villa', 'independent-house'].includes(propertyType);
  const showBhk = isResidential;

  const handleListingTypeSelect = (type: string) => {
    setValue('basicDetails.listingType', type, { shouldValidate: true });
    
    // Auto-select logical property type defaults
    if (type === 'commercial' && !['office', 'shop', 'warehouse'].includes(propertyType)) {
      setValue('basicDetails.propertyType', 'office', { shouldValidate: true });
    } else if (type !== 'commercial' && ['office', 'shop', 'warehouse'].includes(propertyType)) {
      setValue('basicDetails.propertyType', 'apartment', { shouldValidate: true });
    }
  };

  const handlePropertyTypeSelect = (type: string) => {
    setValue('basicDetails.propertyType', type, { shouldValidate: true });
    
    // Auto-adjust listing type
    if (['office', 'shop', 'warehouse'].includes(type)) {
      setValue('basicDetails.listingType', 'commercial', { shouldValidate: true });
    } else if (listingType === 'commercial') {
      setValue('basicDetails.listingType', 'sale', { shouldValidate: true });
    }

    // Clear BHK if not residential
    if (!['apartment', 'villa', 'independent-house'].includes(type)) {
      setValue('basicDetails.bhk', undefined, { shouldValidate: true });
    } else if (!selectedBhk) {
      setValue('basicDetails.bhk', '3', { shouldValidate: true }); // Default to 3 BHK
    }
  };

  const handleBhkSelect = (bhkVal: string) => {
    setValue('basicDetails.bhk', bhkVal, { shouldValidate: true });
  };

  const handleNext = async () => {
    const isValid = await trigger('basicDetails');
    if (isValid) {
      onNext();
    } else {
      toast('Please resolve basic details validation errors before proceeding.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 animate-in fade-in duration-300">
      
      {/* 1. Listing Type Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Listing Type</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'sale', label: 'For Sale', desc: 'Sell your property' },
            { value: 'rent', label: 'For Rent', desc: 'Rent out your property' },
            { value: 'commercial', label: 'Commercial', desc: 'Offices, shops, etc' }
          ].map(item => {
            const isSelected = listingType === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleListingTypeSelect(item.value)}
                className={`p-4.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10' 
                    : 'border-border/80 hover:bg-muted/20 text-foreground'
                }`}
              >
                <span className="text-xs font-black">{item.label}</span>
                <span className="text-[9px] text-muted-foreground leading-none hidden sm:block">{item.desc}</span>
              </button>
            );
          })}
        </div>
        {errors.basicDetails?.listingType && (
          <span className="text-[11px] text-destructive font-bold">{errors.basicDetails.listingType.message}</span>
        )}
      </div>

      {/* 2. Property Type Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Property Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {propertyTypes.map(item => {
            const Icon = item.icon;
            const isSelected = propertyType === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handlePropertyTypeSelect(item.value)}
                className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10' 
                    : 'border-border/80 hover:bg-muted/20 text-foreground'
                }`}
              >
                <div className={`p-2 rounded-xl ${isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground/80'}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold">{item.label}</span>
              </button>
            );
          })}
        </div>
        {errors.basicDetails?.propertyType && (
          <span className="text-[11px] text-destructive font-bold">{errors.basicDetails.propertyType.message}</span>
        )}
      </div>

      {/* 3. BHK Selection (Conditional) */}
      {showBhk && (
        <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">BHK (Bedrooms)</label>
          <div className="flex flex-wrap gap-2">
            {bhkOptions.map(val => {
              const isSelected = selectedBhk === val;
              return (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleBhkSelect(val)}
                  className={`px-4.5 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary text-primary-foreground font-black shadow-xs' 
                      : 'border-border/80 hover:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{val} BHK</span>
                </button>
              );
            })}
          </div>
          {errors.basicDetails?.bhk && (
            <span className="text-[11px] text-destructive font-bold">{errors.basicDetails.bhk.message}</span>
          )}
        </div>
      )}

      {/* 4. Title Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Property Title</label>
        <Input 
          type="text"
          placeholder="e.g. Spacious 3 BHK Apartment in DLF Phase 5"
          {...register('basicDetails.title')}
          className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
        />
        {errors.basicDetails?.title ? (
          <span className="text-[11px] text-destructive font-bold">{errors.basicDetails.title.message}</span>
        ) : (
          <span className="text-[10px] text-muted-foreground">Keep it descriptive, including BHK and project name if possible. (Min 10 characters)</span>
        )}
      </div>

      {/* 5. Description Textarea */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
          <span className={`text-[10px] font-bold ${description.length < 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
            {description.length} / 2000 chars (Min 50)
          </span>
        </div>
        <textarea 
          placeholder="Describe the property highlights, nearby landmarks, society security, utilities, furnishing, or lease conditions..."
          {...register('basicDetails.description')}
          rows={5}
          className="rounded-xl bg-background/50 border border-border/80 focus-visible:ring-primary/45 w-full p-3 text-xs font-semibold outline-hidden resize-none focus:border-primary/50"
        />
        {errors.basicDetails?.description && (
          <span className="text-[11px] text-destructive font-bold">{errors.basicDetails.description.message}</span>
        )}
      </div>

      {/* Footer navigation */}
      <div className="flex justify-end pt-4 border-t border-border/25 mt-2">
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
