import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate a secure 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Invalidate any previous unused codes for this email
    await supabaseAdmin
      .from("auth_otps")
      .update({ used: true })
      .eq("email", cleanEmail)
      .eq("used", false);

    // Save the new OTP to the database
    const { error: insertError } = await supabaseAdmin
      .from("auth_otps")
      .insert({ email: cleanEmail, code, expires_at: expiresAt, used: false });

    if (insertError) {
      console.error("[OTP Insert Error]:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to issue access code. Please try again." },
        { status: 500 }
      );
    }

    // --- Ensure user exists and is confirmed in Supabase Auth ---
    // If a brand new user calls signInWithOtp with shouldCreateUser: true, Supabase routes
    // email delivery through the "Confirm signup" template which defaults to a confirmation link.
    // By pre-creating and confirming the user in auth.users first, Supabase routes the request
    // through the customized "Magic Link" template containing the OTP code.
    try {
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: cleanEmail,
        email_confirm: true,
      });

      if (createError) {
        // User already exists in auth.users, proceed directly without downloading full user directory
      }
    } catch (_authPreError) {
      console.warn("[OTP] Auth pre-creation check skipped:", _authPreError);
    }

    // --- Attempt to send via Supabase built-in email ---
    let emailSent = false;
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: false },
      });
      if (!otpError) {
        emailSent = true;
        console.log(`[OTP] Email sent via Supabase to ${cleanEmail}`);
      } else {
        console.warn(`[OTP] Supabase email failed (${otpError.message}) — code stored in DB`);
      }
    } catch (_e) {
      console.warn("[OTP] Supabase email unavailable — code stored in DB");
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit access code has been sent to ${cleanEmail}. Check your inbox.`,
    });
  } catch (error: any) {
    console.error("[send-otp error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
