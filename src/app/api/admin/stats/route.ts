import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// 30-second in-memory stats cache to avoid re-aggregating thousands of rows on rapid tab clicks
let statsCache: { data: any; timestamp: number } | null = null;

export async function GET() {
  try {
    const now = Date.now();
    if (statsCache && now - statsCache.timestamp < 30 * 1000) {
      return NextResponse.json({ success: true, ...statsCache.data });
    }

    const [
      { data: profiles },
      { data: transactions },
      { data: applications },
      { count: totalFormSubmissions },
    ] = await Promise.all([
      supabaseAdmin
        .from("profiles")
        .select("id, name, email, phone, matric_no, track, verification_status, created_at")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabaseAdmin
        .from("transactions")
        .select("id, matric_no, description, amount, status, reference, method, receipt_no, created_at")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabaseAdmin
        .from("applications")
        .select("id, form_no, matric_no, full_name, email, phone, gender, dob, age, preferred_centre, education, status, created_at")
        .order("created_at", { ascending: false })
        .limit(1000),
      supabaseAdmin
        .from("form_submissions")
        .select("*", { count: "exact", head: true }),
    ]);

    const studentList = profiles || [];
    const txnList = transactions || [];
    const appList = applications || [];

    // Financial Metrics
    const paidTxns = txnList.filter((t: any) => t.status === "Paid");
    const pendingTxns = txnList.filter((t: any) => t.status === "Pending");
    const failedTxns = txnList.filter((t: any) => t.status === "Failed");

    const totalRevenue = paidTxns.reduce(
      (sum: number, t: any) => sum + (Number(t.amount) || 0),
      0
    );

    const formFeesRevenue = paidTxns
      .filter(
        (t: any) =>
          t.description?.toLowerCase().includes("form") ||
          t.description?.toLowerCase().includes("access") ||
          Number(t.amount) < 50000
      )
      .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

    const tuitionRevenue = paidTxns
      .filter(
        (t: any) =>
          t.description?.toLowerCase().includes("tuition") ||
          t.description?.toLowerCase().includes("programme") ||
          t.description?.toLowerCase().includes("tailoring") ||
          Number(t.amount) >= 50000
      )
      .reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

    const avgTransactionValue =
      paidTxns.length > 0 ? Math.round(totalRevenue / paidTxns.length) : 0;
    const paymentSuccessRate =
      txnList.length > 0
        ? Math.round((paidTxns.length / txnList.length) * 100)
        : 100;

    // Student & KYC Metrics
    const totalStudents = studentList.length;
    const verifiedProfiles = studentList.filter(
      (p: any) => p.verification_status === "Verified"
    ).length;
    const pendingProfiles = studentList.filter(
      (p: any) => (p.verification_status || "Pending") === "Pending"
    ).length;
    const rejectedProfiles = studentList.filter(
      (p: any) => p.verification_status === "Rejected"
    ).length;
    const kycVerificationRate =
      totalStudents > 0
        ? Math.round((verifiedProfiles / totalStudents) * 100)
        : 0;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentSignups = studentList.filter(
      (p: any) => new Date(p.created_at) >= sevenDaysAgo
    ).length;

    // Track Breakdown
    const trackCounts: Record<string, number> = {};
    studentList.forEach((p: any) => {
      const track = p.track || "Unassigned / Pending";
      trackCounts[track] = (trackCounts[track] || 0) + 1;
    });

    // Applications & Admissions Metrics
    const totalApplications = appList.length;
    const pendingApplications = appList.filter(
      (a: any) => a.status === "Pending" || a.status === "Submitted"
    ).length;
    const approvedApplications = appList.filter(
      (a: any) => a.status === "Approved"
    ).length;
    const rejectedApplications = appList.filter(
      (a: any) => a.status === "Rejected"
    ).length;
    const admissionApprovalRate =
      totalApplications > 0
        ? Math.round((approvedApplications / totalApplications) * 100)
        : 0;

    // Regional Centre Breakdown
    const centreCounts: Record<string, number> = {
      Abuja: 0,
      Enugu: 0,
      Virtual: 0,
    };
    appList.forEach((a: any) => {
      const centre = a.preferred_centre || "Virtual";
      if (centre.toLowerCase().includes("abuja")) centreCounts.Abuja++;
      else if (centre.toLowerCase().includes("enugu")) centreCounts.Enugu++;
      else centreCounts.Virtual++;
    });

    const resultPayload = {
      stats: {
        // Core KPIs
        totalStudents,
        totalRevenue,
        pendingApplications,
        totalApplications,
        verifiedProfiles,
        recentSignups,
        // Enhanced Financial KPIs
        totalTransactions: txnList.length,
        paidTransactions: paidTxns.length,
        pendingTransactions: pendingTxns.length,
        failedTransactions: failedTxns.length,
        paymentSuccessRate,
        formFeesRevenue,
        tuitionRevenue,
        avgTransactionValue,
        // Enhanced Student & KYC KPIs
        pendingProfiles,
        rejectedProfiles,
        kycVerificationRate,
        trackDistribution: trackCounts,
        // Enhanced Admissions KPIs
        approvedApplications,
        rejectedApplications,
        admissionApprovalRate,
        centreDistribution: centreCounts,
        totalFormSubmissions: totalFormSubmissions || 0,
      },
      recentStudents: studentList.slice(0, 5),
      recentTransactions: txnList.slice(0, 5),
      recentApplications: appList.slice(0, 5),
    };

    statsCache = { data: resultPayload, timestamp: now };

    return NextResponse.json({
      success: true,
      ...resultPayload,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message },
      { status: 500 }
    );
  }
}
