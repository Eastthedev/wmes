import { supabaseAdmin } from "./supabase";

export const PORTAL_ID_PREFIX = "WMES/FTP/27A/";

/**
 * Generates the next sequential portal ID in the format WMES/FTP/27A/0001
 * Starting from 0001 and counting up with each new user onboarded.
 */
export async function getNextPortalId(): Promise<string> {
  try {
    // Query recent records matching prefix instead of downloading full tables (drastically cuts DB egress)
    const [{ data: profiles, error: pErr }, { data: apps, error: aErr }] =
      await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("matric_no")
          .ilike("matric_no", "WMES/FTP/27A/%")
          .order("created_at", { ascending: false })
          .limit(25),
        supabaseAdmin
          .from("applications")
          .select("form_no, matric_no")
          .or("form_no.ilike.WMES/FTP/27A/%,matric_no.ilike.WMES/FTP/27A/%")
          .order("created_at", { ascending: false })
          .limit(25),
      ]);

    if (pErr) {
      console.error("[getNextPortalId] Error fetching profiles:", pErr);
    }
    if (aErr) {
      console.error("[getNextPortalId] Error fetching applications:", aErr);
    }

    let maxNum = 0;

    const checkId = (idStr?: string | null) => {
      if (!idStr) return;
      const match = idStr.trim().match(/WMES\/FTP\/27A\/(\d+)/i);
      if (match && match[1]) {
        const val = parseInt(match[1], 10);
        if (!isNaN(val) && val > maxNum) {
          maxNum = val;
        }
      }
    };

    (profiles || []).forEach((p: { matric_no?: string | null }) => checkId(p.matric_no));
    (apps || []).forEach((a: { form_no?: string | null; matric_no?: string | null }) => {
      checkId(a.form_no);
      checkId(a.matric_no);
    });

    let nextNum = maxNum + 1;
    let candidate = `${PORTAL_ID_PREFIX}${String(nextNum).padStart(4, "0")}`;

    // Verify uniqueness against both tables in case of race condition
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 20) {
      const [profileCol, appCol] = await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("matric_no", candidate)
          .maybeSingle(),
        supabaseAdmin
          .from("applications")
          .select("id")
          .eq("form_no", candidate)
          .maybeSingle(),
      ]);

      if (!profileCol.data && !appCol.data) {
        isUnique = true;
      } else {
        nextNum++;
        candidate = `${PORTAL_ID_PREFIX}${String(nextNum).padStart(4, "0")}`;
        attempts++;
      }
    }

    return candidate;
  } catch (err) {
    console.error("[getNextPortalId] Unexpected error:", err);
    // Fallback safe ID
    return `${PORTAL_ID_PREFIX}0001`;
  }
}
