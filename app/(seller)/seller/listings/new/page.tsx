'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/toast';
import { Card, CardContent } from '@/components/ui/card';
import { listingFormSchema, ListingFormValues } from '@/lib/validations/listing-form';
import FormStepper from '@/components/seller/listing-form/form-stepper';
import StepBasic from '@/components/seller/listing-form/step-basic';
import StepLocation from '@/components/seller/listing-form/step-location';
import StepFeatures from '@/components/seller/listing-form/step-features';
import StepPhotos from '@/components/seller/listing-form/step-photos';
import StepPricing from '@/components/seller/listing-form/step-pricing';
import StepReview from '@/components/seller/listing-form/step-review';
import { SellerListing } from '@/lib/mock-data/seller-listings';

export default function NewPropertyListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<any>({
    resolver: zodResolver(listingFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      basicDetails: {
        listingType: 'sale',
        propertyType: 'apartment',
        title: '',
        description: '',
        bhk: '3'
      },
      locationDetails: {
        streetAddress: '',
        city: 'Gurugram',
        state: 'Haryana',
        lat: 28.4595,
        lng: 77.0266
      },
      featuresDetails: {
        amenities: [],
        bathrooms: 2,
        furnishing: 'Semi-Furnished',
        superArea: ''
      },
      photosDetails: {
        images: [],
        coverIndex: 0
      },
      pricingDetails: {
        price: undefined as any
      }
    }
  });

  const { register, setValue, watch, formState: { errors }, trigger, handleSubmit } = form;

  const steps = ['Basic Info', 'Location', 'Features', 'Photos', 'Pricing', 'Review'];

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmitForm = async (values: any) => {
    setIsSubmitting(true);
    try {
      // Create new listing object
      const today = new Date();
      const expiry = new Date();
      expiry.setDate(today.getDate() + 180); // 6 months expiry
      
      const newListingId = `s-prop-${Math.floor(1000 + Math.random() * 9000)}`;

      const newListing: SellerListing = {
        id: newListingId,
        title: values.basicDetails.title,
        price: Number(values.pricingDetails.price),
        type: values.basicDetails.listingType === 'rent' ? 'rent' : 'sale',
        bhk: parseInt(values.basicDetails.bhk || '0') || 0,
        city: values.locationDetails.city,
        status: 'pending', // Default to pending awaiting admin approval
        views: 0,
        leads: 0,
        postedDate: today.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        isFeatured: false,
        images: values.photosDetails.images.length > 0 
          ? values.photosDetails.images 
          : ['https://placehold.co/800x600?text=Property'],
        isSold: false
      };

      // Load existing listings from localStorage, append, and save
      const storedListings = localStorage.getItem('estatex_seller_listings');
      let listingsList: SellerListing[] = [];
      if (storedListings) {
        listingsList = JSON.parse(storedListings);
      }
      
      listingsList.unshift(newListing); // Add new listing to the top
      localStorage.setItem('estatex_seller_listings', JSON.stringify(listingsList));

      // Show success toast and redirect
      toast('Property listing created successfully! Awaiting admin approval.', 'success');
      router.push('/listings');
    } catch (error) {
      console.error('Error submitting form', error);
      toast('Failed to create property listing. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300 max-w-3xl mx-auto w-full relative pb-10">
      
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Post New Property</h1>
        <p className="text-sm text-muted-foreground mt-0.5">List your residential or commercial property in 6 easy steps.</p>
      </div>

      {/* 6-step Stepper Progress */}
      <FormStepper 
        currentStep={currentStep} 
        totalSteps={steps.length} 
        steps={steps} 
      />

      <Card className="rounded-2xl border-border/40 bg-card/65 backdrop-blur-xs shadow-md mt-1">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmitForm)} className="outline-none">
            
            {/* Step 1: Basic Details */}
            {currentStep === 1 && (
              <StepBasic 
                register={register} 
                setValue={setValue} 
                watch={watch} 
                errors={errors} 
                trigger={trigger} 
                onNext={handleNextStep} 
              />
            )}

            {/* Step 2: Location Details */}
            {currentStep === 2 && (
              <StepLocation 
                register={register} 
                errors={errors} 
                trigger={trigger} 
                onNext={handleNextStep} 
                onBack={handleBackStep} 
              />
            )}

            {/* Step 3: Features & Specs */}
            {currentStep === 3 && (
              <StepFeatures 
                register={register} 
                setValue={setValue} 
                watch={watch} 
                errors={errors} 
                trigger={trigger} 
                onNext={handleNextStep} 
                onBack={handleBackStep} 
              />
            )}

            {/* Step 4: Photos Upload */}
            {currentStep === 4 && (
              <StepPhotos 
                setValue={setValue} 
                watch={watch} 
                errors={errors} 
                trigger={trigger} 
                onNext={handleNextStep} 
                onBack={handleBackStep} 
              />
            )}

            {/* Step 5: Pricing Details */}
            {currentStep === 5 && (
              <StepPricing 
                register={register} 
                watch={watch} 
                errors={errors} 
                trigger={trigger} 
                onNext={handleNextStep} 
                onBack={handleBackStep} 
              />
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <StepReview 
                watch={watch} 
                onBack={handleBackStep} 
                onSubmit={handleSubmit(onSubmitForm)} 
                isSubmitting={isSubmitting} 
              />
            )}

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
