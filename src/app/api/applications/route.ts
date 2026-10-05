import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getNextPortalId } from "@/lib/portalId";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const matricNo = searchParams.get("matricNo");
    const email = searchParams.get("email");

    if (!matricNo && !email) {
      return NextResponse.json(
        { success: false, error: "matricNo or email is required." },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("applications").select("*");
    if (matricNo) {
      query = query.or(`matric_no.eq.${matricNo},form_no.eq.${matricNo}`);
    } else if (email) {
      query = query.eq("email", email.trim().toLowerCase());
    }

    const { data, error } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[Applications GET Error]:", error);
    }

    return NextResponse.json({
      success: true,
      application: data || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      formNo,
      matricNo,
      fullName,
      gender,
      dob,
      age,
      phone,
      email,
      address,
      education,
      currentStatus,
      sponsorType,
      sponsorName,
      ninNumber,
      preferredCentre,
      passportPhoto,
      fashionTrack,
      rawData,
    } = body;

    if (!fullName || !phone || !email) {
      return NextResponse.json(
        { success: false, error: "Full Name, Phone, and Email are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // The form number MUST be identical to the student's portal ID
    let assignedPortalId =
      matricNo ||
      (formNo && !formNo.startsWith("WMES-APP-") ? formNo : null);

    // If not supplied directly, attempt to fetch user's portal ID from profiles table
    if (!assignedPortalId && cleanEmail) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("matric_no")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (profile?.matric_no) {
        assignedPortalId = profile.matric_no;
      }
    }

    // If still not set, generate the next sequential portal ID (WMES/FTP/27A/0001 format)
    if (!assignedPortalId) {
      assignedPortalId = await getNextPortalId();
    }

    // Check if an application already exists for this portal ID / email
    const { data: existingApp } = await supabaseAdmin
      .from("applications")
      .select("id")
      .or(`form_no.eq.${assignedPortalId},matric_no.eq.${assignedPortalId},email.eq.${cleanEmail}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const payload = {
      form_no: assignedPortalId,
      matric_no: assignedPortalId,
      full_name: fullName.trim(),
      gender: Array.isArray(gender) ? gender.join(", ") : gender || null,
      dob: dob || null,
      age: age || null,
      phone: phone.trim(),
      email: cleanEmail,
      address: address ? address.trim() : null,
      education: education || null,
      current_status: Array.isArray(currentStatus) ? currentStatus : [],
      sponsor_type: sponsorType || null,
      sponsor_name: sponsorName || null,
      nin_number: ninNumber || null,
      preferred_centre: preferredCentre || null,
      passport_photo_url: passportPhoto || null,
      status: "Pending",
      raw_data: {
        ...(rawData || body),
        ...(fashionTrack ? { fashionTrack } : {}),
      },
    };

    let appData;
    let dbError;

    if (existingApp?.id) {
      const { data: updated, error: updateError } = await supabaseAdmin
        .from("applications")
        .update(payload)
        .eq("id", existingApp.id)
        .select()
        .single();
      appData = updated;
      dbError = updateError;
    } else {
      const { data: inserted, error: insertError } = await supabaseAdmin
        .from("applications")
        .insert(payload)
        .select()
        .single();
      appData = inserted;
      dbError = insertError;
    }

    if (dbError) {
      console.error("[Applications Insert/Update Error]:", dbError);
      return NextResponse.json(
        { success: false, error: "Failed to persist application in database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      formNo: assignedPortalId,
      matricNo: assignedPortalId,
      application: appData,
      message: `Application submitted successfully! Your application is now Pending review by the Secretary Desk. Form No: ${assignedPortalId}.`,
    });
  } catch (error: any) {
    console.error("[applications route error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
