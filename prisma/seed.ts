import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local first, falling back to default .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
dotenv.config()

import { PrismaClient, Role, ListingType, PropertyType, ListingStatus } from '@prisma/client'
import { mockProperties } from '../lib/mock-data/properties'

const prisma = new PrismaClient()

function mapListingType(type: string): ListingType {
  switch (type?.toLowerCase()) {
    case 'rent':
      return ListingType.RENT
    case 'commercial':
      return ListingType.COMMERCIAL
    case 'sale':
    default:
      return ListingType.SALE
  }
}

function mapPropertyType(pt: string): PropertyType {
  switch (pt?.toLowerCase()) {
    case 'villa':
      return PropertyType.VILLA
    case 'house':
      return PropertyType.HOUSE
    case 'plot':
      return PropertyType.PLOT
    case 'office':
      return PropertyType.OFFICE
    case 'shop':
      return PropertyType.SHOP
    case 'warehouse':
      return PropertyType.WAREHOUSE
    case 'apartment':
    default:
      return PropertyType.APARTMENT
  }
}

function mapStatus(status: string): ListingStatus {
  switch (status?.toLowerCase()) {
    case 'pending':
      return ListingStatus.PENDING
    case 'rejected':
      return ListingStatus.REJECTED
    case 'paused':
      return ListingStatus.PAUSED
    case 'expired':
    case 'sold':
      return ListingStatus.EXPIRED
    case 'available':
    case 'approved':
    default:
      return ListingStatus.APPROVED
  }
}

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Create 3 users (1 Admin, 1 Seller, 1 Buyer)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@estatehub.com' },
    update: {},
    create: {
      id: 'usr-admin-1',
      name: 'Admin User',
      email: 'admin@estatehub.com',
      phone: '+91 99999 00001',
      role: Role.ADMIN,
      phoneVerified: true,
      isActive: true,
    },
  })

  const seller = await prisma.user.upsert({
    where: { email: 'seller@estatehub.com' },
    update: {},
    create: {
      id: 'usr-seller-1',
      name: 'Rajesh Kumar',
      email: 'seller@estatehub.com',
      phone: '+91 99999 00002',
      role: Role.SELLER,
      phoneVerified: true,
      isActive: true,
    },
  })

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@estatehub.com' },
    update: {},
    create: {
      id: 'usr-buyer-1',
      name: 'Priya Sharma',
      email: 'buyer@estatehub.com',
      phone: '+91 99999 00003',
      role: Role.BUYER,
      phoneVerified: true,
      isActive: true,
    },
  })

  console.log(`👤 Users created/verified:
  - Admin: ${admin.email}
  - Seller: ${seller.email}
  - Buyer: ${buyer.email}`)

  // 2. Create 25 properties with images and amenities
  const propertiesToSeed = mockProperties.slice(0, 25)

  for (const prop of propertiesToSeed) {
    const localityName = prop.location?.address || prop.location?.city || 'Central'
    const cityName = prop.location?.city || 'Gurugram'

    await prisma.property.upsert({
      where: { id: prop.id },
      update: {
        title: prop.title,
        description: prop.description,
        price: prop.price,
        type: mapListingType(prop.type),
        propertyType: mapPropertyType(prop.propertyType),
        bhk: prop.bedrooms ?? null,
        area: prop.area,
        floor: prop.floor ?? null,
        totalFloors: prop.totalFloors ?? null,
        furnishing: prop.furnishingStatus ?? null,
        status: mapStatus(prop.status),
        isVerified: prop.isVerified ?? false,
        isFeatured: prop.featured ?? false,
        lat: prop.location?.coordinates?.lat ?? null,
        lng: prop.location?.coordinates?.lng ?? null,
        address: prop.location?.address ?? null,
        locality: localityName,
        city: cityName,
        pincode: prop.location?.zipCode ?? null,
        sellerId: seller.id,
      },
      create: {
        id: prop.id,
        title: prop.title,
        description: prop.description,
        price: prop.price,
        type: mapListingType(prop.type),
        propertyType: mapPropertyType(prop.propertyType),
        bhk: prop.bedrooms ?? null,
        area: prop.area,
        floor: prop.floor ?? null,
        totalFloors: prop.totalFloors ?? null,
        furnishing: prop.furnishingStatus ?? null,
        status: mapStatus(prop.status),
        isVerified: prop.isVerified ?? false,
        isFeatured: prop.featured ?? false,
        lat: prop.location?.coordinates?.lat ?? null,
        lng: prop.location?.coordinates?.lng ?? null,
        address: prop.location?.address ?? null,
        locality: localityName,
        city: cityName,
        pincode: prop.location?.zipCode ?? null,
        sellerId: seller.id,
        images: {
          create: (prop.images || []).map((imgUrl, idx) => ({
            url: imgUrl,
            isMain: idx === 0,
            order: idx,
          })),
        },
        amenities: {
          create: (prop.amenities || []).map((a) => ({
            name: typeof a === 'string' ? a : a.name,
          })),
        },
      },
    })
  }

  console.log(`🏠 Seeding completed! ${propertiesToSeed.length} properties seeded.`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
