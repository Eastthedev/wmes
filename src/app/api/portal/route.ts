import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// In-memory catalog cache (10-minute TTL) to prevent repeated Supabase queries for static tables
let catalogCache: {
  forms: any[];
  programme: any;
  modules: any[];
  timestamp: number;
} | null = null;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const matricNo = searchParams.get("matricNo");
    const email = searchParams.get("email");

    const queryTerm = (matricNo || email || "").trim();

    // 1. Fetch Profile
    let profile: any = null;
    if (email && !matricNo) {
      const { data } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("email", email.toLowerCase().trim())
        .maybeSingle();
      profile = data;
    } else if (matricNo && !email) {
      const { data } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .or(`matric_no.ilike.${matricNo.trim()},email.ilike.${matricNo.trim()}`)
        .limit(1)
        .maybeSingle();
      profile = data;
    } else if (email && matricNo) {
      const { data } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .or(`matric_no.ilike.${matricNo.trim()},email.ilike.${email.trim()}`)
        .limit(1)
        .maybeSingle();
      profile = data;
    } else {
      const { data } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      profile = data;
    }

    const lookupEmail = (profile?.email || email || (queryTerm.includes("@") ? queryTerm : "")).toLowerCase().trim();
    const lookupMatric = profile?.matric_no || (!queryTerm.includes("@") ? queryTerm : "");

    // 2. Fetch Application record
    let application: any = null;
    const appConds: string[] = [];
    if (lookupMatric) {
      appConds.push(`matric_no.ilike.${lookupMatric}`);
      appConds.push(`form_no.ilike.${lookupMatric}`);
    }
    if (lookupEmail) {
      appConds.push(`email.ilike.${lookupEmail}`);
    }

    if (appConds.length > 0) {
      const { data: appData } = await supabaseAdmin
        .from("applications")
        .select("*")
        .or(appConds.join(","))
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      application = appData;
    }

    // Synthesize profile from application if no profile row existed
    if (!profile && application) {
      profile = {
        id: application.id,
        matric_no: application.matric_no || application.form_no,
        name: application.full_name,
        email: application.email,
        phone: application.phone,
        avatar_url: application.passport_photo_url || null,
        verification_status: application.status === "Approved" ? "Verified" : "Pending",
        created_at: application.created_at,
      };
    }

    const activeMatric = profile?.matric_no || application?.matric_no || application?.form_no || lookupMatric || "";
    const activeEmail = (profile?.email || application?.email || lookupEmail || "").toLowerCase().trim();

    // 3. Fetch Transactions for user
    let transactions: any[] = [];
    if (activeMatric || activeEmail) {
      const txConds: string[] = [];
      if (activeMatric) txConds.push(`matric_no.ilike.${activeMatric}`);
      if (activeEmail) txConds.push(`email.ilike.${activeEmail}`);

      const { data: txData } = await supabaseAdmin
        .from("transactions")
        .select("*")
        .or(txConds.join(","))
        .order("created_at", { ascending: false })
        .limit(50);
      transactions = txData || [];
    }

    // 4. Fetch Scholarship Token (with linked batch)
    let scholarshipToken: any = null;
    if (activeMatric || activeEmail) {
      const tokenConds: string[] = [];
      if (activeMatric) tokenConds.push(`student_matric_no.ilike.${activeMatric}`);
      if (activeEmail) tokenConds.push(`student_email.ilike.${activeEmail}`);

      const { data: tokenData } = await supabaseAdmin
        .from("scholarship_tokens")
        .select("*, sponsorship_batches(*)")
        .or(tokenConds.join(","))
        .order("redeemed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      scholarshipToken = tokenData;
    }

    // 5. Fetch Scholarship Application / Waitlist
    let scholarshipApp: any = null;
    if (activeMatric || activeEmail) {
      const sAppConds: string[] = [];
      if (activeMatric) sAppConds.push(`matric_no.ilike.${activeMatric}`);
      if (activeEmail) sAppConds.push(`email.ilike.${activeEmail}`);

      const { data: sData } = await supabaseAdmin
        .from("scholarship_applications")
        .select("*")
        .or(sAppConds.join(","))
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      scholarshipApp = sData;
    }

    // If scholarshipApp has awarded_token, but scholarshipToken is not found yet:
    if (!scholarshipToken && scholarshipApp?.awarded_token) {
      const { data: tokenByCode } = await supabaseAdmin
        .from("scholarship_tokens")
        .select("*, sponsorship_batches(*)")
        .eq("token_code", scholarshipApp.awarded_token)
        .maybeSingle();
      if (tokenByCode) {
        scholarshipToken = tokenByCode;
      }
    }

    // If transactions reference a scholarship token, resolve token
    if (!scholarshipToken) {
      const schTx = transactions.find(
        (t: any) =>
          (t.status === "Paid" || t.status === "Successful") &&
          (t.method === "Scholarship Grant" ||
            t.description?.toLowerCase().includes("scholarship") ||
            (t.reference && t.reference.startsWith("SCH-")))
      );
      if (schTx?.reference && schTx.reference.startsWith("SCH-")) {
        const { data: tokenByRef } = await supabaseAdmin
          .from("scholarship_tokens")
          .select("*, sponsorship_batches(*)")
          .eq("token_code", schTx.reference)
          .maybeSingle();
        if (tokenByRef) {
          scholarshipToken = tokenByRef;
        }
      }
    }

    // 6. Funding Analysis & Scholarship Docket
    const paidTxns = (transactions || []).filter(
      (t: any) => t.status === "Paid" || t.status === "Successful" || t.status === "Completed"
    );

    const scholarshipTxns = paidTxns.filter(
      (t: any) =>
        t.method === "Scholarship Grant" ||
        t.description?.toLowerCase().includes("scholarship") ||
        t.type?.toLowerCase().includes("scholarship") ||
        t.paid_by?.toLowerCase().includes("endowment") ||
        (t.reference && t.reference.startsWith("SCH-"))
    );

    const selfPaidTxns = paidTxns.filter(
      (t: any) =>
        t.method !== "Scholarship Grant" &&
        !t.description?.toLowerCase().includes("scholarship") &&
        !t.type?.toLowerCase().includes("scholarship") &&
        !t.paid_by?.toLowerCase().includes("endowment") &&
        !(t.reference && t.reference.startsWith("SCH-"))
    );

    const hasPaidFormFeeSelf = selfPaidTxns.some(
      (t: any) =>
        t.description?.toLowerCase().includes("form") ||
        t.description?.toLowerCase().includes("admission") ||
        Number(t.amount) === 10000 ||
        Number(t.amount) === 100 ||
        (Number(t.amount) >= 3000 && Number(t.amount) < 50000)
    );

    const hasPaidTuitionSelf = selfPaidTxns.some(
      (t: any) =>
        t.description?.toLowerCase().includes("programme") ||
        t.description?.toLowerCase().includes("tailoring") ||
        t.description?.toLowerCase().includes("tuition") ||
        t.description?.toLowerCase().includes("fashion") ||
        Number(t.amount) >= 100000
    );

    const hasScholarshipToken = Boolean(scholarshipToken);
    const hasScholarshipAward = scholarshipApp?.status === "Awarded";
    const hasScholarshipTxns = scholarshipTxns.length > 0;
    const hasSponsorOnApp = Boolean(application?.sponsor_name && application.sponsor_name !== "Self" && application.sponsor_name !== "");

    const isScholarship =
      hasScholarshipToken ||
      hasScholarshipAward ||
      hasScholarshipTxns ||
      hasSponsorOnApp;

    let scholarshipCoverage = "none";
    if (isScholarship) {
      if (scholarshipToken?.coverage) {
        scholarshipCoverage = scholarshipToken.coverage;
      } else if (scholarshipToken?.sponsorship_batches?.coverage_type) {
        scholarshipCoverage = scholarshipToken.sponsorship_batches.coverage_type;
      } else if (
        scholarshipTxns.some((t: any) => t.description?.toLowerCase().includes("programme") || Number(t.amount) >= 100000) &&
        scholarshipTxns.some((t: any) => t.description?.toLowerCase().includes("form") || Number(t.amount) === 10000)
      ) {
        scholarshipCoverage = "both";
      } else if (scholarshipTxns.some((t: any) => t.description?.toLowerCase().includes("programme") || Number(t.amount) >= 100000)) {
        scholarshipCoverage = "tuition";
      } else if (scholarshipTxns.some((t: any) => t.description?.toLowerCase().includes("form") || Number(t.amount) === 10000)) {
        scholarshipCoverage = "forms";
      } else {
        scholarshipCoverage = "both";
      }
    }

    const formFeeCleared =
      hasPaidFormFeeSelf ||
      (isScholarship && (scholarshipCoverage === "forms" || scholarshipCoverage === "both"));

    const tuitionCleared =
      hasPaidTuitionSelf ||
      (isScholarship && (scholarshipCoverage === "tuition" || scholarshipCoverage === "both"));

    let entryStatus: "Scholarship" | "Self-Paid" | "Hybrid (Scholarship + Self-Paid)" | "Unpaid" = "Unpaid";
    if (isScholarship && (hasPaidFormFeeSelf || hasPaidTuitionSelf)) {
      entryStatus = "Hybrid (Scholarship + Self-Paid)";
    } else if (isScholarship) {
      entryStatus = "Scholarship";
    } else if (hasPaidFormFeeSelf || hasPaidTuitionSelf || paidTxns.length > 0) {
      entryStatus = "Self-Paid";
    }

    const sponsorName =
      scholarshipToken?.sponsor_name ||
      scholarshipToken?.sponsorship_batches?.sponsor_name ||
      scholarshipTxns[0]?.paid_by?.replace(" (Endowment)", "") ||
      application?.sponsor_name ||
      scholarshipApp?.sponsorship_category ||
      "WMES Community Endowment Fund";

    const scholarshipTitle =
      scholarshipToken?.sponsorship_batches?.title ||
      (scholarshipToken?.sponsor_name ? `${scholarshipToken.sponsor_name} Grant` : null) ||
      (application?.sponsor_name ? `${application.sponsor_name} Sponsorship` : null) ||
      "Official WMES Educational Grant";

    const scholarshipDetails = isScholarship
      ? {
          sponsorName,
          scholarshipTitle,
          tokenCode:
            scholarshipToken?.token_code ||
            scholarshipApp?.awarded_token ||
            scholarshipTxns[0]?.reference ||
            "Registry Grant Award",
          coverage: scholarshipCoverage,
          sponsorCategory:
            scholarshipToken?.sponsorship_batches?.sponsor_category ||
            scholarshipApp?.sponsorship_category ||
            application?.sponsor_type ||
            "Endowment Partner",
          redeemedAt:
            scholarshipToken?.redeemed_at ||
            scholarshipTxns[0]?.verified_at ||
            scholarshipTxns[0]?.created_at ||
            null,
          batchId: scholarshipToken?.batch_id || null,
          batchCode: scholarshipToken?.sponsorship_batches?.batch_code || null,
        }
      : null;

    const fundingDocket = {
      entryStatus,
      isScholarship,
      isSelfPaid: selfPaidTxns.length > 0,
      formFeeCleared,
      formFeeSource: hasPaidFormFeeSelf
        ? "Self-Paid (ALATPay)"
        : isScholarship && (scholarshipCoverage === "forms" || scholarshipCoverage === "both")
        ? `Scholarship Grant (${sponsorName})`
        : "Unpaid",
      tuitionCleared,
      tuitionSource: hasPaidTuitionSelf
        ? "Self-Paid (ALATPay)"
        : isScholarship && (scholarshipCoverage === "tuition" || scholarshipCoverage === "both")
        ? `Scholarship Grant (${sponsorName})`
        : "Outstanding",
      totalPaidAmount: selfPaidTxns.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0),
      scholarshipGrantValue:
        scholarshipTxns.reduce((sum: number, t: any) => sum + Number(t.amount || 0), 0) ||
        (isScholarship
          ? scholarshipCoverage === "both"
            ? 110000
            : scholarshipCoverage === "tuition"
            ? 100000
            : 10000
          : 0),
      scholarshipDetails,
      transactionsCount: transactions.length,
      paidTransactionsCount: paidTxns.length,
    };

    // Selected Fashion Track determination
    const rawTrack =
      application?.raw_data?.fashionTrack ||
      application?.fashion_track ||
      null;

    const selectedTrack = rawTrack
      ? Array.isArray(rawTrack)
        ? rawTrack.join(", ")
        : String(rawTrack)
      : (hasPaidTuitionSelf || tuitionCleared ? "Professional Fashion Design & Garment Technology" : "Not Selected Yet");

    // 7. Fetch Institutional Forms, Programmes & Modules (cached in-memory for 10 mins)
    let institutionalForms: any[] = [];
    let activeProgramme: any = null;
    let modules: any[] = [];

    const now = Date.now();
    if (catalogCache && now - catalogCache.timestamp < 10 * 60 * 1000) {
      institutionalForms = catalogCache.forms;
      activeProgramme = catalogCache.programme;
      modules = catalogCache.modules;
    } else {
      const [formsRes, progRes] = await Promise.all([
        supabaseAdmin
          .from("institutional_forms")
          .select("*")
          .order("code", { ascending: true }),
        supabaseAdmin
          .from("programmes")
          .select("*")
          .limit(1),
      ]);

      institutionalForms = formsRes.data || [];
      activeProgramme = progRes.data?.[0] || null;

      if (activeProgramme) {
        const { data: modData } = await supabaseAdmin
          .from("programme_modules")
          .select("*")
          .eq("programme_id", activeProgramme.id)
          .order("order_index", { ascending: true });
        modules = modData || [];
      }

      catalogCache = {
        forms: institutionalForms,
        programme: activeProgramme,
        modules,
        timestamp: now,
      };
    }

    // 8. Fetch Form Submissions for user (recent 25)
    let submissions: any[] = [];
    if (activeMatric) {
      const { data: subData } = await supabaseAdmin
        .from("form_submissions")
        .select("*")
        .eq("matric_no", activeMatric)
        .order("created_at", { ascending: false })
        .limit(25);
      submissions = subData || [];
    }

    // 10. Fetch Recorded Sessions (recent 50)
    const { data: rawRecordings } = await supabaseAdmin
      .from("recorded_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    // Helper to extract clean 11-char YouTube Video ID
    const parseYouTubeId = (urlOrId?: string): string => {
      if (!urlOrId || typeof urlOrId !== "string") return "";
      const trimmed = urlOrId.trim();
      if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
      const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
      const match = trimmed.match(regExp);
      return match ? match[1] : "";
    };

    // Normalize student track for session filtering
    const trackLower = (selectedTrack || "").toLowerCase();
    let studentTargetFilter: "male" | "female" | "both" = "both";
    if (trackLower.includes("male") && !trackLower.includes("female") && !trackLower.includes("both")) {
      studentTargetFilter = "male";
    } else if (trackLower.includes("female") && !trackLower.includes("male") && !trackLower.includes("both")) {
      studentTargetFilter = "female";
    } else {
      studentTargetFilter = "both";
    }

    // Filter recordings by student's track focus
    const filteredRecordings = (rawRecordings || []).filter((r: any) => {
      const recTrack = (r.target_track || "both").toLowerCase();
      if (studentTargetFilter === "male") {
        return recTrack === "male" || recTrack === "both";
      }
      if (studentTargetFilter === "female") {
        return recTrack === "female" || recTrack === "both";
      }
      return true; // Enrolled in "both" or general sees all sessions
    });

    // Dynamic profile sync
    const finalTrack = selectedTrack !== "Not Selected Yet" ? selectedTrack : (tuitionCleared ? (activeProgramme?.title || "Tailoring") : "Pending");
    const isProfileVerified =
      profile?.verification_status === "Verified" ||
      application?.status === "Approved" ||
      application?.status === "Verified";
    const finalVerification = isProfileVerified ? "Verified" : "Pending";
    const finalAvatar = profile?.avatar_url || application?.passport_photo_url || null;

    const enrolledDate =
      profile?.enrolled_date ||
      (profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : null);

    const enhancedProfile = profile
      ? {
          ...profile,
          enrolled_date: enrolledDate,
          avatar_url: finalAvatar,
          track: finalTrack,
          selected_fashion_track: selectedTrack,
          verification_status: finalVerification,
          funding_status: entryStatus,
        }
      : null;

    // 7. Format recordings for client
    const formattedRecordings = filteredRecordings.map((r: any) => {
      const ytId = r.youtube_video_id || parseYouTubeId(r.video_url || "");
      const cleanThumbnail =
        r.thumbnail_url ||
        (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : "/images/service_training_capacity.jpg");

      return {
        id: r.id,
        title: r.title,
        programme: r.programme || "Vocational Tailoring & Garment Technology",
        category: r.category || "Curriculum Session",
        duration: r.duration || "",
        instructor: r.instructor || "",
        instructorRole: r.instructor_role || "",
        targetTrack: r.target_track || "both",
        createdBy: r.created_by || "Secretary Desk",
        youtubeVideoId: ytId,
        date:
          r.date ||
          (r.created_at
            ? new Date(r.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : ""),
        thumbnail: cleanThumbnail,
        slideUrl: r.video_url || r.slide_url || "",
        videoUrl: r.video_url || "",
        notes: r.notes || "",
        views: r.views || 0,
        description: r.description || "",
        created_at: r.created_at,
      };
    });

    // 8. Custom DB notifications from notifications table
    let dbNotifications: any[] = [];
    try {
      const { data: notifData } = await supabaseAdmin
        .from("notifications")
        .select("*")
        .or(`matric_no.eq.${activeMatric},matric_no.is.null,matric_no.eq.all`)
        .order("created_at", { ascending: false });
      dbNotifications = notifData || [];
    } catch (_e) {}

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

    // 9. Synthesize live notifications directly from database
    const notifications: any[] = [];

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

    (filteredRecordings || []).forEach((r: any) => {
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

    if (finalVerification === "Verified") {
      notifications.push({
        id: `verification-${activeMatric}`,
        title: "Student Profile Verified",
        message:
          "Your student registration and enrollment details are verified under the WMES US CEU institutional registry.",
        type: "verification",
        category: "system",
        linkTab: "overview",
        createdAt: profile?.updated_at || profile?.created_at || new Date().toISOString(),
        timeAgo: formatTimeAgo(profile?.updated_at || profile?.created_at),
        read: false,
        badgeColor: "bg-emerald-500",
      });
    }

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

    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      profile: enhancedProfile,
      application: application || null,
      selectedTrack,
      fundingDocket,
      scholarshipToken: scholarshipToken || null,
      scholarshipApp: scholarshipApp || null,
      transactions: transactions || [],
      institutionalForms: institutionalForms || [],
      submissions: submissions || [],
      programme: activeProgramme,
      modules: modules || [],
      recordings: formattedRecordings,
      notifications: notifications || [],
    });
  } catch (error: any) {
    console.error("[portal route error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
