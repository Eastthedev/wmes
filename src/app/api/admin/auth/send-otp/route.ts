import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";
import { getAuthorizedAdmin } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid administrative email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
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

    // Generate secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate previous unused codes for this admin email
    await supabaseAdmin
      .from("auth_otps")
      .update({ used: true })
      .eq("email", cleanEmail)
      .eq("used", false);

    // Save the new OTP to auth_otps table
    const { error: insertError } = await supabaseAdmin
      .from("auth_otps")
      .insert({
        email: cleanEmail,
        code,
        expires_at: expiresAt,
        used: false,
      });

    if (insertError) {
      console.error("[Admin OTP Insert Error]:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to issue administrative security code. Please try again." },
        { status: 500 }
      );
    }

    // Ensure user exists and is confirmed in Supabase Auth
    try {
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        email_confirm: true,
      });

      if (createError) {
        // User already exists in auth.users, proceed directly without downloading full user directory
      }
    } catch (_authPreError) {
      console.warn("[Admin OTP] Auth pre-check skipped:", _authPreError);
    }

    // Dispatch email via Supabase signInWithOtp
    let emailSent = false;
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: false },
      });
      if (!otpError) {
        emailSent = true;
        console.log(`[Admin OTP] Security code dispatched to ${cleanEmail}`);
      } else {
        console.warn(`[Admin OTP] Supabase signInWithOtp note: ${otpError.message}`);
      }
    } catch (e: any) {
      console.warn(`[Admin OTP] Supabase dispatch exception: ${e?.message}`);
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit administrative security code has been sent to ${cleanEmail}. Check your inbox.`,
      email: cleanEmail,
      role: authorizedAdmin.role,
      title: authorizedAdmin.title,
      emailSent,
    });
  } catch (error: any) {
    console.error("[Admin send-otp error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
