'use client';

import React from 'react';
import { UseFormWatch } from 'react-hook-form';
import { ChevronLeft, Check, Sparkles, Building2, MapPin, IndianRupee, Video, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ListingFormValues } from '@/lib/validations/listing-form';

interface StepReviewProps {
  watch: UseFormWatch<ListingFormValues>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function StepReview({
  watch,
  onBack,
  onSubmit,
  isSubmitting
}: StepReviewProps) {
  // Watch all details
  const basicDetails = watch('basicDetails') || {};
  const locationDetails = watch('locationDetails') || {};
  const featuresDetails = watch('featuresDetails') || {};
  const photosDetails = watch('photosDetails') || {};
  const pricingDetails = watch('pricingDetails') || {};

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

  const coverImage = photosDetails.images?.[photosDetails.coverIndex || 0] || 'https://placehold.co/800x600?text=Property';

  return (
    <div className="flex flex-col gap-6 py-2 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider select-none">
        <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
        <span>Review & Publish Listing</span>
      </div>

      {/* Review summary cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Cover Photo preview */}
        <div className="md:col-span-1 rounded-2xl overflow-hidden border border-border/60 bg-muted relative aspect-4/3 md:aspect-auto md:h-full">
          <Image 
            src={coverImage} 
            alt="Cover Preview" 
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4 text-white">
            <span className="text-[10px] font-black uppercase tracking-wider text-primary-foreground/90">Cover Photo</span>
            <span className="text-xs font-bold truncate mt-0.5">{basicDetails.title || 'Untitled Property'}</span>
          </div>
        </div>

        {/* Text Details Summary */}
        <div className="md:col-span-2 flex flex-col gap-4 text-xs">
          {/* Basic Details Info */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border/40">
            <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 w-full">
              <span className="font-extrabold text-foreground">Basic Property Details</span>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground mt-1 font-semibold">
                <div>Listing Type: <strong className="text-foreground uppercase">{basicDetails.listingType}</strong></div>
                <div>Property Type: <strong className="text-foreground capitalize">{basicDetails.propertyType}</strong></div>
                {basicDetails.bhk && (
                  <div>Rooms: <strong className="text-foreground">{basicDetails.bhk} BHK</strong></div>
                )}
                <div>Total Area: <strong className="text-foreground uppercase">{featuresDetails.totalArea || '0'} {featuresDetails.totalAreaUnit || 'sqft'}</strong></div>
                {featuresDetails.carpetArea && (
                  <div>Carpet Area: <strong className="text-foreground uppercase">{featuresDetails.carpetArea} {featuresDetails.totalAreaUnit || 'sqft'}</strong></div>
                )}
                {basicDetails.propertyType !== 'plot' && (
                  <div>Floor: <strong className="text-foreground">{featuresDetails.floorNo} of {featuresDetails.totalFloors || 'N/A'}</strong></div>
                )}
                <div className="capitalize">Furnishing: <strong className="text-foreground">{featuresDetails.furnishing || 'N/A'}</strong></div>
                <div className="capitalize">Facing: <strong className="text-foreground">{featuresDetails.facing || 'N/A'}</strong></div>
                <div className="capitalize">Parking: <strong className="text-foreground">{featuresDetails.parking || 'none'}</strong></div>
                <div className="capitalize">Age: <strong className="text-foreground">{(featuresDetails.propertyAge || '').replace(/-/g, ' ')}</strong></div>
                {basicDetails.listingType === 'rent' && featuresDetails.availableFrom && (
                  <div>Available From: <strong className="text-foreground">{featuresDetails.availableFrom}</strong></div>
                )}
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border/40">
            <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 w-full">
              <span className="font-extrabold text-foreground">Location & Address</span>
              <p className="text-muted-foreground mt-1 font-semibold leading-relaxed">
                {locationDetails.streetAddress || 'Address not specified'}
                {locationDetails.landmark && `, Landmark: ${locationDetails.landmark}`}
                {locationDetails.locality && `, ${locationDetails.locality}`}
                , {locationDetails.city}, {locationDetails.state}
                {locationDetails.pincode && ` - ${locationDetails.pincode}`}
              </p>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border/40">
            <IndianRupee className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 w-full">
              <span className="font-extrabold text-foreground">Expected Price Details</span>
              <div className="flex flex-col gap-1 mt-1 font-semibold text-muted-foreground">
                <div>Expected Price: <strong className="text-primary text-sm font-black">{formatPrice(Number(pricingDetails.price))}</strong> <span className="text-[10px] font-bold">({pricingDetails.priceNegotiable ? 'Negotiable' : 'Fixed'})</span></div>
                {basicDetails.listingType === 'rent' && (
                  <div className="grid grid-cols-2 gap-2 mt-1 border-t border-border/10 pt-2">
                    {pricingDetails.monthlyRent && (
                      <div>Monthly Rent: <strong className="text-foreground">₹ {Number(pricingDetails.monthlyRent).toLocaleString('en-IN')}</strong></div>
                    )}
                    {pricingDetails.securityDeposit && (
                      <div>Security Deposit: <strong className="text-foreground">₹ {Number(pricingDetails.securityDeposit).toLocaleString('en-IN')}</strong></div>
                    )}
                    {pricingDetails.maintenanceCharges && (
                      <div>Maintenance: <strong className="text-foreground">₹ {Number(pricingDetails.maintenanceCharges).toLocaleString('en-IN')}</strong></div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Video / Virtual Tour Info */}
          {(pricingDetails.videoUrl || pricingDetails.virtualTourUrl) && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border/40">
              <Video className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 w-full text-left">
                <span className="font-extrabold text-foreground">Walk-through & Tour</span>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground mt-1 font-semibold">
                  {pricingDetails.videoUrl && (
                    <div>Video Uploaded: <strong className="text-foreground">Yes</strong></div>
                  )}
                  {pricingDetails.virtualTourUrl && (
                    <div className="truncate col-span-2">Virtual Tour: <a href={pricingDetails.virtualTourUrl} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline truncate inline-block max-w-full">{pricingDetails.virtualTourUrl}</a></div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Preferences Info */}
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border/40">
            <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1 w-full">
              <span className="font-extrabold text-foreground">Contact Preferences</span>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground mt-1 font-semibold">
                <div>Show Phone: <strong className="text-foreground">{pricingDetails.showPhoneToBuyers ? 'Yes' : 'No'}</strong></div>
                <div>WhatsApp Enabled: <strong className="text-foreground">{pricingDetails.showWhatsAppButton ? 'Yes' : 'No'}</strong></div>
                <div className="capitalize">Preferred Call Time: <strong className="text-foreground">{pricingDetails.preferredContactTime}</strong></div>
              </div>
            </div>
          </div>

          {/* Amenities Info */}
          {featuresDetails.amenities && featuresDetails.amenities.length > 0 && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-muted/20 border border-border/40">
              <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1 w-full">
                <span className="font-extrabold text-foreground">Amenities</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {featuresDetails.amenities.map((amenity: string) => (
                    <span 
                      key={amenity} 
                      className="px-2.5 py-1 rounded-lg bg-primary/5 border border-primary/20 text-[10px] font-bold text-primary capitalize"
                    >
                      {amenity.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-2xl text-[11px] font-semibold leading-relaxed select-none">
        <strong>Ready to publish?</strong> Once submitted, your property listing will undergo a brief automated trust check before appearing live on the public real estate portal.
      </div>

      {/* Footer navigation */}
      <div className="flex justify-between pt-4 border-t border-border/25 mt-2">
        <Button 
          type="button" 
          variant="ghost"
          disabled={isSubmitting}
          onClick={onBack}
          className="rounded-xl border border-border/80 h-10 font-bold text-xs cursor-pointer px-4"
        >
          <ChevronLeft className="h-4.5 w-4.5 mr-1" />
          <span>Back</span>
        </Button>
        <Button 
          type="button" 
          disabled={isSubmitting}
          onClick={onSubmit}
          className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-6 h-10 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border-none"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Check className="h-4.5 w-4.5 stroke-[3]" />
              <span>Publish Property</span>
            </>
          )}
        </Button>
      </div>

    </div>
  );
}
