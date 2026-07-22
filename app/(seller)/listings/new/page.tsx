'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from '@/components/ui/toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RotateCcw, ArrowRight } from 'lucide-react';
import { listingFormSchema, ListingFormValues } from '@/lib/validations/listing-form';
import FormStepper from '@/components/seller/listing-form/form-stepper';
import StepBasic from '@/components/seller/listing-form/step-basic';
import StepLocation from '@/components/seller/listing-form/step-location';
import StepFeatures from '@/components/seller/listing-form/step-features';
import StepPhotos from '@/components/seller/listing-form/step-photos';
import StepPricing from '@/components/seller/listing-form/step-pricing';
import StepReview from '@/components/seller/listing-form/step-review';
import { SellerListing } from '@/lib/mock-data/seller-listings';

const DEFAULT_FORM_VALUES: ListingFormValues = {
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
    locality: '',
    landmark: '',
    pincode: '',
    lat: 28.4595,
    lng: 77.0266
  },
  featuresDetails: {
    totalArea: undefined as unknown as number,
    totalAreaUnit: 'sqft',
    carpetArea: '' as unknown as number,
    floorNo: '' as unknown as number,
    totalFloors: '' as unknown as number,
    propertyAge: '1-5-years',
    furnishing: 'semi-furnished',
    parking: 'none',
    facing: 'any',
    availableFrom: '',
    amenities: [],
  },
  photosDetails: {
    images: [],
    coverIndex: 0
  },
  pricingDetails: {
    price: undefined as unknown as number,
    priceNegotiable: false,
    monthlyRent: '' as unknown as number,
    securityDeposit: '' as unknown as number,
    maintenanceCharges: '' as unknown as number,
    videoUrl: '',
    virtualTourUrl: '',
    showPhoneToBuyers: true,
    showWhatsAppButton: false,
    preferredContactTime: 'anytime',
  }
};

export default function NewPropertyListingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Draft persistence state
  const [draftBannerVisible, setDraftBannerVisible] = useState<boolean>(false);
  const [savedDraft, setSavedDraft] = useState<{ step: number; values: ListingFormValues } | null>(null);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema) as unknown as Resolver<ListingFormValues>,
    mode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES
  });

  const { register, setValue, watch, formState: { errors }, trigger, handleSubmit, setError, clearErrors, reset, getValues } = form;

  // On initial mount, check for an existing draft in sessionStorage
  useEffect(() => {
    try {
      const draftString = sessionStorage.getItem('seller_listing_draft');
      if (draftString) {
        const parsed = JSON.parse(draftString);
        if (parsed && parsed.values) {
          setSavedDraft(parsed);
          setDraftBannerVisible(true);
        }
      }
    } catch (e) {
      console.error('Error reading draft from sessionStorage', e);
    }
  }, []);

  // Save form state to sessionStorage on every step change
  useEffect(() => {
    try {
      const currentValues = getValues();
      const draftPayload = {
        step: currentStep,
        values: currentValues
      };
      sessionStorage.setItem('seller_listing_draft', JSON.stringify(draftPayload));
    } catch (e) {
      console.error('Error saving draft to sessionStorage', e);
    }
  }, [currentStep, getValues]);

  const handleContinueDraft = () => {
    if (savedDraft) {
      reset(savedDraft.values);
      if (savedDraft.step) {
        setCurrentStep(savedDraft.step);
      }
      toast('Draft loaded successfully!', 'success');
    }
    setDraftBannerVisible(false);
  };

  const handleStartFresh = () => {
    sessionStorage.removeItem('seller_listing_draft');
    reset(DEFAULT_FORM_VALUES);
    setCurrentStep(1);
    setDraftBannerVisible(false);
    toast('Draft discarded. Starting fresh.');
  };

  const steps = ['Basic Info', 'Location', 'Features', 'Photos', 'Pricing', 'Review'];

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmitForm: SubmitHandler<ListingFormValues> = async (values) => {
    setIsSubmitting(true);
    try {
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

      // Clear unsaved draft from sessionStorage upon submission
      sessionStorage.removeItem('seller_listing_draft');
      
      toast('Property listing created successfully! Awaiting admin approval.', 'success');
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

      {/* Unsaved Draft Banner */}
      {draftBannerVisible && (
        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-foreground">You have an unsaved draft</span>
              <p className="text-[11px] text-muted-foreground leading-normal">
                Would you like to continue editing your previous listing draft?
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button 
              type="button" 
              onClick={handleContinueDraft}
              className="rounded-xl bg-primary hover:bg-primary/95 text-primary-foreground font-bold px-3.5 h-8 text-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleStartFresh}
              className="rounded-xl border-border/80 h-8 font-bold text-xs cursor-pointer px-3 hover:bg-muted/50 flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Start Fresh</span>
            </Button>
          </div>
        </div>
      )}

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
                setValue={setValue}
                watch={watch}
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
                setError={setError}
                clearErrors={clearErrors}
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
                setValue={setValue} 
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
                onEditStep={(step) => setCurrentStep(step)}
                onPostAnother={() => {
                  sessionStorage.removeItem('seller_listing_draft');
                  reset(DEFAULT_FORM_VALUES);
                  setCurrentStep(1);
                }}
              />
            )}

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
