import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createUser, updateUserSubscription } from "@/lib/db/queries";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

if (!webhookSecret) {
  throw new Error("CLERK_WEBHOOK_SECRET is not set");
}

export async function POST(req: Request) {
  try {
    // Ensure webhookSecret is defined (type guard)
    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not configured");
    }

    const headersList = await headers();
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: "Missing Svix headers" },
        { status: 400 }
      );
    }

    const body = await req.text();
    const payload = JSON.parse(body);

    // Verify webhook signature
    const wh = new Webhook(webhookSecret);
    try {
      wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Process Clerk events
    if (payload.type === "user.created") {
      const userData = payload.data;
      await createUser({
        id: userData.id,
        email: userData.email_addresses[0]?.email_address || "",
        first_name: userData.first_name,
        last_name: userData.last_name,
      });
    } else if (payload.type === "user.updated") {
      const userData = payload.data;
      // Check if subscription tier has changed (if you store it in public metadata)
      // For now, we could update basic info only. Subscription changes might be handled separately.
      // We'll leave subscription updates to a separate process or Clerk billing webhook.
    } else if (payload.type === "user.deleted") {
      // Optionally handle user deletion
      console.log(`User ${payload.data.id} deleted`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}