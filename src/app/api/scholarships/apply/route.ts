import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const {
      matricNo,
      fullName,
      email,
      phone,
      stateOfOrigin,
      lga,
      reason,
      commitment,
      guarantorContact,
    } = await req.json();

    if (!matricNo || !fullName || !reason) {
      return NextResponse.json(
        { success: false, error: "Please fill all required application fields." },
        { status: 400 }
      );
    }

    const cleanMatric = matricNo.trim();
    const cleanEmail = (email || "").trim().toLowerCase();

    // Check if student already has an active scholarship application
    const conds: string[] = [];
    if (cleanMatric) conds.push(`matric_no.ilike.${cleanMatric}`);
    if (cleanEmail) conds.push(`email.ilike.${cleanEmail}`);

    if (conds.length > 0) {
      const { data: existingApp } = await supabaseAdmin
        .from("scholarship_applications")
        .select("*")
        .or(conds.join(","))
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingApp) {
        return NextResponse.json(
          {
            success: false,
            error:
              "You have already submitted a scholarship application to the Secretary Desk. Multiple applications are not permitted.",
            alreadyApplied: true,
            application: existingApp,
          },
          { status: 400 }
        );
      }
    }

    const { data: newApp, error: insertError } = await supabaseAdmin
      .from("scholarship_applications")
      .insert({
        matric_no: matricNo.trim(),
        full_name: fullName.trim(),
        email: (email || "").trim().toLowerCase(),
        phone: (phone || "").trim(),
        state_of_origin: stateOfOrigin || null,
        lga: lga || null,
        reason: reason.trim(),
        commitment: commitment || "Full 6-Month Vocational Training",
        guarantor_contact: guarantorContact || null,
        status: "Pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Scholarship Apply Error]:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to submit scholarship aid request." },
        { status: 500 }
      );
    }

    // Log to audit
    await supabaseAdmin.from("audit_logs").insert({
      actor: `Student (${matricNo})`,
      action: "APPLY_SCHOLARSHIP_AID",
      details: `${fullName} (${matricNo}) submitted a scholarship financial aid request. State: ${stateOfOrigin || "N/A"}.`,
    });

    return NextResponse.json({
      success: true,
      application: newApp,
      message: "Scholarship aid request submitted to the Secretary Desk waitlist.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
