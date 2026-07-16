'use client';

import React from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors, UseFormTrigger, UseFormSetError, UseFormClearErrors } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Check, Compass, Waves, Dumbbell, ArrowUpDown, Zap, Shield, Car, Trees, Building2, Smile, Trophy, Phone, Droplets, Trash2, Flame, ShieldAlert, Calendar } from 'lucide-react';
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
  setError: UseFormSetError<ListingFormValues>;
  clearErrors: UseFormClearErrors<ListingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

const AMENITIES_LIST = [
  { label: 'Swimming Pool', value: 'swimming-pool', icon: Waves },
  { label: 'Gym', value: 'gym', icon: Dumbbell },
  { label: 'Lift', value: 'lift', icon: ArrowUpDown },
  { label: 'Power Backup', value: 'power-backup', icon: Zap },
  { label: 'Security/CCTV', value: 'security-cctv', icon: Shield },
  { label: 'Parking', value: 'parking', icon: Car },
  { label: 'Garden/Park', value: 'garden-park', icon: Trees },
  { label: 'Club House', value: 'club-house', icon: Building2 },
  { label: 'Children\'s Play Area', value: 'play-area', icon: Smile },
  { label: 'Sports Facility', value: 'sports-facility', icon: Trophy },
  { label: 'Intercom', value: 'intercom', icon: Phone },
  { label: 'Rainwater Harvesting', value: 'rainwater', icon: Droplets },
  { label: 'Waste Disposal', value: 'waste-disposal', icon: Trash2 },
  { label: 'Gas Pipeline', value: 'gas-pipeline', icon: Flame },
  { label: 'Fire Safety', value: 'fire-safety', icon: ShieldAlert }
];

const PROPERTY_AGE_OPTIONS = [
  { label: 'Under Construction', value: 'under-construction' },
  { label: 'Less than 1 year', value: 'less-than-1-year' },
  { label: '1-5 years', value: '1-5-years' },
  { label: '5-10 years', value: '5-10-years' },
  { label: '10+ years', value: '10-plus-years' }
] as const;

const FURNISHING_OPTIONS = [
  { label: 'Unfurnished', value: 'unfurnished', desc: 'Bare shell property' },
  { label: 'Semi-Furnished', value: 'semi-furnished', desc: 'Basic fittings, cupboards' },
  { label: 'Furnished', value: 'furnished', desc: 'Fully loaded with appliances' }
] as const;

const PARKING_OPTIONS = ['none', '1', '2', '2+'] as const;
const FACING_OPTIONS = ['east', 'west', 'north', 'south', 'any'] as const;

export default function StepFeatures({
  register,
  setValue,
  watch,
  errors,
  trigger,
  setError,
  clearErrors,
  onNext,
  onBack
}: StepFeaturesProps) {
  // Watch necessary form states
  const propertyType = watch('basicDetails.propertyType') || '';
  const listingType = watch('basicDetails.listingType') || '';

  const totalAreaUnit = watch('featuresDetails.totalAreaUnit') || 'sqft';
  const propertyAge = watch('featuresDetails.propertyAge') || '1-5-years';
  const furnishing = watch('featuresDetails.furnishing') || 'semi-furnished';
  const parking = watch('featuresDetails.parking') || 'none';
  const facing = watch('featuresDetails.facing') || 'any';
  const selectedAmenities = watch('featuresDetails.amenities') || [];

  const isPlot = propertyType === 'plot';
  const isRent = listingType === 'rent';

  const handleUnitSelect = (unit: 'sqft' | 'sqm' | 'acres') => {
    setValue('featuresDetails.totalAreaUnit', unit, { shouldValidate: true });
  };

  const handleAgeSelect = (age: typeof PROPERTY_AGE_OPTIONS[number]['value']) => {
    setValue('featuresDetails.propertyAge', age, { shouldValidate: true });
  };

  const handleFurnishingSelect = (furn: typeof FURNISHING_OPTIONS[number]['value']) => {
    setValue('featuresDetails.furnishing', furn, { shouldValidate: true });
  };

  const handleParkingSelect = (park: typeof PARKING_OPTIONS[number]) => {
    setValue('featuresDetails.parking', park, { shouldValidate: true });
  };

  const handleFacingSelect = (face: typeof FACING_OPTIONS[number]) => {
    setValue('featuresDetails.facing', face, { shouldValidate: true });
  };

  const handleToggleAmenity = (val: string) => {
    const updated = selectedAmenities.includes(val)
      ? selectedAmenities.filter((item) => item !== val)
      : [...selectedAmenities, val];
    setValue('featuresDetails.amenities', updated, { shouldValidate: true });
  };

  const handleNext = async () => {
    // Clear manual errors first
    clearErrors('featuresDetails.floorNo');

    // Run manual validations
    let hasManualError = false;

    if (!isPlot) {
      const floorNo = watch('featuresDetails.floorNo');
      if (floorNo === undefined || floorNo === null || floorNo === '') {
        setError('featuresDetails.floorNo', {
          type: 'manual',
          message: 'Floor number is required for non-plot properties.'
        });
        hasManualError = true;
      }
    }

    if (hasManualError) {
      toast('Please resolve the required fields errors.', 'error');
      return;
    }

    const isValid = await trigger('featuresDetails');
    if (isValid) {
      onNext();
    } else {
      toast('Please enter valid property features and specs.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">
        <Compass className="h-4.5 w-4.5 text-primary" />
        <span>Property Features & Specifications</span>
      </div>

      {/* SECTION 1: PROPERTY DETAILS */}
      <div className="flex flex-col gap-4 border border-border/30 bg-muted/10 p-5 rounded-2xl animate-in slide-in-from-top-3 duration-300">
        <h3 className="text-sm font-bold text-foreground">Property Specs & Dimensions</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Area + Unit Selector */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Area *</label>
            <div className="flex rounded-xl overflow-hidden border border-border/80 bg-background/50">
              <Input 
                type="number"
                placeholder="e.g. 1800"
                {...register('featuresDetails.totalArea')}
                className="border-none rounded-none focus-visible:ring-0 h-11 text-xs font-semibold flex-1 shadow-none bg-transparent"
              />
              <div className="flex border-l border-border/80 bg-muted/30">
                {(['sqft', 'sqm', 'acres'] as const).map((unit) => {
                  const isSelected = totalAreaUnit === unit;
                  return (
                    <button
                      key={unit}
                      type="button"
                      onClick={() => handleUnitSelect(unit)}
                      className={`px-3 text-[10px] font-bold uppercase transition-colors cursor-pointer border-r last:border-r-0 border-border/60 ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground font-black' 
                          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {unit}
                    </button>
                  );
                })}
              </div>
            </div>
            {errors.featuresDetails?.totalArea && (
              <span className="text-[11px] text-destructive font-bold">{errors.featuresDetails.totalArea.message}</span>
            )}
          </div>

          {/* Carpet Area */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Carpet Area (Optional)</label>
            <div className="relative">
              <Input 
                type="number"
                placeholder="e.g. 1500"
                {...register('featuresDetails.carpetArea')}
                className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold pr-12"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground uppercase select-none">
                {totalAreaUnit}
              </span>
            </div>
            {errors.featuresDetails?.carpetArea && (
              <span className="text-[11px] text-destructive font-bold">{errors.featuresDetails.carpetArea.message}</span>
            )}
          </div>
        </div>

        {/* Floor configuration (Hidden for Plots) */}
        {!isPlot && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-3 duration-300">
            {/* Floor Number */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Floor Number *</label>
              <Input 
                type="number"
                placeholder="e.g. 4"
                {...register('featuresDetails.floorNo')}
                className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
              />
              {errors.featuresDetails?.floorNo && (
                <span className="text-[11px] text-destructive font-bold">{errors.featuresDetails.floorNo.message}</span>
              )}
            </div>

            {/* Total Floors in Building */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Floors in Building</label>
              <Input 
                type="number"
                placeholder="e.g. 12"
                {...register('featuresDetails.totalFloors')}
                className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold"
              />
              {errors.featuresDetails?.totalFloors && (
                <span className="text-[11px] text-destructive font-bold">{errors.featuresDetails.totalFloors.message}</span>
              )}
            </div>
          </div>
        )}

        {/* Property Age Radio Selector */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Property Age</label>
          <div className="flex flex-wrap gap-2.5">
            {PROPERTY_AGE_OPTIONS.map((option) => {
              const isSelected = propertyAge === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleAgeSelect(option.value)}
                  className={`px-4.5 py-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary text-primary-foreground font-black shadow-xs' 
                      : 'border-border/80 hover:border-border bg-background/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Furnishing Status (Radio Cards with Descriptions) */}
        <div className="flex flex-col gap-2 text-left">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Furnishing Status</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {FURNISHING_OPTIONS.map((option) => {
              const isSelected = furnishing === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleFurnishingSelect(option.value)}
                  className={`p-4.5 rounded-2xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10' 
                      : 'border-border/80 hover:bg-muted/20 bg-background/50 text-foreground'
                  }`}
                >
                  <span className="text-xs font-black">{option.label}</span>
                  <span className="text-[9px] text-muted-foreground leading-none mt-1">{option.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Parking & Facing selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-1">
          {/* Parking */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Parking Spaces</label>
            <div className="flex gap-2">
              {PARKING_OPTIONS.map((val) => {
                const isSelected = parking === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleParkingSelect(val)}
                    className={`h-9 min-w-[50px] px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center ${
                      isSelected 
                        ? 'border-primary bg-primary text-primary-foreground font-black' 
                        : 'border-border/80 hover:border-border bg-background/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{val === 'none' ? 'None' : val}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Facing */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Facing Direction</label>
            <div className="flex flex-wrap gap-2">
              {FACING_OPTIONS.map((val) => {
                const isSelected = facing === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleFacingSelect(val)}
                    className={`h-9 px-3.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center capitalize ${
                      isSelected 
                        ? 'border-primary bg-primary text-primary-foreground font-black' 
                        : 'border-border/80 hover:border-border bg-background/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>{val}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Date picker for Rental listings only */}
        {isRent && (
          <div className="flex flex-col gap-1.5 text-left mt-1 animate-in slide-in-from-top-3 duration-300">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Available From</span>
            </label>
            <Input 
              type="date"
              {...register('featuresDetails.availableFrom')}
              className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold max-w-xs"
            />
            {errors.featuresDetails?.availableFrom && (
              <span className="text-[11px] text-destructive font-bold">{errors.featuresDetails.availableFrom.message}</span>
            )}
          </div>
        )}

      </div>

      {/* SECTION 2: AMENITIES GRID */}
      <div className="flex flex-col gap-3">
        <div className="text-left select-none">
          <h3 className="text-sm font-bold text-foreground">Select Amenities</h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">Select amenities that apply to your property to help buyers search better.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-1.5">
          {AMENITIES_LIST.map((item) => {
            const IconComponent = item.icon;
            const isChecked = selectedAmenities.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleToggleAmenity(item.value)}
                className={`flex flex-col items-center justify-center text-center p-4.5 rounded-2xl border cursor-pointer transition-all aspect-square gap-3 select-none ${
                  isChecked 
                    ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10 font-bold scale-102 shadow-2xs' 
                    : 'border-border/60 hover:border-border/95 hover:bg-muted/10 bg-background/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-all relative ${
                  isChecked ? 'bg-primary text-primary-foreground' : 'bg-muted/65 text-muted-foreground/90'
                }`}>
                  <IconComponent className="h-5 w-5" />
                  {isChecked && (
                    <div className="absolute -top-1.5 -right-1.5 bg-primary border-2 border-white rounded-full p-0.5 shadow-3xs flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 stroke-[4.5] text-primary-foreground" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-black tracking-tight leading-tight max-w-[85px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="flex justify-between pt-4 border-t border-border/25 mt-4">
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
          className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 h-10 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border-none"
        >
          <span>Next Step</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </Button>
      </div>

    </div>
  );
}
