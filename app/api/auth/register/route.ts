import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { Role, SubscriptionPlan } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, password, role } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    const emailLower = email.trim().toLowerCase()

    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email: emailLower },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Account with this email already exists" },
        { status: 400 }
      )
    }

    // Check if phone number is already registered (if provided)
    if (phone) {
      const existingPhone = await db.user.findUnique({
        where: { phone },
      })
      if (existingPhone) {
        return NextResponse.json(
          { error: "Account with this phone number already exists" },
          { status: 400 }
        )
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Map role string to enum
    const userRole =
      role?.toUpperCase() === "SELLER"
        ? Role.SELLER
        : role?.toUpperCase() === "ADMIN"
        ? Role.ADMIN
        : Role.BUYER

    // Create user in database
    const newUser = await db.user.create({
      data: {
        name,
        email: emailLower,
        phone: phone || null,
        password: hashedPassword,
        role: userRole,
      },
    })

    // If registering as SELLER, create FREE subscription plan automatically
    if (userRole === Role.SELLER) {
      await db.subscription.create({
        data: {
          userId: newUser.id,
          plan: SubscriptionPlan.FREE,
          isActive: true,
          autoRenew: true,
        },
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Account created",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration endpoint error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 500 }
    )
  }
}
