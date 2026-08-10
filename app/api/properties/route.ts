import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { ListingType, PropertyType, ListingStatus } from "@prisma/client"
import { z } from "zod"

// Zod schema for property creation
const createPropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().positive("Price must be greater than 0"),
  type: z.nativeEnum(ListingType),
  propertyType: z.nativeEnum(PropertyType),
  bhk: z.number().int().optional().nullable(),
  area: z.number().positive("Area must be positive"),
  carpetArea: z.number().positive().optional().nullable(),
  floor: z.number().int().optional().nullable(),
  totalFloors: z.number().int().optional().nullable(),
  furnishing: z.string().optional().nullable(),
  facing: z.string().optional().nullable(),
  propertyAge: z.string().optional().nullable(),
  parking: z.number().int().default(0),
  address: z.string().optional().nullable(),
  locality: z.string().min(2, "Locality is required"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  images: z.array(z.string().url()).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const city = searchParams.get("city")
    const type = searchParams.get("type")
    const propertyType = searchParams.get("propertyType")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const bhk = searchParams.get("bhk")
    const furnishing = searchParams.get("furnishing")
    const amenities = searchParams.get("amenities")
    const sort = searchParams.get("sort") || "newest"
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "12", 10)

    // Build dynamic where conditions - buyers see only APPROVED properties
    const where: any = {
      status: ListingStatus.APPROVED,
    }

    if (city) {
      where.OR = [
        { city: { contains: city, mode: "insensitive" } },
        { locality: { contains: city, mode: "insensitive" } },
        { address: { contains: city, mode: "insensitive" } },
      ]
    }

    if (type) {
      const typeUpper = type.toUpperCase()
      if (Object.values(ListingType).includes(typeUpper as ListingType)) {
        where.type = typeUpper as ListingType
      }
    }

    if (propertyType) {
      const ptUpper = propertyType.toUpperCase()
      if (Object.values(PropertyType).includes(ptUpper as PropertyType)) {
        where.propertyType = ptUpper as PropertyType
      }
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        where.price.gte = parseFloat(minPrice)
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        where.price.lte = parseFloat(maxPrice)
      }
    }

    if (bhk && !isNaN(parseInt(bhk, 10))) {
      where.bhk = parseInt(bhk, 10)
    }

    if (furnishing) {
      where.furnishing = { equals: furnishing, mode: "insensitive" }
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities)
        ? amenities
        : amenities.split(",").map((a) => a.trim()).filter(Boolean)

      if (amenityArray.length > 0) {
        where.amenities = {
          some: {
            name: { in: amenityArray, mode: "insensitive" },
          },
        }
      }
    }

    // Build sort order
    let orderBy: any = { createdAt: "desc" }
    if (sort === "price_asc" || sort === "price-asc") {
      orderBy = { price: "asc" }
    } else if (sort === "price_desc" || sort === "price-desc") {
      orderBy = { price: "desc" }
    } else if (sort === "oldest") {
      orderBy = { createdAt: "asc" }
    } else if (sort === "views") {
      orderBy = { views: "desc" }
    } else {
      orderBy = { createdAt: "desc" }
    }

    // Pagination calculations
    const currentPage = Math.max(1, page)
    const take = Math.max(1, limit)
    const skip = (currentPage - 1) * take

    const total = await db.property.count({ where })
    const totalPages = Math.ceil(total / take)

    const properties = await db.property.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        amenities: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
          },
        },
      },
    })

    return NextResponse.json({
      properties,
      total,
      totalPages,
      currentPage,
    })
  } catch (error: any) {
    console.error("GET /api/properties error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch properties" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== "SELLER" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Seller or Admin account required" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const validationResult = createPropertySchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Create property in DB with PENDING status
    const property = await db.property.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type,
        propertyType: data.propertyType,
        bhk: data.bhk ?? null,
        area: data.area,
        carpetArea: data.carpetArea ?? null,
        floor: data.floor ?? null,
        totalFloors: data.totalFloors ?? null,
        furnishing: data.furnishing ?? null,
        facing: data.facing ?? null,
        propertyAge: data.propertyAge ?? null,
        parking: data.parking,
        status: ListingStatus.PENDING,
        address: data.address ?? null,
        locality: data.locality,
        city: data.city,
        pincode: data.pincode ?? null,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        sellerId: (session.user as any).id,
        images: {
          create: data.images.map((url, idx) => ({
            url,
            isMain: idx === 0,
            order: idx,
          })),
        },
        amenities: {
          create: data.amenities.map((name) => ({ name })),
        },
      },
      include: {
        images: true,
        amenities: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Find all Admin users to create notification for
    const adminUsers = await db.user.findMany({
      where: { role: "ADMIN" },
      select: { id: true },
    })

    if (adminUsers.length > 0) {
      await db.notification.createMany({
        data: adminUsers.map((admin: { id: string }) => ({
          title: "New Property Submitted for Approval",
          message: `Property "${property.title}" in ${property.city} was submitted by ${session.user.name || "Seller"}.`,
          type: "PROPERTY_PENDING",
          userId: admin.id,
          actionUrl: `/admin/listings?id=${property.id}`,
        })),
      })
    }

    return NextResponse.json(property, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/properties error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create property" },
      { status: 500 }
    )
  }
}
