import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { pin } = await req.json();
    const cleanPin = String(pin || "").trim();

    const superAdminPin = String(process.env.ADMIN_PIN || "123456").trim();
    const secretaryPin = String(process.env.SECRETARY_PIN || "224466").trim();

    if (cleanPin === superAdminPin) {
      try {
        await supabaseAdmin
          .from("audit_logs")
          .insert({
            actor: "Super Administrator (Master PIN)",
            action: "ADMIN_LOGIN_PIN",
            details: "Super Administrator unlocked platform governance via Master Security PIN.",
            metadata: {
              role: "super_admin",
              method: "master_pin",
              timestamp: new Date().toISOString(),
            },
          });
      } catch (_logErr) {
        // ignore log error
      }

      return NextResponse.json({
        success: true,
        role: "super_admin",
        roleTitle: "Super Administrator",
        email: "worldmobileedusystem@gmail.com",
      });
    }

    if (cleanPin === secretaryPin) {
      try {
        await supabaseAdmin
          .from("audit_logs")
          .insert({
            actor: "Secretary Desk (Desk PIN)",
            action: "ADMIN_LOGIN_PIN",
            details: "Admissions Secretary unlocked Desk portal via Secretary PIN.",
            metadata: {
              role: "secretary",
              method: "secretary_pin",
              timestamp: new Date().toISOString(),
            },
          });
      } catch (_logErr) {
        // ignore log error
      }

      return NextResponse.json({
        success: true,
        role: "secretary",
        roleTitle: "Secretary / Admissions Desk",
        email: "johnsunday0153@gmail.com",
      });
    }

    return NextResponse.json(
      { success: false, error: "Incorrect PIN. Access denied." },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
