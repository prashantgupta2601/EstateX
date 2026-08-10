import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { LeadStatus } from "@prisma/client"

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

    const lead = await db.lead.findUnique({
      where: { id },
    })

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    // Verify ownership
    if (lead.sellerId !== sellerId && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. You can only manage your own leads" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { status, note } = body

    let newStatus = lead.status
    if (status && Object.values(LeadStatus).includes(status.toUpperCase() as LeadStatus)) {
      newStatus = status.toUpperCase() as LeadStatus
    }

    // Update lead status
    const updatedLead = await db.lead.update({
      where: { id },
      data: {
        status: newStatus,
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    // If note content is provided, create a LeadNote entry
    if (note && typeof note === "string" && note.trim().length > 0) {
      await db.leadNote.create({
        data: {
          leadId: id,
          content: note.trim(),
        },
      })
    }

    // Re-fetch lead with updated notes
    const finalLead = await db.lead.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    return NextResponse.json(finalLead)
  } catch (error: any) {
    console.error("PATCH /api/seller/leads/[id] error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update lead" },
      { status: 500 }
    )
  }
}
