'use client';

import React from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors, UseFormTrigger } from 'react-hook-form';
import { ChevronRight, ChevronLeft, Image as ImageIcon, Trash2, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import Image from 'next/image';
import { ListingFormValues } from '@/lib/validations/listing-form';

interface StepPhotosProps {
  setValue: UseFormSetValue<ListingFormValues>;
  watch: UseFormWatch<ListingFormValues>;
  errors: FieldErrors<ListingFormValues>;
  trigger: UseFormTrigger<ListingFormValues>;
  onNext: () => void;
  onBack: () => void;
}

export default function StepPhotos({
  setValue,
  watch,
  errors,
  trigger,
  onNext,
  onBack
}: StepPhotosProps) {
  // Watch values
  const images = watch('photosDetails.images') || [];
  const coverIndex = watch('photosDetails.coverIndex') || 0;

  const sampleImages = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  ];

  const handleUseSamples = () => {
    setValue('photosDetails.images', sampleImages, { shouldValidate: true });
    toast('Sample photos loaded successfully!', 'success');
  };

  const handleRemovePhoto = (idxToRemove: number) => {
    const updated = images.filter((_: string, idx: number) => idx !== idxToRemove);
    setValue('photosDetails.images', updated, { shouldValidate: true });
    
    // Adjust cover index
    if (coverIndex >= updated.length) {
      setValue('photosDetails.coverIndex', Math.max(0, updated.length - 1), { shouldValidate: true });
    }
  };

  const handleSetCover = (idx: number) => {
    setValue('photosDetails.coverIndex', idx, { shouldValidate: true });
    toast('Cover photo updated.', 'success');
  };

  const handleNext = async () => {
    const isValid = await trigger('photosDetails');
    if (isValid) {
      onNext();
    } else {
      toast('Please add at least one photo before proceeding.', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-5 py-2 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between border-b border-border/25 pb-2.5 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Camera className="h-4.5 w-4.5 text-primary" />
          <span>Upload Property Photos</span>
        </div>
        {images.length === 0 && (
          <button 
            type="button"
            onClick={handleUseSamples}
            className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 fill-primary/10" />
            <span>Use Sample Photos</span>
          </button>
        )}
      </div>

      {/* Photo Drag & Drop / Mock Click zone */}
      <div 
        onClick={handleUseSamples}
        className="border border-dashed border-border/80 bg-muted/10 p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer hover:bg-muted/20 transition-colors select-none"
      >
        <ImageIcon className="h-7 w-7 text-muted-foreground/80" />
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold text-foreground">Click to upload photos or select sample files</span>
          <p className="text-[10px] text-muted-foreground max-w-xs leading-relaxed mt-0.5">
            Add beautiful high-res exterior, living room, and kitchen shots. (PNG, JPG accepted, up to 5MB)
          </p>
        </div>
      </div>
      {errors.photosDetails?.images && (
        <span className="text-[11px] text-destructive font-bold text-center">{errors.photosDetails.images.message}</span>
      )}

      {/* Photo Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-2 animate-in zoom-in-95 duration-350">
          {images.map((url: string, idx: number) => {
            const isCover = coverIndex === idx;
            return (
              <div 
                key={url + idx}
                className={`relative group rounded-xl overflow-hidden aspect-4/3 border bg-muted shadow-2xs ${
                  isCover ? 'border-primary ring-2 ring-primary/10' : 'border-border/60'
                }`}
              >
                <Image 
                  src={url} 
                  alt={`Preview ${idx + 1}`} 
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover select-none"
                />
                
                {/* Image Overlay Toolbar */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className="p-1.5 rounded-lg bg-background/80 text-foreground hover:bg-background text-[10px] font-bold shadow-xs cursor-pointer select-none"
                    >
                      Make Cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="p-1.5 rounded-lg bg-destructive text-white hover:bg-destructive/95 shadow-xs cursor-pointer select-none"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Cover Badge indicator */}
                {isCover && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground font-black text-[9px] uppercase px-1.5 py-0.2 rounded-md shadow-3xs select-none">
                    Cover Photo
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

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
