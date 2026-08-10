import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUserId = (session.user as any).id
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

    if (!action || (action !== "ban" && action !== "unban")) {
      return NextResponse.json(
        { error: "Valid action ('ban' or 'unban') is required" },
        { status: 400 }
      )
    }

    // Prevent admin from banning themselves
    if (id === adminUserId) {
      return NextResponse.json(
        { error: "You cannot ban your own admin account" },
        { status: 400 }
      )
    }

    const targetUser = await db.user.findUnique({
      where: { id },
    })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isBanned = action === "ban"
    const banReason = isBanned ? reason || "Account suspended by Administrator" : null

    const updatedUser = await db.user.update({
      where: { id },
      data: {
        isBanned,
        banReason,
        isActive: !isBanned,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        isBanned: true,
        banReason: true,
      },
    })

    // Create notification for target user
    await db.notification.create({
      data: {
        title: isBanned ? "Account Suspended ⚠️" : "Account Restored ✅",
        message: isBanned
          ? `Your account has been suspended by an administrator.${reason ? ` Reason: ${reason}` : ""}`
          : "Your account suspension has been lifted. You can now access all features.",
        type: isBanned ? "ACCOUNT_BANNED" : "ACCOUNT_UNBANNED",
        userId: id,
      },
    })

    console.log(`[Admin Activity] User ${id} (${targetUser.email}) ${action}ned by Admin ${session.user.email}`)

    return NextResponse.json({
      success: true,
      message: `User ${action}ned successfully`,
      user: updatedUser,
    })
  } catch (error: any) {
    console.error("PATCH /api/admin/users/[id]/ban error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update user ban status" },
      { status: 500 }
    )
  }
}
