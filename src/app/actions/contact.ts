"use server";

import { supabaseAdmin } from "@/lib/supabase";

export interface ContactFormState {
  success: boolean;
  error: string | null;
  message: string | null;
}

export async function submitContact(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return {
      success: false,
      error: "Please fill in all required fields (Name, Email, Subject, Message).",
      message: null,
    };
  }

  try {
    // Insert into Supabase contact_inquiries table
    const { error: insertError } = await supabaseAdmin
      .from("contact_inquiries")
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
        status: "New",
      });

    if (insertError) {
      console.error("[Supabase Contact Inquiries Insert Error]:", insertError);
      return {
        success: false,
        error: "Unable to record inquiry in the database. Please try again.",
        message: null,
      };
    }

    return {
      success: true,
      error: null,
      message:
        "Thank you for reaching out. Your dispatch has been permanently recorded in the Registry. Our administrative Secretariat will follow up shortly.",
    };
  } catch (err: any) {
    console.error("[submitContact error]:", err);
    return {
      success: false,
      error: err?.message || "Failed to submit inquiry.",
      message: null,
    };
  }
}
