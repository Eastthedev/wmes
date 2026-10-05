import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { applicationId, tokenCode, actorRole = "Secretary Desk" } =
      await req.json();

    if (!applicationId || !tokenCode) {
      return NextResponse.json(
        { success: false, error: "Application ID and Token Code are required." },
        { status: 400 }
      );
    }

    // 1. Fetch application
    const { data: application, error: appErr } = await supabaseAdmin
      .from("scholarship_applications")
      .select("*")
      .eq("id", applicationId)
      .maybeSingle();

    if (appErr || !application) {
      return NextResponse.json(
        { success: false, error: "Applicant not found." },
        { status: 404 }
      );
    }

    // 2. Fetch token
    const { data: token, error: tokenErr } = await supabaseAdmin
      .from("scholarship_tokens")
      .select("*")
      .eq("token_code", tokenCode)
      .maybeSingle();

    if (tokenErr || !token) {
      return NextResponse.json(
        { success: false, error: "Token not found." },
        { status: 404 }
      );
    }

    if (token.status === "Redeemed") {
      return NextResponse.json(
        { success: false, error: "This token has already been claimed." },
        { status: 400 }
      );
    }

    // 3. Mark token as Redeemed for this student
    const nowIso = new Date().toISOString();
    await supabaseAdmin
      .from("scholarship_tokens")
      .update({
        status: "Redeemed",
        student_matric_no: application.matric_no,
        student_name: application.full_name,
        student_email: application.email,
        redeemed_at: nowIso,
      })
      .eq("id", token.id);

    // 4. Mark application as Awarded
    await supabaseAdmin
      .from("scholarship_applications")
      .update({
        status: "Awarded",
        awarded_token: tokenCode,
      })
      .eq("id", applicationId);

    // 5. Update batch count
    if (token.batch_id) {
      const { data: batch } = await supabaseAdmin
        .from("sponsorship_batches")
        .select("claimed_slots, total_slots")
        .eq("id", token.batch_id)
        .maybeSingle();

      if (batch) {
        const nextClaimed = (batch.claimed_slots || 0) + 1;
        await supabaseAdmin
          .from("sponsorship_batches")
          .update({
            claimed_slots: nextClaimed,
            status: nextClaimed >= batch.total_slots ? "Fully Redeemed" : "Active",
          })
          .eq("id", token.batch_id);
      }
    }

    // 6. Generate Paid Transaction(s) for the student
    const coverage = token.coverage || "tuition";
    const txnsToInsert: any[] = [];

    if (coverage === "tuition" || coverage === "both") {
      txnsToInsert.push({
        id: `TXN-SCH-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        matric_no: application.matric_no,
        description: `Payment for Fashion Training Programme (Scholarship Grant - ${token.sponsor_name})`,
        type: "Programme Tuition (Scholarship)",
        amount: 100000,
        method: "Scholarship Grant",
        status: "Paid",
        receipt_no: `REC-SCH-${Math.floor(1000 + Math.random() * 9000)}`,
        reference: tokenCode,
        paid_by: `${token.sponsor_name} (Endowment)`,
        email: application.email,
        verified_at: nowIso,
      });
    }

    if (coverage === "forms" || coverage === "both") {
      txnsToInsert.push({
        id: `TXN-SCH-F-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        matric_no: application.matric_no,
        description: `Payment to Access the Forms Page (Scholarship Grant - ${token.sponsor_name})`,
        type: "Forms Access Fee (Scholarship)",
        amount: 100,
        method: "Scholarship Grant",
        status: "Paid",
        receipt_no: `REC-SCH-F-${Math.floor(1000 + Math.random() * 9000)}`,
        reference: tokenCode,
        paid_by: `${token.sponsor_name} (Endowment)`,
        email: application.email,
        verified_at: nowIso,
      });
    }

    if (txnsToInsert.length > 0) {
      await supabaseAdmin.from("transactions").insert(txnsToInsert);
    }

    // 7. Update Student Profile
    await supabaseAdmin
      .from("profiles")
      .update({
        track: "Tailoring",
        role: "Scholarship Scholar",
      })
      .eq("matric_no", application.matric_no);

    // 8. Log Audit
    await supabaseAdmin.from("audit_logs").insert({
      actor: actorRole,
      action: "AWARD_SCHOLARSHIP_TOKEN",
      details: `${actorRole} awarded scholarship token ${tokenCode} (${token.sponsor_name}) to waitlist student ${application.full_name} (${application.matric_no}).`,
    });

    return NextResponse.json({
      success: true,
      message: `Awarded ${tokenCode} to ${application.full_name}. Their portal is now unlocked!`,
    });
  } catch (error: any) {
    console.error("[award scholarship error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
