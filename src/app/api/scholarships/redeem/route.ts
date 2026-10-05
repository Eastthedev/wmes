import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { tokenCode, matricNo, name, email } = await req.json();

    if (!tokenCode?.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter your scholarship token." },
        { status: 400 }
      );
    }

    if (!matricNo?.trim()) {
      return NextResponse.json(
        { success: false, error: "Student Portal ID is required." },
        { status: 400 }
      );
    }

    const cleanToken = tokenCode.trim().toUpperCase();
    const cleanMatric = matricNo.trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || "Scholarship Student").trim();

    // 0. Verify the student hasn't already activated a scholarship token
    const studentConds: string[] = [];
    if (cleanMatric) studentConds.push(`student_matric_no.ilike.${cleanMatric}`);
    if (cleanEmail) studentConds.push(`student_email.ilike.${cleanEmail}`);

    if (studentConds.length > 0) {
      const { data: alreadyRedeemedToken } = await supabaseAdmin
        .from("scholarship_tokens")
        .select("token_code, sponsor_name, redeemed_at")
        .or(studentConds.join(","))
        .eq("status", "Redeemed")
        .limit(1)
        .maybeSingle();

      if (alreadyRedeemedToken) {
        return NextResponse.json(
          {
            success: false,
            error: `You have already activated a scholarship token (${alreadyRedeemedToken.token_code}). Each student may only validate one scholarship token.`,
            alreadyRedeemed: true,
            tokenCode: alreadyRedeemedToken.token_code,
          },
          { status: 400 }
        );
      }
    }

    // 1. Fetch token
    const { data: token, error: fetchErr } = await supabaseAdmin
      .from("scholarship_tokens")
      .select("*")
      .ilike("token_code", cleanToken)
      .maybeSingle();

    if (fetchErr || !token) {
      return NextResponse.json(
        { success: false, error: "Invalid scholarship token. Please check and try again." },
        { status: 404 }
      );
    }

    if (token.status === "Redeemed") {
      return NextResponse.json(
        {
          success: false,
          error: `This scholarship token was already redeemed on ${
            token.redeemed_at ? new Date(token.redeemed_at).toLocaleDateString("en-GB") : "record"
          }.`,
        },
        { status: 400 }
      );
    }

    // 2. Mark token as Redeemed
    const { error: tokenUpdateErr } = await supabaseAdmin
      .from("scholarship_tokens")
      .update({
        status: "Redeemed",
        student_matric_no: cleanMatric,
        student_name: cleanName,
        student_email: cleanEmail,
        redeemed_at: new Date().toISOString(),
      })
      .eq("id", token.id);

    if (tokenUpdateErr) {
      console.error("[Redeem Error]:", tokenUpdateErr);
      return NextResponse.json(
        { success: false, error: "Failed to redeem token. Please try again." },
        { status: 500 }
      );
    }

    // 3. Increment claimed_slots in batch
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

    const coverage = token.coverage || "tuition";
    const nowIso = new Date().toISOString();

    // 4. Generate Paid Transactions in ledger so dashboard immediately unlocks
    const txnsToInsert: any[] = [];

    if (coverage === "tuition" || coverage === "both") {
      txnsToInsert.push({
        id: `TXN-SCH-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        matric_no: cleanMatric,
        description: `Payment for Fashion Training Programme (Scholarship Grant - ${token.sponsor_name})`,
        type: "Programme Tuition (Scholarship)",
        amount: 100000,
        method: "Scholarship Grant",
        status: "Paid",
        receipt_no: `REC-SCH-${Math.floor(1000 + Math.random() * 9000)}`,
        reference: cleanToken,
        paid_by: `${token.sponsor_name} (Endowment)`,
        email: cleanEmail,
        verified_at: nowIso,
      });
    }

    if (coverage === "forms" || coverage === "both") {
      txnsToInsert.push({
        id: `TXN-SCH-F-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        matric_no: cleanMatric,
        description: `Payment to Access the Forms Page (Scholarship Grant - ${token.sponsor_name})`,
        type: "Forms Access Fee (Scholarship)",
        amount: 100,
        method: "Scholarship Grant",
        status: "Paid",
        receipt_no: `REC-SCH-F-${Math.floor(1000 + Math.random() * 9000)}`,
        reference: cleanToken,
        paid_by: `${token.sponsor_name} (Endowment)`,
        email: cleanEmail,
        verified_at: nowIso,
      });
    }

    if (txnsToInsert.length > 0) {
      await supabaseAdmin.from("transactions").insert(txnsToInsert);
    }

    // 5. Update Profile
    await supabaseAdmin
      .from("profiles")
      .update({
        track: "Tailoring",
        role: "Scholarship Scholar",
      })
      .eq("matric_no", cleanMatric);

    // 6. Update Applications if row exists
    await supabaseAdmin
      .from("applications")
      .update({
        sponsor_name: token.sponsor_name,
        sponsor_type: "Scholarship Endowment",
      })
      .or(`matric_no.eq.${cleanMatric},email.eq.${cleanEmail}`);

    // 7. Write to Audit Logs
    await supabaseAdmin.from("audit_logs").insert({
      actor: `Student (${cleanMatric})`,
      action: "REDEEM_SCHOLARSHIP_TOKEN",
      details: `Token ${cleanToken} redeemed by ${cleanName} (${cleanMatric}). Sponsored by "${token.sponsor_name}". Coverage: ${coverage}.`,
      metadata: {
        tokenCode: cleanToken,
        matricNo: cleanMatric,
        sponsorName: token.sponsor_name,
        coverage,
        transactionsCount: txnsToInsert.length,
      },
    });

    return NextResponse.json({
      success: true,
      sponsorName: token.sponsor_name,
      coverage,
      tokenCode: cleanToken,
      message: `Congratulations! Your 100% scholarship funded by ${token.sponsor_name} has been activated.`,
    });
  } catch (error: any) {
    console.error("[scholarships/redeem error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
