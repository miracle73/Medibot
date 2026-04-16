import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { analyzeSymptomsStream } from "@/lib/openai/stream";
import {
  createSymptomCheck,
  incrementDailyCheck,
  getUserUsage,
} from "@/lib/db/queries";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { symptoms: string };
    const { symptoms } = body;

    if (!symptoms || typeof symptoms !== "string" || symptoms.trim().length === 0) {
      return NextResponse.json(
        { error: "Symptoms description is required" },
        { status: 400 }
      );
    }

    // Check usage limits before proceeding
    const usage = await getUserUsage(userId);
    if (!usage) {
      return NextResponse.json(
        { error: "User not found. Please sign up first." },
        { status: 404 }
      );
    }

    if (usage.subscription_tier === "free" && usage.remaining_checks <= 0) {
      return NextResponse.json(
        {
          error:
            "Daily limit reached. You've used all 3 free checks for today. Upgrade to Premium for unlimited access.",
        },
        { status: 429 }
      );
    }

    // Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let completeData: any = null;

        try {
          // Stream events from OpenAI
          for await (const event of analyzeSymptomsStream(symptoms)) {
            const line = JSON.stringify(event) + "\n";
            controller.enqueue(encoder.encode(line));

            if (event.type === "complete") {
              completeData = event.data;
            }
          }

          // After streaming completes, save to database
          if (completeData && userId) {
            try {
              await createSymptomCheck({
                user_id: userId,
                symptoms,
                conditions: completeData.conditions,
                severity: completeData.severity,
                recommendations: completeData.recommendations,
                confidence_score: completeData.confidence_score,
              });

              // Increment daily check count (only affects free tier)
              await incrementDailyCheck(userId);
            } catch (dbError) {
              console.error("Failed to save symptom check:", dbError);
              // We don't send error to client since they already received the analysis
            }
          }
        } catch (error) {
          console.error("Stream error:", error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Check symptoms API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}