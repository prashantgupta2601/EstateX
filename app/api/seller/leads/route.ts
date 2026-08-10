import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { LeadStatus } from "@prisma/client"

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

    const { searchParams } = new URL(req.url)
    const propertyId = searchParams.get("propertyId")
    const statusParam = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "10", 10)

    const where: any = {
      sellerId,
    }

    if (propertyId) {
      where.propertyId = propertyId
    }

    if (statusParam) {
      const statusUpper = statusParam.toUpperCase()
      if (Object.values(LeadStatus).includes(statusUpper as LeadStatus)) {
        where.status = statusUpper as LeadStatus
      }
    }

    const currentPage = Math.max(1, page)
    const take = Math.max(1, limit)
    const skip = (currentPage - 1) * take

    const total = await db.lead.count({ where })
    const totalPages = Math.ceil(total / take)

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            city: true,
            images: {
              take: 1,
              orderBy: { order: "asc" },
            },
          },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    return NextResponse.json({
      leads,
      total,
      totalPages,
      currentPage,
    })
  } catch (error: any) {
    console.error("GET /api/seller/leads error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch seller leads" },
      { status: 500 }
    )
  }
}
