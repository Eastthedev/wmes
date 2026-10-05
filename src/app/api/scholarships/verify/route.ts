import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { tokenCode } = await req.json();

    if (!tokenCode?.trim()) {
      return NextResponse.json(
        { success: false, error: "Please enter a token code." },
        { status: 400 }
      );
    }

    const cleanToken = tokenCode.trim().toUpperCase();

    const { data: token, error } = await supabaseAdmin
      .from("scholarship_tokens")
      .select("id, token_code, sponsor_name, coverage, status, redeemed_at")
      .ilike("token_code", cleanToken)
      .maybeSingle();

    if (error || !token) {
      return NextResponse.json(
        { success: false, error: "Token not found. Please double-check the code." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      token: {
        code: token.token_code,
        sponsorName: token.sponsor_name,
        coverage: token.coverage,
        status: token.status,
        redeemedAt: token.redeemed_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code") || req.nextUrl.searchParams.get("tokenCode");
    if (!code?.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide a token code in the query (?code=...)." },
        { status: 400 }
      );
    }

    const cleanToken = code.trim().toUpperCase();
    const { data: token, error } = await supabaseAdmin
      .from("scholarship_tokens")
      .select("id, token_code, sponsor_name, coverage, status, redeemed_at")
      .ilike("token_code", cleanToken)
      .maybeSingle();

    if (error || !token) {
      return NextResponse.json(
        { success: false, error: "Token not found. Please double-check the code." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      token: {
        code: token.token_code,
        sponsorName: token.sponsor_name,
        coverage: token.coverage,
        status: token.status,
        redeemedAt: token.redeemed_at,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
