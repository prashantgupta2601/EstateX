import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { LeadStatus } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required to submit property enquiries" },
        { status: 401 }
      )
    }

    const buyerId = (session.user as any).id
    const body = await req.json()
    const { propertyId, message } = body

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId is required" },
        { status: 400 }
      )
    }

    // Verify property exists
    const property = await db.property.findUnique({
      where: { id: propertyId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      )
    }

    // Prevent duplicate leads for the same buyer and property
    const existingLead = await db.lead.findFirst({
      where: {
        buyerId,
        propertyId,
      },
    })

    if (existingLead) {
      return NextResponse.json(
        {
          error: "You have already submitted an enquiry for this property",
          lead: existingLead,
        },
        { status: 400 }
      )
    }

    // Create lead record
    const lead = await db.lead.create({
      data: {
        buyerId,
        sellerId: property.sellerId,
        propertyId,
        message: message || "Interested in learning more about this property.",
        status: LeadStatus.NEW,
        source: "website",
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            city: true,
          },
        },
      },
    })

    // Dispatch notification to property seller
    await db.notification.create({
      data: {
        title: "New Property Enquiry Received",
        message: `${session.user.name || "A buyer"} sent an enquiry for your listing "${property.title}".`,
        type: "LEAD_NEW",
        userId: property.sellerId,
        actionUrl: `/seller/leads?id=${lead.id}`,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully",
        lead,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("POST /api/leads error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit enquiry" },
      { status: 500 }
    )
  }
}
