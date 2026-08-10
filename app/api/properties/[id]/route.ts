import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { ListingStatus } from "@prisma/client"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 })
    }

    const existingProperty = await db.property.findUnique({
      where: { id },
    })

    if (!existingProperty) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Increment views counter
    const updatedProperty = await db.property.update({
      where: { id },
      data: {
        views: { increment: 1 },
      },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        videos: true,
        amenities: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            phoneVerified: true,
            subscription: true,
            kycSubmission: {
              select: {
                status: true,
                reraNumber: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedProperty)
  } catch (error: any) {
    console.error("GET /api/properties/[id] error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch property details" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    const property = await db.property.findUnique({
      where: { id },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check ownership or admin privileges
    if (property.sellerId !== userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. You can only edit your own listings." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const {
      title,
      description,
      price,
      type,
      propertyType,
      bhk,
      area,
      carpetArea,
      floor,
      totalFloors,
      furnishing,
      facing,
      propertyAge,
      parking,
      address,
      locality,
      city,
      pincode,
      lat,
      lng,
      images,
      amenities,
    } = body

    // Update property and reset status to PENDING for re-review (unless updated by admin)
    const newStatus = userRole === "ADMIN" ? property.status : ListingStatus.PENDING

    const updated = await db.property.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(type && { type }),
        ...(propertyType && { propertyType }),
        ...(bhk !== undefined && { bhk: bhk ? parseInt(bhk, 10) : null }),
        ...(area && { area: parseFloat(area) }),
        ...(carpetArea !== undefined && { carpetArea: carpetArea ? parseFloat(carpetArea) : null }),
        ...(floor !== undefined && { floor: floor ? parseInt(floor, 10) : null }),
        ...(totalFloors !== undefined && { totalFloors: totalFloors ? parseInt(totalFloors, 10) : null }),
        ...(furnishing !== undefined && { furnishing }),
        ...(facing !== undefined && { facing }),
        ...(propertyAge !== undefined && { propertyAge }),
        ...(parking !== undefined && { parking: parseInt(parking, 10) }),
        ...(address !== undefined && { address }),
        ...(locality && { locality }),
        ...(city && { city }),
        ...(pincode !== undefined && { pincode }),
        ...(lat !== undefined && { lat: lat ? parseFloat(lat) : null }),
        ...(lng !== undefined && { lng: lng ? parseFloat(lng) : null }),
        status: newStatus,
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

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("PATCH /api/properties/[id] error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update property" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    const property = await db.property.findUnique({
      where: { id },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Check ownership or admin privileges
    if (property.sellerId !== userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. You can only delete your own listings." },
        { status: 403 }
      )
    }

    await db.property.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Property deleted successfully",
    })
  } catch (error: any) {
    console.error("DELETE /api/properties/[id] error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to delete property" },
      { status: 500 }
    )
  }
}
