import { Property } from '@/types/property';

export function mapDbPropertyToUiProperty(dbProp: any): Property {
  return {
    id: dbProp.id,
    title: dbProp.title,
    description: dbProp.description,
    price: dbProp.price,
    currency: 'INR',
    type: (dbProp.type?.toLowerCase() || 'sale') as any,
    propertyType: (dbProp.propertyType?.toLowerCase() || 'apartment') as any,
    bedrooms: dbProp.bhk || 0,
    bathrooms: dbProp.bhk || 1,
    area: dbProp.area,
    areaUnit: 'sqft',
    images: (dbProp.images && dbProp.images.length > 0)
      ? dbProp.images.map((img: any) => (typeof img === 'string' ? img : img.url))
      : ['https://placehold.co/800x600/1e293b/ffffff?text=EstateX+Property'],
    location: {
      address: dbProp.address || dbProp.locality || dbProp.city,
      city: dbProp.city,
      state: 'India',
      zipCode: dbProp.pincode || '',
      coordinates:
        dbProp.lat && dbProp.lng
          ? { lat: dbProp.lat, lng: dbProp.lng }
          : undefined,
    },
    amenities: (dbProp.amenities || []).map((a: any, idx: number) => ({
      id: a.id || `am-${idx}`,
      name: typeof a === 'string' ? a : a.name,
    })),
    floor: dbProp.floor || undefined,
    totalFloors: dbProp.totalFloors || undefined,
    furnishingStatus: (dbProp.furnishing as any) || 'Unfurnished',
    status: dbProp.status === 'APPROVED' ? 'available' : 'pending',
    featured: dbProp.isFeatured || false,
    isVerified: dbProp.isVerified || false,
    createdAt: dbProp.createdAt
      ? new Date(dbProp.createdAt).toISOString()
      : new Date().toISOString(),
    agent: {
      id: dbProp.seller?.id || 'agent-default',
      name: dbProp.seller?.name || 'Property Owner',
      email: dbProp.seller?.email || 'contact@estatex.com',
      phone: dbProp.seller?.phone || '+91 98765 43210',
      role: 'owner',
      isVerified: dbProp.seller?.kycSubmission?.status === 'APPROVED' || false,
    },
  };
}
