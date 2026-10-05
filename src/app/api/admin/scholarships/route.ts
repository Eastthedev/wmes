import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const [batchesRes, tokensRes, appsRes] = await Promise.all([
      supabaseAdmin
        .from("sponsorship_batches")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("scholarship_tokens")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
      supabaseAdmin
        .from("scholarship_applications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100),
    ]);

    return NextResponse.json({
      success: true,
      batches: batchesRes.data || [],
      tokens: tokensRes.data || [],
      applications: appsRes.data || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sponsorName = body.sponsorName || body.sponsor_name;
    const coverage = body.coverage || "tuition";
    const totalSlots = body.totalSlots || body.total_slots || 1;
    const notes = body.notes || "";
    const actorRole = body.actorRole || body.created_by || "Secretary Desk";

    if (!sponsorName?.trim()) {
      return NextResponse.json(
        { success: false, error: "Sponsor or Donor Name is required." },
        { status: 400 }
      );
    }

    const slots = Math.max(1, parseInt(String(totalSlots), 10) || 1);
    const cleanCoverage = ["tuition", "forms", "both"].includes(coverage)
      ? coverage
      : "tuition";

    const unitPrice =
      cleanCoverage === "tuition"
        ? 100000
        : cleanCoverage === "forms"
        ? 10000
        : 110000;
    const totalAmount = unitPrice * slots;

    // 1. Calculate next sequential batch ID
    const { data: existingBatches } = await supabaseAdmin
      .from("sponsorship_batches")
      .select("id");

    const batchCount = (existingBatches?.length || 0) + 1;
    const currentYear = new Date().getFullYear();
    const batchId = `SPON-${currentYear}-${String(batchCount).padStart(3, "0")}`;
    const batchCode = `B${String(batchCount).padStart(2, "0")}`;

    // 2. Insert Batch (NO bank details required)
    const { error: batchErr } = await supabaseAdmin
      .from("sponsorship_batches")
      .insert({
        id: batchId,
        sponsor_name: sponsorName.trim(),
        coverage: cleanCoverage,
        total_slots: slots,
        claimed_slots: 0,
        unit_price: unitPrice,
        total_amount: totalAmount,
        created_by: actorRole,
        notes: notes ? notes.trim() : null,
        status: "Active",
      });

    if (batchErr) {
      console.error("[Create Batch Error]:", batchErr);
      return NextResponse.json(
        { success: false, error: "Failed to create sponsorship batch." },
        { status: 500 }
      );
    }

    // 3. Generate sequential tokens: WMES-SCH-B01-001, WMES-SCH-B01-002...
    const tokensToInsert = [];
    for (let i = 1; i <= slots; i++) {
      const tokenCode = `WMES-SCH-${batchCode}-${String(i).padStart(3, "0")}`;
      tokensToInsert.push({
        batch_id: batchId,
        token_code: tokenCode,
        coverage: cleanCoverage,
        sponsor_name: sponsorName.trim(),
        status: "Available",
      });
    }

    const { data: insertedTokens, error: tokensErr } = await supabaseAdmin
      .from("scholarship_tokens")
      .insert(tokensToInsert)
      .select();

    if (tokensErr) {
      console.error("[Create Tokens Error]:", tokensErr);
      return NextResponse.json(
        { success: false, error: "Failed to generate scholarship tokens." },
        { status: 500 }
      );
    }

    // 4. Log to Audit Trail
    await supabaseAdmin.from("audit_logs").insert({
      actor: actorRole,
      action: "ISSUE_SCHOLARSHIP_TOKENS",
      details: `${actorRole} generated ${slots} scholarship tokens for Sponsor: "${sponsorName.trim()}". Coverage: ${cleanCoverage}. Total Value: ₦${totalAmount.toLocaleString()}. Batch ID: ${batchId}.`,
      metadata: {
        batchId,
        sponsorName: sponsorName.trim(),
        slots,
        coverage: cleanCoverage,
        totalAmount,
      },
    });

    return NextResponse.json({
      success: true,
      batchId,
      tokens: insertedTokens || [],
      message: `Successfully issued ${slots} scholarship tokens for ${sponsorName.trim()}.`,
    });
  } catch (error: any) {
    console.error("[admin/scholarships error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
