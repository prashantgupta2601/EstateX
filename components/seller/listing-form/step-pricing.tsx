'use client';

import React, { useCallback, useMemo } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormWatch, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { ChevronRight, ChevronLeft, IndianRupee, Video, X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { useDropzone, FileRejection } from 'react-dropzone';
import { ListingFormValues } from '@/lib/validations/listing-form';

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface StepPricingProps {
  register: UseFormRegister<ListingFormValues>;
  setValue: UseFormSetValue<ListingFormValues>;
  watch: UseFormWatch<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
  trigger: UseFormTrigger<ListingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

const PREFERRED_TIME_OPTIONS = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
  { label: 'Anytime', value: 'anytime' }
] as const;

export default function StepPricing({
  register,
  setValue,
  watch,
  errors,
  trigger,
  onNext,
  onBack
}: StepPricingProps) {
  // Watch values
  const listingType = watch('basicDetails.listingType') || '';
  const totalArea = watch('featuresDetails.totalArea');
  const totalAreaUnit = watch('featuresDetails.totalAreaUnit') || 'sqft';
  
  const price = watch('pricingDetails.price');
  const priceNegotiable = watch('pricingDetails.priceNegotiable') || false;
  // Remove unused monthlyRent, securityDeposit, maintenanceCharges watches
  
  const videoUrl = watch('pricingDetails.videoUrl') || '';
  const virtualTourUrl = watch('pricingDetails.virtualTourUrl') || '';
  
  const showPhoneToBuyers = watch('pricingDetails.showPhoneToBuyers') ?? true;
  const showWhatsAppButton = watch('pricingDetails.showWhatsAppButton') ?? false;
  const preferredContactTime = watch('pricingDetails.preferredContactTime') || 'anytime';

  const isRent = listingType === 'rent';

  // Live calculation of price per sqft
  const pricePerSqft = useMemo(() => {
    const numPrice = Number(price);
    const numArea = Number(totalArea);
    if (!numPrice || !numArea || isNaN(numPrice) || isNaN(numArea)) return 0;
    return Math.round(numPrice / numArea);
  }, [price, totalArea]);

  // Convert number price to readable format (Lakhs / Crores)
  const getReadablePrice = (priceVal: number | string | undefined) => {
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

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = useMemo(() => getYouTubeId(virtualTourUrl), [virtualTourUrl]);

  // Dropzone for Video
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const objectUrl = URL.createObjectURL(file);
    setValue('pricingDetails.videoUrl', objectUrl, { shouldValidate: true });
    toast('Simulated video upload successfully!', 'success');
  }, [setValue]);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach((rejection) => {
      const { errors } = rejection;
      if (errors[0]?.code === 'file-too-large') {
        toast('Video file is too large. Maximum size limit is 100MB.', 'error');
      } else if (errors[0]?.code === 'file-invalid-type') {
        toast('Invalid video format. MP4, MOV, and AVI only are accepted.', 'error');
      } else {
        toast(errors[0]?.message || 'Video selection failed.', 'error');
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'video/mp4': ['.mp4'],
      'video/quicktime': ['.mov'],
      'video/x-msvideo': ['.avi'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    maxFiles: 1,
  });

  const handleRemoveVideo = () => {
    setValue('pricingDetails.videoUrl', '', { shouldValidate: true });
  };

  const handleTimeSelect = (val: typeof PREFERRED_TIME_OPTIONS[number]['value']) => {
    setValue('pricingDetails.preferredContactTime', val, { shouldValidate: true });
  };

  const handleNext = async () => {
    const isValid = await trigger('pricingDetails');
    if (isValid) {
      onNext();
    } else {
      toast('Please resolve the required pricing validation errors.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 py-2 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">
        <IndianRupee className="h-4.5 w-4.5 text-primary" />
        <span>Pricing & Contact Preferences</span>
      </div>

      {/* SECTION 1: PRICING DETAILS */}
      <div className="flex flex-col gap-4 border border-border/30 bg-muted/10 p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-foreground">Expected Price Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Expected Price */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Expected Price (INR) *</label>
            <div className="relative">
              <Input 
                type="number"
                placeholder={isRent ? "e.g. 25000" : "e.g. 7500000"}
                {...register('pricingDetails.price')}
                className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold pl-8"
              />
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            </div>
            {errors.pricingDetails?.price ? (
              <span className="text-[11px] text-destructive font-bold">{errors.pricingDetails.price.message}</span>
            ) : (
              price && <span className="text-xs font-black text-primary animate-fade-in mt-0.5">{getReadablePrice(price)}</span>
            )}
          </div>

          {/* Price per sqft (Auto-calculated, Readonly) */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Price per {totalAreaUnit} (Calculated)</label>
            <div className="relative">
              <Input 
                type="text"
                readOnly
                value={pricePerSqft > 0 ? `₹ ${pricePerSqft.toLocaleString('en-IN')} per ${totalAreaUnit}` : 'Auto-calculated'}
                className="rounded-xl bg-muted/30 border-border/80 focus-visible:ring-0 h-11 text-xs font-bold text-muted-foreground cursor-not-allowed select-none pl-8 shadow-none"
              />
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
            </div>
          </div>
        </div>

        {/* Negotiable switch */}
        <div className="flex items-center justify-between border-t border-border/20 pt-3.5 mt-1 select-none">
          <div className="flex flex-col text-left gap-0.5">
            <span className="text-xs font-bold text-foreground">Price is Negotiable</span>
            <p className="text-[9px] text-muted-foreground">Toggle if you are willing to discuss offers with potential clients.</p>
          </div>
          <button
            type="button"
            onClick={() => setValue('pricingDetails.priceNegotiable', !priceNegotiable, { shouldValidate: true })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              priceNegotiable ? 'bg-primary' : 'bg-muted-foreground/35'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                priceNegotiable ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Rental specific inputs */}
        {isRent && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border/20 pt-4 mt-1.5 animate-in slide-in-from-top-3 duration-300">
            {/* Monthly Rent */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Monthly Rent (INR)</label>
              <div className="relative">
                <Input 
                  type="number"
                  placeholder="e.g. 25000"
                  {...register('pricingDetails.monthlyRent')}
                  className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold pl-8"
                />
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              </div>
              {errors.pricingDetails?.monthlyRent && (
                <span className="text-[11px] text-destructive font-bold">{errors.pricingDetails.monthlyRent.message}</span>
              )}
            </div>

            {/* Security Deposit */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Security Deposit (INR)</label>
              <div className="relative">
                <Input 
                  type="number"
                  placeholder="e.g. 50000"
                  {...register('pricingDetails.securityDeposit')}
                  className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold pl-8"
                />
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              </div>
              {errors.pricingDetails?.securityDeposit && (
                <span className="text-[11px] text-destructive font-bold">{errors.pricingDetails.securityDeposit.message}</span>
              )}
            </div>

            {/* Maintenance Charges */}
            <div className="flex flex-col gap-1.5 text-left">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Monthly Maintenance</label>
              <div className="relative">
                <Input 
                  type="number"
                  placeholder="e.g. 3000"
                  {...register('pricingDetails.maintenanceCharges')}
                  className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold pl-8"
                />
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              </div>
              {errors.pricingDetails?.maintenanceCharges && (
                <span className="text-[11px] text-destructive font-bold">{errors.pricingDetails.maintenanceCharges.message}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: VIDEO OR VIRTUAL TOUR */}
      <div className="flex flex-col gap-4 border border-border/30 bg-muted/10 p-5 rounded-2xl">
        <div className="text-left select-none">
          <h3 className="text-sm font-bold text-foreground">Video & Virtual Tour (Optional)</h3>
          <p className="text-[9px] text-muted-foreground mt-0.5">Upload a short walk-through video or add a Matterport/YouTube link.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Video Dropzone */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-left">Walk-through Video</label>
            {!videoUrl ? (
              <div 
                {...getRootProps()}
                className={`border border-dashed rounded-xl p-6.5 flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border/80 bg-background/50 hover:bg-muted/10'
                }`}
              >
                <input {...getInputProps()} />
                <Video className="h-6 w-6 text-muted-foreground/80" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-foreground">Drag & drop video here</span>
                  <span className="text-[9px] text-muted-foreground">MP4, MOV, AVI only (Max 100MB)</span>
                </div>
              </div>
            ) : (
              <div className="relative border border-border/85 rounded-xl overflow-hidden bg-background">
                <video src={videoUrl} controls className="w-full max-h-40 object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveVideo}
                  className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-destructive hover:bg-destructive/95 text-destructive-foreground shadow-xs cursor-pointer select-none"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Virtual Tour URL */}
          <div className="flex flex-col gap-2 text-left">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Virtual Tour / YouTube Link</label>
            <div className="relative">
              <Input 
                type="text"
                placeholder="e.g. https://www.youtube.com/watch?v=..."
                {...register('pricingDetails.virtualTourUrl')}
                className="rounded-xl bg-background/50 border-border/80 focus-visible:ring-primary/45 h-11 text-xs font-semibold pl-8"
              />
              <YoutubeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            </div>
            
            {ytId && (
              <div className="relative rounded-xl overflow-hidden aspect-video border border-border/80 bg-muted mt-1.5 max-w-[200px] select-none animate-in zoom-in-95 duration-200">
                <Image 
                  src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} 
                  alt="YouTube preview" 
                  fill
                  sizes="200px"
                  className="object-cover pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <YoutubeIcon className="h-7 w-7 text-red-600 fill-red-600" />
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-[10px] font-semibold text-primary select-none mt-1 text-left">
          💡 Uploading a video or adding a virtual tour increases buyer interest and leads by over 40%.
        </p>
      </div>

      {/* SECTION 3: CONTACT PREFERENCES */}
      <div className="flex flex-col gap-4 border border-border/30 bg-muted/10 p-5 rounded-2xl">
        <h3 className="text-sm font-bold text-foreground">Contact Preferences</h3>

        {/* Show Phone Toggle */}
        <div className="flex items-center justify-between select-none">
          <div className="flex flex-col text-left gap-0.5">
            <span className="text-xs font-bold text-foreground">Show Phone to Buyers</span>
            <p className="text-[9px] text-muted-foreground">Allow verified buyers to view your mobile number directly.</p>
          </div>
          <button
            type="button"
            onClick={() => setValue('pricingDetails.showPhoneToBuyers', !showPhoneToBuyers, { shouldValidate: true })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              showPhoneToBuyers ? 'bg-primary' : 'bg-muted-foreground/35'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                showPhoneToBuyers ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* WhatsApp Button Toggle */}
        <div className="flex items-center justify-between border-t border-border/20 pt-3.5 select-none">
          <div className="flex flex-col text-left gap-0.5">
            <span className="text-xs font-bold text-foreground">Enable Direct WhatsApp Chat</span>
            <p className="text-[9px] text-muted-foreground">Add a WhatsApp button next to your phone number for instant messages.</p>
          </div>
          <button
            type="button"
            onClick={() => setValue('pricingDetails.showWhatsAppButton', !showWhatsAppButton, { shouldValidate: true })}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              showWhatsAppButton ? 'bg-primary' : 'bg-muted-foreground/35'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                showWhatsAppButton ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Preferred Contact Time Chip selector */}
        <div className="flex flex-col gap-2 text-left border-t border-border/20 pt-4 select-none">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preferred Call Time</label>
          <div className="flex gap-2">
            {PREFERRED_TIME_OPTIONS.map((opt) => {
              const isSelected = preferredContactTime === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleTimeSelect(opt.value)}
                  className={`h-9 px-4.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-center ${
                    isSelected 
                      ? 'border-primary bg-primary text-primary-foreground font-black' 
                      : 'border-border/80 hover:border-border bg-background/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
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
