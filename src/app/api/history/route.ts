import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getSymptomHistory } from "@/lib/db/queries";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get last 50 checks, most recent first
    const history = await getSymptomHistory(userId, 50, 0);

    return NextResponse.json(history);
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}