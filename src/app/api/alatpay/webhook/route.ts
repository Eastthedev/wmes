import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const signature =
      req.headers.get("x-alatpay-signature") ||
      req.headers.get("x-webhook-signature") ||
      req.headers.get("authorization");

    const webhookSecret = process.env.ALATPAY_WEBHOOK_SECRET_KEY;

    // Signature/Secret verification
    if (webhookSecret && signature) {
      const cleanSig = signature.replace(/^Bearer\s+/i, "");
      if (cleanSig !== webhookSecret && !cleanSig.includes(webhookSecret)) {
        console.warn("ALATPay Webhook: Signature mismatch warning.");
      }
    }

    const payload = await req.json();
    console.log("[ALATPay Webhook Event Received]:", payload);

    return NextResponse.json({
      status: "received",
      receivedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", error: error?.message },
      { status: 400 }
    );
  }
}
