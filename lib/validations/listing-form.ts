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
  totalArea: z.coerce.number({ message: 'Total area is required.' }).positive({ message: 'Area must be greater than 0.' }),
  totalAreaUnit: z.enum(['sqft', 'sqm', 'acres']).default('sqft'),
  carpetArea: z.coerce.number().positive({ message: 'Carpet area must be greater than 0.' }).optional().or(z.literal('')),
  floorNo: z.coerce.number().optional().or(z.literal('')),
  totalFloors: z.coerce.number().optional().or(z.literal('')),
  propertyAge: z.enum(['under-construction', 'less-than-1-year', '1-5-years', '5-10-years', '10-plus-years']),
  furnishing: z.enum(['unfurnished', 'semi-furnished', 'furnished']),
  parking: z.enum(['none', '1', '2', '2+']).default('none'),
  facing: z.enum(['east', 'west', 'north', 'south', 'any']).default('any'),
  availableFrom: z.string().optional(),
  amenities: z.array(z.string()).default([]),
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
