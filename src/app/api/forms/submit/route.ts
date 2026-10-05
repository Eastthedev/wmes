import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { matricNo, formTitle, reason, notes } = await req.json();

    if (!matricNo || !formTitle) {
      return NextResponse.json(
        { success: false, error: "Matric number and form title are required." },
        { status: 400 }
      );
    }

    const cleanMatric = String(matricNo).trim();
    const ticketId = `${cleanMatric}-REQ${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: submission, error: insertError } = await supabaseAdmin
      .from("form_submissions")
      .insert({
        ticket_id: ticketId,
        matric_no: matricNo,
        form_title: formTitle,
        reason: reason || null,
        notes: notes || "Under primary administrative review.",
        status: "Under Review",
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Form Submission Error]:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to persist submission in database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      ticketId,
      submission,
      message: `Form request filed with ticket ID ${ticketId}.`,
    });
  } catch (error: any) {
    console.error("[forms/submit error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
