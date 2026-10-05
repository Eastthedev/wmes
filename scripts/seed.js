/**
 * WMES Supabase Seed Script
 * Seeds: institutional_forms, programmes, programme_modules
 * Run: node scripts/seed.js
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://fvfgjmhygrnylzagxubs.supabase.co";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2ZmdqbWh5Z3JueWx6YWd4dWJzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDAyNDc1NywiZXhwIjoyMTA1NjAwNzU3fQ.vN3dvH6904haCDfOzGPlh23v58-QLnfEsOybf6doTfM";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const institutionalForms = [
  {
    id: "WF-001",
    title: "Application for Programme Deferral",
    category: "Academic",
    eta: "5–7 working days",
    desc: "Apply to defer your programme enrollment to the next academic intake.",
    requirements: ["Valid WMES Student ID", "Medical/personal reason statement", "Supervisor acknowledgement"],
    pdf_template_url: "/forms/deferral.pdf",
  },
  {
    id: "WF-002",
    title: "Change of Track / Specialisation",
    category: "Academic",
    eta: "7–10 working days",
    desc: "Request a formal transfer between programme tracks or specialisation streams.",
    requirements: ["Original enrollment letter", "Dean advisory signature", "Two terms completed"],
    pdf_template_url: "/forms/track-change.pdf",
  },
  {
    id: "WF-003",
    title: "Certificate of Enrollment",
    category: "Administrative",
    eta: "2–3 working days",
    desc: "Official WMES letter confirming active enrollment status for visa, bank, or institutional purposes.",
    requirements: ["Current tuition clearance", "Up-to-date contact details"],
    pdf_template_url: "/forms/enrollment-cert.pdf",
  },
  {
    id: "WF-004",
    title: "Result Verification / Transcript Request",
    category: "Academic",
    eta: "5 working days",
    desc: "Request an official authenticated transcript of your academic performance for external submission.",
    requirements: ["Programme completion (or active enrollment)", "Destination institution details", "Student portal clearance"],
    pdf_template_url: "/forms/transcript.pdf",
  },
  {
    id: "WF-005",
    title: "Financial Clearance Declaration",
    category: "Financial",
    eta: "3–5 working days",
    desc: "Request confirmation that all outstanding tuition obligations have been settled in full.",
    requirements: ["All payment receipts", "Bank account details for refund (if applicable)"],
    pdf_template_url: "/forms/financial-clearance.pdf",
  },
  {
    id: "WF-006",
    title: "Advisory Board Endorsement Request",
    category: "Advisory",
    eta: "10–14 working days",
    desc: "Submit a formal request for endorsement from the WMES Advisory Board for research or institutional proposals.",
    requirements: ["Research/proposal abstract", "Institutional affiliation letter", "Two faculty referees"],
    pdf_template_url: "/forms/advisory-endorsement.pdf",
  },
  {
    id: "WF-007",
    title: "Identity Verification & Student ID Re-issue",
    category: "Administrative",
    eta: "3–5 working days",
    desc: "Apply for a replacement student identity card with current programme details.",
    requirements: ["Passport photograph (studio quality)", "Statutory declaration (if lost)", "Biometric form"],
    pdf_template_url: "/forms/id-reissue.pdf",
  },
  {
    id: "WF-008",
    title: "Accreditation Recognition Application",
    category: "Advisory",
    eta: "14–21 working days",
    desc: "Submit your portfolio for formal accreditation review under the US CEU, WMES Registry, or ISO HRM framework.",
    requirements: ["Portfolio of completed works", "Industry reference letters (2)", "Programme completion certificate"],
    pdf_template_url: "/forms/accreditation.pdf",
  },
];

const fashionProgramme = {
  id: "PROG-FT-2026",
  title: "Professional Fashion Design & Garment Technology",
  code: "FT-2026",
  description: "A comprehensive fashion design and garment technology programme accredited under the WMES Academic Registry.",
  duration: "12 Months",
  credit_hours: 36,
  accreditation: "WMES Registry / US CEU Accredited",
  status: "Active",
  tuition_fee: 100000,
  currency: "NGN",
};

const fashionModules = [
  { order_index: 1, title: "Fashion Fundamentals & History", code: "FT-101", duration: "4 Weeks", credits: 3, description: "Introduction to fashion history, key designers, and cultural influence on global fashion trends.", status: "Completed", instructor: "Prof. Adaeze Nwosu" },
  { order_index: 2, title: "Fabric Technology & Materials Science", code: "FT-102", duration: "4 Weeks", credits: 3, description: "Study of textile fibres, fabric properties, weave structures, and care labelling standards.", status: "Completed", instructor: "Dr. Seun Adeyemi" },
  { order_index: 3, title: "Pattern Making & Draping", code: "FT-201", duration: "6 Weeks", credits: 4, description: "Technical pattern drafting, flat pattern manipulation, and draping techniques on dress forms.", status: "In Progress", instructor: "Mrs. Chisom Eze" },
  { order_index: 4, title: "Garment Construction Techniques", code: "FT-202", duration: "6 Weeks", credits: 4, description: "Industrial and couture construction methods, finishing, tailoring, and quality control.", status: "Upcoming", instructor: "Mr. Emeka Obi" },
  { order_index: 5, title: "Fashion Illustration & CAD", code: "FT-301", duration: "4 Weeks", credits: 3, description: "Manual fashion illustration, figure drawing, and introduction to CAD/CLO3D digital design tools.", status: "Upcoming", instructor: "Ms. Tolu Bakare" },
  { order_index: 6, title: "Styling, Branding & Visual Merchandising", code: "FT-302", duration: "4 Weeks", credits: 3, description: "Personal and editorial styling, brand identity development, lookbook creation, and VM strategy.", status: "Upcoming", instructor: "Dr. Funmi Oladele" },
  { order_index: 7, title: "Fashion Business & Entrepreneurship", code: "FT-401", duration: "4 Weeks", credits: 3, description: "Business plan development, pricing strategy, legal structures, supply chain, and fashion retail.", status: "Upcoming", instructor: "Prof. Chukwuemeka Agu" },
  { order_index: 8, title: "International Accreditation & Portfolio Review", code: "FT-402", duration: "6 Weeks", credits: 4, description: "Preparation for WMES Registry and US CEU accreditation submission. Final portfolio critique and capstone presentation.", status: "Upcoming", instructor: "WMES Academic Board" },
];

async function seed() {
  console.log("🌱 Starting WMES database seed...\n");

  console.log("📋 Seeding institutional_forms...");
  const { error: formsError } = await supabase
    .from("institutional_forms")
    .upsert(institutionalForms, { onConflict: "id" });

  if (formsError) {
    console.error("❌ institutional_forms error:", formsError.message);
  } else {
    console.log("✅ Seeded", institutionalForms.length, "institutional forms.\n");
  }

  console.log("🎓 Seeding programme...");
  const { error: progError } = await supabase
    .from("programmes")
    .upsert(fashionProgramme, { onConflict: "id" });

  if (progError) {
    console.error("❌ programmes error:", progError.message);
    return;
  }
  console.log("✅ Programme seeded.\n");

  console.log("📚 Seeding programme_modules...");
  const modulesWithProgrammeId = fashionModules.map((m) => ({
    ...m,
    programme_id: fashionProgramme.id,
  }));

  const { error: modulesError } = await supabase
    .from("programme_modules")
    .upsert(modulesWithProgrammeId, { onConflict: "programme_id,order_index" });

  if (modulesError) {
    console.error("❌ programme_modules error:", modulesError.message);
  } else {
    console.log("✅ Seeded", fashionModules.length, "modules.\n");
  }

  console.log("🎉 Seed complete!");
}

seed().catch(console.error);
