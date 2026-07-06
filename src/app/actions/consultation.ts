"use server";

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

  // Log output to standard output/console for verification
  console.log("=== NEW CONSULTATION SUBMISSION RECEIVED ===");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Client Name: ${name}`);
  console.log(`Email Address: ${email}`);
  console.log(`Phone: ${phone || "None provided"}`);
  console.log(`Organization: ${organization || "None provided"}`);
  console.log(`Sector of Interest: ${sector}`);
  console.log(`Message Content: ${message}`);
  console.log("============================================");

  // TODO: Implement Resend/SendGrid mail dispatch
  // Example implementation snippet:
  // const { data, error } = await resend.emails.send({
  //   from: 'WMES Portal <admissions@wmesgroup.com>',
  //   to: ['inquiries@wmesgroup.com'],
  //   subject: `Inquiry: ${sector} Management Request by ${name}`,
  //   text: `Name: ${name}\nEmail: ${email}\nOrg: ${organization}\nDetails: ${message}`,
  // });

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    error: null,
    message: "Consultation Request successfully logged. Our Executive Secretary will reach out via the provided email or telephone within 24 hours.",
  };
}
