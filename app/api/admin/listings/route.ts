import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { ListingStatus } from "@prisma/client"

export async function GET(req: Request) {
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

    const { searchParams } = new URL(req.url)
    const statusParam = searchParams.get("status") || "PENDING"
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "15", 10)

    const where: any = {}

    if (statusParam && statusParam.toUpperCase() !== "ALL") {
      const statusUpper = statusParam.toUpperCase()
      if (Object.values(ListingStatus).includes(statusUpper as ListingStatus)) {
        where.status = statusUpper as ListingStatus
      }
    }

    const currentPage = Math.max(1, page)
    const take = Math.max(1, limit)
    const skip = (currentPage - 1) * take

    const total = await db.property.count({ where })
    const totalPages = Math.ceil(total / take)

    const listings = await db.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
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
            phone: true,
            kycSubmission: {
              select: {
                status: true,
                reraNumber: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({
      listings,
      total,
      totalPages,
      currentPage,
    })
  } catch (error: any) {
    console.error("GET /api/admin/listings error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin listings" },
      { status: 500 }
    )
  }
}
