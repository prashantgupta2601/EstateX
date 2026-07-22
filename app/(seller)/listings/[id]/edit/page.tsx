'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler, Resolver } from 'react-hook-form';
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
import { mockSellerListings, SellerListing } from '@/lib/mock-data/seller-listings';
import { mockProperties } from '@/lib/mock-data/properties';

export default function EditPropertyPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema) as unknown as Resolver<ListingFormValues>,
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
        locality: '',
        landmark: '',
        pincode: '',
        lat: 28.4595,
        lng: 77.0266
      },
      featuresDetails: {
        totalArea: 1200,
        totalAreaUnit: 'sqft',
        carpetArea: 1000,
        floorNo: 2,
        totalFloors: 5,
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
        price: 5000000,
        priceNegotiable: false,
        monthlyRent: undefined,
        securityDeposit: undefined,
        maintenanceCharges: undefined,
        videoUrl: '',
        virtualTourUrl: '',
        showPhoneToBuyers: true,
        showWhatsAppButton: false,
        preferredContactTime: 'anytime',
      }
    }
  });

  const { register, setValue, watch, formState: { errors }, trigger, handleSubmit, setError, clearErrors, reset } = form;

  const steps = ['Basic Info', 'Location', 'Features', 'Photos', 'Pricing', 'Review'];

  // Utility to match a SellerListing with detailed property mock data
  const findDetailedProperty = (sellerProp: SellerListing) => {
    const cleanId = sellerProp.id.replace('s-', '');
    let detail = mockProperties.find(p => p.id === cleanId || p.id === sellerProp.id);
    if (!detail) {
      detail = mockProperties.find(p => 
        p.price === sellerProp.price && 
        p.bedrooms === sellerProp.bhk && 
        p.type === sellerProp.type
      );
    }
    if (!detail) {
      detail = mockProperties.find(p => 
        p.price === sellerProp.price || 
        p.title.toLowerCase().includes(sellerProp.title.toLowerCase()) || 
        sellerProp.title.toLowerCase().includes(p.title.toLowerCase())
      );
    }
    return detail;
  };

  useEffect(() => {
    if (!id) return;

    // Load seller listings from localStorage or fall back to mock data
    const stored = localStorage.getItem('estatex_seller_listings');
    let listingsList: SellerListing[] = [];
    if (stored) {
      listingsList = JSON.parse(stored);
    } else {
      listingsList = mockSellerListings;
    }

    const listing = listingsList.find(l => l.id === id);
    if (!listing) {
      toast('Property listing not found.', 'error');
      router.push('/listings');
      return;
    }

    // Match with detailed mock property for extra form fields
    const detailed = findDetailedProperty(listing);

    const prepopulatedValues: ListingFormValues = {
      basicDetails: {
        listingType: listing.type || 'sale',
        propertyType: detailed?.propertyType || 'apartment',
        title: listing.title || '',
        description: detailed?.description || 'Spacious and well-maintained property with excellent layout, ample natural light, and premium fixtures. Located in a prime residential area with easy access to markets and public transport.',
        bhk: String(listing.bhk || '3')
      },
      locationDetails: {
        streetAddress: detailed?.location?.address || 'Golf Course Road',
        city: listing.city || detailed?.location?.city || 'Gurugram',
        state: detailed?.location?.state || 'Haryana',
        locality: detailed?.location?.address || 'Sector 54',
        landmark: 'Near Metro Station',
        pincode: detailed?.location?.zipCode || '122002',
        lat: detailed?.location?.coordinates?.lat || 28.4595,
        lng: detailed?.location?.coordinates?.lng || 77.0266
      },
      featuresDetails: {
        totalArea: detailed?.area || 1650,
        totalAreaUnit: detailed?.areaUnit === 'sqft' ? 'sqft' : detailed?.areaUnit === 'sqm' ? 'sqm' : 'sqft',
        carpetArea: detailed?.area ? Math.round(detailed.area * 0.85) : 1400,
        floorNo: detailed?.floor || 3,
        totalFloors: detailed?.totalFloors || 8,
        propertyAge: '1-5-years',
        furnishing: detailed?.furnishingStatus?.toLowerCase() === 'furnished' 
          ? 'furnished' 
          : detailed?.furnishingStatus?.toLowerCase() === 'semi-furnished' 
          ? 'semi-furnished' 
          : 'unfurnished',
        parking: '1',
        facing: 'east',
        availableFrom: '',
        amenities: detailed?.amenities?.map(a => a.name.toLowerCase().replace(/ /g, '-')) || ['gym', 'swimming-pool', 'power-backup']
      },
      photosDetails: {
        images: listing.images && listing.images.length > 0 
          ? listing.images 
          : ['https://placehold.co/800x600?text=Property'],
        coverIndex: 0
      },
      pricingDetails: {
        price: listing.price || 5000000,
        priceNegotiable: true,
        monthlyRent: listing.type === 'rent' ? listing.price : undefined,
        securityDeposit: listing.type === 'rent' ? listing.price * 2 : undefined,
        maintenanceCharges: 3000,
        videoUrl: '',
        virtualTourUrl: '',
        showPhoneToBuyers: true,
        showWhatsAppButton: true,
        preferredContactTime: 'anytime'
      }
    };

    reset(prepopulatedValues);
    setIsLoading(false);
  }, [id, reset, router]);

  const handleNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handleBackStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmitForm: SubmitHandler<ListingFormValues> = async (values) => {
    setIsSubmitting(true);
    try {
      const stored = localStorage.getItem('estatex_seller_listings');
      let listingsList: SellerListing[] = [];
      if (stored) {
        listingsList = JSON.parse(stored);
      } else {
        listingsList = mockSellerListings;
      }

      const updatedListings = listingsList.map(l => {
        if (l.id === id) {
          return {
            ...l,
            title: values.basicDetails.title,
            price: Number(values.pricingDetails.price),
            type: values.basicDetails.listingType === 'rent' ? 'rent' : 'sale',
            bhk: parseInt(values.basicDetails.bhk || '0') || 0,
            city: values.locationDetails.city,
            images: values.photosDetails.images.length > 0 ? values.photosDetails.images : l.images,
            status: 'pending' // Changes under review
          };
        }
        return l;
      });

      localStorage.setItem('estatex_seller_listings', JSON.stringify(updatedListings));

      toast('Listing updated successfully. Changes under review.', 'success');
      router.push('/listings');
    } catch (error) {
      console.error('Error updating listing', error);
      toast('Failed to update property listing. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 text-center py-20 items-center justify-center min-h-[400px]">
        <div className="h-9 w-9 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold text-muted-foreground animate-pulse">Loading property details for edit...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left animate-in fade-in duration-300 max-w-3xl mx-auto w-full relative pb-10">
      
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Edit Property Listing</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Update details, pricing, photos or features of your property.</p>
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

            {/* Step 6: Review & Submit (Edit Mode) */}
            {currentStep === 6 && (
              <StepReview 
                watch={watch} 
                onBack={handleBackStep} 
                onSubmit={handleSubmit(onSubmitForm)} 
                isSubmitting={isSubmitting}
                onEditStep={(step) => setCurrentStep(step)}
                isEditMode={true}
              />
            )}

          </form>
        </CardContent>
      </Card>

    </div>
  );
}
