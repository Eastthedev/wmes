import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, tier } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, error: "Full Name is required." },
        { status: 400 }
      );
    }

    if (!email?.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, error: "A valid Email Address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanTier = tier || "Vocational Student";

    // Check if profile already exists in Supabase
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    if (existingUser) {
      return NextResponse.json({
        success: true,
        user: {
          id: existingUser.id,
          matricNo: existingUser.matric_no,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          track: existingUser.track,
          registryHub: existingUser.registry_hub,
          accreditationStatus: existingUser.accreditation_status,
        },
        message: "Account already exists. Logged in successfully.",
      });
    }

    // Generate next sequential portal ID (WMES/FTP/27A/0001 format)
    const { getNextPortalId } = await import("@/lib/portalId");
    const matricNo = await getNextPortalId();

    // Insert new profile into Supabase
    const { data: newProfile, error: insertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        matric_no: matricNo,
        name: cleanName,
        email: cleanEmail,
        role: cleanTier,
        track:
          cleanTier.toLowerCase().includes("commercial") ||
          cleanTier.toLowerCase().includes("facility")
            ? "Commercial Hospitality & Facility Asset Management"
            : "Professional Fashion Design & Garment Technology",
        registry_hub: "Abuja / Enugu Creative Hub",
        accreditation_status: "US CEU Verified",
        enrolled_date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      })
      .select()
      .single();

    if (insertError) {
      console.error("[Profile Creation Error]:", insertError);
      return NextResponse.json(
        { success: false, error: "Database error creating user account." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newProfile.id,
        matricNo: newProfile.matric_no,
        name: newProfile.name,
        email: newProfile.email,
        role: newProfile.role,
        track: newProfile.track,
        registryHub: newProfile.registry_hub,
        accreditationStatus: newProfile.accreditation_status,
      },
      message: "Account registered successfully in WMES Registry.",
    });
  } catch (error: any) {
    console.error("[register error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
