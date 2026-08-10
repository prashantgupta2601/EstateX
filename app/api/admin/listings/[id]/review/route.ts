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

    const userRole = (session.user as any).role
    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Admin account required" },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const { action, reason } = body

    if (!action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json(
        { error: "Valid action ('approve' or 'reject') is required" },
        { status: 400 }
      )
    }

    const property = await db.property.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    const newStatus = action === "approve" ? ListingStatus.APPROVED : ListingStatus.REJECTED

    const updatedProperty = await db.property.update({
      where: { id },
      data: {
        status: newStatus,
        isVerified: action === "approve" ? true : property.isVerified,
      },
    })

    // Create notification for property seller
    const notificationTitle = action === "approve"
      ? "Listing Approved! 🎉"
      : "Listing Review Update ⚠️"

    const notificationMessage = action === "approve"
      ? `Your property "${property.title}" has been approved and is now live on EstateHub.`
      : `Your property "${property.title}" was not approved.${reason ? ` Reason: ${reason}` : ""}`

    await db.notification.create({
      data: {
        title: notificationTitle,
        message: notificationMessage,
        type: action === "approve" ? "LISTING_APPROVED" : "LISTING_REJECTED",
        userId: property.sellerId,
        actionUrl: `/seller/listings?id=${property.id}`,
      },
    })

    console.log(`[Admin Activity] Listing ${id} (${property.title}) ${action}d by Admin ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: `Property ${action}d successfully`,
      property: updatedProperty,
    })
  } catch (error: any) {
    console.error("PATCH /api/admin/listings/[id]/review error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to review listing" },
      { status: 500 }
    )
  }
}
