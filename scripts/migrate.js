const { Client } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres.fvfgjmhygrnylzagxubs:xIsfuw-pawqog-2nomra@aws-1-eu-west-1.pooler.supabase.com:6543/postgres";

async function runMigration() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Connecting to Supabase PostgreSQL database...");
    await client.connect();
    console.log("Connected successfully. Creating tables and indexes...");

    await client.query(`
      -- 1. Profiles Table (Students, Trainees, Corporate Members)
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        matric_no TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT DEFAULT '+234 803 456 7890',
        role TEXT DEFAULT 'Vocational Student',
        track TEXT DEFAULT 'Professional Fashion Design & Garment Technology',
        registry_hub TEXT DEFAULT 'Abuja / Enugu Creative Hub',
        accreditation_status TEXT DEFAULT 'US CEU Verified',
        enrolled_date TEXT DEFAULT 'January 15, 2026',
        two_factor_enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      -- 2. Auth OTPs Table (For login access codes)
      CREATE TABLE IF NOT EXISTS public.auth_otps (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_auth_otps_email ON public.auth_otps(email);

      -- 3. Transactions Table (ALATPay Verified Payments for 10k Forms & 100k Tuition)
      CREATE TABLE IF NOT EXISTS public.transactions (
        id TEXT PRIMARY KEY,
        matric_no TEXT NOT NULL,
        description TEXT NOT NULL,
        type TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        method TEXT DEFAULT 'ALATPay Checkout',
        status TEXT DEFAULT 'Paid',
        receipt_no TEXT UNIQUE NOT NULL,
        reference TEXT,
        paid_by TEXT,
        email TEXT,
        verified_at TIMESTAMPTZ DEFAULT now(),
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_transactions_matric ON public.transactions(matric_no);

      -- 4. WMES Applications Table (Multi-section digital admission form)
      CREATE TABLE IF NOT EXISTS public.applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        form_no TEXT UNIQUE NOT NULL,
        matric_no TEXT,
        full_name TEXT NOT NULL,
        gender TEXT,
        dob TEXT,
        age TEXT,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT,
        education TEXT,
        current_status TEXT[],
        sponsor_type TEXT,
        sponsor_name TEXT,
        nin_number TEXT,
        preferred_centre TEXT,
        passport_photo_url TEXT,
        status TEXT DEFAULT 'Submitted',
        raw_data JSONB,
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_applications_form_no ON public.applications(form_no);

      -- 5. Consultations Table (From Services & Real Estate page)
      CREATE TABLE IF NOT EXISTS public.consultations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        organization TEXT,
        sector TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'Pending Review',
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- 6. Contact Inquiries Table (From Contact page)
      CREATE TABLE IF NOT EXISTS public.contact_inquiries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'New',
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- 7. Institutional Forms Catalog
      CREATE TABLE IF NOT EXISTS public.institutional_forms (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT NOT NULL,
        processing_time TEXT NOT NULL,
        pdf_url TEXT,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- 8. Form Submissions (Student service request tickets)
      CREATE TABLE IF NOT EXISTS public.form_submissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_id TEXT UNIQUE NOT NULL,
        matric_no TEXT NOT NULL,
        form_title TEXT NOT NULL,
        reason TEXT,
        notes TEXT,
        status TEXT DEFAULT 'Under Review',
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_form_sub_matric ON public.form_submissions(matric_no);

      -- 9. Programmes Curriculum
      CREATE TABLE IF NOT EXISTS public.programmes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        track TEXT NOT NULL,
        director TEXT NOT NULL,
        accreditation TEXT NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- 10. Programme Modules
      CREATE TABLE IF NOT EXISTS public.programme_modules (
        id TEXT PRIMARY KEY,
        programme_id TEXT NOT NULL REFERENCES public.programmes(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        order_index INT NOT NULL,
        duration TEXT NOT NULL,
        lessons_count INT NOT NULL,
        progress_percent INT DEFAULT 0,
        status TEXT DEFAULT 'Upcoming',
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- 11. Recorded Sessions
      CREATE TABLE IF NOT EXISTS public.recorded_sessions (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        instructor TEXT NOT NULL,
        duration TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        thumbnail_url TEXT,
        video_url TEXT,
        description TEXT,
        views INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- 12. System Notifications Table
      CREATE TABLE IF NOT EXISTS public.notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        matric_no TEXT,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'system',
        category TEXT DEFAULT 'system',
        link_tab TEXT,
        read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_notifications_matric ON public.notifications(matric_no);
      CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);
    `);

    console.log("All tables created successfully. Seeding initial data...");

    // Seed default demo profile
    await client.query(`
      INSERT INTO public.profiles (matric_no, name, email, phone, role, track, registry_hub, accreditation_status)
      VALUES (
        'WMES/FTP/27A/0001',
        'Chidi Okonkwo',
        'student@wmes.org',
        '+234 803 456 7890',
        'Fashion Design Trainee',
        'Professional Fashion Design & Garment Technology',
        'Abuja / Enugu Creative Hub',
        'US CEU Verified'
      )
      ON CONFLICT (email) DO UPDATE 
      SET matric_no = EXCLUDED.matric_no, name = EXCLUDED.name;
    `);

    // Seed official institutional forms
    await client.query(`
      INSERT INTO public.institutional_forms (id, code, title, category, description, processing_time, pdf_url)
      VALUES 
      ('form-1', 'WMES-F-01', 'Official Academic Transcript Request', 'Academic Records', 'Formal docket request for official accredited transcripts dispatched to international universities or employer verification boards.', '48 Hours', '/docs/forms/transcript-request.pdf'),
      ('form-2', 'WMES-F-02', 'Vocational Apprenticeship & Machine Allocation', 'Atelier Services', 'Application for allocation of specialized industrial sewing machines and studio schedule booking at Abuja/Enugu centres.', '24 Hours', '/docs/forms/machine-allocation.pdf'),
      ('form-3', 'WMES-F-03', 'Course Exemption & Prior Learning Assessment', 'Curriculum', 'Evaluation of prior fashion atelier experience, trade test certifications, or academic diplomas for advanced module standing.', '5 Business Days', '/docs/forms/course-exemption.pdf'),
      ('form-4', 'WMES-F-04', 'Commercial Facility Management Contract Request', 'Corporate Consulting', 'Official submission for WMES turnkey stewardship, hotel operations handover, or institutional school turnaround.', '72 Hours', '/docs/forms/facility-contract.pdf')
      ON CONFLICT (code) DO NOTHING;
    `);

    // Seed default programme
    await client.query(`
      INSERT INTO public.programmes (id, title, track, director, accreditation, description)
      VALUES (
        'prog-fashion-2026',
        'Professional Fashion Design & Haute Couture Garment Technology',
        'Vocational Technical Training',
        'Dr. Chinyere Nwankwo (Dean of Vocational Studies)',
        'US Continuing Education Units (CEU) Accredited',
        'A masterclass vocational diploma track covering pattern drafting, industrial machine operations, haute couture tailoring, atelier management, and commercial collection launch.'
      )
      ON CONFLICT (id) DO NOTHING;
    `);

    // Seed programme modules
    await client.query(`
      INSERT INTO public.programme_modules (id, programme_id, title, order_index, duration, lessons_count, progress_percent, status)
      VALUES 
      ('mod-1', 'prog-fashion-2026', 'Module 1: Fundamental Pattern Drafting & Anatomy Measurements', 1, '2 Weeks', 6, 100, 'Completed'),
      ('mod-2', 'prog-fashion-2026', 'Module 2: Industrial Sewing Machinery & Precision Seam Engineering', 2, '3 Weeks', 8, 45, 'In Progress'),
      ('mod-3', 'prog-fashion-2026', 'Module 3: Haute Couture Corsetry & Structural Garment Construction', 3, '4 Weeks', 10, 0, 'Upcoming'),
      ('mod-4', 'prog-fashion-2026', 'Module 4: Textile Chemistry, Fabric Finishes & Quality Control', 4, '2 Weeks', 5, 0, 'Upcoming'),
      ('mod-5', 'prog-fashion-2026', 'Module 5: Atelier Commercial Operations & Runway Capstone Showcase', 5, '3 Weeks', 7, 0, 'Upcoming')
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Database migration and seeding completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
