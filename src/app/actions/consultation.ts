"use server";

import { supabaseAdmin } from "@/lib/supabase";

export interface FormState {
  success: boolean;
  error: string | null;
  message: string | null;
}

export async function submitConsultation(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const organization = formData.get("organization") as string;
  const sector = formData.get("sector") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!name || !email || !sector || !message) {
    return {
      success: false,
      error: "Please fill in all required fields (Name, Email, Sector, Message).",
      message: null,
    };
  }

  try {
    // Insert record into Supabase consultations table
    const { error: insertError } = await supabaseAdmin
      .from("consultations")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : null,
        organization: organization ? organization.trim() : null,
        sector: sector.trim(),
        message: message.trim(),
        status: "Pending Review",
      });

    if (insertError) {
      console.error("[Supabase Consultation Insert Error]:", insertError);
      return {
        success: false,
        error: "Unable to save consultation to database. Please try again.",
        message: null,
      };
    }

    return {
      success: true,
      error: null,
      message:
        "Consultation request successfully recorded in the WMES Registry. Our Executive Advisory Secretariat will review your docket and contact you within 24 hours.",
    };
  } catch (err: any) {
    console.error("[submitConsultation error]:", err);
    return {
      success: false,
      error: err?.message || "Failed to process request.",
      message: null,
    };
  }
}
