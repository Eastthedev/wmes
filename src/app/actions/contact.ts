"use server";

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

  // Log outputs to standard output/console for verification
  console.log("=== NEW CONTACT INQUIRY RECEIVED ===");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`User Name: ${name}`);
  console.log(`Email Address: ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Message Content: ${message}`);
  console.log("=====================================");

  // TODO: Implement Resend/SendGrid dispatch code
  // Example:
  // await resend.emails.send({
  //   from: 'WMES Contact <contact@wmesgroup.com>',
  //   to: ['info@wmesgroup.com'],
  //   subject: `Contact Form: ${subject} (${name})`,
  //   text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  // });

  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    success: true,
    error: null,
    message: "Thank you for contacting us. Your message has been logged. Our administrative team will review your inquiry and follow up shortly.",
  };
}
