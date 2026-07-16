import { z } from 'zod';

export const basicDetailsSchema = z.object({
  listingType: z.enum(['sale', 'rent', 'commercial']),
  propertyType: z.string().min(1, { message: 'Please select a property type.' }),
  title: z.string()
    .min(10, { message: 'Title must be at least 10 characters long.' })
    .max(100, { message: 'Title cannot exceed 100 characters.' }),
  description: z.string()
    .min(50, { message: 'Description must be at least 50 characters long.' })
    .max(2000, { message: 'Description cannot exceed 2000 characters.' }),
  bhk: z.string().optional(),
}).refine((data) => {
  const isResidential = ['apartment', 'villa', 'house', 'independent-house'].includes(data.propertyType);
  if (isResidential && !data.bhk) {
    return false;
  }
  return true;
}, {
  message: 'BHK selection is required for residential properties.',
  path: ['bhk'],
});

export const locationDetailsSchema = z.object({
  streetAddress: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City is required.' }),
  state: z.string().min(2, { message: 'State is required.' }),
  locality: z.string().min(1, { message: 'Locality/Area is required.' }),
  landmark: z.string().optional(),
  pincode: z.string().regex(/^\d{6}$/, { message: 'Pincode must be exactly 6 digits.' }),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const featuresDetailsSchema = z.object({
  amenities: z.array(z.string()).default([]),
  bathrooms: z.coerce.number().min(1, { message: 'At least 1 bathroom is required.' }),
  furnishing: z.string().min(1, { message: 'Furnishing status is required.' }),
  superArea: z.string().min(1, { message: 'Super area is required.' }),
});

export const photosDetailsSchema = z.object({
  images: z.array(z.string()).min(1, { message: 'At least one photo upload is required.' }),
  coverIndex: z.number().default(0),
});

export const pricingDetailsSchema = z.object({
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
});

export const listingFormSchema = z.object({
  basicDetails: basicDetailsSchema,
  locationDetails: locationDetailsSchema,
  featuresDetails: featuresDetailsSchema,
  photosDetails: photosDetailsSchema,
  pricingDetails: pricingDetailsSchema,
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;
