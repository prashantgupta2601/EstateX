import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { ListingStatus } from "@prisma/client"

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
    const sellerId = (session.user as any).id
    const userRole = (session.user as any).role

    const property = await db.property.findUnique({
      where: { id },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // Only owner or admin can update status
    if (property.sellerId !== sellerId && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. You can only manage your own listings" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status } = body

    if (!status || !Object.values(ListingStatus).includes(status)) {
      return NextResponse.json(
        { error: "Valid status (APPROVED, PAUSED, PENDING, EXPIRED, REJECTED) is required" },
        { status: 400 }
      )
    }

    const updatedProperty = await db.property.update({
      where: { id },
      data: { status: status as ListingStatus },
      include: {
        images: true,
        _count: {
          select: { leads: true },
        },
      },
    })

    return NextResponse.json(updatedProperty)
  } catch (error: any) {
    console.error("PATCH /api/seller/listings/[id]/status error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update listing status" },
      { status: 500 }
    )
  }
}
