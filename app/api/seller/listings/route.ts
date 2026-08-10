import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sellerId = (session.user as any).id
    const userRole = (session.user as any).role

    if (userRole !== "SELLER" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Seller account required" },
        { status: 403 }
      )
    }

    const listings = await db.property.findMany({
      where: { sellerId },
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        amenities: true,
        _count: {
          select: {
            leads: true,
            wishlistedBy: true,
            reviews: true,
          },
        },
      },
    })

    return NextResponse.json(listings)
  } catch (error: any) {
    console.error("GET /api/seller/listings error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch seller listings" },
      { status: 500 }
    )
  }
}
