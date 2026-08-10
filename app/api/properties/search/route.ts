import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { ListingStatus } from "@prisma/client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q") || ""

    if (!q || q.trim().length < 2) {
      return NextResponse.json([])
    }

    const searchTerm = q.trim()

    const properties = await db.property.findMany({
      where: {
        status: ListingStatus.APPROVED,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { locality: { contains: searchTerm, mode: "insensitive" } },
          { city: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
      select: {
        id: true,
        title: true,
        city: true,
        locality: true,
        price: true,
        type: true,
        propertyType: true,
      },
    })

    // Map properties to structured suggestion items for LocationAutocomplete
    const suggestions = properties.map((prop: any) => ({
      id: prop.id,
      name: prop.title,
      city: prop.city,
      locality: prop.locality,
      price: prop.price,
      type: prop.locality?.toLowerCase().includes(searchTerm.toLowerCase())
        ? "locality"
        : "city",
      propertyType: prop.propertyType,
    }))

    return NextResponse.json(suggestions)
  } catch (error: any) {
    console.error("GET /api/properties/search error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to search properties" },
      { status: 500 }
    )
  }
}
