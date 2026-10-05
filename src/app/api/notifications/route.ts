import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const matricNo = searchParams.get("matricNo");
    const email = searchParams.get("email");

    // Fetch user profile (only minimal columns, avoiding heavy avatar egress)
    let profileQuery = supabaseAdmin
      .from("profiles")
      .select("id, matric_no, email, name, verification_status, updated_at, created_at");
    if (email) {
      profileQuery = profileQuery.eq("email", email.toLowerCase().trim());
    } else if (matricNo) {
      profileQuery = profileQuery.eq("matric_no", matricNo.trim());
    } else {
      profileQuery = profileQuery.order("created_at", { ascending: false }).limit(1);
    }
    const { data: profile } = await profileQuery.maybeSingle();
    const activeMatric = profile?.matric_no || matricNo || "";

    // 1. Transactions (recent 10)
    const { data: transactions } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("matric_no", activeMatric)
      .order("created_at", { ascending: false })
      .limit(10);

    // 2. Recorded sessions (recent 10)
    const { data: recordings } = await supabaseAdmin
      .from("recorded_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);

    // 3. Form submissions (recent 10)
    const { data: submissions } = await supabaseAdmin
      .from("form_submissions")
      .select("*")
      .eq("matric_no", activeMatric)
      .order("created_at", { ascending: false })
      .limit(10);

    // 4. Custom DB notifications (recent 15)
    const { data: dbNotifications } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .or(`matric_no.eq.${activeMatric},matric_no.is.null,matric_no.eq.all`)
      .order("created_at", { ascending: false })
      .limit(15);

    const notifications: any[] = [];

    // Helper for formatting time
    const formatTimeAgo = (dateStr?: string) => {
      if (!dateStr) return "Recent";
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      if (isNaN(diffMs) || diffMs < 0) return "Just now";
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return "Just now";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    // Synthesize live transactions
    (transactions || []).forEach((t: any) => {
      const isPaid = t.status === "Paid" || t.status === "Successful" || t.status === "Completed";
      const isForms =
        t.description?.toLowerCase().includes("forms") || Number(t.amount) === 10000 || Number(t.amount) === 100;
      const isProg =
        t.description?.toLowerCase().includes("programme") ||
        t.description?.toLowerCase().includes("tailoring") ||
        t.description?.toLowerCase().includes("fashion") ||
        Number(t.amount) >= 100000;

      if (isPaid) {
        notifications.push({
          id: `tx-success-${t.id}`,
          title: isForms
            ? "Forms Fee Payment Confirmed"
            : isProg
            ? "Tuition Payment Confirmed"
            : "Payment Confirmed",
          message: `Payment of ₦${Number(t.amount).toLocaleString()} verified via ${
            t.method || "ALATPay"
          }. Receipt #${t.receipt_no}.`,
          type: "payment_success",
          category: "payment",
          linkTab: "payment",
          createdAt: t.created_at || t.verified_at || new Date().toISOString(),
          timeAgo: formatTimeAgo(t.created_at || t.verified_at),
          read: false,
          badgeColor: "bg-emerald-500",
        });

        if (isForms) {
          notifications.push({
            id: `unlock-forms-${t.id}`,
            title: "Institutional Forms Unlocked",
            message:
              "Payment verified. Official WMES academic request forms, transcript dockets, and letters are unlocked.",
            type: "form_unlocked",
            category: "forms",
            linkTab: "forms",
            createdAt: t.created_at || t.verified_at || new Date().toISOString(),
            timeAgo: formatTimeAgo(t.created_at || t.verified_at),
            read: false,
            badgeColor: "bg-blue-500",
          });
        }

        if (isProg) {
          notifications.push({
            id: `unlock-prog-${t.id}`,
            title: "Tailoring Programme Unlocked",
            message:
              "Tuition verified. Full access to your Professional Tailoring curriculum, studio equipment, and practicals is active.",
            type: "programme_unlocked",
            category: "programme",
            linkTab: "programme",
            createdAt: t.created_at || t.verified_at || new Date().toISOString(),
            timeAgo: formatTimeAgo(t.created_at || t.verified_at),
            read: false,
            badgeColor: "bg-purple-500",
          });
        }
      } else {
        notifications.push({
          id: `tx-failed-${t.id}`,
          title: "Payment Not Successful",
          message: `Payment attempt of ₦${Number(t.amount).toLocaleString()} for ${
            t.description
          } was not completed (${t.status || "Failed"}).`,
          type: "payment_failed",
          category: "payment",
          linkTab: "payment",
          createdAt: t.created_at || new Date().toISOString(),
          timeAgo: formatTimeAgo(t.created_at),
          read: false,
          badgeColor: "bg-rose-500",
        });
      }
    });

    // Synthesize live uploaded videos
    (recordings || []).forEach((r: any) => {
      notifications.push({
        id: `video-${r.id}`,
        title: `New Video: ${r.title}`,
        message: `Lecture demonstration by ${r.instructor || "Faculty"} (${
          r.duration || "Session"
        }) is now ready in the Recorded Session library.`,
        type: "video_uploaded",
        category: "video",
        linkTab: "recorded",
        createdAt: r.created_at || r.date || new Date().toISOString(),
        timeAgo: formatTimeAgo(r.created_at || r.date),
        read: false,
        badgeColor: "bg-indigo-500",
      });
    });

    // Synthesize live form tickets
    (submissions || []).forEach((s: any) => {
      notifications.push({
        id: `form-ticket-${s.ticket_id || s.id}`,
        title: `Form Request: ${s.form_title}`,
        message: `Ticket #${s.ticket_id} status is currently "${s.status}".${
          s.notes ? ` Notes: ${s.notes}` : ""
        }`,
        type: "form_update",
        category: "forms",
        linkTab: "forms",
        createdAt: s.created_at || new Date().toISOString(),
        timeAgo: formatTimeAgo(s.created_at),
        read: false,
        badgeColor: "bg-amber-500",
      });
    });

    // Profile verification
    if (profile?.verification_status === "Verified") {
      notifications.push({
        id: `verification-${activeMatric}`,
        title: "Student Profile Verified",
        message:
          "Your student registration and enrollment details are verified under the WMES US CEU institutional registry.",
        type: "verification",
        category: "system",
        linkTab: "overview",
        createdAt: profile.updated_at || profile.created_at || "2026-01-15T00:00:00Z",
        timeAgo: formatTimeAgo(profile.updated_at || profile.created_at),
        read: false,
        badgeColor: "bg-emerald-500",
      });
    }

    // Explicit DB notifications
    (dbNotifications || []).forEach((n: any) => {
      notifications.push({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type || "system",
        category: n.category || "system",
        linkTab: n.link_tab || "overview",
        createdAt: n.created_at || new Date().toISOString(),
        timeAgo: formatTimeAgo(n.created_at),
        read: Boolean(n.read),
        badgeColor:
          n.type === "payment_success"
            ? "bg-emerald-500"
            : n.type === "payment_failed"
            ? "bg-rose-500"
            : n.type === "video_uploaded"
            ? "bg-indigo-500"
            : "bg-blue-500",
      });
    });

    // Order chronologically descending
    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      notifications,
    });
  } catch (error: any) {
    console.error("[notifications API error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to load notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, notificationId, matricNo } = body;

    if (action === "mark_read" && notificationId) {
      // If it's a UUID (stored in notifications table), update DB
      if (
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          notificationId
        )
      ) {
        await supabaseAdmin
          .from("notifications")
          .update({ read: true })
          .eq("id", notificationId);
      }
      return NextResponse.json({ success: true, message: "Marked as read" });
    }

    if (action === "create" && body.title && body.message) {
      const { data, error } = await supabaseAdmin
        .from("notifications")
        .insert({
          matric_no: matricNo || null,
          title: body.title,
          message: body.message,
          type: body.type || "system",
          category: body.category || "system",
          link_tab: body.linkTab || "overview",
          read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, notification: data });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or parameters" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[notifications POST error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Operation failed" },
      { status: 500 }
    );
  }
}
