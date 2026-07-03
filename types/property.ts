export interface Amenity {
  id: string;
  name: string;
  icon?: string; // name of icon component (e.g. from lucide-react)
  category?: string; // e.g. "Kitchen", "Outdoor", "Safety"
}

export interface Location {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  rating?: number;
  role?: 'owner' | 'broker';
  isVerified?: boolean;
}

export type PropertyType = 'apartment' | 'house' | 'condo' | 'townhouse' | 'land' | 'commercial';
export type PropertyStatus = 'available' | 'rented' | 'sold' | 'pending';
export type ListingType = 'rent' | 'sale';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string; // e.g., 'USD', 'INR'
  type: ListingType;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit?: string; // e.g., 'sqft', 'sqm'
  images: string[];
  location: Location;
  amenities: Amenity[];
  status: PropertyStatus;
  featured: boolean;
  isVerified?: boolean;
  createdAt: string; // ISO date string
  agent: Agent;
  yearBuilt?: number;
  parkingSpaces?: number;
  floor?: number;
  totalFloors?: number;
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Furnished';
}
