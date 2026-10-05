import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";

    let query = supabaseAdmin
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (status && status !== "all") {
      if (status.toLowerCase() === "pending") {
        query = query.or("status.eq.Pending,status.eq.Submitted");
      } else {
        query = query.eq("status", status);
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, applications: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, remarks, completeness, reviewerName } = await req.json();
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "id and status are required" },
        { status: 400 }
      );
    }

    // Preserve existing application raw_data and append officialUse docket review
    const { data: currentApp } = await supabaseAdmin
      .from("applications")
      .select("raw_data")
      .eq("id", id)
      .maybeSingle();

    const currentRaw = (currentApp?.raw_data as any) || {};
    const updatedRaw = {
      ...currentRaw,
      officialUse: {
        ...(currentRaw.officialUse || {}),
        remarks: remarks !== undefined ? remarks : currentRaw.officialUse?.remarks || "",
        completeness: completeness || currentRaw.officialUse?.completeness || "Complete",
        reviewedBy: reviewerName || "Secretary Desk (Registry)",
        reviewedAt: new Date().toISOString(),
        decision: status,
      },
    };

    const { data, error } = await supabaseAdmin
      .from("applications")
      .update({
        status,
        raw_data: updatedRaw,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, application: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}
