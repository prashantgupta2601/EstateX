import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { Role } from "@prisma/client"

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
    const roleParam = searchParams.get("role")
    const statusParam = searchParams.get("status")
    const search = searchParams.get("q") || searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const limit = parseInt(searchParams.get("limit") || "15", 10)

    const where: any = {}

    if (roleParam && roleParam.toUpperCase() !== "ALL") {
      const rUpper = roleParam.toUpperCase()
      if (Object.values(Role).includes(rUpper as Role)) {
        where.role = rUpper as Role
      }
    }

    if (statusParam === "banned") {
      where.isBanned = true
    } else if (statusParam === "active") {
      where.isActive = true
      where.isBanned = false
    }

    if (search) {
      const q = search.trim()
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ]
    }

    const currentPage = Math.max(1, page)
    const take = Math.max(1, limit)
    const skip = (currentPage - 1) * take

    const total = await db.user.count({ where })
    const totalPages = Math.ceil(total / take)

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        isActive: true,
        isBanned: true,
        banReason: true,
        createdAt: true,
        _count: {
          select: {
            properties: true,
            leads: true,
          },
        },
        subscription: {
          select: {
            plan: true,
            isActive: true,
          },
        },
        kycSubmission: {
          select: {
            status: true,
          },
        },
      },
    })

    return NextResponse.json({
      users,
      total,
      totalPages,
      currentPage,
    })
  } catch (error: any) {
    console.error("GET /api/admin/users error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    )
  }
}
