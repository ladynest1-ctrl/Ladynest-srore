import nodemailer from "nodemailer";
import { SITE_EMAIL } from "./siteConfig";

function getEnv(name, fallback = "") {
  const value = process.env[name];
  return value && String(value).trim() ? String(value).trim() : fallback;
}

export function getSmtpConfig() {
  const host = getEnv("SMTP_HOST", getEnv("EMAIL_HOST", "smtp.gmail.com"));
  const port = Number(getEnv("SMTP_PORT", getEnv("EMAIL_PORT", "587")));
  const user = getEnv("SMTP_USER", getEnv("EMAIL_USER", getEnv("EMAIL_USERNAME", SITE_EMAIL)));
  const pass = getEnv("SMTP_PASSWORD", getEnv("EMAIL_PASSWORD", getEnv("EMAIL_PASS", "")));
  const from = getEnv("SMTP_FROM", getEnv("EMAIL_FROM", getEnv("EMAIL_USER", SITE_EMAIL)));

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from,
  };
}

export function createSmtpTransport() {
  const { host, port, secure, user, pass } = getSmtpConfig();

  // Reuse transporter where possible to avoid creating multiple connections
  if (!global.__smtpTransport) {
    global.__smtpTransport = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: true,
      auth: user && pass ? { user, pass } : undefined,
      tls: { rejectUnauthorized: true },
    });
  }

  return global.__smtpTransport;
}

function stripHtml(html = "") {
  return String(html)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendEmail({ to, subject, html, text, replyTo, from } = {}) {
  const config = getSmtpConfig();

  if (!config.host || !config.user || !config.pass) {
    throw new Error("SMTP configuration is missing. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in the server environment.");
  }

  const transporter = createSmtpTransport();

  try {
    const info = await transporter.sendMail({
      from: from || config.from,
      to,
      subject,
      text: text || stripHtml(html),
      html,
      replyTo,
    });

    return info;
  } catch (error) {
    console.warn("[EMAIL] Failed to deliver email", {
      to,
      subject,
      host: config.host,
      port: config.port,
      code: error?.code,
      message: error?.message,
    });
    throw new Error("We couldn't send this email right now. Please try again later.");
  }
}

export async function sendOrderEmail(order = {}) {
  const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL || process.env.CONTACT_NOTIFICATION_EMAIL || process.env.SMTP_USER || SITE_EMAIL;
  const total = Number(order.totalPrice || 0);
  const deliveryCharges = Number(order.deliveryCharges || 0);
  const subtotal = Math.max(total - deliveryCharges, 0);

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 760px; margin: 0 auto;">
      <h2 style="margin-bottom: 12px; color: #1f2937;">New Order Received</h2>
      <p><strong>Order ID:</strong> #${order.id}</p>
      <p><strong>Order Date:</strong> ${order.createdAt ? new Date(order.createdAt).toISOString() : new Date().toISOString()}</p>
      <p><strong>Customer Name:</strong> ${order.customerName || "-"}</p>
      <p><strong>Email:</strong> ${order.email || "Not provided"}</p>
      <p><strong>Phone:</strong> ${order.phone || "-"}</p>
      <p><strong>Address:</strong> ${order.address || "-"}${order.city ? `, ${order.city}` : ""}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod || "-"}</p>
      <p><strong>Order Status:</strong> ${order.status || "-"}</p>

      <table style="width:100%; border-collapse: collapse; margin-top: 16px; border: 1px solid #e5e7eb;">
        <thead>
          <tr style="background: #f3f4f6; text-align: left;">
            <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Product</th>
            <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Color</th>
            <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Qty</th>
            <th style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${order.productName || "-"}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${order.colorSelected || "-"}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${order.quantity || 1}</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">Rs. ${total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 16px;">
        <p><strong>Subtotal:</strong> Rs. ${subtotal.toLocaleString()}</p>
        <p><strong>Delivery Charges:</strong> Rs. ${deliveryCharges.toLocaleString()}</p>
        <p style="font-size:18px;"><strong>Total:</strong> Rs. ${total.toLocaleString()}</p>
      </div>
    </div>
  `;

  const text = stripHtml(html);

  return sendEmail({
    to: adminEmail,
    from: process.env.SMTP_FROM || process.env.EMAIL_USER || SITE_EMAIL,
    replyTo: order.email || undefined,
    subject: `New Order Received - #${order.id}`,
    html,
    text,
  });
}

export async function sendContactEmail(message = {}) {
  const adminEmail = process.env.CONTACT_NOTIFICATION_EMAIL || process.env.ORDER_NOTIFICATION_EMAIL || process.env.SMTP_USER || SITE_EMAIL;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; background: #fff; color: #111;">
      <h2 style="margin-bottom: 16px; color: #1a1a1a;">New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${message.name || "-"}</p>
      <p><strong>Email:</strong> ${message.email || "-"}</p>
      <p><strong>Phone:</strong> ${message.phone || "-"}</p>
      <p><strong>Subject:</strong> ${message.subject || "General Inquiry"}</p>
      <p><strong>Sent:</strong> ${message.createdAt ? new Date(message.createdAt).toISOString() : new Date().toISOString()}</p>
      <div style="margin-top: 16px; padding: 16px; background: #f7f3eb; border-left: 4px solid #C5A25D;">
        <p style="white-space: pre-wrap; margin: 0;">${message.message || "-"}</p>
      </div>
    </div>
  `;

  const text = stripHtml(html);

  return sendEmail({
    to: adminEmail,
    from: process.env.SMTP_FROM || process.env.EMAIL_USER || SITE_EMAIL,
    replyTo: message.email || undefined,
    subject: `Contact Inquiry: ${message.subject || "General Inquiry"}`,
    html,
    text,
  });
}
