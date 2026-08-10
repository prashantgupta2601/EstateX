import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id

    const wishlistItems = await db.wishlist.findMany({
      where: { userId },
      select: {
        propertyId: true,
        createdAt: true,
        property: {
          include: {
            images: {
              orderBy: { order: "asc" },
            },
            seller: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    const propertyIds = wishlistItems.map((item: any) => item.propertyId)

    return NextResponse.json({
      propertyIds,
      items: wishlistItems,
    })
  } catch (error: any) {
    console.error("GET /api/wishlist error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch wishlist" },
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

    const userId = (session.user as any).id
    const body = await req.json()
    const { propertyId } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is required" },
        { status: 400 }
      )
    }

    // Verify property exists
    const propertyExists = await db.property.findUnique({
      where: { id: propertyId },
    })

    if (!propertyExists) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      )
    }

    // Upsert into wishlist table
    const wishlistItem = await db.wishlist.upsert({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
      update: {},
      create: {
        userId,
        propertyId,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Added to wishlist",
        wishlistItem,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("POST /api/wishlist error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to add to wishlist" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(req.url)
    let propertyId = searchParams.get("propertyId")

    if (!propertyId) {
      try {
        const body = await req.json()
        propertyId = body.propertyId
      } catch (e) {
        // Body reading fallback
      }
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is required" },
        { status: 400 }
      )
    }

    await db.wishlist.deleteMany({
      where: {
        userId,
        propertyId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist",
    })
  } catch (error: any) {
    console.error("DELETE /api/wishlist error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to remove from wishlist" },
      { status: 500 }
    )
  }
}
