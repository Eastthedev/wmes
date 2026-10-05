import { NextResponse } from "next/server";
import { getNextPortalId } from "@/lib/portalId";

export async function GET() {
  try {
    const portalId = await getNextPortalId();
    return NextResponse.json({ success: true, portalId });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to generate portal ID" },
      { status: 500 }
    );
  }
}
