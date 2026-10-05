import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, code, name } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and access code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();
    const cleanName = name ? String(name).trim() : "";

    let verified = false;

    // --- Strategy 1: Check our auth_otps table (always reliable) ---
    const { data: otps } = await supabaseAdmin
      .from("auth_otps")
      .select("*")
      .eq("email", cleanEmail)
      .eq("code", cleanCode)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (otps && otps.length > 0) {
      // Mark OTP as consumed
      await supabaseAdmin
        .from("auth_otps")
        .update({ used: true })
        .eq("id", otps[0].id);
      verified = true;
    }

    // --- Strategy 2: Try Supabase native OTP (when email was sent via Supabase) ---
    if (!verified) {
      try {
        const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
          email: cleanEmail,
          token: cleanCode,
          type: "email",
        });
        if (!verifyError && authData?.session) {
          verified = true;
        }
      } catch (_e) {
        // Supabase native OTP not available, rely on DB check above
      }
    }

    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired access code. Please request a new one." },
        { status: 401 }
      );
    }

    // --- Fetch or auto-provision WMES profile ---
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", cleanEmail)
      .maybeSingle();

    let userAccount = profile;

    if (userAccount && cleanName && (!userAccount.name || userAccount.name === "WMES Student" || userAccount.name === "Student")) {
      await supabaseAdmin
        .from("profiles")
        .update({ name: cleanName })
        .eq("id", userAccount.id);
      userAccount.name = cleanName;
    }

    if (!userAccount) {
      const { getNextPortalId } = await import("@/lib/portalId");
      const matricNo = await getNextPortalId();

      const namePrefix = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName =
        cleanName ||
        namePrefix
          .split(" ")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ") ||
        "WMES Student";

      const { data: newProfile } = await supabaseAdmin
        .from("profiles")
        .insert({
          matric_no: matricNo,
          name: formattedName,
          email: cleanEmail,
          role: "Vocational Student",
          track: "Pending",
          registry_hub: "Abuja / Enugu Creative Hub",
          verification_status: "Pending",
        })
        .select()
        .single();

      if (newProfile) userAccount = newProfile;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userAccount?.id,
        matricNo: userAccount?.matric_no || "WMES/FTP/27A/0001",
        name: userAccount?.name || "Student",
        email: userAccount?.email || cleanEmail,
        role: userAccount?.role || "Vocational Student",
        track: userAccount?.track || "Pending",
        registryHub: userAccount?.registry_hub || "Abuja / Enugu Creative Hub",
        verificationStatus: userAccount?.verification_status || "Pending",
      },
      message: "Authentication successful.",
    });
  } catch (error: any) {
    console.error("[verify-otp error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
