import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Lazily instantiated so module evaluation (e.g. during build page-data
// collection) doesn't throw when the API key env var is absent.
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }
  return new Resend(apiKey);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send email using Resend. Plain-text body: user input (name/email/subject/
    // message) is interpolated into the message, so a `text` field is used
    // instead of `html` to remove any HTML/markup injection surface — Resend
    // treats the value as literal text, never parsed markup.
    const resend = getResend();
    const data = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL!,
      subject: `Portfolio Contact: ${subject}`,
      text: [
        "New Contact Form Submission",
        "============================",
        "",
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Subject: ${subject}`,
        "",
        "Message:",
        message,
        "",
        `Reply-To: ${email}`,
      ].join("\n"),
      replyTo: email,
    });

    return NextResponse.json(
      { message: "Email sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
