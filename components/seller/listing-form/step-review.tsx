'use client';

import React, { useState } from 'react';
import { UseFormWatch } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Building2, 
  MapPin, 
  IndianRupee, 
  Video, 
  Phone, 
  Edit2, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ListingFormValues } from '@/lib/validations/listing-form';

interface StepReviewProps {
  watch: UseFormWatch<ListingFormValues>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onEditStep?: (step: number) => void;
  isEditMode?: boolean;
  onPostAnother?: () => void;
}

export default function StepReview({
  watch,
  onBack,
  onSubmit,
  isSubmitting,
  onEditStep,
  isEditMode = false,
  onPostAnother,
}: StepReviewProps) {
  const router = useRouter();

  // Declaration Checkbox state
  const [declarationChecked, setDeclarationChecked] = useState<boolean>(false);
  
  // Local submission state for mock 1.5s delay & success screen (in creation mode)
  const [localSubmitting, setLocalSubmitting] = useState<boolean>(false);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState<boolean>(false);

  // Watch all section values
  const basicDetails = watch('basicDetails') || {};
  const locationDetails = watch('locationDetails') || {};
  const featuresDetails = watch('featuresDetails') || {};
  const photosDetails = watch('photosDetails') || {};
  const pricingDetails = watch('pricingDetails') || {};

  // Image carousel state for first 3 images
  const allImages = photosDetails.images || [];
  const previewImages = allImages.slice(0, 3);
  const fallbackImage = 'https://placehold.co/800x600?text=No+Property+Image';
  const displayImages = previewImages.length > 0 ? previewImages : [fallbackImage];
  
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const formatPrice = (priceVal: number) => {
    if (!priceVal) return '₹0';
    if (priceVal >= 10000000) {
      return `₹ ${(priceVal / 10000000).toFixed(2)} Cr`;
    }
    if (priceVal >= 100000) {
      return `₹ ${(priceVal / 100000).toFixed(2)} L`;
    }
    return `₹ ${priceVal.toLocaleString('en-IN')}`;
  };

  const handleSubmitClick = async () => {
    if (!declarationChecked) return;

    if (isEditMode) {
      // In edit mode, trigger parent submit directly
      onSubmit();
    } else {
      // Creation mode: simulate 1.5s delay then show success screen
      setLocalSubmitting(true);
      try {
        await onSubmit(); // Saves listing to storage
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSubmittedSuccessfully(true);
      } catch (error) {
        console.error('Submission failed:', error);
      } finally {
        setLocalSubmitting(false);
      }
    }
  };

  const isLoading = isSubmitting || localSubmitting;

  // Render Success Screen after submitting (Creation mode)
  if (isSubmittedSuccessfully && !isEditMode) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-4 animate-in zoom-in-95 duration-500 max-w-lg mx-auto">
        <style>{`
          @keyframes draw-circle {
            0% { stroke-dashoffset: 157; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes draw-check {
            0% { stroke-dashoffset: 36; }
            100% { stroke-dashoffset: 0; }
          }
          @keyframes scale-in {
            0% { transform: scale(0.6); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-circle {
            stroke-dasharray: 157;
            stroke-dashoffset: 157;
            animation: draw-circle 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
          }
          .animate-check {
            stroke-dasharray: 36;
            stroke-dashoffset: 36;
            animation: draw-check 0.4s cubic-bezier(0.65, 0, 0.45, 1) 0.5s forwards;
          }
          .animate-scale {
            animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
        `}</style>
        
        {/* Animated Green SVG Checkmark Circle */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10 animate-scale">
            <svg className="w-14 h-14 text-emerald-600 dark:text-emerald-400" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="animate-circle" cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path className="animate-check" d="M16 26l7 7 13-13" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-black text-foreground tracking-tight mb-2">
          Listing Submitted Successfully!
        </h2>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
          Your property listing is under review. It will be live within 24 hours after admin approval.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Button
            type="button"
            onClick={() => router.push('/listings')}
            className="w-full sm:w-auto rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 h-11 text-xs cursor-pointer shadow-md transition-all hover:scale-[1.02]"
          >
            <Building className="h-4 w-4 mr-2" />
            <span>View My Listings</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsSubmittedSuccessfully(false);
              setDeclarationChecked(false);
              if (onPostAnother) {
                onPostAnother();
              }
            }}
            className="w-full sm:w-auto rounded-xl border-border/80 h-11 font-bold text-xs cursor-pointer px-6 hover:bg-muted/50"
          >
            <Sparkles className="h-4 w-4 mr-2 text-primary" />
            <span>Post Another Property</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-2 animate-in fade-in duration-300">
      
      {/* Top Header Banner */}
      <div className="flex items-center justify-between border-b border-border/25 pb-3 select-none">
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
          <span>Review Your Property Listing</span>
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
          Step 6 of 6
        </span>
      </div>

      {/* Prominent Price & Cover Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Image Carousel (First 3 photos) */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-muted aspect-4/3 shadow-sm group">
            <Image 
              src={displayImages[activeImageIndex]} 
              alt={`Property preview ${activeImageIndex + 1}`} 
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-3.5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-primary/90 text-primary-foreground px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {activeImageIndex === 0 ? 'Cover Image' : `Photo ${activeImageIndex + 1}`}
                </span>
                <span className="text-[10px] font-extrabold bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  {activeImageIndex + 1} of {displayImages.length}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs font-black truncate">{basicDetails.title || 'Untitled Property'}</span>
                <span className="text-[10px] opacity-80 font-medium truncate">
                  {locationDetails.locality ? `${locationDetails.locality}, ` : ''}{locationDetails.city}
                </span>
              </div>
            </div>

            {/* Navigation Arrows for Carousel */}
            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
                  title="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-xs transition-transform active:scale-95 cursor-pointer"
                  title="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail dots indicator */}
          {displayImages.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 py-1">
              {displayImages.map((img, idx) => (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === activeImageIndex ? 'w-5 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlighted Price Banner Card */}
        <div className="md:col-span-2 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 shadow-xs relative overflow-hidden">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary">Expected Price</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary border border-primary/30 capitalize">
                For {basicDetails.listingType || 'sale'}
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight mt-1">
              {formatPrice(Number(pricingDetails.price))}
              {pricingDetails.priceNegotiable && (
                <span className="text-xs font-bold text-muted-foreground ml-2">(Negotiable)</span>
              )}
            </div>
            {basicDetails.listingType === 'rent' && (
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground mt-2 border-t border-border/20 pt-2">
                {pricingDetails.monthlyRent && (
                  <div>Monthly Rent: <strong className="text-foreground">₹ {Number(pricingDetails.monthlyRent).toLocaleString('en-IN')}</strong></div>
                )}
                {pricingDetails.securityDeposit && (
                  <div>Deposit: <strong className="text-foreground">₹ {Number(pricingDetails.securityDeposit).toLocaleString('en-IN')}</strong></div>
                )}
                {pricingDetails.maintenanceCharges && (
                  <div>Maintenance: <strong className="text-foreground">₹ {Number(pricingDetails.maintenanceCharges).toLocaleString('en-IN')}/mo</strong></div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground mt-4 pt-3 border-t border-border/20">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Standard Seller Protection Applied</span>
          </div>
        </div>
      </div>

      {/* Read-Only Details Sections */}
      <div className="flex flex-col gap-4 text-xs">
        
        {/* Section 1: Basic Details */}
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-2xs flex flex-col gap-3 relative">
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <div className="flex items-center gap-2 font-extrabold text-sm text-foreground">
              <Building2 className="h-4.5 w-4.5 text-primary" />
              <span>Basic Details</span>
            </div>
            {onEditStep && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(1)}
                className="h-8 px-2.5 text-xs font-bold text-primary hover:text-primary/90 hover:bg-primary/10 rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-muted-foreground font-medium">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Title</span>
              <strong className="text-foreground font-bold">{basicDetails.title || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Listing Type</span>
              <strong className="text-foreground font-bold uppercase">{basicDetails.listingType || 'sale'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Property Type</span>
              <strong className="text-foreground font-bold capitalize">{basicDetails.propertyType || 'apartment'}</strong>
            </div>
            {basicDetails.bhk && (
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Bedrooms / BHK</span>
                <strong className="text-foreground font-bold">{basicDetails.bhk} BHK</strong>
              </div>
            )}
            <div className="col-span-2 sm:col-span-3 mt-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Description</span>
              <p className="text-foreground font-normal leading-relaxed mt-0.5 bg-muted/20 p-2.5 rounded-xl border border-border/20">
                {basicDetails.description || 'No description provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Location Details */}
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-2xs flex flex-col gap-3 relative">
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <div className="flex items-center gap-2 font-extrabold text-sm text-foreground">
              <MapPin className="h-4.5 w-4.5 text-primary" />
              <span>Location & Address</span>
            </div>
            {onEditStep && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(2)}
                className="h-8 px-2.5 text-xs font-bold text-primary hover:text-primary/90 hover:bg-primary/10 rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-muted-foreground font-medium">
            <div className="col-span-2 sm:col-span-3">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Address</span>
              <strong className="text-foreground font-bold">
                {locationDetails.streetAddress || 'Address not specified'}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Locality / Area</span>
              <strong className="text-foreground font-bold">{locationDetails.locality || 'N/A'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">City</span>
              <strong className="text-foreground font-bold">{locationDetails.city || 'Gurugram'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">State</span>
              <strong className="text-foreground font-bold">{locationDetails.state || 'Haryana'}</strong>
            </div>
            {locationDetails.landmark && (
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Landmark</span>
                <strong className="text-foreground font-bold">{locationDetails.landmark}</strong>
              </div>
            )}
            {locationDetails.pincode && (
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Pincode</span>
                <strong className="text-foreground font-bold">{locationDetails.pincode}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Features & Amenities */}
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-2xs flex flex-col gap-3 relative">
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <div className="flex items-center gap-2 font-extrabold text-sm text-foreground">
              <Layers className="h-4.5 w-4.5 text-primary" />
              <span>Features & Amenities</span>
            </div>
            {onEditStep && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(3)}
                className="h-8 px-2.5 text-xs font-bold text-primary hover:text-primary/90 hover:bg-primary/10 rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-muted-foreground font-medium">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Total Area</span>
              <strong className="text-foreground font-bold uppercase">
                {featuresDetails.totalArea || '0'} {featuresDetails.totalAreaUnit || 'sqft'}
              </strong>
            </div>
            {featuresDetails.carpetArea && (
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Carpet Area</span>
                <strong className="text-foreground font-bold uppercase">
                  {featuresDetails.carpetArea} {featuresDetails.totalAreaUnit || 'sqft'}
                </strong>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Floor</span>
              <strong className="text-foreground font-bold">
                {featuresDetails.floorNo ? `Floor ${featuresDetails.floorNo}` : 'N/A'}{' '}
                {featuresDetails.totalFloors ? `of ${featuresDetails.totalFloors}` : ''}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Furnishing</span>
              <strong className="text-foreground font-bold capitalize">
                {featuresDetails.furnishing || 'Unfurnished'}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Property Age</span>
              <strong className="text-foreground font-bold capitalize">
                {(featuresDetails.propertyAge || '').replace(/-/g, ' ')}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Parking</span>
              <strong className="text-foreground font-bold capitalize">
                {featuresDetails.parking || 'none'}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Facing</span>
              <strong className="text-foreground font-bold capitalize">
                {featuresDetails.facing || 'any'}
              </strong>
            </div>
            {featuresDetails.availableFrom && (
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Available From</span>
                <strong className="text-foreground font-bold">
                  {featuresDetails.availableFrom}
                </strong>
              </div>
            )}
          </div>

          {/* Amenities Badges List */}
          {featuresDetails.amenities && featuresDetails.amenities.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/20">
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block mb-1.5">
                Included Amenities ({featuresDetails.amenities.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {featuresDetails.amenities.map((amenity: string) => (
                  <span 
                    key={amenity} 
                    className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary capitalize flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{amenity.replace(/-/g, ' ')}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Pricing & Contact Details */}
        <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-2xs flex flex-col gap-3 relative">
          <div className="flex items-center justify-between border-b border-border/20 pb-2">
            <div className="flex items-center gap-2 font-extrabold text-sm text-foreground">
              <IndianRupee className="h-4.5 w-4.5 text-primary" />
              <span>Pricing & Preferences</span>
            </div>
            {onEditStep && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onEditStep(5)}
                className="h-8 px-2.5 text-xs font-bold text-primary hover:text-primary/90 hover:bg-primary/10 rounded-lg cursor-pointer flex items-center gap-1"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-muted-foreground font-medium">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Show Phone</span>
              <strong className="text-foreground font-bold">
                {pricingDetails.showPhoneToBuyers ? 'Yes' : 'No'}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">WhatsApp Button</span>
              <strong className="text-foreground font-bold">
                {pricingDetails.showWhatsAppButton ? 'Yes' : 'No'}
              </strong>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Preferred Time</span>
              <strong className="text-foreground font-bold capitalize">
                {pricingDetails.preferredContactTime || 'anytime'}
              </strong>
            </div>
            {pricingDetails.videoUrl && (
              <div className="col-span-2 sm:col-span-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Video URL</span>
                <span className="text-primary font-bold truncate block">{pricingDetails.videoUrl}</span>
              </div>
            )}
            {pricingDetails.virtualTourUrl && (
              <div className="col-span-2 sm:col-span-3">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/75 block">Virtual Tour URL</span>
                <span className="text-primary font-bold truncate block">{pricingDetails.virtualTourUrl}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Declaration Checkbox */}
      <div className="p-4 bg-muted/30 border border-border/60 rounded-2xl text-xs font-semibold leading-relaxed flex items-start gap-3 mt-2 select-none">
        <input
          type="checkbox"
          id="declaration-checkbox"
          checked={declarationChecked}
          onChange={(e) => setDeclarationChecked(e.target.checked)}
          className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary/40 cursor-pointer mt-0.5 shrink-0"
        />
        <label htmlFor="declaration-checkbox" className="text-foreground/90 cursor-pointer font-medium leading-normal">
          I confirm that the information provided is accurate and I am authorized to list this property.
        </label>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-border/25 mt-2">
        <Button 
          type="button" 
          variant="ghost"
          disabled={isLoading}
          onClick={onBack}
          className="rounded-xl border border-border/80 h-10 font-bold text-xs cursor-pointer px-4"
        >
          <ChevronLeft className="h-4.5 w-4.5 mr-1" />
          <span>Back</span>
        </Button>

        <Button 
          type="button" 
          disabled={!declarationChecked || isLoading}
          onClick={handleSubmitClick}
          className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-7 h-10 text-xs flex items-center gap-2 cursor-pointer shadow-md border-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              <span>{isEditMode ? 'Updating Listing...' : 'Submitting Listing...'}</span>
            </>
          ) : (
            <>
              <Check className="h-4.5 w-4.5 stroke-[3]" />
              <span>{isEditMode ? 'Update Listing' : 'Submit Listing'}</span>
            </>
          )}
        </Button>
      </div>

    </div>
  );
}
