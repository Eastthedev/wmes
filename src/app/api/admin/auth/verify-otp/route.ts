import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { getAuthorizedAdmin } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, error: "Email and 6-digit security code are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = String(code).trim();

    const authorizedAdmin = getAuthorizedAdmin(cleanEmail);
    if (!authorizedAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Access Restricted: This email address is not authorized for administrative access. Only designated Secretariat and Super Admin personnel are permitted.",
        },
        { status: 403 }
      );
    }

    let verified = false;

    // Strategy 1: Verify against our auth_otps table
    const { data: otps, error: dbError } = await supabaseAdmin
      .from("auth_otps")
      .select("*")
      .eq("email", cleanEmail)
      .eq("code", cleanCode)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (!dbError && otps && otps.length > 0) {
      await supabaseAdmin
        .from("auth_otps")
        .update({ used: true })
        .eq("id", otps[0].id);
      verified = true;
    }

    // Strategy 2: Verify via Supabase Auth native OTP
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
        // Fallback check done
      }
    }

    if (!verified) {
      // Log failed attempt to audit_logs safely
      try {
        await supabaseAdmin
          .from("audit_logs")
          .insert({
            actor: `Anonymous / Unverified (${cleanEmail})`,
            action: "ADMIN_LOGIN_FAILED",
            details: `Failed administrative OTP login attempt for ${cleanEmail}. Invalid or expired code.`,
            metadata: {
              email: cleanEmail,
              attemptedCode: cleanCode.replace(/./g, "*"),
              timestamp: new Date().toISOString(),
            },
          });
      } catch (_logErr) {
        // ignore log error
      }

      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired security code. Please check your inbox or request a new code.",
        },
        { status: 401 }
      );
    }

    // Authentication Succeeded: Log to audit trail safely
    try {
      await supabaseAdmin
        .from("audit_logs")
        .insert({
          actor: `${authorizedAdmin.title} (${cleanEmail})`,
          action: "ADMIN_LOGIN_SUCCESS",
          details: `${authorizedAdmin.displayName} unlocked the ${authorizedAdmin.title} platform via Email OTP.`,
          metadata: {
            email: cleanEmail,
            role: authorizedAdmin.role,
            authMethod: "email_otp",
            timestamp: new Date().toISOString(),
          },
        });
    } catch (_logSuccessErr) {
      console.warn("[Admin Verify] Audit log insert warning:", _logSuccessErr);
    }

    return NextResponse.json({
      success: true,
      role: authorizedAdmin.role,
      roleTitle: authorizedAdmin.title,
      displayName: authorizedAdmin.displayName,
      email: cleanEmail,
      message: "Administrative authentication successful.",
    });
  } catch (error: any) {
    console.error("[Admin verify-otp error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
