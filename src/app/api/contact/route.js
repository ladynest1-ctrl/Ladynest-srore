import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { sendEmail, sendContactEmail } from "../../../lib/email";
import { SITE_EMAIL } from "../../../lib/siteConfig";

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export async function POST(req) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const subject = String(body?.subject || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: { name, email, subject: subject || "General Inquiry", message },
    });

    try {
      await sendContactEmail({
        name,
        email,
        phone: body?.phone,
        subject,
        message,
        createdAt: newMessage.createdAt,
      });
    } catch (emailError) {
      console.warn("[CONTACT_EMAIL] Failed to send intake email", {
        messageId: newMessage?.id,
        email,
        subject: subject || "General Inquiry",
        code: emailError?.code,
        message: emailError?.message,
      });

      return NextResponse.json(
        { success: false, error: "Your message was saved, but we could not send the email notification right now. Please try again later." },
        { status: 202 }
      );
    }

    return NextResponse.json({ success: true, message: "Message Sent!" }, { status: 200 });
  } catch (error) {
    console.error("[CONTACT_API] Error:", {
      message: error?.message,
      code: error?.code,
    });
    return NextResponse.json({ success: false, error: "Unable to send message. Please try again later." }, { status: 500 });
  }
}
