import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserUsage } from "@/lib/db/queries";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usage = await getUserUsage(userId);
    if (!usage) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      tier: usage.subscription_tier,
      remaining: usage.remaining_checks,
      last_check_date: usage.last_check_date,
    });
  } catch (error) {
    console.error("Usage API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}