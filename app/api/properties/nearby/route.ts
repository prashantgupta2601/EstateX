import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const latStr = searchParams.get("lat")
    const lngStr = searchParams.get("lng")
    const radiusStr = searchParams.get("radius") || "10" // default 10 km

    if (!latStr || !lngStr) {
      return NextResponse.json(
        { error: "Latitude (lat) and longitude (lng) query parameters are required" },
        { status: 400 }
      )
    }

    const lat = parseFloat(latStr)
    const lng = parseFloat(lngStr)
    const radius = parseFloat(radiusStr)

    if (isNaN(lat) || isNaN(lng) || isNaN(radius)) {
      return NextResponse.json(
        { error: "Invalid lat, lng, or radius numbers" },
        { status: 400 }
      )
    }

    // Execute Haversine spherical distance calculation on PostgreSQL
    const nearbyProperties: any[] = await db.$queryRaw`
      SELECT 
        id, 
        title, 
        description, 
        price, 
        type, 
        "propertyType", 
        bhk, 
        area, 
        locality, 
        city, 
        lat, 
        lng,
        (6371 * acos(
          LEAST(1.0, GREATEST(-1.0, 
            cos(radians(${lat})) * 
            cos(radians(lat)) * 
            cos(radians(lng) - radians(${lng})) + 
            sin(radians(${lat})) * 
            sin(radians(lat))
          ))
        )) AS distance 
      FROM "Property"
      WHERE status = 'APPROVED' 
        AND lat IS NOT NULL 
        AND lng IS NOT NULL
      HAVING (6371 * acos(
        LEAST(1.0, GREATEST(-1.0, 
          cos(radians(${lat})) * 
          cos(radians(lat)) * 
          cos(radians(lng) - radians(${lng})) + 
          sin(radians(${lat})) * 
          sin(radians(lat))
        ))
      )) <= ${radius}
      ORDER BY distance ASC
      LIMIT 20
    `

    // Convert BigInt or decimal values if any before serializing
    const sanitizedProperties = nearbyProperties.map((p) => ({
      ...p,
      distance: typeof p.distance === "number" ? Math.round(p.distance * 100) / 100 : parseFloat(p.distance),
    }))

    return NextResponse.json(sanitizedProperties)
  } catch (error: any) {
    console.error("GET /api/properties/nearby error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to calculate nearby properties" },
      { status: 500 }
    )
  }
}
