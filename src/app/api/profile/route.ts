import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { matricNo, email, name, phone, avatarUrl } = await req.json();

    if (!matricNo && !email) {
      return NextResponse.json(
        { success: false, error: "Matriculation Number or Email is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanMatric = matricNo ? matricNo.trim() : null;

    // 1. Prepare profile updates
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (name?.trim()) updates.name = name.trim();
    if (phone?.trim()) updates.phone = phone.trim();
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl;

    // 2. Update profiles table
    let profileQuery = supabaseAdmin.from("profiles").update(updates);
    if (cleanEmail) {
      profileQuery = profileQuery.eq("email", cleanEmail);
    } else if (cleanMatric) {
      profileQuery = profileQuery.eq("matric_no", cleanMatric);
    }

    const { data: updatedProfile, error: profileErr } = await profileQuery
      .select()
      .maybeSingle();

    if (profileErr) {
      console.error("[Profile Update DB Error]:", profileErr);
      return NextResponse.json(
        { success: false, error: "Failed to update profile." },
        { status: 500 }
      );
    }

    // 3. Synchronize avatar photo to applications table (passport_photo_url)
    if (avatarUrl !== undefined) {
      let appQuery = supabaseAdmin
        .from("applications")
        .update({ passport_photo_url: avatarUrl });

      if (cleanMatric) {
        appQuery = appQuery.or(`matric_no.eq.${cleanMatric},form_no.eq.${cleanMatric}`);
      } else if (cleanEmail) {
        appQuery = appQuery.eq("email", cleanEmail);
      }

      await appQuery;

      // Log to audit_logs
      try {
        await supabaseAdmin.from("audit_logs").insert({
          actor: cleanMatric || cleanEmail || "Student",
          action: "UPDATE_PROFILE_PHOTO",
          details: `Student ${cleanMatric || cleanEmail} updated their profile picture. Automatically synchronized to official application form.`,
          metadata: { matricNo: cleanMatric, email: cleanEmail, hasPhoto: Boolean(avatarUrl) },
        });
      } catch (_logErr) {}
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
