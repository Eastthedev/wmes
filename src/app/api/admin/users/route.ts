import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";

    let query = supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,matric_no.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, users: data || [] });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, verification_status } = await req.json();
    if (!id || !verification_status) {
      return NextResponse.json(
        { success: false, error: "id and verification_status are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({ verification_status })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, user: data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}
